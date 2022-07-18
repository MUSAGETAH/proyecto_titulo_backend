const ErrorResponse = require("../helper/errorResponse");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

exports.seguridad = async (req, res, next) => {
  let token;

  //EL TOKEN SE ENCUENTRA EN LA PROPIEDAD AUTHORIZATION DEL HEADER DEL RQUEST
  //SIEMPRE COMIENZAN CON LA PALABRA Bearer 'TOKEN'
  //DEBE VENIR EL TOKEN EN LOS HEADERS EN  AUTHORIZATION Y ADEMAS DEBE COMENZAR CON LA PALABRA 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //CON ESTO SEPARO EL TOKEN DEL BEARER Y ME QUEDO SOLO CON EL TOKEN
    token = req.headers.authorization.slice(6).trim();
    console.log('este es el token',token)
  }

  if (!token) {
    return next(new ErrorResponse("El cliente no envio el token", 400));
  }

  //UNA VEZ VALIDADO NECESITAMOS AL JSON WEB TOKEN PARA VER SI NO A EXPIRADO NI HA SIDO MANIPULADO
  try {
    //LA FUNCION TOMA EL TOKEN Y LO DECODIFICA Y LO CONVIERTE EN EL PAYLOAD EL VALOR QUE SE ALNACENA, EN ESTE CASO EL USERNAME
    const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD);
    console.log("token", decoded);
    //CON ESTO BUSQUE Y ECNONTRE AL USUARIO  DE LA BASE DE DATOS QUE TIENE ESTE PARAMETRO USERNAME QUE SE ENCONTRABA DECODIFICADO EN EL TOKEN
    const usuarioBD = await Usuario.findOne({ userName: decoded.username });

    //AHORA INCLUIMOS LA DATA DEL USUARIO
    //AHORA EL REQUEST VIAJARIA HACIA LAS RUTAS Y CONTROLLERS CONTENIENDO LA DATA DEL USUARIO
    req.usuario = usuarioBD;

    next();
  } catch (err) {
    return next(
      new ErrorResponse("Errores en el procesamiento del token", 400)
    );
  }
};
