
// el controller necesita una ruta por lo que creamos este archivo para lgorarlo
// mandamos a llamar a ruta de express y al mismo express 
const {Router} = require("express");
const express = require("express");
const ruta = express.Router();

// ahora importo a la funcion desde el controller
// que me permite grabar un nuevo record de autor
// esto obtiene las funciones desde el controller
// tambien voy agregando a la constante los metodos que vaya generando en el controller
const {crearAutor, getAutor, getAutorById, updateAutor,deleteAutor} = require('../controllers/autor')

// la ruta es un slach y usamos el metodo postpara crear un nuevo autor 
// voy agregando metodos a la ruta segun necesite get post delete etc
ruta.route("/")
    .post(crearAutor)
    .get(getAutor)

ruta.route("/:id")
    .get(getAutorById)
    .put(updateAutor)
    .delete(deleteAutor)


// ahora exportare la ruta para que sea visible para otros archivos
module.exports = ruta;

//ahora debo registrar este archivo en elcorazon server.js

// en post man para esta api localhost:5000/api/DisqueraAutor