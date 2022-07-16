const express = require("express");
const ruta = express.Router();
const {
  getDiscoById,
  getDiscos,
  crearDisco,
  updateDisco,
  deleteDisco,
  pagination
} = require("../controllers/disco");

// COMIENZO DE ENDPOINTS

ruta
    .route('/')
    .get(getDiscos)
    .post(crearDisco)

ruta
    .route('/:id')
    .get(getDiscoById)
    .put(updateDisco)
    .delete(deleteDisco)

ruta
    .route('/pagination')
    .post(pagination);

module.exports = ruta;
