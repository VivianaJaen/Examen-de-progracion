# TecnoPlus - Sistema de Gestión de Productos (CRUD MERN)

Aplicación web full-stack desarrollada para la gestión de inventario de productos tecnológicos de **TecnoPlus**, implementando una arquitectura REST modular con Node.js, Express, MongoDB Atlas y un frontend responsivo con Bootstrap 5 y JavaScript puro (`fetch` + `async/await`).

## Tecnologías Utilizadas
* **Backend:** Node.js, Express.js
* **Base de Datos:** MongoDB Atlas & Mongoose
* **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6+)
* **Variables de Entorno & Seguridad:** `dotenv`, `cors`

## Estructura del Proyecto
```text
TecnoPlus_Examen/
├── config/
│   └── db.js                      # Conexión a MongoDB Atlas
├── controllers/
│   └── producto.controller.js     # Lógica CRUD y validaciones HTTP
├── models/
│   └── Producto.js                # Esquema y modelo de Mongoose
├── public/
│   ├── index.html                 # Interfaz de usuario (Bootstrap 5)
│   ├── styles.css                 # Estilos personalizados
│   └── app.js                     # Consumo de API REST con fetch
├── routes/
│   └── producto.routes.js         # Definición de endpoints
├── .env                           # Variables de entorno (no incluido en el repo)
├── .gitignore                     # Archivos ignorados por Git
├── app.js                         # Servidor principal Express
└── package.json                   # Dependencias y scripts