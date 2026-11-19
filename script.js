const productos = [
  {
    id: 1,
    nombre: 'Osito Corazón Clásico 30cm',
    categoria: 'animales',
    precio: 280,
    descripcion: 'Felpa suave color miel con detalle de corazón bordado.',
    imagen: 'peluche1.jpg'
  },
  {
    id: 2,
    nombre: 'Conejito Pastel 35cm',
    categoria: 'animales',
    precio: 310,
    descripcion: 'Orejas largas y relleno hipoalergénico ultrasuave.',
    imagen: 'peluche2.jpg'
  },
  {
    id: 3,
    nombre: 'Oso Gigante BearHue 95cm',
    categoria: 'gigantes',
    precio: 850,
    descripcion: 'Tamaño extra grande con costura reforzada ideal para regalo.',
    imagen: 'peluche3.jpg'
  },
  {
    id: 4,
    nombre: 'Zorrito Naranja 30cm',
    categoria: 'animales',
    precio: 260,
    descripcion: 'Textura aterciopelada con cola esponjosa.',
    imagen: 'peluche4.jpg'
  },
  {
    id: 5,
    nombre: 'Personaje Edición Especial 32cm',
    categoria: 'caricaturas',
    precio: 340,
    descripcion: 'Acabado premium de colección listo para entrega.',
    imagen: 'peluche5.jpg'
  },
  {
    id: 6,
    nombre: 'Elefante Celeste Gigante 80cm',
    categoria: 'gigantes',
    precio: 760,
    descripcion: 'Súper acolchado y suave al tacto.',
    imagen: 'peluche6.jpg'
  }
];

const catalogo = document.getElementById('catalogo');
const filtros = document.querySelectorAll('.filtro');
const listaCarrito = document.getElementById('lista-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const zonaTotal = document.getElementById('zona-total');
const totalPrecio = document.getElementById('total-precio');
const contadorCarrito = document.getElementById('contador-carrito');
const dedicatoriaInput = document.getElementById('dedicatoria');
const notaGenerada = document.getElementById('nota-generada');
const btnCopiar = document.getElementById('btn-copiar');
const btnPedir = document.getElementById('btn-pedir');
const avisoCopiado = document.getElementById('aviso-copiado');
const btnVerCarrito = document.getElementById('btn-ver-carrito');
const panelPedido = document.getElementById('panel-pedido');

let carrito = [];

function renderCatalogo(categoria = 'todos') {
  catalogo.innerHTML = '';
  const filtrados = categoria === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoria);

  filtrados.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'producto-card';
    card.innerHTML = `
      <div class="producto-img">
        <img src="${prod.imagen}" alt="${prod.nombre}">
      </div>
      <div class="producto-body">
        <div>
          <span class="producto-cat">${prod.categoria}</span>
          <h3>${prod.nombre}</h3>
          <p class="producto-desc">${prod.descripcion}</p>
        </div>
        <div class="producto-pie">
          <span class="producto-precio">$${prod.precio.toFixed(2)}</span>
          <button type="button" class="btn-agregar" data-id="${prod.id}">
            <i class="fa-solid fa-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    catalogo.appendChild(card);
  });

  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      agregarAlCarrito(Number(btn.dataset.id));
    });
  });
}

function agregarAlCarrito(id) {
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    const prod = productos.find(p => p.id === id);
    carrito.push({ ...prod, cantidad: 1 });
  }
  avisoCopiado.hidden = true;
  renderCarrito();
}

function cambiarCantidad(id, delta) {
  const index = carrito.findIndex(item => item.id === id);
  if (index === -1) return;

  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  avisoCopiado.hidden = true;
  renderCarrito();
}

function actualizarNota() {
  if (carrito.length === 0) {
    notaGenerada.value = '';
    return;
  }

  let total = 0;
  const lineas = carrito.map(item => {
    const sub = item.precio * item.cantidad;
    total += sub;
    return `• ${item.cantidad}x ${item.nombre} ($${sub.toFixed(2)})`;
  });

  const extra = dedicatoriaInput.value.trim();
  let texto = `Hola BearHue (@bear.hue_), quiero hacer el siguiente pedido:\n\n${lineas.join('\n')}\n\nTotal estimado: $${total.toFixed(2)}`;

  if (extra !== '') {
    texto += `\nNota: ${extra}`;
  }

  notaGenerada.value = texto;
}

function copiarNotaAlPortapapeles() {
  const texto = notaGenerada.value;
  if (!texto) return;

  notaGenerada.select();
  notaGenerada.setSelectionRange(0, 99999);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texto).catch(() => {
      document.execCommand('copy');
    });
  } else {
    document.execCommand('copy');
  }

  avisoCopiado.hidden = false;
}

function renderCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    totalItems += item.cantidad;

    const li = document.createElement('li');
    li.className = 'item-carrito';
    li.innerHTML = `
      <div class="item-info">
        <strong>${item.nombre}</strong>
        <span>$${item.precio.toFixed(2)} c/u — Subtotal: $${subtotal.toFixed(2)}</span>
      </div>
      <div class="controles-cant">
        <button type="button" class="btn-cant menos" data-id="${item.id}">-</button>
        <span class="cant-num">${item.cantidad}</span>
        <button type="button" class="btn-cant mas" data-id="${item.id}">+</button>
      </div>
    `;
    listaCarrito.appendChild(li);
  });

  contadorCarrito.textContent = totalItems;

  if (carrito.length === 0) {
    carritoVacio.hidden = false;
    zonaTotal.hidden = true;
  } else {
    carritoVacio.hidden = true;
    zonaTotal.hidden = false;
    totalPrecio.textContent = '$' + total.toFixed(2);
    actualizarNota();
  }

  document.querySelectorAll('.menos').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(Number(btn.dataset.id), -1));
  });

  document.querySelectorAll('.mas').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(Number(btn.dataset.id), 1));
  });
}

dedicatoriaInput.addEventListener('input', () => {
  avisoCopiado.hidden = true;
  actualizarNota();
});

btnCopiar.addEventListener('click', () => {
  copiarNotaAlPortapapeles();
});

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    renderCatalogo(btn.dataset.cat);
  });
});

btnVerCarrito.addEventListener('click', () => {
  panelPedido.scrollIntoView({ behavior: 'smooth' });
});

btnPedir.addEventListener('click', () => {
  if (carrito.length === 0) return;
  copiarNotaAlPortapapeles();
  window.open('https://ig.me/m/bear.hue_', '_blank', 'noopener,noreferrer');
});

renderCatalogo();
renderCarrito();