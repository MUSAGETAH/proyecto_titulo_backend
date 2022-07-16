
// importo mongoose
const mongoose = require('mongoose');

// creo coleccion
const DiscoSquema = new mongoose.Schema({

    // puedo agregar validaciones y caracteristicas que va a tener la columna de la coleccion
    titulo: {
        required: [true, 'Ingrese un título de disco'],
        maxlength: [500, 'El título de libro no puede ser mayor'],
        type: String
    },
    descripcion: String,
    precio: Number,
    fechaPublicacion: Date,
    autor: { id: String, seudonimo: String}
});

module.exports = mongoose.model('Disco', DiscoSquema)