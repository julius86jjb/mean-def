// Requires

var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

const Usuario = require('../models/usuario');


var app = express();


// Rutas


app.post('/', (req, res) => {


    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, UsuarioDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!UsuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas1',
                errors: err
            })
        }
        if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas2',
                errors: err
            })
        }

        UsuarioDB.password = ':)';
        // let token = jwt.sign({ usuario: UsuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        let token = jwt.sign({ usuario: UsuarioDB }, SEED, { expiresIn: 14400 })

        res.json({
            ok: true,
            usuario: UsuarioDB,
            token: token,
            id: UsuarioDB.id
                // token: token
        })
    })



})


module.exports = app;