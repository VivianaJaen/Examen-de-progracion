require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB Atlas
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rutas de la API
app.use('/api/productos', require('./routes/producto.routes'));

// Ruta de verificación de la API
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Bienvenido a la API de TecnoPlus',
        estado: 'Servidor funcionando correctamente'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor TecnoPlus activo en http://localhost:${PORT}`);
});