var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');



app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;

// /// client id
// 171715616822-d5i1khoro5n7ofiee5vhpmro08d2m5h2.apps.googleusercontent.com
// // client secret
// J1Egcs6dKwhcSIaCwXVHmVs9