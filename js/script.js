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

function buscarCategoria(id) {
  for (var i = 0; i < categorias.length; i++) {
    if (categorias[i].id == id) {
      return categorias[i];
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
// 2. PARTES FIJAS (menú, pie, carrito lateral y ventana de vista rápida)
// Se pintan UNA sola vez al cargar; después solo cambia la zona central.
// ===============================
function pintarMenu() {
  var html = "";
  html += '<div class="contenedor menu-barra">';
  html += '  <a href="#/inicio" class="logo"><img src="img/logo.jpg" alt="Logo Happy Pets" class="logo-imagen"> Happy Pets</a>';
  html += '  <nav id="enlaces" class="enlaces">';
  // data-vista: con esto sabemos qué enlace marcar como "activo" (ver marcarMenu)
  html += '    <a href="#/inicio" data-vista="inicio">Inicio</a>';
  html += '    <a href="#/tienda" data-vista="tienda">Tienda</a>';
  html += '    <a href="#/carrito" data-vista="carrito">Carrito</a>';
  html += '    <a href="#/contacto" data-vista="contacto">Contacto</a>';
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
  html += '    <p><a href="#/tienda">Tienda</a></p>';
  html += '    <p><a href="#/carrito">Carrito</a></p>';
  html += '    <p><a href="#/contacto">Contacto</a></p>';
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

function pintarModal() {
  // La ventana de "vista rápida". #modal es el fondo oscuro que cubre todo,
  // y .modal-caja es el recuadro blanco del centro.
  var html = "";
  html += '<div id="modal">';
  html += '  <div class="modal-caja">';
  html += '    <button id="cerrar-modal" class="btn-icono">✖</button>';
  html += '    <div id="modal-contenido"></div>';
  html += '  </div>';
  html += '</div>';
  $("body").append(html);
}

function marcarMenu(vista) {
  // Primero le quitamos "activo" a todos los enlaces y luego se lo ponemos
  // solo al que tiene data-vista igual a la vista actual.
  $("#enlaces a").removeClass("activo");
  $('#enlaces a[data-vista="' + vista + '"]').addClass("activo");
}

// ===============================
// 3. DIBUJAR EL CARRITO (lateral y vista carrito)
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
    pie += '<a href="#/carrito" class="btn btn-borde">Ver carrito</a>';
  }
  // jQuery: llena el carrito lateral con los productos y el resumen
  $("#lateral-items").html(items);
  $("#lateral-pie").html(pie);

  // Vista del carrito (solo si es la que se está mostrando)
  // jQuery: .length dice cuántos elementos encontró. Si es 0, ese elemento
  // no está en pantalla ahora mismo (por ejemplo, estamos en la tienda)
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
  // La imagen y el título tienen la clase "abrir-rapido": al tocarlos se abre la
  // vista rápida (ver eventos). El href queda por si alguien abre en otra pestaña.
  html += '  <a href="#/producto/' + p.id + '" class="tarjeta-imagen abrir-rapido" data-id="' + p.id + '">';
  html += '    <img src="' + p.imagen + '" alt="' + p.nombre + '">';
  html += '    <span class="ver-rapido">👁 Vista rápida</span>';
  if (p.destacado) {
    html += '    <span class="etiqueta">Destacado</span>';
  }
  if (!p.disponible) {
    html += '    <span class="agotado">Agotado</span>';
  }
  html += '  </a>';
  html += '  <div class="tarjeta-cuerpo">';
  html += '    <h3><a href="#/producto/' + p.id + '" class="abrir-rapido" data-id="' + p.id + '">' + p.nombre + '</a></h3>';
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

// Bloque de compra (cantidad + botón agregar). Se usa en la vista rápida y en
// la vista de producto. Usa CLASES y no ids porque puede haber dos a la vez en
// pantalla (el detalle del producto y, encima, la vista rápida de otro).
function bloqueCompra(p) {
  if (!p.disponible) {
    return "";
  }
  var html = "";
  html += '<div class="detalle-compra">';
  html += '  <div class="cantidad">';
  html += '    <button class="cant-menos">-</button><span class="cant-numero">1</span><button class="cant-mas">+</button>';
  html += '  </div>';
  html += '  <button class="btn btn-naranja btn-agregar-detalle" data-id="' + p.id + '">Agregar al carrito</button>';
  html += '</div>';
  return html;
}

function etiquetaEstado(p) {
  if (p.disponible) {
    return '<span class="estado ok">Disponible</span>';
  }
  return '<span class="estado no">Agotado</span>';
}

// ===============================
// 5. VISTA RÁPIDA (ventana que se abre encima, sin salir de donde estás)
// ===============================
function abrirVistaRapida(id) {
  var p = buscarProducto(id);
  if (p == null) {
    return;
  }
  var cat = buscarCategoria(p.categoria);

  var html = "";
  html += '<div class="modal-grid">';
  html += '  <div class="modal-imagen"><img src="' + p.imagen + '" alt="' + p.nombre + '"></div>';
  html += '  <div class="modal-info">';
  if (cat) {
    html += '    <span class="modal-categoria">' + cat.icono + ' ' + cat.nombre + '</span>';
  }
  html += '    <h2>' + p.nombre + '</h2>';
  html += '    <p class="detalle-precio">' + formatoPrecio(p.precio) + ' ' + etiquetaEstado(p) + '</p>';
  html += '    <p class="detalle-texto">' + p.descripcion + '</p>';
  html += bloqueCompra(p);
  html += '    <a href="#/producto/' + p.id + '" class="ver-detalle">Ver detalle completo →</a>';
  html += '  </div>';
  html += '</div>';
  $("#modal-contenido").html(html);

  // 1) .fadeIn() aparece el fondo oscuro.
  // 2) Un instante después le ponemos la clase "abierto": en el CSS eso hace que
  //    el recuadro suba y crezca un poco (transition). Si se pusiera la clase en el
  //    mismo momento, el navegador no alcanzaría a animarlo.
  $("#modal").fadeIn(200);
  setTimeout(function () {
    $("#modal").addClass("abierto");
  }, 10);
  // Mientras la ventana está abierta, la página de atrás no hace scroll
  $("body").addClass("sin-scroll");
}

function cerrarVistaRapida() {
  // jQuery deja encadenar métodos: primero quita la clase (el recuadro baja)
  // y sobre el mismo elemento hace el fadeOut (el fondo desaparece).
  $("#modal").removeClass("abierto").fadeOut(200);
  $("body").removeClass("sin-scroll");
}

// ===============================
// 6. VISTA: INICIO (las categorías filtran los productos aquí mismo)
// ===============================
function vistaInicio() {
  // jQuery: copia el contenido de la plantilla <template id="plantilla-inicio">
  // dentro de la zona central
  $("#vista").html($("#plantilla-inicio").html());

  // Categorías: ahora son botones (no enlaces) que filtran la grilla de abajo
  var cats = "";
  for (var i = 0; i < categorias.length; i++) {
    cats += '<button class="categoria reveal" data-categoria="' + categorias[i].id + '">';
    cats += '<span class="categoria-icono">' + categorias[i].icono + '</span>';
    cats += '<h3>' + categorias[i].nombre + '</h3></button>';
  }
  $("#lista-categorias").html(cats);

  // Más vendidos (máximo 4)
  var mas = "";
  var contMas = 0;
  for (var j = 0; j < productos.length; j++) {
    if (productos[j].masVendido && contMas < 4) {
      mas += tarjetaProducto(productos[j]);
      contMas++;
    }
  }
  $("#lista-vendidos").html(mas);

  // Al entrar se ven los destacados (categoría vacía = destacados)
  pintarProductosInicio("", false);
}

// Pinta la grilla de productos del inicio.
// categoria = "" muestra los destacados; si no, los de esa categoría.
// animar = true hace el efecto de desvanecer y volver a aparecer.
function pintarProductosInicio(categoria, animar) {
  var lista = [];
  for (var i = 0; i < productos.length; i++) {
    var p = productos[i];
    if (categoria == "" && p.destacado) {
      lista.push(p);
    } else if (categoria != "" && p.categoria == categoria) {
      lista.push(p);
    }
  }
  // Máximo 8 en el inicio; el resto está en la tienda
  lista = lista.slice(0, 8);

  var html = "";
  for (var j = 0; j < lista.length; j++) {
    html += tarjetaProducto(lista[j]);
  }

  // Títulos y enlace "ver todos" según la categoría
  var cat = buscarCategoria(categoria);
  var titulo = cat ? cat.icono + " " + cat.nombre : "Productos destacados";
  var subtitulo = cat ? "Lo que tenemos en " + cat.nombre.toLowerCase() : "Lo mejor para tu mascota";
  var enlace = cat ? "#/tienda/" + cat.id : "#/tienda";

  // Marcar la categoría elegida (la clase "activa" la pinta de azul)
  $(".categoria").removeClass("activa");
  if (categoria != "") {
    $('.categoria[data-categoria="' + categoria + '"]').addClass("activa");
  }

  function cambiar() {
    $("#titulo-productos").text(titulo);
    $("#subtitulo-productos").text(subtitulo);
    // .attr("href", ...) cambia un atributo HTML del elemento
    $("#ver-categoria").attr("href", enlace);
    $("#lista-inicio").html(html);
    // Las tarjetas nuevas traen la clase "reveal" (invisibles hasta hacer scroll).
    // Como el usuario ya está mirando esta parte, las mostramos de una vez.
    // El espacio en el selector significa "los .reveal que están DENTRO de #lista-inicio".
    $("#lista-inicio .reveal").addClass("visible");
  }

  if (!animar) {
    cambiar();
    return;
  }
  // .fadeOut(150, funcion): desaparece en 150 ms y CUANDO TERMINA ejecuta la función.
  // Ahí cambiamos el contenido y lo hacemos aparecer con .fadeIn().
  $("#lista-inicio").stop(true, true).fadeOut(150, function () {
    cambiar();
    $("#lista-inicio").fadeIn(250);
  });
}

// ===============================
// 7. VISTA: TIENDA (filtros con jQuery)
// ===============================
function vistaTienda(categoriaUrl) {
  $("#vista").html($("#plantilla-tienda").html());

  // Crear los radios de categorías
  var radios = '<label><input type="radio" name="categoria" value="" checked> Todas</label>';
  for (var i = 0; i < categorias.length; i++) {
    radios += '<label><input type="radio" name="categoria" value="' + categorias[i].id + '"> ' + categorias[i].nombre + '</label>';
  }
  $("#filtro-categorias").html(radios);

  // Si la ruta es #/tienda/snacks, se marca ese radio
  if (categoriaUrl) {
    // jQuery: el selector busca un <input> cuyo name sea "categoria" y cuyo value
    // sea el de la ruta (igual que los selectores de atributo en CSS).
    // .prop("checked", true) lo deja marcado.
    $('input[name="categoria"][value="' + categoriaUrl + '"]').prop("checked", true);
  }

  pintarTienda(false);

  // jQuery: .on("change", ...) significa "cuando el usuario CAMBIE este elemento,
  // ejecuta la función". Con la coma se escogen varios elementos a la vez:
  // los radios, el checkbox y el select de ordenar.
  // (Estos elementos se crean de nuevo cada vez que se entra a la tienda,
  // por eso el evento se engancha aquí y no al cargar la página.)
  $("#filtro-categorias, #solo-disponibles, #orden").on("change", function () {
    pintarTienda(true);
  });
}

function pintarTienda(animar) {
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
  function cambiar() {
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
    $("#lista-productos .reveal").addClass("visible");
  }

  if (!animar) {
    cambiar();
    return;
  }
  // Mismo truco que en el inicio: desaparecer, cambiar y volver a aparecer
  $("#lista-productos").stop(true, true).fadeOut(150, function () {
    cambiar();
    $("#lista-productos").fadeIn(250);
  });
}

// ===============================
// 8. VISTA: PRODUCTO
// ===============================
function vistaProducto(id) {
  var p = buscarProducto(id);

  if (p == null) {
    $("#vista").html('<div class="contenedor"><p class="vacio">Producto no encontrado. <a href="#/tienda">Ir a la tienda</a></p></div>');
    return;
  }

  document.title = p.nombre + " - Happy Pets";
  var html = "";
  html += '<div class="contenedor">';
  // history.back() es como tocar el botón "atrás" del navegador
  html += '  <button class="volver" onclick="history.back()">← Volver</button>';
  html += '  <div class="detalle-grid">';
  html += '    <div class="detalle-imagen"><img src="' + p.imagen + '" alt="' + p.nombre + '"></div>';
  html += '    <div class="detalle-info">';
  html += '      <h1>' + p.nombre + '</h1>';
  html += '      <p class="detalle-precio">' + formatoPrecio(p.precio) + ' ' + etiquetaEstado(p) + '</p>';
  html += '      <p class="detalle-texto">' + p.descripcion + '</p>';
  html += bloqueCompra(p);
  html += '      <ul class="ventajas">';
  html += '        <li>✔ Envío a domicilio en Medellín</li>';
  html += '        <li>✔ Envío gratis en compras desde $150.000</li>';
  html += '        <li>✔ Pago seguro</li>';
  html += '      </ul>';
  html += '    </div>';
  html += '  </div>';

  // Productos relacionados: otros de la misma categoría (máximo 4)
  var relacionados = "";
  var cont = 0;
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].categoria == p.categoria && productos[i].id != p.id && cont < 4) {
      relacionados += tarjetaProducto(productos[i]);
      cont++;
    }
  }
  if (relacionados != "") {
    html += '  <div class="relacionados">';
    html += '    <h2>También te puede gustar</h2>';
    html += '    <div class="grid-productos">' + relacionados + '</div>';
    html += '  </div>';
  }
  html += '</div>';
  $("#vista").html(html);
}

// ===============================
// 9. VISTA: CARRITO
// ===============================
function vistaCarrito() {
  $("#vista").html($("#plantilla-carrito").html());
  pintarPaginaCarrito();
}

// ===============================
// 9.1 VISTA: CONTACTO
// ===============================
function vistaContacto() {
  $("#vista").html($("#plantilla-contacto").html());
}

// Revisa un campo del formulario. Si "valido" es false, lo marca en rojo y
// escribe el error en el <span class="error-texto"> que va justo después del campo.
// .next() devuelve el elemento que está inmediatamente después (el hermano siguiente).
function marcarCampo(campo, valido, mensaje) {
  campo.toggleClass("campo-error", !valido);
  campo.next(".error-texto").text(valido ? "" : mensaje);
  return valido;
}

function enviarContacto() {
  var nombre = $("#contacto-nombre");
  var correo = $("#contacto-correo");
  var mensaje = $("#contacto-mensaje");

  // Patrón algo@algo.algo: revisa que el correo tenga esa forma (no que exista)
  var formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Se revisan los tres por separado para marcar TODOS los errores a la vez.
  // $.trim() quita los espacios del principio y del final, para que "   " no cuente como texto.
  var okNombre = marcarCampo(nombre, $.trim(nombre.val()) != "", "Escribe tu nombre");
  var okCorreo = marcarCampo(correo, formatoCorreo.test($.trim(correo.val())), "Escribe un correo válido");
  var okMensaje = marcarCampo(mensaje, $.trim(mensaje.val()).length >= 10, "El mensaje debe tener al menos 10 letras");

  if (!okNombre || !okCorreo || !okMensaje) {
    return;
  }

  // Simulación: no se envía a ningún lado. Cambiamos el formulario por un mensaje.
  var primerNombre = $.trim(nombre.val()).split(" ")[0];
  var html = "";
  html += '<div class="gracias">';
  html += '  <span>📨</span>';
  html += '  <h2>¡Gracias, ' + primerNombre + '!</h2>';
  html += '  <p>Recibimos tu mensaje (simulación: no se envió a ningún lado).</p>';
  html += '  <a href="#/tienda" class="btn btn-azul">Ir a la tienda</a>';
  html += '</div>';
  $("#form-contacto").hide().html(html).fadeIn(400);
}

// ===============================
// 10. NAVEGACIÓN SIN RECARGAR (el "enrutador")
// ===============================
// Todo el sitio es UNA sola página: el menú y el pie no cambian, solo <main id="vista">.
// La vista que toca va en la dirección después del # (ej: index.html#/tienda).
// Cambiar lo que va después del # NO recarga la página; el navegador solo avisa con
// el evento "hashchange" (ver el final del archivo) y ahí pintamos la vista.
// Rutas: #/inicio, #/tienda, #/tienda/snacks, #/producto/5, #/carrito, #/contacto
// Lee lo que va después del # y lo separa en partes.
// "#/producto/5" -> { vista: "producto", dato: "5" }
function leerRuta() {
  var texto = window.location.hash.replace("#/", "").replace("#", "");
  var partes = texto.split("/");
  return { vista: partes[0] || "inicio", dato: partes[1] };
}

// Se ejecuta al cargar la página y cada vez que cambia el # de la dirección.
function navegar() {
  var ruta = leerRuta();

  // Si había algo abierto encima, lo cerramos
  cerrarVistaRapida();
  cerrarCarrito();
  // En celular, el menú desplegable se cierra al elegir una opción
  // (.slideUp lo recoge hacia arriba; es lo contrario de .slideDown)
  if ($(window).width() <= 768) {
    $("#enlaces").slideUp(150);
  }

  // Si la ruta no existe, mostramos el inicio
  var vistas = ["inicio", "tienda", "producto", "carrito", "contacto"];
  // $.inArray(valor, lista) devuelve la posición del valor en la lista, o -1 si no está
  if ($.inArray(ruta.vista, vistas) == -1) {
    ruta.vista = "inicio";
  }

  marcarMenu(ruta.vista);
  document.title = "Happy Pets - Todo para tu mejor amigo";

  // EFECTO: la zona central desaparece, se cambia su contenido y vuelve a aparecer.
  // .stop(true, true) cancela una animación anterior si el usuario navega muy rápido.
  $("#vista").stop(true, true).fadeOut(150, function () {
    if (ruta.vista == "inicio") {
      vistaInicio();
    } else if (ruta.vista == "tienda") {
      vistaTienda(ruta.dato);
    } else if (ruta.vista == "producto") {
      vistaProducto(ruta.dato);
    } else if (ruta.vista == "carrito") {
      vistaCarrito();
    } else if (ruta.vista == "contacto") {
      vistaContacto();
    }

    // El fondo de las páginas internas es gris clarito; el del inicio es blanco
    $("body").toggleClass("fondo-interno", ruta.vista != "inicio");

    // Volver arriba de la página (sin animación, para que no se vea el salto)
    $(window).scrollTop(0);
    $("#vista").fadeIn(250);
    mostrarElementos();
  });
}

// ===============================
// 11. EFECTO AL HACER SCROLL
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
// 12. INICIO: se ejecuta cuando la página termina de cargar
// ===============================
// $(document).ready(...) espera a que todo el HTML esté cargado antes de ejecutar el código.
// Si no lo usamos, JavaScript podría buscar elementos que todavía no existen.
$(document).ready(function () {
  cargarCarrito();
  pintarMenu();
  pintarPie();
  pintarCarritoLateral();
  pintarModal();
  refrescarCarrito();

  // Pintamos la vista que diga la dirección (si no hay #, el inicio)
  navegar();

  // "hashchange" ocurre cada vez que cambia lo que va después del # en la dirección:
  // al tocar un enlace href="#/tienda", o al usar los botones atrás/adelante del navegador.
  $(window).on("hashchange", navegar);

  // ----- Eventos -----
  // IMPORTANTE: casi todo lo de la zona central se crea con JavaScript DESPUÉS de cargar
  // la página (y se vuelve a crear en cada navegación), así que $(".btn-agregar").on(...)
  // NO funcionaría. Con $(document).on("click", ".btn-agregar", ...) jQuery escucha los
  // clicks en toda la página y revisa si lo que se tocó es un ".btn-agregar".
  // Así sirve para elementos creados después.

  // Si tocan un enlace a la vista donde ya están (ej: "Ver carrito" estando en el carrito),
  // el # no cambia y "hashchange" no ocurre. En ese caso solo cerramos lo que esté abierto.
  $(document).on("click", 'a[href^="#/"]:not(.abrir-rapido)', function () {
    if ($(this).attr("href") == window.location.hash) {
      cerrarCarrito();
      cerrarVistaRapida();
    }
  });

  // Abrir y cerrar carrito lateral
  $("#btn-carrito").on("click", abrirCarrito);
  $("#cerrar-carrito, #fondo-oscuro").on("click", cerrarCarrito);

  // Menú en celular
  // .slideToggle(): si el menú está oculto lo despliega hacia abajo, y si está visible lo esconde
  $("#btn-menu").on("click", function () {
    $("#enlaces").slideToggle(200);
  });

  // Vista rápida: al tocar la imagen o el nombre de un producto
  $(document).on("click", ".abrir-rapido", function (evento) {
    // .preventDefault() evita que el enlace haga lo normal (ir a #/producto/5).
    // En vez de eso, abrimos la ventana encima sin salir de donde estamos.
    evento.preventDefault();
    abrirVistaRapida($(this).data("id"));
  });

  // Cerrar la vista rápida: con la X, tocando el fondo oscuro o con la tecla Esc
  $(document).on("click", "#cerrar-modal", cerrarVistaRapida);
  $(document).on("click", "#modal", function (evento) {
    // evento.target es lo que se tocó exactamente. Si es el fondo (#modal) y no
    // algo dentro del recuadro blanco, cerramos.
    if (evento.target == this) {
      cerrarVistaRapida();
    }
  });
  $(document).on("keydown", function (evento) {
    if (evento.key == "Escape") {
      cerrarVistaRapida();
      cerrarCarrito();
    }
  });

  // Inicio: las categorías filtran la grilla de productos ahí mismo
  $(document).on("click", ".categoria", function () {
    var categoria = $(this).data("categoria");
    // Si toca la que ya estaba elegida, se vuelve a los destacados.
    // .hasClass("activa") responde true si el botón tiene esa clase.
    if ($(this).hasClass("activa")) {
      categoria = "";
    }
    pintarProductosInicio(categoria, true);

    // .animate({ scrollTop: ... }) mueve la página suavemente hasta los productos.
    // Se restan 80 px por el menú, que está pegado arriba.
    // Se anima "html, body" (los dos) porque según el navegador el scroll lo lleva uno u otro.
    $("html, body").animate({ scrollTop: $("#seccion-productos").offset().top - 80 }, 500);
  });

  // Botones con data-bajar="#algo": bajan con scroll animado hasta ese elemento
  $(document).on("click", "[data-bajar]", function () {
    var destino = $(this).data("bajar");
    $("html, body").animate({ scrollTop: $(destino).offset().top - 80 }, 600);
  });

  // Tarjetas: botón 🛒 agrega 1 unidad
  $(document).on("click", ".btn-agregar", function () {
    // $(this) es el botón que se tocó.
    // .data("id") lee su atributo data-id="5" (así sabemos qué producto es)
    agregarAlCarrito($(this).data("id"), 1);
    abrirCarrito();
  });

  // Carrito: más, menos y eliminar
  $(document).on("click", ".btn-mas", function () {
    cambiarCantidad($(this).data("id"), 1);
  });
  $(document).on("click", ".btn-menos", function () {
    cambiarCantidad($(this).data("id"), -1);
  });
  $(document).on("click", ".btn-eliminar", function () {
    eliminarDelCarrito($(this).data("id"));
  });

  // Bloque de compra (vista rápida y detalle): cantidad y botón agregar.
  // Como puede haber dos bloques a la vez, cada botón busca SU propio número:
  // .closest(".detalle-compra") sube hasta el bloque donde está el botón y
  // .find(".cant-numero") busca el número dentro de ESE bloque.
  $(document).on("click", ".cant-mas", function () {
    var numero = $(this).closest(".detalle-compra").find(".cant-numero");
    numero.text(Number(numero.text()) + 1);
  });
  $(document).on("click", ".cant-menos", function () {
    var numero = $(this).closest(".detalle-compra").find(".cant-numero");
    var c = Number(numero.text());
    if (c > 1) {
      numero.text(c - 1);
    }
  });
  $(document).on("click", ".btn-agregar-detalle", function () {
    var cantidad = Number($(this).closest(".detalle-compra").find(".cant-numero").text());
    agregarAlCarrito($(this).data("id"), cantidad);
    cerrarVistaRapida();
    abrirCarrito();
  });

  // Formulario de contacto
  // "submit" ocurre al tocar "Enviar" o al dar Enter. evento.preventDefault() evita
  // que el navegador recargue la página (que es lo que hace un formulario por defecto).
  $(document).on("submit", "#form-contacto", function (evento) {
    evento.preventDefault();
    enviarContacto();
  });
  // Apenas el usuario escribe en un campo marcado en rojo, se le quita el error
  // ("input" ocurre con cada letra que se escribe o borra)
  $(document).on("input", ".formulario input, .formulario textarea", function () {
    marcarCampo($(this), true, "");
  });

  // Finalizar compra (simulado, no hay pasarela de pago)
  $(document).on("click", "#finalizar", function () {
    carrito = [];
    guardarCarrito();
    refrescarCarrito();
    // En vez de un alert, cambiamos el contenido de la vista por un mensaje
    var html = "";
    html += '<div class="gracias">';
    html += '  <span>🎉</span>';
    html += '  <h2>¡Gracias por tu compra!</h2>';
    html += '  <p>Esto es una simulación: no se hizo ningún cobro.</p>';
    html += '  <a href="#/inicio" class="btn btn-azul">Volver al inicio</a>';
    html += '</div>';
    // Encadenado: se oculta, se le cambia el contenido mientras está oculto,
    // y aparece ya con el mensaje nuevo (así no se ve el cambio de golpe).
    $("#pagina-carrito").hide().html(html).fadeIn(400);
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
  $(window).on("scroll", mostrarElementos);
});
