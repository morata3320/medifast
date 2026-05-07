/* Carrito */

const LS_KEY = 'mf_cart';
const SS_KEY = 'mf_cart_session';
const COOKIE_KEY = 'mf_ultima_compra';
const UPDATE_KEY = 'mf_ultima_actualizacion';

function guardarFechaActualizacion() {
  localStorage.setItem(UPDATE_KEY, new Date().toISOString());
}

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

function guardarLocal(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
  guardarFechaActualizacion();
}

function guardarSesion(items) {
  sessionStorage.setItem(SS_KEY, JSON.stringify(items));
}

function persistir() {
  guardarLocal(carrito);
  guardarSesion(carrito);
}

let carrito = leerCarrito();

export const getItems = () => [...carrito];

export const getCantidadTotal = () =>
  carrito.reduce((total, item) => total + item.cantidad, 0);

export const getSubtotal = () =>
  carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

export function getTotales() {
  const subtotal = getSubtotal();
  const envio = subtotal > 0 && subtotal < 20 ? 2.5 : 0;

  return {
    subtotal,
    envio,
    total: subtotal + envio,
  };
}

export function agregarItem(producto) {
  const encontrado = carrito.find((item) => item.id === producto.id);

  if (encontrado) {
    encontrado.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      laboratorio: producto.laboratorio || '',
      unidad: producto.unidad || '',
      cantidad: 1,
    });
  }

  persistir();
  return getItems();
}

export function eliminarItem(id) {
  carrito = carrito.filter((item) => item.id !== id);

  persistir();
  return getItems();
}

export function cambiarCantidad(id, cambio) {
  const item = carrito.find((producto) => producto.id === id);

  if (!item) return getItems();

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    return eliminarItem(id);
  }

  persistir();
  return getItems();
}

export function vaciar() {
  carrito = [];

  persistir();
  return [];
}

export function sincronizar() {
  carrito = leerCarrito();
  return getItems();
}

export function setCookieCompra() {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 30);

  document.cookie =
    `${COOKIE_KEY}=${encodeURIComponent(new Date().toISOString())};` +
    `expires=${fecha.toUTCString()};path=/;SameSite=Strict`;

  guardarFechaActualizacion();
}

export function getCookieCompra() {
  const match = document.cookie.match(new RegExp(`${COOKIE_KEY}=([^;]+)`));

  return match ? decodeURIComponent(match[1]) : null;
}

export function getUltimaActualizacion() {
  return localStorage.getItem(UPDATE_KEY);
}