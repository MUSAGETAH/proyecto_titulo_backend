const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const errorHandler = require('./middleware/error')
const connectDataBase = require('./config/db')

dotenv.config({path: './config/config.env'});
// FUNCION QUE EJECUTA LA CONEXION A LA BASE DE DATOS
connectDataBase()

//RUTAS
const disco = require('./rutas/disco');
const autor = require('./rutas/autor');
const usuario = require('./rutas/usuario');

const app = express();
// con esto indicamos que procese el json
app.use(express.json())
app.use(cors());

// MORGAN ES UN MIDDLEWARE Y AQUI LOC ONDICIONO SOLO A USARSE EN PRODUCCION
// ME IMPRIME LOS REQUEST Y METODOS QUE VIENEN DE UNA URL CUALQUIERA
if(process.env.NODE_ENV === 'development'){
    
    app.use(morgan('dev'))
}

// NAMESPACES
// url generica y variable disco con la url del archivo
// AQUI USAMOS LAS IMPLEMENTACION DE LAS RUTAS
// USAMOS LAS RUTAS REQUERIDAS ARRIBA Y LES DOY LAS URL BASE
//+ COMO SEGUNDO PARAMETRO EL OBJETO INSTANCIA DEL ARCHIVO RUTA
app.use('/api/DisqueraAutor', autor);
app.use('/api/disco', disco);
app.use('/usuario', usuario);
// LUEGO VOY A POSTMAN Y YA ME DEVUELVE EL STATUS, 200 PARA OK

//MIDDLEWARE
app.use(errorHandler);



//aqui defino mi variable creada en config
const PORT = process.env.PORT || 5000

// aqui elijo el ambiente de producion o desarrollo
const server = app.listen(PORT, console.log('servidor se ejecuta en ambiente', process.env.NODE_ENV));

// CUANDO SUCEDA ESTE ERROR SE DETIENE MI SERVIDOR
process.on('unhandledRejection', (err, promise)=>{
    console.log('Errores', err.message)
    server.close(()=>{
        process.exit(1)
    });
});