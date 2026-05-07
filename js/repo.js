/* Datos */

const DB_NAME = 'MediFastDB';
const DB_VERSION = 1;
const STORE_PRODUCTOS = 'productos';
const STORE_EVENTOS = 'eventos';

let db = null;

export function abrirDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_PRODUCTOS)) {
        const store = database.createObjectStore(STORE_PRODUCTOS, {
          keyPath: 'id',
        });

        store.createIndex('categoria', 'categoria', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORE_EVENTOS)) {
        database.createObjectStore(STORE_EVENTOS, {
          keyPath: 'fecha',
        });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function guardarProductos(productos) {
  const database = await abrirDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_PRODUCTOS, 'readwrite');
    const store = transaction.objectStore(STORE_PRODUCTOS);

    productos.forEach((producto) => {
      store.put(producto);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

async function leerProductosDB() {
  const database = await abrirDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_PRODUCTOS, 'readonly');
    const store = transaction.objectStore(STORE_PRODUCTOS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function registrarEvento(tipo, detalle = '') {
  try {
    const database = await abrirDB();
    const transaction = database.transaction(STORE_EVENTOS, 'readwrite');
    const store = transaction.objectStore(STORE_EVENTOS);

    store.put({
      fecha: Date.now(),
      tipo,
      detalle,
    });
  } catch {
    console.warn('No se pudo registrar el evento.');
  }
}

export async function cargarProductos() {
  try {
    const productosGuardados = await leerProductosDB();

    if (productosGuardados.length > 0) {
      registrarEvento('carga', 'indexeddb');
      return productosGuardados;
    }
  } catch {
    console.warn('No se pudo leer desde IndexedDB.');
  }

  const respuesta = await fetch('./data/productos.json');

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar productos.json');
  }

  const productos = await respuesta.json();

  try {
    await guardarProductos(productos);
    registrarEvento('carga', 'json');
  } catch {
    console.warn('No se pudo guardar en IndexedDB.');
  }

  return productos;
}