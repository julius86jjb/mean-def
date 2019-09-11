// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');



// Inicializar variables

var app = express();
app.use(fileUpload({ useTempFiles: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var busquedaRoutes = require('./routes/busqueda');
var imagenesRoutes = require('./routes/imagenes');





// Conexion DB

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});


// Server index config - VER IMAGENES EN EL NAVEGADOR CON FS

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Rutas

app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);





// Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express Server escuchando en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});