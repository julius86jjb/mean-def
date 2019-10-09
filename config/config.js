module.exports.SEED = 'este-es-el-seed-desarrollo';

// Google 

module.exports.CLIENT_ID = '171715616822-d5i1khoro5n7ofiee5vhpmro08d2m5h2.apps.googleusercontent.com';

// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/hospitalDB';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;