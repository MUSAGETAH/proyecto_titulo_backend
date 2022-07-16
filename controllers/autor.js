const ErrorResponse = require('../helper/errorResponse')
const Autor = require("../models/Autor");

// POST
// esta funcion crea a un autor
exports.crearAutor = async (req, res, next) => {
  // el create es gracias a mongoose y es el cliente el que envia la data en un request
  // y request tiene un header tiene body y un status
  //en este caso necesitamos un body por que ahi nos estan enviado la data en un json el cliente
  //esto inserta un nuevo registro en la db de mongo
  //y cuando necesitamos que la bd devuelva el registro vendra con un id automatico
  //si hay un error hacemos un try

  try {
    const autorData = await Autor.create(req.body);
    //esto se le envia de respuesta al cliente con un status 200 exitoso
    //el controller recibe el request y esta devolviendo un response pero la data es de tipo json
    //   por lo que debemos indicarle a expreess que procese esta informacion el body
    // esto se hace en el Service.js
    //desde el cliente (angular) envio un autor por metodo post
    //recibo, lo inserto y devuelvo la respuesta con status 200 
    //aedmas de la data del autor
    res.status(200).json({
      status: 200,
      data: autorData,
    });
  } catch (err) {
    next(new ErrorResponse('Error, no es posible crear el autor'+ err.message + 404 ))
  }
};

// respuesta de todo estos si no hay problema:

// {
//     "status": 200,
//     "data": {
//         "nombre": "Sergio",
//         "seudonimo": "Gran Rah",
//         "estilo": "Rap",
//         "nombreCompleto": "Sergio Nicolas Miranda Nuñez",
//         "_id": "62ce382b6f09bbb32be2e816", primary key de la collecion
//         "__v": 0
//     }
// }

// si vamos al atlas veremos la coleccion

// GET (obtengo lista) en este caso no devuelvo data de 1 autor si no una lista completa
exports.getAutor = async (req, res, next) => {
  try {
    const autorLista = await Autor.find();
    res.status(200).json(autorLista);
  } catch(err) {
    next(new ErrorResponse('Error, no es posible obtener el autor'+ err.message + 404 ))
  }
//  en postman: localhost:5000/api/DisqueraAutor
//   respuesta de este metodo 

//   [
//     {
//         "_id": "62ce382b6f09bbb32be2e816",
//         "nombre": "Sergio",
//         "seudonimo": "Gran Rah",
//         "estilo": "Rap",
//         "nombreCompleto": "Sergio Nicolas Miranda Nuñez",
//         "__v": 0
//     },
//     {
//         "_id": "62ce3daca5ccff23bf6a9f59",
//         "nombre": "Pedrito",
//         "seudonimo": "Super mc",
//         "estilo": "Rap metal",
//         "nombreCompleto": "Pedrito mc du nacimento",
//         "__v": 0
//     }
// ]
};

// GET por id(obtengo autor por id)
//en este caso sera por id dentro de la url la peticion de obtencion de un autor por id
//por lo que utilizo findbyid y obtengo ese parametro del request
exports.getAutorById = async (req, res, next) => {
    try{

      const autor = await Autor.findById(req.params.id);
      
      if(!autor){
        return next(new ErrorResponse('El autor no existe en la bd con este id: '+ req.params.id, 404 )) 
      }
      res.status(200).json(autor);
    } catch(err) {

        // acepta dos parametros 1 representa el mensaje personalizado
        // que representa el error y el segundo el codigo de error
        next(new ErrorResponse('El autor no existe con este id: '+ req.params.id, 404 ))
    }

//    en postman localhost:5000/api/DisqueraAutor/62ce382b6f09bbb32be2e816

//    {
//     "_id": "62ce382b6f09bbb32be2e816",
//     "nombre": "Sergio",
//     "seudonimo": "Gran Rah",
//     "estilo": "Rap",
//     "nombreCompleto": "Sergio Nicolas Miranda Nuñez",
//     "__v": 0
// }
  };


//   UPDATE POR ID
// se actualiza por el id
// findByIdAndUpdate pide 2 paarametros
exports.updateAutor = async (req, res, next) => {
    try { //esta funcion pide 2
      const autor = await Autor.findByIdAndUpdate(req.params.id, req.body);
    //   si no encuentra autor habra una condicon
      if(!autor){
        next(new ErrorResponse('El autor no existe con este id'+ req.params.id + 404 ))
      }
      
      res.status(200).json({
        status: 200,
        data: autor
      });
    } catch (err) {
      next(new ErrorResponse('El autor no existe con este id'+ req.params.id + 404 ))
    }
  };

//   DELETE 
  exports.deleteAutor = async (req, res, next) => {
    try {
      const autor = await Autor.findByIdAndDelete(req.params.id);
    //   si no encuentra autor habra una condicon
      if(!autor){
        next(new ErrorResponse('El autor no existe con este id'+ req.params.id + 404 ))
      }
      res.status(200).json({status:200});
    
    } catch (err) {
       
      next(new ErrorResponse('El autor no existe con este id'+ req.params.id + 404 ))
    }
  };

