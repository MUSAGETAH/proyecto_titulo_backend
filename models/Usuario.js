const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
//schema que representa al usuario en la base de dato
const UsuarioSchema = new mongoose.Schema({
  nombre: {
    // validaciones para mis propiedades
    //cuando el cliente ingrese un usuario sin nombre se dispara ese mensaje
    type: String,
    required: [true, "Por favor ingrese un nombre"],
  },
  apellido: {
    type: String,
    required: [true, "Por favor ingrese un apellido"],
  },
  userName: {
    type: String,
    required: [true, "Por favor ingrese un username"],
  },
  email: {
    type: String,
    required: [true, "Por favor ingrese un email"],
    // unique es para que no ingrese emails que ya habia usado antes para registro
    unique: true,
    match: [
      /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
      "Ingrese un email válido",
    ],
  },
  password: {
    type: String,
    required: [true, "Por favor ingrese un password"],
    minlength: 6,

    // para ocultar el password en las respuestas y consultas
    select: false,
  },

  //VAMOS A ENCRIPTAR Y LUEGO PONER UN NEXT PARA QUE CONTINUE CON LA INSERCION
  //INSTALANDO UNA LIBRIERIA LLAMADA BCRYPTJS
  //LA IMPORTAMOS ARRIBA DEL DOCUMENTO Y
});

// el metodo pre dispara el middleware antes de la insercion

UsuarioSchema.pre("save", async function (next) {
  // HAY QUE USAR UN ALGORITMO DE ENCRIPTACION QUE TRAE LA LIBRERIA BCRYPT
  // EL GENT SALT TOMA UN PASS PLANO ENVIADO POR UN CLIENTE Y LO CONVIERTE EN ALGORITMOS ALEATORIOS
  // ASI PODEMOS GUARDAR ESTE PASS EN LA COLECCION PERO ENCRIPTADO
  // EL NUMERO 10 REPRESENTA LA CANTIDAD DE ROWS QUE USARA PARA GENERAR EL ENCRIPTADO DEL PASS
  // ES UN METODO ASYNCRONO POR LO QUE LLEVA EL ASYNC
  const salt = await bcrypt.genSalt(10);

  // AHORA INVOCO AL PASS USANDO EL METODO HASH DE BCRYPT
  //THIS.PASSWORD REPRESENTA EL DATO QUE ENVIA EL CLIENTE
  // LUEGO , Y LE PASAMOS EL PARAMETRO QUE ENCRYPTA DECLARADO EN LA CONST SALT
  // Y DE AHORA EN ADELANTE EL NUEVO PASSWORD SERA EL DATO ENCRYPTADO
  this.password = await bcrypt.hash(this.password, salt);

//   la respuesta seria:

        
// _id
// 62d5941765717e72949e2b45
// nombre
// "titan"
// apellido
// "Miranda"
// userName
// "Rah"
// email
// "test.3@test.com"
// password
// "$2a$10$.nBMZ.UvPDQQlWxAnf2y9urohizgovw6MW/zm/Rn50vQtU3Gies1a"
// __v
// 0
});

//Json web rtoken es una cadena de caracteres codificada
//o comprime toda la data que se envia entre cliente y servidor
//POR EJEMPLO EL CLIENTE QUIERE ENVIAR UN CONJUTO DE DATOS NOMBRE , DIRECCION ETC
//EN VEZ DE ENVIAR EL ARCHIVO PLANO ENVIA UN CONJUNTO DE CARACTERESS
//SE DIVIDEN EN 3 SECCIONES DIDIVDAS POR 1 PUNTO

// 1ERA SECCION EL HEADER: 

// REPRESENTA LA INFORMACION DEL TIPO DE ALGORITMO QUE USAMOS, QUE VERIFICA
// QUE EL TOKEN FUE CRFEADO POR NUESTRA APP Y NO POR OTRAS ENTIDADS

// 2DA SECCION PAYLOAD:

// AQUI AGREGAMOS LA DATA QUE QUEREMOS QUE EL TOKEN ALMACENE COMO MAIL DIRECCION TELEFONO ETC, OPCIONAL

// 3ERA SECCION VERIFICACION DE FIRMA

// AGREGAMOS LA PALABRA SECRETA QUE NECESITO PARA PODER HACER CAMBIOS 
// AL TOKEN O VALIDAR QUE ESTE TOKEN PERTENECE A ESTA APLICACION Y NO HA SIDO MANIPILADA POR AGENTES EXTERNOS
// LA PALABRA SECRETA SE ALMACENA SOLO EN EL SERVIDOR NO EN EL CLIENTE
// MIENTRAS QUE EL TOKEN SE ALMNACENA EN LOS CLIENTES POR LO QUE PUEDE SER UN ELEMENTO PUBLICO
// PARA VALIDAR QUE ESTO NO SE MANIPULE POR OTROS, AGREGO UNA PALABRA SECRETA EN EL SERVIDOR 
// CON ESTO CADA VEZ QUE EL SERBIDOR RESIVA EL REQUEST EJECUTA EL ALORITMO DE VALIDACION
// SI ESTAA PALABRA COINCIDE PROCEDE CON EL PEDIDO DEL CLIENTE, EN CASO CONTRARIO
// SE RECHAZA EL REQUEST
// ESTO LO HACE JSONWEBTOKEN 

// DEBO IMPORTAR LA LIBRERIA DEL JSON WEB TOKEN ARRIBA DEL DOCUMENTO
// AGREGO LA PALABRA SECRETA Y EL TIEMPO DE EXPIRACION DEL TOKEN EN CONFIG.ENV
UsuarioSchema.methods.crearJsonWebToken = function(){
    //AHORA LLAMO A LA VARIABLE CREADA COMO PALABRA SECRETA 
   return jwt.sign({ username: this.userName},
                    process.env.JWT_SECRET_WORD, 
                    {expiresIn: process.env.JWT_EXPIRE})
    }
    //VOY A CONTROLLERS A LA PROPIEDAD PASSWORD DEL REGISTRARUSUARIO

// esta funcion comprara la pass que envia el usuario con la de base de datos
UsuarioSchema.methods.validarPassword = async function(passwordUsuario){
  return await bcrypt.compare(passwordUsuario, this.password);
}
// exportamos el schema con el objeto creado usuarioSchema
//UNA VEZ HECHA LA FUNCION VOY A CONTROLLER AL METODO LOGIN
module.exports = mongoose.model("Usuario", UsuarioSchema);
