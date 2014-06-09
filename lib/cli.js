var program = require('commander');
var express = require('express');
var fs = require('fs');
var path = require('path');

program
  .version(require('../package.json').version)
  .option('-p, --port <n>', 'Port')
  .option('-t, --target-ext <extension>', 'Extension (bemjson.js is default)')
  .option('-s, --source-ext <extension>', 'Source extension (html is default)')
  .parse(process.argv);

var app = express();
var projectRoot = process.cwd();
var enbMiddleware = require('enb/lib/server/server-middleware').createMiddleware();

app
    .use(function (req, res, next) {
        if (req.query.source) {
            var requestPath = req.path.replace(/^\/+/, '');
            var bemjsonPath = requestPath.replace('.' + sourceExtension, '.' + targetExtension);

            var sourceFilename = path.resolve(projectRoot, req.query.source);
            var sourceText = '';

            var destFilename =  path.resolve(projectRoot, bemjsonPath);
            var destText = '';

            if (fs.existsSync(destFilename)) {
                destText = fs.readFileSync(destFilename, 'utf8');
            }
            if (fs.existsSync(sourceFilename)) {
                sourceText = fs.readFileSync(sourceFilename, 'utf8');
            }
            if (sourceText !== destText) {
                ensureDirectoryExists(path.dirname(destFilename));
                fs.writeFileSync(destFilename, sourceText, 'utf8');
            }
        }
        next();
    })
    .use(enbMiddleware)
    .use('/', express.static(projectRoot));

var port = program.port ? parseInt(program.port) : 8080;
var targetExtension = program.targetExt ? program.targetExt : 'bemjson.js';
var sourceExtension = program.sourceExt ? program.sourceExt : 'html';

app.listen(port, function () {
    console.log('app started on %s', port);
});

function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        ensureDirectoryExists(path.dirname(dirPath));
        fs.mkdirSync(dirPath);
    }
}
