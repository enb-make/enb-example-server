enb-example-server
==================

Простой веб-сервер для просмотра верстки [bt-блоков][bt] на лету. Этот инструмент не является самостоятельным и предназначен для использования внутри проектов с bt-шаблонизатором.

Установка
---------
```
npm install --save-dev enb-example-server
```

Для работы модуля требуется зависимость от пакета [enb][enb] версии 0.8.45 или выше.

Использование
-------------
Запуск сервера через `supervisor`:
```
supervisor enb-example-server
```

Веб-сервер принимает пути вида _http://localhost:8080/pages/example/example.html?source=path/to/block.btjson.js_, где:
* _pages/example/example.html_ — путь к специльной странице проекта, в контексте которой настроена сборка примеров блоков по заданному bt-шаблону;
* _path/to/block.btjson.js_ — bt-шаблон блока.

###Параметры
  * `-p`, `--port` — Порт. По умолчанию — 8080.

[bt]: https://github.com/enb-make/bt
[enb]: https://github.com/enb-make/enb
