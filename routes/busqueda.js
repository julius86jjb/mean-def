var express = require('express');
var app = express();

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

// ==================================================== //
// Busqueda por collecion
// ==================================================== //

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var expresionRegular = RegExp(busqueda, 'i');

    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expresionRegular);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, expresionRegular);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, expresionRegular);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son medicos, usuarios y hospitales',
                err: { mensaje: 'Tabla/coleccion incorrectos' }
            })
            break;
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    })


})





// ==================================================== //
// Busqueda general
// ==================================================== //
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var expresionRegular = RegExp(busqueda, 'i');


    Promise.all([
            buscarHospitales(busqueda, expresionRegular),
            buscarMedicos(busqueda, expresionRegular),
            buscarUsuarios(busqueda, expresionRegular)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })
        })

});


function buscarHospitales(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: expresionRegular })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }


            })
    })

}

function buscarMedicos(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: expresionRegular }, (err, medicos) => {

            if (err) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos);
            }


        })
    })

}

function buscarUsuarios(busqueda, expresionRegular) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email rol  img')
            .or([{ nombre: expresionRegular }, { email: expresionRegular }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar en usuarios', err)
                } else {
                    resolve(usuarios);
                }
            })

    })

}





module.exports = app;