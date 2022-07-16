const mongoose = require('mongoose');

const AutorSchema = new mongoose.Schema({
    nombre: String,
    seudonimo: String,
    estilo: String,
    nombreCompleto: String
});

module.exports = mongoose.model('Autor', AutorSchema);