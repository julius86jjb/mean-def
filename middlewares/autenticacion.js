const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificaToken = (req, res, next) => {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();

        // res.status(201).json({
        //     ok: true,
        //     decoded
        // })

    });



};