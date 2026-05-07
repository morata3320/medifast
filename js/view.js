/* Componentes */

const esc = (valor) =>
  String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const fmt = (numero) => `$${Number(numero).toFixed(2)}`;

const descuento = (original, actual) => {
  if (!original) return 0;
  return Math.round(((original - actual) / original) * 100);
};

export function tarjetaProducto(producto) {
  const tieneDescuento = producto.precioOriginal;
  const porcentaje = descuento(producto.precioOriginal, producto.precio);

  const badges = `
    ${producto.oferta ? '<span class="badge badge-oferta">Oferta</span>' : ''}
    ${producto.requiereReceta ? '<span class="badge badge-receta">Receta</span>' : ''}
  `;

  const precio = tieneDescuento
    ? `
      <div class="price-wrap">
        <span class="price-original">${fmt(producto.precioOriginal)}</span>
        <span class="price-current">${fmt(producto.precio)}</span>
        <span class="price-discount">-${porcentaje}%</span>
      </div>
    `
    : `
      <div class="price-wrap">
        <span class="price-current">${fmt(producto.precio)}</span>
      </div>
    `;

  const receta = producto.requiereReceta
    ? '<div class="receta-notice">Requiere receta médica</div>'
    : '';

  return `
    <article class="product-card" data-id="${producto.id}" role="listitem" aria-label="${esc(producto.nombre)}, ${fmt(producto.precio)}">
      <div class="card-badges" aria-hidden="true">${badges}</div>

      <div class="card-img">
        <img
          src="${esc(producto.imagen)}"
          alt="Imagen de ${esc(producto.nombre)}"
          loading="lazy"
          onerror="this.src='assets/placeholder.svg'; this.onerror=null;"
        />
      </div>

      <div class="card-body">
        <span class="card-lab">${esc(producto.laboratorio)}</span>
        <h3 class="card-name">${esc(producto.nombre)}</h3>
        <p class="card-desc">${esc(producto.descripcion)}</p>
        <span class="card-unidad">${esc(producto.unidad)}</span>
      </div>

      <div class="card-foot">
        ${precio}
        <button
          class="btn-add"
          type="button"
          data-id="${producto.id}"
          aria-label="Agregar ${esc(producto.nombre)} al carrito"
          ${producto.stock === 0 ? 'disabled aria-disabled="true"' : ''}
        >
          ${producto.stock === 0 ? 'Agotado' : 'Agregar'}
        </button>
      </div>

      ${receta}
    </article>
  `;
}

export function itemCarrito(item) {
  return `
    <div class="cart-item" data-id="${item.id}" role="listitem" aria-label="${esc(item.nombre)}">
      <img
        class="ci-img"
        src="${esc(item.imagen)}"
        alt="${esc(item.nombre)}"
        loading="lazy"
        onerror="this.src='assets/placeholder.svg'; this.onerror=null;"
      />

      <div class="ci-info">
        <p class="ci-name">${esc(item.nombre)}</p>
        <p class="ci-price">${fmt(item.precio)} c/u · <strong>${fmt(item.precio * item.cantidad)}</strong></p>

        <div class="qty-ctrl" role="group" aria-label="Cantidad de ${esc(item.nombre)}">
          <button class="qty-btn btn-minus" type="button" data-id="${item.id}" aria-label="Reducir cantidad">−</button>
          <span class="qty-n" aria-live="polite">${item.cantidad}</span>
          <button class="qty-btn btn-plus" type="button" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>

      <button class="btn-rm" type="button" data-id="${item.id}" aria-label="Eliminar ${esc(item.nombre)}">
        Eliminar
      </button>
    </div>
  `;
}

export function resumenOrden(items, totales) {
  const lineas = items.map((item) => `
    <div class="order-line">
      <span>${esc(item.nombre)} x ${item.cantidad}</span>
      <strong>${fmt(item.precio * item.cantidad)}</strong>
    </div>
  `).join('');

  const envio = totales.envio > 0
    ? fmt(totales.envio)
    : 'Gratis';

  return `
    <div class="order-summary" role="region" aria-label="Resumen del pedido">
      <h3>Resumen del pedido</h3>

      ${lineas}

      <div class="order-line">
        <span>Envío</span>
        <strong>${envio}</strong>
      </div>

      <div class="order-line">
        <span>Total</span>
        <strong>${fmt(totales.total)}</strong>
      </div>
    </div>
  `;
}

export const carritoVacio = () => `
  <div class="cart-empty" role="status" aria-live="polite">
    <p><strong>Tu carrito está vacío</strong></p>
    <p>Agrega productos desde el catálogo.</p>
  </div>
`;

export const loaderHTML = () => `
  <div class="loader" role="status" aria-label="Cargando productos">
    <div class="spinner" aria-hidden="true"></div>
    <span>Cargando productos...</span>
  </div>
`;

export const sinResultados = (busqueda) => `
  <div class="empty-results" role="status">
    <p>No se encontraron productos para <strong>"${esc(busqueda)}"</strong>.</p>
  </div>
`;

export function showToast(mensaje, tipo = 'success') {
  const contenedor = document.getElementById('toast-container');

  if (!contenedor) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.setAttribute('role', 'alert');
  toast.textContent = mensaje;

  contenedor.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}