// Requires

var express = require('express');

const jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAuteticacion = require('../middlewares/autenticacion');

const Medico = require('../models/medico');

var app = express();


// Rutas


// =========================================================
// Obtener listado de médicos
// =========================================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //parametro opcional, si viene algo en el query, lo asignamos, sino, 0
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error get medicos',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos
                    });
                })

            }
        )
})





// =========================================================
// Actualizar un medico
// =========================================================


app.put('/:id', mdAuteticacion.verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            })
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: ' No existe un medico con ese ID' }
            })
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                })
            }


            res.status(200).json({
                ok: true,
                medico: medicoDB
            });

        })

    })

})



// =========================================================
// Crear un nuevo usuario
// =========================================================


app.post('/', mdAuteticacion.verificaToken, function(req, res) {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    })

    medico.save((err, medicoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear médico',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            medico: medicoDB
        })
    })

})




// =========================================================
// Borrar un medico
// =========================================================


app.delete('/:id', mdAuteticacion.verificaToken, function(req, res) {

    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            })
        }

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID',
                errors: {
                    message: 'No existe un medico con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });

    })
})


module.exports = app;