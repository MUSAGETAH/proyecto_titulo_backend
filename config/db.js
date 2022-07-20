//CON ESTO CONECTO MONGOOSE A MI CLUSTER DE MONGO DB

const mongoose = require('mongoose');

const connectDatabase = async () => {
 
    const conexion = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
 
    console.log('MongoDB Servidor Atlas Conectado', conexion.connection.host);
};

// Y LUEGO EXPORTO EL MODULO CON LA FUNCION 
module.exports = connectDatabase;