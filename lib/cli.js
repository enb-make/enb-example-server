var program = require('commander');
var express = require('express');
var fs = require('fs');
var path = require('path');

program
  .version(require('../package.json').version)
  .option('-p, --port <n>', 'Port')
  .parse(process.argv);

var app = express();
var projectRoot = process.cwd();
var enbMiddleware = require('enb/lib/server/server-middleware').createMiddleware();

app
    .use(function (req, res, next) {
        if (req.query.source) {
            var requestPath = req.path.replace(/^\/+/, '');
            var bemjsonPath = requestPath.replace('.html', '.bemjson.js');

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
                fs.writeFileSync(destFilename, sourceText, 'utf8');
            }
            enbMiddleware(req, res, next);
        } else {
            next();
        }
    })
    .use(enbMiddleware)
    .use('/', express.static(projectRoot));

var port = program.port ? parseInt(program.port) : 8080;
app.listen(port, function () {
    console.log('app started on %s', port);
});
