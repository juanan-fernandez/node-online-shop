//const path = require('path');
const express = require('express');
//mis librerias
//const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();


router.get('/', (req, res) => {
   //res.send('<h1>Welcome to my web!</h1>')
   //res.sendFile(path.join(rootDir,'views', 'shop.html')); //enviarmos un html normal
   res.render('shop', 
      {
         prods:adminData.products, 
         pageTitle:'Shop-interpolated', 
         path:'/',
         hasProducts: adminData.products.length>0,
         productCSS: true
      }); //usamos motor de plantillas
});

module.exports = router;