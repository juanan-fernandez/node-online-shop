"use strict";

var path = require('path');

var express = require('express'); //mis librerias


var rootDir = require('../util/path');

var adminData = require('./admin');

var router = express.Router();
router.get('/', function (req, res) {
  //res.send('<h1>Welcome to my web!</h1>')
  //res.sendFile(path.join(rootDir,'views', 'shop.html')); //enviarmos un html normal
  res.render('shop'); //usamos motor de plantillas
});
module.exports = router;
//# sourceMappingURL=shop.dev.js.map
