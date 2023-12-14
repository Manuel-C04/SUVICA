let swiper = new Swiper(".mySwiper", {
  slidesPerView: 1.5,
  spaceBetween: 0,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  breakpoints: {
    620: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    680: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    380: {
      slidesPerView: 2,
      spaceBetween: 50,
    },
    1240: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
    1800: {
      slidesPerView: 5.5,
      spaceBetween: 50,
    },
  } 
});


  
  
function abrirCarritoModal() {
  let carritoModal = document.getElementById("carritoModal");
  carritoModal.style.display = "block";
}


function cerrarCarritoModal() {
  let carritoModal = document.getElementById("carritoModal");
  carritoModal.style.display = "none";
}


document.addEventListener("DOMContentLoaded", function () {
  cargarCarritoDesdeLocalStorage();

  const botonesAgregar = document.querySelectorAll(".add-to-cart");
  botonesAgregar.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const card = boton.closest(".card-product");
      const id = card.getAttribute("data-id");
      const imagenSrc = card.querySelector(".card-img").getAttribute("src");
      const nombreProducto = card.querySelector(".card-title").innerText;

      agregarAlCarrito(id, nombreProducto, imagenSrc);
      incrementarContadorIndicador();
    });
  });

  function incrementarContadorIndicador() {
    const indicadorCarrito = document.getElementById("indicadorCarrito");
    indicadorCarrito.style.display = "block";
  }
});


function agregarAlCarrito(id, nombre, imagen) {
  const tablaCarrito = document.getElementById("tablaCarrito").getElementsByTagName('tbody')[0];
  const productosEnCarrito = tablaCarrito.getElementsByClassName("producto-en-carrito");

  let existeEnCarrito = false;
  for (let i = 0; i < productosEnCarrito.length; i++) {
    const productoFila = productosEnCarrito[i];
    const idProductoEnCarrito = productoFila.getAttribute("data-id");

    if (idProductoEnCarrito === id) {
      const cantidadElement = productoFila.querySelector("input[type='number']");
      cantidadElement.value = parseInt(cantidadElement.value, 10) + 1;
      existeEnCarrito = true;
      break;
    }
  }

  if (!existeEnCarrito) {
    const nuevaFila = tablaCarrito.insertRow();
    nuevaFila.classList.add("producto-en-carrito");
    nuevaFila.setAttribute("data-id", id);

    const celdaProducto = nuevaFila.insertCell(0);

    const nombreProductoElement = document.createElement("p");
    nombreProductoElement.innerText = nombre;

    const imagenProducto = document.createElement("img");
    imagenProducto.src = imagen;
    imagenProducto.alt = nombre;
    imagenProducto.style.width = "100px";

    const celdaImagen = nuevaFila.insertCell(1);
    celdaImagen.appendChild(imagenProducto);
    celdaImagen.appendChild(nombreProductoElement);

    const cantidadElement = document.createElement("input");
    cantidadElement.type = "number";
    cantidadElement.value = 1;
    cantidadElement.style.width = "40px";

    const celdaCantidad = nuevaFila.insertCell(2);
    celdaCantidad.appendChild(cantidadElement);

    const celdaEliminar = nuevaFila.insertCell(3);
    const botonEliminar = document.createElement("button");
    botonEliminar.innerText = "X";
    botonEliminar.addEventListener("click", function () {
      const filaAEliminar = botonEliminar.closest(".producto-en-carrito");
      tablaCarrito.removeChild(filaAEliminar);
      actualizarLocalStorage();
    });
    celdaEliminar.appendChild(botonEliminar);
  }

  actualizarLocalStorage();
}

function cargarCarritoDesdeLocalStorage() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.forEach(item => {
    agregarAlCarrito(item.id, item.nombre, item.imagen, item.cantidad);
  });
}

function actualizarLocalStorage() {
  const productosEnCarrito = document.getElementById("tablaCarrito").getElementsByTagName('tbody')[0].getElementsByClassName("producto-en-carrito");
  const carrito = [];

  for (let i = 0; i < productosEnCarrito.length; i++) {
    const productoFila = productosEnCarrito[i];
    const id = productoFila.getAttribute("data-id");
    const nombre = productoFila.querySelector("p").innerText;
    const imagen = productoFila.querySelector("img").src;
    const cantidad = productoFila.querySelector("input[type='number']").value;

    carrito.push({ id, nombre, imagen, cantidad });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));

  const indicadorCarrito = document.getElementById("indicadorCarrito");
  const cantidadProductos = productosEnCarrito.length;

  if (cantidadProductos === 0) {
    indicadorCarrito.style.display = "none";
  }
}

function realizarCompra() {
  const tablaCarrito = document.getElementById("tablaCarrito").getElementsByTagName('tbody')[0];
  const productosEnCarrito = tablaCarrito.getElementsByClassName("producto-en-carrito");

  let mensajePedido = "Pedido:\n";

  for (let i = 0; i < productosEnCarrito.length; i++) {
    const productoFila = productosEnCarrito[i];
    const nombreProducto = productoFila.querySelector("p").innerText;
    const cantidad = productoFila.querySelector("input[type='number']").value;

    mensajePedido += `${nombreProducto}: ${cantidad}\n`;
  }

  const enlaceWhatsApp = `https://wa.me/54351158789853?text=${encodeURIComponent(mensajePedido)}`;
  window.open(enlaceWhatsApp, '_blank');
}