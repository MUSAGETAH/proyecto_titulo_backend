//const {Router} = require('express')
const express = require("express");
const ruta = express.Router();

// cuando es una funcion se usa entre llaves
const {seguridad} = require('../middleware/seguridad');

//MIS CONTROLLERS FUERON EXPORTADOS Y LOS RECIBO ACA EN ESTA CONSTANTE
const {
  getDiscoById,
  getDiscos,
  crearDisco,
  updateDisco,
  deleteDisco,
  pagination
} = require("../controllers/disco");

// COMIENZO DE ENDPOINTS

ruta //AHORA ANTES DE EJECUTAR LOS METODOS SE EJECUTRARA LA SEGURIDAD DEL MIDDLEWARE SEGURIDAD
    .route('/')
    .get(seguridad, getDiscos)
    .post(seguridad, crearDisco)

ruta
    .route('/:id')
    .get(seguridad,getDiscoById)
    .put(seguridad,updateDisco)
    .delete(seguridad,deleteDisco)

ruta
    .route('/pagination')
    .post(seguridad,pagination);

    // CON ESTE MODULE EXPORT EXPORTO LA RUTA HACIA OTROS ARHCIVOS
module.exports = ruta;
