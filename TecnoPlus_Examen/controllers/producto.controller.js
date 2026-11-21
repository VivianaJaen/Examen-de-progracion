const Producto = require('../models/Producto');
const mongoose = require('mongoose');

// GET /api/productos - Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().sort({ createdAt: -1 });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
};

// GET /api/productos/:id - Obtener un producto específico
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de producto no válido' });
        }

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el producto', error: error.message });
    }
};

// POST /api/productos - Crear un nuevo producto
const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, stock, categoria } = req.body;

        if (!nombre || !categoria ||
            precio === undefined || stock === undefined ||
            !Number.isFinite(Number(precio)) || Number(precio) <= 0 ||
            !Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({ mensaje: 'Datos del producto inválidos' });
        }

        const nuevoProducto = new Producto({
            nombre,
            precio: Number(precio),
            stock: Number(stock),
            categoria
        });

        await nuevoProducto.save();

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            producto: nuevoProducto
        });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar el producto', error: error.message });
    }
};

// PUT /api/productos/:id - Actualizar un producto existente
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de producto no válido' });
        }

        const { nombre, precio, stock, categoria } = req.body;

        if (!nombre || !categoria ||
            precio === undefined || stock === undefined ||
            !Number.isFinite(Number(precio)) || Number(precio) <= 0 ||
            !Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({ mensaje: 'Datos del producto inválidos' });
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            { nombre, precio: Number(precio), stock: Number(stock), categoria },
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json({
            mensaje: 'Producto actualizado correctamente',
            producto: productoActualizado
        });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
};

// DELETE /api/productos/:id - Eliminar un producto
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensaje: 'ID de producto no válido' });
        }

        const productoEliminado = await Producto.findByIdAndDelete(id);

        if (!productoEliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};