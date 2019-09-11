// Requires

var express = require('express');

const jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAuteticacion = require('../middlewares/autenticacion');

const Hospital = require('../models/hospital');

var app = express();


// Rutas


// =========================================================
// Obtener listado de hospitales
// =========================================================


app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0; //parametro opcional, si viene algo en el query, lo asignamos, sino, 0
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(15)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales
                    });
                });


            }
        )
})


// =========================================================
// Actualizar un hospital
// =========================================================


app.put('/:id', mdAuteticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])
    let body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            })
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: ' No existe un hospital con ese ID' }
            })
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id; //usuario que lo está modificando

        hospital.save((err, hospitalDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                })
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalDB
            });

        })

    })

})


// =========================================================
// Crear un nuevo hospital
// =========================================================


app.post('/', mdAuteticacion.verificaToken, function(req, res) {

    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
    })

    hospital.save((err, hospitalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            hospital: hospitalDB
        })
    })

})



// =========================================================
// Borrar un hospital
// =========================================================


app.delete('/:id', mdAuteticacion.verificaToken, function(req, res) {

    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            })
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });

    })
})


module.exports = app;