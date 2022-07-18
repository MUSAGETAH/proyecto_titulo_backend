const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const errorHandler = require('./middleware/error')
const connectDataBase = require('./config/db')

dotenv.config({path: './config/config.env'});
connectDataBase()

//RUTAS
const disco = require('./rutas/disco');
const autor = require('./rutas/autor');
const usuario = require('./rutas/usuario');

const app = express();
// con esto indicamos que procese el json
app.use(express.json())
app.use(cors());

if(process.env.NODE_ENV === 'development'){
    
    app.use(morgan('dev'))
}

// NAMESPACES
// url generica y variable disco con la url del archivo
// AQUI USAMOS LAS IMPLEMENTACION DE LAS RUTAS
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

process.on('unhandledRejection', (err, promise)=>{
    console.log('Errores', err.message)
    server.close(()=>{
        process.exit(1)
    });
});