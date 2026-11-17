/*
  ===== GUÍA RÁPIDA DE jQUERY (lo que usamos en este archivo) =====

  $("...")          -> busca elementos de la página, igual que en CSS:
                       $("#menu")  busca el elemento con id="menu"
                       $(".tarjeta") busca los elementos con class="tarjeta"
                       $("body")   busca la etiqueta <body>
  .html("...")      -> cambia el contenido HTML de lo que encontró
  .text("...")      -> cambia solo el texto (o lo lee si va vacío)
  .val()            -> lee el valor de un input o select
  .show() / .hide() -> muestra u oculta el elemento
  .addClass("x")    -> le agrega la clase CSS "x"
  .removeClass("x") -> le quita la clase CSS "x"
  .on("evento", f)  -> cuando ocurra el evento (click, change, scroll...) ejecuta la función f
  .data("nombre")   -> lee un atributo HTML que empieza con data- (ej: data-id="5")
  $(this)           -> el elemento exacto que recibió el evento (ej: el botón que se hizo click)
  $(document).ready(f) -> ejecuta f cuando la página terminó de cargar
*/

// ===============================
// 1. CARRITO (se guarda en localStorage)
// ===============================
var carrito = [];

function cargarCarrito() {
  var guardado = localStorage.getItem("happypets_carrito");
  if (guardado) {
    carrito = JSON.parse(guardado);
  }
}

function guardarCarrito() {
  localStorage.setItem("happypets_carrito", JSON.stringify(carrito));
}

function formatoPrecio(numero) {
  return "$" + numero.toLocaleString("es-CO");
}

function buscarProducto(id) {
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id == id) {
      return productos[i];
    }
  }
  return null;
}

function agregarAlCarrito(id, cantidad) {
  var encontrado = false;
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito[i].cantidad += cantidad;
      encontrado = true;
    }
  }
  if (!encontrado) {
    carrito.push({ id: id, cantidad: cantidad });
  }
  guardarCarrito();
  refrescarCarrito();
}

function cambiarCantidad(id, cambio) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito[i].cantidad += cambio;
      if (carrito[i].cantidad < 1) {
        carrito.splice(i, 1);
      }
      break;
    }
  }
  guardarCarrito();
  refrescarCarrito();
}

function eliminarDelCarrito(id) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito.splice(i, 1);
      break;
    }
  }
  guardarCarrito();
  refrescarCarrito();
}

function contarProductos() {
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    total += carrito[i].cantidad;
  }
  return total;
}

function calcularSubtotal() {
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    var p = buscarProducto(carrito[i].id);
    total += p.precio * carrito[i].cantidad;
  }
  return total;
}

// Envío gratis desde $150.000, si no cuesta $10.000
function calcularEnvio(subtotal) {
  if (subtotal == 0 || subtotal >= 150000) {
    return 0;
  }
  return 10000;
}

// ===============================
// 2. PARTES COMUNES (menú, pie de página, carrito lateral)
// ===============================
function pintarMenu() {
  // jQuery: lee el atributo data-pagina del <body> (ej: <body data-pagina="tienda">)
  // Sirve para saber en qué página estamos y marcar el enlace "activo"
  var paginaActual = $("body").data("pagina");
  var html = "";
  html += '<div class="contenedor menu-barra">';
  html += '  <a href="index.html" class="logo"><span class="logo-icono">🐾</span> Happy Pets</a>';
  html += '  <nav id="enlaces" class="enlaces">';
  html += '    <a href="index.html" class="' + (paginaActual == "inicio" ? "activo" : "") + '">Inicio</a>';
  html += '    <a href="tienda.html" class="' + (paginaActual == "tienda" ? "activo" : "") + '">Tienda</a>';
  html += '    <a href="carrito.html" class="' + (paginaActual == "carrito" ? "activo" : "") + '">Carrito</a>';
  html += '  </nav>';
  html += '  <div class="menu-derecha">';
  html += '    <button id="btn-carrito" class="btn-icono">🛒<span id="contador" class="contador">0</span></button>';
  html += '    <button id="btn-menu" class="btn-icono btn-hamburguesa">☰</button>';
  html += '  </div>';
  html += '</div>';
  // jQuery: busca <header id="menu"> y mete dentro todo el HTML que armamos arriba
  $("#menu").html(html);
}

function pintarPie() {
  var html = "";
  html += '<div class="contenedor pie-grid">';
  html += '  <div>';
  html += '    <h3>🐾 Happy Pets</h3>';
  html += '    <p>Tu tienda de confianza para todo lo que tu mascota necesita. Productos de calidad y envíos a domicilio.</p>';
  html += '  </div>';
  html += '  <div>';
  html += '    <h4>Navegación</h4>';
  html += '    <p><a href="tienda.html">Tienda</a></p>';
  html += '    <p><a href="carrito.html">Carrito</a></p>';
  html += '  </div>';
  html += '  <div>';
  html += '    <h4>Contacto</h4>';
  html += '    <p>✉️ happypets2021@outlook.es</p>';
  html += '    <p>📞 +57 324-295-0161</p>';
  html += '    <p>📍 Medellín, Colombia</p>';
  html += '  </div>';
  html += '</div>';
  html += '<div class="pie-final"><p>© 2026 Happy Pets. Todos los derechos reservados.</p></div>';
  // jQuery: mete el HTML dentro de <footer id="pie">
  $("#pie").html(html);
}

function pintarCarritoLateral() {
  var html = "";
  html += '<div id="fondo-oscuro"></div>';
  html += '<aside id="carrito-lateral">';
  html += '  <div class="lateral-titulo"><h2>Tu Carrito</h2><button id="cerrar-carrito" class="btn-icono">✖</button></div>';
  html += '  <div id="lateral-items"></div>';
  html += '  <div id="lateral-pie"></div>';
  html += '</aside>';
  // jQuery: .append() agrega el HTML AL FINAL del <body> sin borrar lo que ya hay
  // (.html() reemplaza todo el contenido, .append() solo agrega)
  $("body").append(html);
}

// ===============================
// 3. DIBUJAR EL CARRITO (lateral y página carrito)
// ===============================
function filaCarrito(item, pagina) {
  var p = buscarProducto(item.id);
  var html = "";
  html += '<div class="fila-carrito">';
  html += '  <img class="fila-imagen" src="' + p.imagen + '" alt="' + p.nombre + '">';
  html += '  <div class="fila-info">';
  html += '    <h3>' + p.nombre + '</h3>';
  html += '    <p class="precio">' + formatoPrecio(p.precio) + '</p>';
  html += '    <div class="cantidad">';
  html += '      <button class="btn-menos" data-id="' + p.id + '">-</button>';
  html += '      <span>' + item.cantidad + '</span>';
  html += '      <button class="btn-mas" data-id="' + p.id + '">+</button>';
  html += '      <button class="btn-eliminar" data-id="' + p.id + '">Eliminar</button>';
  html += '    </div>';
  html += '  </div>';
  if (pagina) {
    html += '  <div class="fila-total">' + formatoPrecio(p.precio * item.cantidad) + '</div>';
  }
  html += '</div>';
  return html;
}

function pintarResumen() {
  var subtotal = calcularSubtotal();
  var envio = calcularEnvio(subtotal);
  var html = "";
  html += '<div class="linea"><span>Subtotal</span><span>' + formatoPrecio(subtotal) + '</span></div>';
  html += '<div class="linea"><span>Envío</span><span>' + (envio == 0 ? "Gratis" : formatoPrecio(envio)) + '</span></div>';
  html += '<div class="linea total"><span>Total</span><span>' + formatoPrecio(subtotal + envio) + '</span></div>';
  return html;
}

function refrescarCarrito() {
  // Contador del menú (el numerito naranja sobre el carrito)
  // jQuery: .text() cambia el texto del elemento con id="contador"
  $("#contador").text(contarProductos());
  if (contarProductos() > 0) {
    $("#contador").show(); // .show() lo hace visible
  } else {
    $("#contador").hide(); // .hide() lo oculta
  }

  // Carrito lateral
  var items = "";
  var pie = "";
  if (carrito.length == 0) {
    items = '<p class="vacio">Tu carrito está vacío</p>';
  } else {
    for (var i = 0; i < carrito.length; i++) {
      items += filaCarrito(carrito[i], false);
    }
    pie += pintarResumen();
    pie += '<a href="carrito.html" class="btn btn-borde">Ver carrito</a>';
  }
  // jQuery: llena el carrito lateral con los productos y el resumen
  $("#lateral-items").html(items);
  $("#lateral-pie").html(pie);

  // Página del carrito (solo si existe en la página)
  // jQuery: .length dice cuántos elementos encontró. Si es 0, ese elemento
  // no existe en la página actual (por ejemplo, estamos en tienda.html)
  if ($("#pagina-carrito").length > 0) {
    pintarPaginaCarrito();
  }
}

function pintarPaginaCarrito() {
  // Si no hay productos mostramos el mensaje "vacío" y ocultamos la lista
  // (.show() y .hide() de jQuery)
  if (carrito.length == 0) {
    $("#carrito-vacio").show();
    $("#carrito-lleno").hide();
    return;
  }
  $("#carrito-vacio").hide();
  $("#carrito-lleno").show();

  var items = "";
  for (var i = 0; i < carrito.length; i++) {
    items += filaCarrito(carrito[i], true);
  }
  $("#lista-carrito").html(items);
  $("#resumen-lineas").html(pintarResumen());
}

function abrirCarrito() {
  // .fadeIn(200): muestra el fondo oscuro con efecto de aparecer (200 milisegundos)
  $("#fondo-oscuro").fadeIn(200);
  // .addClass("abierto"): agrega la clase "abierto". En el CSS, #carrito-lateral.abierto
  // tiene right: 0, por eso el panel se desliza hacia adentro
  $("#carrito-lateral").addClass("abierto");
}

function cerrarCarrito() {
  // .fadeOut(): lo contrario de fadeIn, desaparece suavemente
  $("#fondo-oscuro").fadeOut(200);
  // .removeClass(): quita la clase y el panel vuelve a esconderse
  $("#carrito-lateral").removeClass("abierto");
}

// ===============================
// 4. TARJETA DE PRODUCTO
// ===============================
function tarjetaProducto(p) {
  var html = "";
  html += '<div class="tarjeta reveal">';
  html += '  <a href="producto.html?id=' + p.id + '" class="tarjeta-imagen">';
  html += '    <img src="' + p.imagen + '" alt="' + p.nombre + '">';
  if (p.destacado) {
    html += '    <span class="etiqueta">Destacado</span>';
  }
  if (!p.disponible) {
    html += '    <span class="agotado">Agotado</span>';
  }
  html += '  </a>';
  html += '  <div class="tarjeta-cuerpo">';
  html += '    <h3><a href="producto.html?id=' + p.id + '">' + p.nombre + '</a></h3>';
  html += '    <p class="descripcion">' + p.descripcion + '</p>';
  html += '    <div class="tarjeta-pie">';
  html += '      <span class="precio">' + formatoPrecio(p.precio) + '</span>';
  if (p.disponible) {
    html += '      <button class="btn-agregar" data-id="' + p.id + '">🛒</button>';
  } else {
    html += '      <button class="btn-agregar" disabled>🛒</button>';
  }
  html += '    </div>';
  html += '  </div>';
  html += '</div>';
  return html;
}

// ===============================
// 5. PÁGINA DE INICIO
// ===============================
function paginaInicio() {
  // Categorías
  var cats = "";
  for (var i = 0; i < categorias.length; i++) {
    cats += '<a href="tienda.html?categoria=' + categorias[i].id + '" class="categoria reveal">';
    cats += '<span class="categoria-icono">' + categorias[i].icono + '</span>';
    cats += '<h3>' + categorias[i].nombre + '</h3></a>';
  }
  // jQuery: mete las categorías dentro del <div id="lista-categorias"> de index.html
  $("#lista-categorias").html(cats);

  // Destacados (máximo 4) y más vendidos (máximo 4)
  var dest = "";
  var mas = "";
  var contDest = 0;
  var contMas = 0;
  for (var j = 0; j < productos.length; j++) {
    if (productos[j].destacado && contDest < 4) {
      dest += tarjetaProducto(productos[j]);
      contDest++;
    }
    if (productos[j].masVendido && contMas < 4) {
      mas += tarjetaProducto(productos[j]);
      contMas++;
    }
  }
  $("#lista-destacados").html(dest);
  $("#lista-vendidos").html(mas);
}

// ===============================
// 6. PÁGINA DE TIENDA (filtros con jQuery)
// ===============================
function paginaTienda() {
  // Crear los radios de categorías
  var radios = '<label><input type="radio" name="categoria" value="" checked> Todas</label>';
  for (var i = 0; i < categorias.length; i++) {
    radios += '<label><input type="radio" name="categoria" value="' + categorias[i].id + '"> ' + categorias[i].nombre + '</label>';
  }
  $("#filtro-categorias").html(radios);

  // Si viene ?categoria=snacks en la dirección, se marca ese radio
  var params = new URLSearchParams(window.location.search);
  var categoriaUrl = params.get("categoria");
  if (categoriaUrl) {
    // jQuery: el selector busca un <input> cuyo name sea "categoria" y cuyo value
    // sea el de la URL (igual que los selectores de atributo en CSS).
    // .prop("checked", true) lo deja marcado.
    $('input[name="categoria"][value="' + categoriaUrl + '"]').prop("checked", true);
  }

  pintarTienda();

  // jQuery: .on("change", ...) significa "cuando el usuario CAMBIE este elemento,
  // ejecuta la función pintarTienda". Con la coma se escogen varios elementos a la vez:
  // los radios, el checkbox y el select de ordenar.
  $("#filtro-categorias, #solo-disponibles, #orden").on("change", pintarTienda);
}

function pintarTienda() {
  // jQuery: leemos lo que el usuario escogió en los filtros
  // ":checked" busca el radio que está marcado y .val() nos da su valor
  var categoria = $('input[name="categoria"]:checked').val();
  // .is(":checked") responde true o false: ¿el checkbox está marcado?
  var soloDisponibles = $("#solo-disponibles").is(":checked");
  // .val() en un <select> devuelve la opción elegida
  var orden = $("#orden").val();

  // 1. Filtrar
  var lista = [];
  for (var i = 0; i < productos.length; i++) {
    var p = productos[i];
    if (categoria != "" && p.categoria != categoria) {
      continue;
    }
    if (soloDisponibles && !p.disponible) {
      continue;
    }
    lista.push(p);
  }

  // 2. Ordenar
  lista.sort(function (a, b) {
    if (orden == "precio-menor") {
      return a.precio - b.precio;
    }
    if (orden == "precio-mayor") {
      return b.precio - a.precio;
    }
    return a.nombre.localeCompare(b.nombre);
  });

  // 3. Mostrar el resultado en la página (con jQuery)
  $("#cantidad-resultados").text(lista.length + " producto(s) encontrado(s)");
  if (lista.length == 0) {
    $("#lista-productos").html("");
    $("#sin-resultados").show();
    return;
  }
  $("#sin-resultados").hide();
  var html = "";
  for (var j = 0; j < lista.length; j++) {
    html += tarjetaProducto(lista[j]);
  }
  $("#lista-productos").html(html);
  mostrarElementos();
}

// ===============================
// 7. PÁGINA DE PRODUCTO
// ===============================
function paginaProducto() {
  var params = new URLSearchParams(window.location.search);
  var p = buscarProducto(params.get("id"));

  if (p == null) {
    $("#detalle").html('<p class="vacio">Producto no encontrado</p>');
    return;
  }

  document.title = p.nombre + " - Happy Pets";
  var html = "";
  html += '<div class="detalle-imagen"><img src="' + p.imagen + '" alt="' + p.nombre + '"></div>';
  html += '<div class="detalle-info">';
  html += '  <h1>' + p.nombre + '</h1>';
  html += '  <p class="detalle-precio">' + formatoPrecio(p.precio) + ' ';
  if (p.disponible) {
    html += '<span class="estado ok">Disponible</span>';
  } else {
    html += '<span class="estado no">Agotado</span>';
  }
  html += '  </p>';
  html += '  <p class="detalle-texto">' + p.descripcion + '</p>';
  if (p.disponible) {
    html += '  <div class="detalle-compra">';
    html += '    <div class="cantidad">';
    html += '      <button id="menos">-</button><span id="cantidad">1</span><button id="mas">+</button>';
    html += '    </div>';
    html += '    <button id="agregar-detalle" class="btn btn-naranja" data-id="' + p.id + '">Agregar al carrito</button>';
    html += '  </div>';
  }
  html += '  <ul class="ventajas">';
  html += '    <li>✔ Envío a domicilio en Medellín</li>';
  html += '    <li>✔ Envío gratis en compras desde $150.000</li>';
  html += '    <li>✔ Pago seguro</li>';
  html += '  </ul>';
  html += '</div>';
  $("#detalle").html(html);
}

// ===============================
// 8. EFECTO AL HACER SCROLL
// ===============================
// Las tarjetas empiezan invisibles (clase "reveal" en el CSS, opacity: 0).
// Cuando el usuario baja y llegan a la pantalla, les agregamos la clase "visible"
// y el CSS hace la animación de aparecer.
function mostrarElementos() {
  // $(window).scrollTop() = cuántos píxeles ha bajado el usuario
  // $(window).height()    = alto de la pantalla
  // La suma es el punto hasta donde el usuario puede ver
  var parteVisible = $(window).scrollTop() + $(window).height() - 60;

  // .each() recorre uno por uno todos los elementos con clase "reveal"
  $(".reveal").each(function () {
    // $(this) es el elemento actual del recorrido
    // .offset().top = a cuántos píxeles del inicio de la página está ese elemento
    if ($(this).offset().top < parteVisible) {
      $(this).addClass("visible");
    }
  });
}

// ===============================
// 9. INICIO: se ejecuta cuando la página termina de cargar
// ===============================
// $(document).ready(...) espera a que todo el HTML esté cargado antes de ejecutar el código.
// Si no lo usamos, JavaScript podría buscar elementos que todavía no existen.
$(document).ready(function () {
  cargarCarrito();
  pintarMenu();
  pintarPie();
  pintarCarritoLateral();
  refrescarCarrito();

  // Según la página, se ejecuta su función
  var pagina = $("body").data("pagina");
  if (pagina == "inicio") {
    paginaInicio();
  } else if (pagina == "tienda") {
    paginaTienda();
  } else if (pagina == "producto") {
    paginaProducto();
  } else if (pagina == "carrito") {
    pintarPaginaCarrito();
  }

  // ----- Eventos -----
  // Abrir y cerrar carrito lateral
  // .on("click", funcion): cuando hagan click en el botón, se ejecuta la función
  $("#btn-carrito").on("click", abrirCarrito);
  $("#cerrar-carrito, #fondo-oscuro").on("click", cerrarCarrito);

  // Menú en celular
  // .slideToggle(): si el menú está oculto lo despliega hacia abajo, y si está visible lo esconde
  $("#btn-menu").on("click", function () {
    $("#enlaces").slideToggle(200);
  });

  // IMPORTANTE: los botones de producto los creamos con JavaScript después de cargar la página,
  // así que $(".btn-agregar").on(...) NO funcionaría (todavía no existen).
  // Con $(document).on("click", ".btn-agregar", ...) jQuery escucha los clicks en toda la página
  // y revisa si lo que se tocó es un ".btn-agregar". Así sirve para botones creados después.
  $(document).on("click", ".btn-agregar", function () {
    // $(this) es el botón que se tocó.
    // .data("id") lee su atributo data-id="5" (así sabemos qué producto es)
    agregarAlCarrito($(this).data("id"), 1);
    abrirCarrito();
  });
  $(document).on("click", ".btn-mas", function () {
    cambiarCantidad($(this).data("id"), 1);
  });
  $(document).on("click", ".btn-menos", function () {
    cambiarCantidad($(this).data("id"), -1);
  });
  $(document).on("click", ".btn-eliminar", function () {
    eliminarDelCarrito($(this).data("id"));
  });

  // Página de producto: cantidad y botón agregar
  // Aquí también usamos $(document).on porque estos botones se crean con JS.
  // $("#cantidad").text() lee el número que se ve en pantalla (viene como texto),
  // Number(...) lo convierte a número y le sumamos 1; luego .text(...) lo vuelve a escribir.
  $(document).on("click", "#mas", function () {
    $("#cantidad").text(Number($("#cantidad").text()) + 1);
  });
  $(document).on("click", "#menos", function () {
    var c = Number($("#cantidad").text());
    if (c > 1) {
      $("#cantidad").text(c - 1);
    }
  });
  $(document).on("click", "#agregar-detalle", function () {
    agregarAlCarrito($(this).data("id"), Number($("#cantidad").text()));
    abrirCarrito();
  });

  // Finalizar compra (simulado, no hay pasarela de pago)
  $("#finalizar").on("click", function () {
    alert("¡Gracias por tu compra! (simulación)");
    carrito = [];
    guardarCarrito();
    refrescarCarrito();
  });

  // Si se agranda la ventana, el menú vuelve a su estado normal
  // "resize" ocurre cuando cambia el tamaño de la ventana.
  // .removeAttr("style") borra el estilo que puso slideToggle para que el CSS mande otra vez.
  $(window).on("resize", function () {
    if ($(window).width() > 768) {
      $("#enlaces").removeAttr("style");
    }
  });

  // Efecto de aparición al hacer scroll
  // "scroll" ocurre cada vez que el usuario sube o baja la página.
  // Se llama también una vez al inicio para mostrar lo que ya se ve sin hacer scroll.
  $(window).on("scroll", mostrarElementos);
  mostrarElementos();
});
