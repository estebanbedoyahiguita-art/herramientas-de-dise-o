# Happy Pets - Proyecto universitario

Tienda en línea de comida natural (BARF) para perros y gatos, hecha con tecnologías básicas:
HTML, CSS (con media queries), JavaScript y jQuery.

## Una sola página
Todo el sitio vive en `index.html`. El menú y el pie son fijos; jQuery cambia solo la
zona central (`#vista`) con un efecto de desvanecer, sin recargar la página.
La vista se elige con lo que va después del `#` en la dirección:

- `#/inicio`: página principal
- `#/tienda` (o `#/tienda/snacks`): tienda con filtros
- `#/producto/5`: detalle de un producto
- `#/carrito`: carrito de compras

Los botones atrás/adelante del navegador funcionan, porque cada vista tiene su dirección.

## Lo que hace jQuery
- **Navegación sin recargar** (`navegar()`): escucha el evento `hashchange` y pinta la vista.
- **Vista rápida**: al tocar un producto se abre una ventana animada encima.
- **Categorías en el inicio**: filtran la grilla de productos ahí mismo, con animación.
- **Filtros de la tienda**: categoría, disponibilidad y orden, sin recargar.
- **Carrito lateral**: se desliza al agregar un producto; se guarda en `localStorage`.
- **Efecto al hacer scroll**: las tarjetas aparecen al llegar a la pantalla.

## Archivos
- `index.html`: la página y las plantillas (`<template>`) de cada vista
- `css/style.css`: estilos y media queries
- `js/datos.js`: catálogo de productos y categorías
- `js/script.js`: todo el comportamiento con jQuery (comentado paso a paso)

## Cómo verla
Abrir `index.html` en el navegador (necesita internet para jQuery y las imágenes).
