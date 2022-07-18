const ErrorResponse = require("../helper/errorResponse");
const Usuario = require("../models/Usuario");

//REGISTRAR
exports.registrarUsuario = async (req, res, next) => {
  //ANTES DE TRABAJAR LA LOGICA CON ESTA LINEA VERIFICO EL STATUS 200 EN POSTMAN
  //LUEGO LA COMENTO Y COMIENZO LA LOGICA
  //res.status(200).json({status:200})

  try {
    //MI VARIABLE CON LOS REQUEEST LOS IGUALO A AL req.body
    const { nombre, apellido, username, email, password } = req.body;
    //DESPUES NECESITO INSTANCIAR LA COLLECTION DECLARADA EN MODELS EL USUARIO.SCHEMA
    //ESTO LO HAGO AL PRINCIPIO DE ESTE DOCUMENTO CON EL REQUIRE
    //LUEGO LLAMO A LA VARIABLE QUE CONTIENE ESTA INSTANCIA Y LE PASO LOS PARAMETROS
    //COMO EL NOMBRE DE LA VARIABLE ES IGUAL A LA PROPIEDAD DEFINIDA LOS PONGO ASI Y NO ASI NOMBRE:
    //COMO EN MIS MODELOS QUE ES LO MISMO QUE EL SCHEMA USUARIO
    //PONGO userName ( propiedad del Schema ) : username (VARIABLE DEFINIDA ACA)
    //ESTA ES LA INSERSCION DE UN NUEVO RECORDS EN LA BASE DE DATOS MGDB
    //COMO ES UN PROCESO ASINCRONO DEBO PONER AWAIT Y ASYNC

    const userBD = await Usuario.create({
      nombre,
      apellido,
      userName: username,
      email,
      password,
    });

    const token = userBD.crearJsonWebToken();

    // RETORNO
    res.status(200).json({
      status: 200,
      id: userBD._id,
      nombre,
      apellido,
      username,
      email,
      token,
    });
  } catch (err) {
    next(
      // esto invoca el error response creado
      new ErrorResponse("Error registrando usuario" + err, 400)
    );
    //

    //LUEGO PRUEBO EN POSTMAN EN EL METODO REGISTRAR(POST), SELECCIONO BODY, ROW Y JSON
  }
};

//LOGIN
 exports.login = async (req, res, next) => {
  try {
    // PIDE DOS PARAMETROS EMAIL Y PASSWORD
    // LOS TOMARA DEL BODY REQUEST
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse("Ingrese un email y un password", 400));
    }

    // Usuario es el SCHEMA
    //COMO EL PASSWORD VA POR DEFECTO PUEDO FORZAR A QUE VAYA PONIENDO ESTO .select('+password')
    //CON ESTA CONSULTA OBTEMNGO EL USUARIO DE LA BD
    //QUE YA ME DEUVELVE CON EL NOMBRE EL APELLIDO ETC
    const usuarioBD = await Usuario.findOne({ email }).select("+password");
    //SI EL USUARIO NO EXISTE
    if (!usuarioBD) {
      return next(new ErrorResponse("Usuario no existe en la BD", 400));
    }

    // SI PASA LA VALIDACION LLAMAMOS AL METODO QUE COMPARA LOS PASS
    const valorBool =  await usuarioBD.validarPassword(password);

    if (!valorBool) {
      return next(new ErrorResponse("Las credenciales son incorrectas", 400));
    }

    //LUEGO GENERAMOS EL TOKEN DE USUARIO LOGEADO SI LA VALIDACION ES TRUE

    const token = usuarioBD.crearJsonWebToken();

    // RETORNO
    res.status(200).json({
      status: 200,
      id: usuarioBD._id,
      nombre: usuarioBD.nombre,
      apellido: usuarioBD.apellido,
      username: usuarioBD.userName,
      email: usuarioBD.email,
      token,
    });
  } catch (err) {
    next(
      // esto invoca el error response creado
      new ErrorResponse("Error en el login" + err, 400)
    );
  }
};

//OBTENER DATA DE USUARIO EN SESION
exports.getUsuario = async (req, res, next) => {
 //AHORA DEVOLVEMOS EL USUARIO 

 try {

 
    const usuarioEnElToken = req.usuario;

    const token = await usuarioEnElToken.crearJsonWebToken();

    res.status(200).json({
        status: 200,
        id: usuarioEnElToken._id,
        nombre: usuarioEnElToken.nombre,
        apellido: usuarioEnElToken.apellido,
        username: usuarioEnElToken.userName,
        email: usuarioEnElToken.email,
        token,
      });

    }catch(err){
       return next(
            new ErrorResponse('Error obteniendo la sesion del usuario' + err, 400)
        );
    }

};
