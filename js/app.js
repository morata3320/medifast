/* App */

import {
  cargarProductos,
  registrarEvento,
} from './repo.js';

import {
  getItems,
  getCantidadTotal,
  getTotales,
  agregarItem,
  eliminarItem,
  cambiarCantidad,
  vaciar,
  sincronizar,
  setCookieCompra,
} from './cart.js';

import {
  tarjetaProducto,
  itemCarrito,
  carritoVacio,
  loaderHTML,
  sinResultados,
  resumenOrden,
  showToast,
} from './view.js';

let productos = [];
let categoriaActiva = 'Todos';
let textoBusqueda = '';

const grid = document.getElementById('productos-grid');
const catFilter = document.getElementById('cat-filter');
const searchInput = document.getElementById('search-input');

const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartSubt = document.getElementById('cart-subt');
const cartEnvio = document.getElementById('cart-envio');
const cartTotal = document.getElementById('cart-total');

const modalOverlay = document.getElementById('modal-overlay');
const resumenOrdenEl = document.getElementById('resumen-orden');

document.addEventListener('DOMContentLoaded', async () => {
  sessionStorage.setItem('mf_sesion_inicio', new Date().toISOString());

  grid.innerHTML = loaderHTML();
  grid.setAttribute('aria-busy', 'true');

  try {
    productos = await cargarProductos();
    renderCategorias();
    renderProductos();
    grid.setAttribute('aria-busy', 'false');
  } catch (error) {
    grid.innerHTML = `
      <p class="error-load" role="alert">
        No se pudieron cargar los productos.
      </p>
    `;
    console.error(error);
  }

  renderCarrito();
  actualizarBadge();
  eventos();

  window.addEventListener('storage', (event) => {
    if (event.key === 'mf_cart') {
      sincronizar();
      renderCarrito();
      actualizarBadge();
    }
  });
});

function renderCategorias() {
  const categorias = ['Todos', ...new Set(productos.map((producto) => producto.categoria))];

  catFilter.innerHTML = categorias.map((categoria) => `
    <button
      class="cat-pill ${categoria === categoriaActiva ? 'active' : ''}"
      type="button"
      data-cat="${categoria}"
      aria-pressed="${categoria === categoriaActiva}"
    >
      ${categoria}
    </button>
  `).join('');
}

function actualizarTitulo() {
  const titulo = document.getElementById('titulo-catalogo');

  if (!titulo) return;

  titulo.textContent = categoriaActiva === 'Todos'
    ? 'Catálogo de productos'
    : categoriaActiva;
}

function actualizarCategorias() {
  catFilter.querySelectorAll('.cat-pill').forEach((boton) => {
    const activo = boton.dataset.cat === categoriaActiva;
    boton.classList.toggle('active', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });
}

function renderProductos() {
  let lista = productos;

  if (categoriaActiva !== 'Todos') {
    lista = lista.filter((producto) => producto.categoria === categoriaActiva);
  }

  if (textoBusqueda.trim()) {
    const q = textoBusqueda.toLowerCase();

    lista = lista.filter((producto) =>
      producto.nombre.toLowerCase().includes(q) ||
      producto.descripcion.toLowerCase().includes(q) ||
      producto.categoria.toLowerCase().includes(q) ||
      (producto.laboratorio || '').toLowerCase().includes(q)
    );
  }

  if (lista.length === 0) {
    grid.innerHTML = sinResultados(textoBusqueda || categoriaActiva);
    return;
  }

  grid.setAttribute('role', 'list');
  grid.innerHTML = lista.map((producto) => tarjetaProducto(producto)).join('');
}

function renderCarrito() {
  const items = getItems();

  if (items.length === 0) {
    cartItems.innerHTML = carritoVacio();
    cartSubt.textContent = '$0.00';
    cartEnvio.textContent = '$0.00';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartItems.setAttribute('role', 'list');
  cartItems.innerHTML = items.map((item) => itemCarrito(item)).join('');

  const totales = getTotales();

  cartSubt.textContent = `$${totales.subtotal.toFixed(2)}`;
  cartEnvio.textContent = totales.envio > 0 ? `$${totales.envio.toFixed(2)}` : 'Gratis';
  cartTotal.textContent = `$${totales.total.toFixed(2)}`;
}

function actualizarBadge() {
  const cantidad = getCantidadTotal();

  cartBadge.textContent = cantidad;
  cartBadge.setAttribute('aria-label', `${cantidad} productos en el carrito`);
  cartBadge.style.display = cantidad > 0 ? 'grid' : 'none';
}

function abrirCarrito() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');

  cartSidebar.setAttribute('aria-hidden', 'false');
  document.getElementById('btn-abrir-carrito').setAttribute('aria-expanded', 'true');

  document.body.style.overflow = 'hidden';
  document.getElementById('btn-cerrar-carrito').focus();
}

function cerrarCarrito() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');

  cartSidebar.setAttribute('aria-hidden', 'true');
  document.getElementById('btn-abrir-carrito').setAttribute('aria-expanded', 'false');

  document.body.style.overflow = '';
}

function abrirModal() {
  resumenOrdenEl.innerHTML = resumenOrden(getItems(), getTotales());

  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');

  document.body.style.overflow = 'hidden';
  document.getElementById('f-nombre').focus();
}

function cerrarModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');

  document.body.style.overflow = '';
}

function eventos() {
  document.getElementById('btn-abrir-carrito').addEventListener('click', abrirCarrito);
  document.getElementById('btn-cerrar-carrito').addEventListener('click', cerrarCarrito);
  cartOverlay.addEventListener('click', cerrarCarrito);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      cerrarCarrito();
      cerrarModal();
    }
  });

  grid.addEventListener('click', (event) => {
    const boton = event.target.closest('.btn-add');

    if (!boton || boton.disabled) return;

    const id = Number(boton.dataset.id);
    const producto = productos.find((item) => item.id === id);

    if (!producto) return;

    agregarItem(producto);
    registrarEvento('agregar', producto.nombre);

    renderCarrito();
    actualizarBadge();

    showToast(`${producto.nombre} agregado al carrito.`, 'success');

    boton.textContent = 'Agregado';

    setTimeout(() => {
      boton.textContent = 'Agregar';
    }, 1200);
  });

  cartItems.addEventListener('click', (event) => {
    const elemento = event.target.closest('[data-id]');

    if (!elemento) return;

    const id = Number(elemento.dataset.id);

    if (event.target.closest('.btn-rm')) {
      eliminarItem(id);
      showToast('Producto eliminado.', 'info');
    }

    if (event.target.closest('.btn-plus')) {
      cambiarCantidad(id, 1);
    }

    if (event.target.closest('.btn-minus')) {
      cambiarCantidad(id, -1);
    }

    renderCarrito();
    actualizarBadge();
  });

  document.getElementById('btn-vaciar').addEventListener('click', () => {
    if (!confirm('¿Deseas vaciar el carrito?')) return;

    vaciar();
    renderCarrito();
    actualizarBadge();

    showToast('Carrito vaciado.', 'info');
  });

  document.getElementById('btn-checkout').addEventListener('click', () => {
    if (getItems().length === 0) {
      showToast('El carrito está vacío.', 'error');
      return;
    }

    cerrarCarrito();
    abrirModal();
  });

  document.querySelectorAll('.modal-close').forEach((boton) => {
    boton.addEventListener('click', cerrarModal);
  });

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      cerrarModal();
    }
  });

  catFilter.addEventListener('click', (event) => {
    const boton = event.target.closest('.cat-pill');

    if (!boton) return;

    categoriaActiva = boton.dataset.cat;
    textoBusqueda = '';
    searchInput.value = '';

    actualizarTitulo();
    actualizarCategorias();
    renderProductos();
  });

  document.querySelectorAll('.main-nav a').forEach((enlace) => {
    enlace.addEventListener('click', (event) => {
      const categoria = event.currentTarget.dataset.cat;

      document.querySelectorAll('.main-nav a').forEach((item) => {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      });

      event.currentTarget.classList.add('active');
      event.currentTarget.setAttribute('aria-current', 'page');

      if (categoria) {
        categoriaActiva = categoria;
        textoBusqueda = '';
        searchInput.value = '';

        actualizarTitulo();
        actualizarCategorias();
        renderProductos();
      }
    });
  });

  let timer;

  searchInput.addEventListener('input', (event) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      textoBusqueda = event.target.value;
      renderProductos();
    }, 300);
  });

  document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();

    textoBusqueda = searchInput.value;
    renderProductos();
  });

  document.getElementById('form-checkout').addEventListener('submit', (event) => {
    event.preventDefault();

    if (validarFormulario()) {
      procesarPedido();
    }
  });

  document.getElementById('f-tarjeta').addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 16);
  });

  document.getElementById('f-cvv').addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
  });

  document.getElementById('f-cedula').addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
  });

  document.getElementById('f-vencimiento').addEventListener('input', (event) => {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length >= 2) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}`;
    }

    event.target.value = valor;
  });
}

const reglas = {
  'f-nombre': [
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,60}$/,
    'Escribe un nombre válido.',
  ],
  'f-email': [
    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    'Escribe un correo válido.',
  ],
  'f-telefono': [
    /^(\+593|0)[2-9][0-9]{7,8}$/,
    'Escribe un teléfono ecuatoriano válido.',
  ],
  'f-cedula': [
    /^[0-9]{10}$/,
    'La cédula debe tener 10 dígitos.',
  ],
  'f-direccion': [
    /^.{3,150}$/,
    'Escribe una dirección válida.',
  ],
  'f-ciudad': [
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,40}$/,
    'Escribe una ciudad válida.',
  ],
  'f-tarjeta': [
    /^[0-9]{16}$/,
    'La tarjeta debe tener 16 dígitos.',
  ],
  'f-vencimiento': [
    /^(0[1-9]|1[0-2])\/([2-9][0-9])$/,
    'Usa el formato MM/AA.',
  ],
  'f-cvv': [
    /^[0-9]{3,4}$/,
    'El CVV debe tener 3 o 4 dígitos.',
  ],
};

function validarCampo(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-err`);
  const [regex, mensaje] = reglas[id];

  const valido = regex.test(input.value.trim());

  input.setAttribute('aria-invalid', String(!valido));
  error.textContent = valido ? '' : mensaje;

  return valido;
}

function validarFormulario() {
  const ids = Object.keys(reglas);
  const resultados = ids.map((id) => validarCampo(id));
  const valido = resultados.every(Boolean);

  if (!valido) {
    const primerError = document.querySelector('[aria-invalid="true"]');
    primerError?.focus();
    showToast('Corrige los campos marcados.', 'error');
  }

  return valido;
}

function procesarPedido() {
  const totales = getTotales();

  setCookieCompra();
  registrarEvento('compra', `$${totales.total.toFixed(2)}`);

  vaciar();
  renderCarrito();
  actualizarBadge();
  cerrarModal();

  document.getElementById('form-checkout').reset();

  showToast('Pedido confirmado correctamente.', 'success');
}