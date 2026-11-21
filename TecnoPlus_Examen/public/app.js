const API_URL = '/api/productos';

const formProducto = document.getElementById('form-producto');
const inputId = document.getElementById('producto-id');
const inputNombre = document.getElementById('nombre');
const inputCategoria = document.getElementById('categoria');
const inputPrecio = document.getElementById('precio');
const inputStock = document.getElementById('stock');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');
const tablaProductos = document.getElementById('tabla-productos');
const buscador = document.getElementById('buscador');
const alertaContainer = document.getElementById('alerta-container');

let listaProductos = [];

// Mostrar alertas visuales
function mostrarAlerta(mensaje, tipo = 'success') {
    alertaContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    setTimeout(() => {
        alertaContainer.innerHTML = '';
    }, 3500);
}

// 1. Obtener y listar productos (GET)
async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al consultar la API');
        listaProductos = await respuesta.json();
        renderizarTabla(listaProductos);
    } catch (error) {
        tablaProductos.innerHTML = `
            <tr><td colspan="5" class="text-center text-danger py-4">No se pudieron cargar los productos.</td></tr>
        `;
    }
}

// Dibujar filas en la tabla
function renderizarTabla(productos) {
    if (productos.length === 0) {
        tablaProductos.innerHTML = `
            <tr><td colspan="5" class="text-center text-muted py-4">No hay productos registrados.</td></tr>
        `;
        return;
    }

    tablaProductos.innerHTML = productos.map(prod => `
        <tr>
            <td class="fw-semibold">${prod.nombre}</td>
            <td><span class="badge bg-secondary-subtle text-dark border">${prod.categoria}</span></td>
            <td class="fw-bold text-success">$${Number(prod.precio).toFixed(2)}</td>
            <td>
                <span class="badge badge-stock ${prod.stock > 5 ? 'bg-primary' : 'bg-warning text-dark'}">
                    ${prod.stock} uds
                </span>
            </td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicion('${prod._id}')" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto('${prod._id}', '${prod.nombre}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 2. Registrar (POST) o Actualizar (PUT) producto
formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: inputNombre.value.trim(),
        categoria: inputCategoria.value,
        precio: parseFloat(inputPrecio.value),
        stock: parseInt(inputStock.value, 10)
    };

    const id = inputId.value;
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarAlerta(resultado.mensaje || 'Error al guardar el producto', 'danger');
            return;
        }

        mostrarAlerta(resultado.mensaje, 'success');
        resetearFormulario();
        cargarProductos();
    } catch (error) {
        mostrarAlerta('Error de conexión con el servidor', 'danger');
    }
});

// 3. Cargar datos en el formulario para editar
function prepararEdicion(id) {
    const producto = listaProductos.find(p => p._id === id);
    if (!producto) return;

    inputId.value = producto._id;
    inputNombre.value = producto.nombre;
    inputCategoria.value = producto.categoria;
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;

    formTitulo.innerHTML = `<i class="bi bi-pencil-square me-1 text-warning"></i>Editando: ${producto.nombre}`;
    btnGuardar.innerHTML = `<i class="bi bi-check-circle me-1"></i>Actualizar Producto`;
    btnGuardar.classList.replace('btn-primary', 'btn-warning');
    btnCancelar.classList.remove('d-none');
}

// Cancelar modo edición
function resetearFormulario() {
    formProducto.reset();
    inputId.value = '';
    formTitulo.innerHTML = `<i class="bi bi-plus-circle me-1 text-primary"></i>Registrar Producto`;
    btnGuardar.innerHTML = `<i class="bi bi-save me-1"></i>Guardar Producto`;
    btnGuardar.classList.replace('btn-warning', 'btn-primary');
    btnCancelar.classList.add('d-none');
}

btnCancelar.addEventListener('click', resetearFormulario);

// 4. Eliminar producto (DELETE)
async function eliminarProducto(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarAlerta(resultado.mensaje || 'Error al eliminar', 'danger');
            return;
        }

        mostrarAlerta(resultado.mensaje, 'warning');
        cargarProductos();
    } catch (error) {
        mostrarAlerta('Error de conexión al eliminar', 'danger');
    }
}

// 5. Buscador en tiempo real
buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    const filtrados = listaProductos.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
    );
    renderizarTabla(filtrados);
});

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);