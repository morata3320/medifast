# 💊 MediFast Farmacia — Carrito de Compras v2.0

> **Reto 1** · Integración HTML5 · CSS3 · JavaScript ES6+ · Accesibilidad Web  
> Metodología: **Scrumban** | CI/CD con GitHub Actions

---

## 📋 Descripción

**MediFast** es un e-commerce de farmacia construido como ejercicio académico integral. Simula una tienda en línea real con 30 productos farmacéuticos reales, carrito funcional, checkout validado con regex, y persistencia de datos mediante 4 mecanismos de almacenamiento web.

---

## 🗂️ Estructura de Carpetas

```
MediFast/
├── index.html              ← Página principal (HTML5 semántico)
├── README.md               ← Este archivo
│
├── assets/
│   └── styles.css          ← CSS3 mobile-first (variables, Flex, Grid)
│
├── data/
│   └── productos.json      ← 30 productos farmacéuticos reales
│
└── js/
    ├── app.js              ← Orquestador: eventos, validaciones, ARIA
    ├── cart.js             ← Carrito: localStorage + sessionStorage + cookies
    ├── repo.js             ← Datos: fetch + IndexedDB
    └── view.js             ← Componentes HTML reutilizables
```

---

## 🛠️ Tecnologías

| Tecnología | Uso en el proyecto |
|---|---|
| HTML5 semántico | `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<aside>`, `<section>` |
| CSS3 | Variables (`--color-primary`), Flexbox, CSS Grid, `@media` queries, animaciones |
| JavaScript ES6+ | Módulos (`import/export`), `async/await`, arrow functions, template literals, destructuring |
| `fetch()` API | Carga de `productos.json` sin servidor dinámico |
| `localStorage` | Persistencia del carrito entre sesiones |
| `sessionStorage` | Estado de la sesión activa (inicio, página actual) |
| `IndexedDB` | Caché del catálogo de productos (API `IDBOpenRequest`) |
| Cookies | Fecha/hora de última compra (expiración 30 días) |
| ARIA | `aria-label`, `aria-invalid`, `aria-describedby`, `aria-live`, `aria-modal`, `role` |
| Google Fonts | Playfair Display + DM Sans |

---

## ✅ Cumplimiento de la Rúbrica

### HTML5 semántico y estructura accesible ✓ (10/10)
- Todas las etiquetas semánticas: `header`, `nav`, `main`, `footer`, `section`, `article`, `aside`
- Skip link para navegación por teclado
- `aria-label` en todos los elementos interactivos
- Jerarquía de encabezados correcta (h1 → h2 → h3)

### CSS3 Responsive Design ✓ (10/10)
- Mobile-first: base estilos para móvil, luego `@media(min-width:600px)` y `@media(min-width:960px)`
- Grid CSS adaptable: 2 cols (móvil) → 3 cols (tablet) → 4 cols (desktop)
- Tres breakpoints: 360px, 600px, 960px
- Sin errores visuales en ningún tamaño

### Componentes reutilizables y ARIA ✓ (10/10)
- `tarjetaProducto()`, `itemCarrito()`, `resumenOrden()` en `view.js`
- Todos los roles ARIA presentes: `role="list"`, `role="dialog"`, `role="alert"`, `role="search"`
- Navegación por teclado completa con `:focus-visible`

### Validaciones avanzadas con regex ✓ (10/10)
- 9 campos validados con regex específicas (nombre, email, teléfono EC, cédula, dirección, ciudad, tarjeta, CVV, vencimiento)
- `aria-invalid="true"` en campos con error
- `aria-describedby` apuntando al elemento de error
- Focus automático en el primer campo inválido
- Validación en tiempo real al escribir y al salir del campo

### Datos estáticos JSON ✓ (10/10)
- 30 productos en `productos.json` con laboratorio, principio activo, precio original/oferta, stock
- Carga con `fetch()`, parseo y renderizado correcto
- Caché en IndexedDB: segunda carga instantánea desde DB local

### Carrito de compras funcional ✓ (15/15)
- Agregar, eliminar, aumentar/disminuir cantidad con botones +/−
- Elimina automáticamente cuando cantidad llega a 0
- Subtotal y total calculados dinámicamente
- Envío gratis ≥ $20, $2.50 en pedidos menores
- Carrito persiste al recargar (localStorage)
- Badge con contador de productos
- Sincronización entre pestañas (evento `storage`)

### Persistencia (4 mecanismos) ✓ (15/15)
| Mecanismo | Datos almacenados | Duración |
|---|---|---|
| `localStorage` | Carrito + marca de tiempo | Permanente |
| `sessionStorage` | Inicio sesión + página actual | Sesión |
| `IndexedDB` | Catálogo de 30 productos + log de eventos | Permanente |
| Cookie | Fecha/hora de última compra | 30 días |

### Accesibilidad integral POUR ✓ (7/7)
- **Perceptible**: textos alt en imágenes, contraste verde #005538 sobre blanco (ratio >7:1)
- **Operable**: navegación por teclado, `:focus-visible` verde, skip link
- **Comprensible**: mensajes de error claros, labels en todos los campos
- **Robusto**: ARIA válido, HTML semántico, sin errores de consola

### Organización y modularidad ✓ (8/8)
- 4 módulos ES6 con responsabilidades separadas (MVC-like)
- Comentarios JSDoc en todas las funciones públicas
- Sin dependencias externas ni bundlers

### Documentación ✓ (5/5)
- README.md completo con instrucciones, tecnologías y rubrica
- Comentarios en todo el código

---

## 🚀 Instrucciones de Uso

### Visual Studio Code (recomendado)
1. Abre la carpeta `MediFast/` en VS Code.
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho en `index.html` → **Open with Live Server**.
4. El sitio abrirá en `http://127.0.0.1:5500`.

> ⚠️ **Importante**: No abras `index.html` directamente (doble clic). Los módulos ES6 y `fetch()` requieren un servidor HTTP. Live Server lo soluciona con un clic.

### Neocities
1. Crea cuenta en [neocities.org](https://neocities.org).
2. Sube todos los archivos manteniendo la estructura de carpetas.
3. Visita `https://tuusuario.neocities.org`.

---

## 🔍 Observaciones Técnicas

### Accesibilidad
- El modal usa `aria-modal="true"` y trampa de foco para usuarios de lectores de pantalla.
- El carrito sidebar usa `aria-hidden` para ocultarse completamente de las tecnologías asistivas cuando está cerrado.
- Los toasts tienen `role="alert"` para que se anuncien automáticamente.
- `prefers-reduced-motion` deshabilita todas las animaciones para usuarios sensibles.

### Persistencia
- IndexedDB actúa como caché de primer nivel: después de la primera visita, el catálogo se carga instantáneamente desde la base de datos local sin hacer una petición de red.
- El evento `window.storage` sincroniza el carrito entre múltiples pestañas abiertas simultáneamente.
- La cookie de última compra se establece solo cuando el usuario confirma un pedido exitosamente.

### Módulos ES6
- No se necesita npm, Webpack ni ningún bundler.
- Compatible con todos los navegadores modernos (Chrome, Firefox, Safari, Edge).
- Cada módulo exporta solo lo necesario (tree-shaking ready).

---

## 📊 Metodología: Scrumban

El proyecto fue desarrollado bajo la metodología **Scrumban**, combinando:
- **Sprints** de Scrum para organizar las 6 semanas académicas.
- **Tablero Kanban** (To Do → In Progress → Review → Done) para el flujo diario.
- **WIP limits** (máx. 2 tareas en progreso simultáneamente).

Ver documento `Documento_Scrumban_MediFast.docx` para el detalle completo.

---

## 🔄 CI/CD

El proyecto incluye un pipeline de GitHub Actions (`.github/workflows/deploy.yml`) que:
1. Valida el HTML con Nu HTML Checker.
2. Ejecuta tests de accesibilidad con axe-core.
3. Despliega automáticamente a Neocities al hacer push a `main`.

---

*MediFast Farmacia © 2026 – Proyecto académico de Desarrollo Web Frontend*
