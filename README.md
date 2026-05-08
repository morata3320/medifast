# MediFast Farmacia Online

MediFast es un sitio web de farmacia online desarrollado con HTML5, CSS3 y JavaScript ES6. El proyecto permite consultar un catálogo de productos, buscar medicamentos, filtrar por categorías, agregar productos al carrito, modificar cantidades, eliminar productos y finalizar una compra mediante un formulario validado.

El sitio funciona como página estática y puede ejecutarse localmente en un navegador mediante Live Server o un servidor local simple. También puede publicarse en Neocities manteniendo la misma estructura de carpetas.

# Estructura del proyecto

MEDIFASTV3
index.html
README.md
assets
styles.css
placeholder.svg
img
data
productos.json
js
app.js
cart.js
repo.js
view.js

# Tecnologías utilizadas

HTML5 para la estructura semántica del sitio.

CSS3 para el diseño visual, la adaptación responsive y los estilos de accesibilidad.

JavaScript ES6 para la lógica del carrito, eventos, validaciones, renderizado dinámico y almacenamiento web.

JSON para almacenar los datos del catálogo de productos.

Fetch API para cargar el archivo productos.json.

IndexedDB para guardar una copia local del catálogo y registrar eventos internos.

localStorage para guardar el carrito y la fecha de última actualización.

sessionStorage para conservar datos de la sesión actual.

Cookies para registrar la fecha de la última compra.

# Descripción de archivos

# index.html

Contiene la estructura principal del sitio.

Incluye el encabezado, navegación, catálogo, contacto, carrito lateral, modal de compra, mensajes dinámicos y pie de página.

Usa etiquetas semánticas como header, nav, main, section, aside, form y footer.

También incluye atributos de accesibilidad como aria label, aria live, aria hidden, aria expanded, aria controls, aria invalid y aria describedby.

# assets/styles.css

Contiene todos los estilos del sitio.

Define el diseño general, colores, tarjetas de productos, carrito, modal, formulario, mensajes, responsive design y foco visible.

Usa Flexbox, Grid y media queries para adaptar el sitio a móvil, tablet y escritorio.

# data/productos.json

Contiene los productos del catálogo.

Cada producto tiene id, nombre, categoría, precio, precio original, imagen, descripción, stock, unidad, receta, laboratorio, principio activo y oferta.

Las imágenes se cargan desde la ruta assets/img.

# js/app.js

Es el archivo principal de JavaScript.

Controla la carga inicial del sitio, los eventos, la búsqueda, los filtros por categoría, el carrito, el modal de compra y las validaciones del formulario.

También conecta las funciones de repo.js, cart.js y view.js.

# js/cart.js

Contiene la lógica del carrito de compras.

Permite agregar productos, eliminar productos, cambiar cantidades, vaciar el carrito, calcular subtotal, envío y total.

También guarda el carrito en localStorage y sessionStorage.

Registra la última actualización en localStorage y la última compra mediante cookies.

# js/repo.js

Controla la carga de datos.

Carga los productos desde data/productos.json usando Fetch API.

También guarda productos y eventos en IndexedDB para demostrar almacenamiento local avanzado.

# js/view.js

Contiene los componentes visuales reutilizables.

Genera las tarjetas de productos, los elementos del carrito, el resumen de la compra, el mensaje de carrito vacío, el mensaje de carga, los resultados vacíos y las notificaciones.

# Funcionalidades principales

Carga dinámica de productos desde un archivo JSON local.

Búsqueda de productos por nombre, categoría, descripción o laboratorio.

Filtro de productos por categoría.

Tarjetas de productos con imagen, nombre, laboratorio, descripción, unidad, precio y botón para agregar.

Carrito lateral con productos agregados.

Actualización de cantidades con botones de aumentar y disminuir.

Eliminación de productos del carrito.

Cálculo automático de subtotal, envío y total.

Persistencia del carrito al recargar la página.

Formulario de compra con validaciones mediante expresiones regulares.

Mensajes de error accesibles para cada campo.

Registro de la fecha de última actualización.

Uso de localStorage, sessionStorage, IndexedDB y cookies.

# Validaciones del formulario

El formulario de compra valida los siguientes campos:

Nombre completo

Correo electrónico

Teléfono

Cédula

Dirección

Ciudad

Número de tarjeta

Fecha de vencimiento

CVV

Las validaciones se realizan con expresiones regulares en el archivo js/app.js.

Cuando un dato es incorrecto, el campo se marca con aria invalid y se muestra un mensaje conectado mediante aria describedby.

# Accesibilidad

El sitio incluye estructura semántica con HTML5.

Los formularios tienen etiquetas label asociadas a sus campos.

Las imágenes tienen texto alternativo.

El foco visible está definido en CSS.

Los botones y controles tienen etiquetas accesibles.

El carrito y el formulario de compra usan atributos ARIA para mejorar la navegación.

Los mensajes de error usan role alert.

Los cambios dinámicos usan aria live.

# Persistencia de datos

El proyecto usa cuatro mecanismos de almacenamiento web.

localStorage guarda el carrito y la marca de última actualización.

sessionStorage guarda una copia temporal del carrito durante la sesión.

IndexedDB guarda el catálogo de productos y eventos internos.

Cookies guardan la fecha de la última compra.

La marca de última actualización se guarda con la clave mf_ultima_actualizacion.

# Ejecución local

Para ejecutar el proyecto localmente se recomienda usar Live Server en Visual Studio Code.

También se puede usar Python desde la carpeta del proyecto con el siguiente comando.

python -m http.server 5500

Luego se abre el navegador en la siguiente dirección.

http://localhost:5500

# Publicación en Neocities

Para publicar el sitio en Neocities se debe subir toda la estructura del proyecto.

No se debe subir solo index.html porque el sitio necesita las carpetas assets, data y js.

La estructura en Neocities debe quedar así.

index.html
README.md
assets
data
js

Después de subir los archivos, el sitio puede abrirse desde el enlace público de Neocities.

# Observaciones

El proyecto no utiliza frameworks externos.

El sitio funciona como página estática.

No utiliza backend ni base de datos en servidor.

La persistencia se realiza con almacenamiento del navegador.

Las imágenes de productos están ubicadas en assets/img.

Los productos pueden modificarse desde data/productos.json sin cambiar el HTML.
