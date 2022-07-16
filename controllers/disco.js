// un middlware lo que hace es interceptar un mensaje que se envia entre 2 componentes
//HAYQ UE HAER QUE SE ENLACEN ESTOS CONTROLLERS A RUTA DISCO
//METODOS DE TIPO CONTROLLER PARA DAR MANTENIMIENTO A LA ENTIDAD DISCO

const Disco = require("../models/Disco");
//aparece automaticamente el helper que controla los errores

const ErrorResponse = require("../helper/errorResponse");

// el contenido delbody en el response es el mensaje
exports.getDiscos = async (req, res, next) => {
  try {
    const discoLista = await Disco.find();

    res.status(200).json(discoLista);
  } catch (err) {
    // esto es como llamar a un servicio que he creado con parametros
    next(
      new ErrorResponse("No se pudo procesar el request" + err.message, 400)
    );
  }
};

exports.getDiscoById = async (req, res, next) => {
  try {
    const discoUnique = await Disco.findById(req.params.id);

    if (!discoUnique) {
      next(new ErrorResponse("No se pudo econtrar el disco"));
    }

    res.status(200).json(discoUnique);
  } catch (err) {
    // esto es como llamar a un servicio que he creado con parametros
    //o mas parecido a un interaction service con para metros
    next(
      new ErrorResponse("No se pudo procesar el request" + err.message, 400)
    );
  }
};

exports.crearDisco = async (req, res, next) => {
  // el metodo create necesita como parametro la data que usara para crear la coleccion libro
  // y la data esta en el request que envia el cliente dentro del body
  try {
    // discoUnique es igual a la creacion del disco basado en el esquema de disco en models y que a su vez
    // la data viene del body
    const discoUnique = await Disco.create(req.body);

    res.status(200).json({
      status: 200,
      data: discoUnique,
    });
  } catch (err) {
    // esto es como llamar a un servicio que he creado con parametros
    //o mas parecido a un interaction service con para metros
    next(
      new ErrorResponse("No se pudo procesar el request" + err.message, 400)
    );
  }
};

exports.updateDisco = async (req, res, next) => {
  // aqui buscamos el libro antes de actualizarlo
  //el id del libro viaja dentro de la url
  //y los datos estan dentro del requeist del body
  try {
    const discoUnique = await Disco.findByIdAndUpdate(req.params.id, res.body);

    res.status(200).json({
      status: 200,
      data: discoUnique,
    });
  } catch (err) {
    // esto es como llamar a un servicio que he creado con parametros
    //o mas parecido a un interaction service con para metros
    next(
      new ErrorResponse("No se pudo procesar el request" + err.message, 400)
    );
  }
};

exports.deleteDisco = async (req, res, next) => {
  try {
    const discoUnique = await Disco.findByIdAndDelete(req.params.id);

    // si no existe termina la operacion
    if (!discoUnique) {
      return next(new ErrorResponse("El disco no existe" + 400));
    }

    res.status(200).json({
      status: 200,
      data: discoUnique,
    });
  } catch (err) {
    // esto es como llamar a un servicio que he creado con parametros
    //o mas parecido a un interaction service con para metros
    next(
      new ErrorResponse("No se pudo procesar el request" + err.message, 400)
    );
  }
};

// RESPUESTA DEL METODO CREAR

// {
//   "status": 200,
//   "data": {
//       "titulo": "musageta",
//       "descripcion": "Disco de rap",
//       "precio": 10000,
//       "fechaPublicacion": "2009-03-05T03:00:00.000Z",
//       "autor": {
//           "id": "62ce382b6f09bbb32be2e816",
//           "seudonimo": "Titan"
//       },
//       "_id": "62cebe5324bb1730d3f1a79e",
//       "__v": 0
//   }
// }

// RESPUESTA GET OK

exports.pagination = async (req, res, next) => {
  try {
    // esta variable indica que columna que propiedad de la collecion es la que quiioeres ordenar
    const sort = req.body.sort;
    //essta variable indica el tipo de ordenamiento acedente o decendente
    const sortDirection = req.body.sortDirection;
    //esta representa el numero de página que quieres devolver
    const page = parseInt(req.body.page);
    //tamaño de la pagina o cuantos elemnentos por pagina
    const pageSize = parseInt(req.body.pageSize);

    // el valor a buscar por el cliente
    let filterValor = "";
    // propiedad sobre la cual voy a buscar como busca los titulos que comiencen con la letra a
    let filterPropiedad = "";
    //variable que represnta el total de discos
    let discos = [];

    //total de records o filas, que dependen del filtro
    let totalRows = 0;

    //el filter valuye es un json que tiene 2 propidades que 1 es valor y otra propiedad
    //filterValue = {valor: "", propiedad: ""}
    if (req.body.filterValue) {
      filterValor = req.body.filterValue.valor;
      filterPropiedad = req.body.filterValue.propiedad;

      // busqueda de elementos en discos colecction
      discos = await Disco.find({
        [filterPropiedad]: new RegExp(filterValor, "i"),
      })
        .sort({ [sort]: sortDirection })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      totalRows = await Disco.find({
        [filterPropiedad]: new RegExp(filterValor, "i"),
      }).count();
    } else {
      // Disco es el modelo
      //find busca, sort ordena, skip de donde comiezo a leer
      //.skip((page-1)* pageSize) me deuvelve el indice sobre el cual le doy lectura a los records
      //ejemplo lee la pagina 0, entonces 0(page) - 1 = 0 * x = 0 comienzo desde la pagina 0
      //  si se pide leer de la pagina 2 y el tamaño de la pagina es 10 (2-1 = 1 * 10= 10 leera despues del indice 10)
      //limit es hasta cuanto leere
      discos = await Disco.find()
        .sort({ [sort]: sortDirection })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      // total de records de la paginacion
      totalRows = await Disco.find().count();
    }

    // el total es 100 total rows : 10 pagesize = 10 pagesQuantity
    const pagesQuantity = Math.ceil(totalRows / pageSize);
    res.status(200).json({
      status: 200,
      pageSize,
      page,
      sort,
      sortDirection,
      pagesQuantity,
      totalRows,
      data: discos
    })
  } catch (err) {
    next(
      new ErrorResponse("No se pudo procesar el request" + err.message, 400)
    );
  }
};
