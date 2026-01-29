let carrito = [], total = 0;
const SALSAS_GRATIS = 2, RECARGO_SALSA = 1500;
const DOMICILIO = 6000;

// Lista de salsas
const salsas = [
  "BBQ NORMAL","BBQ HOT","BB BRAVA","MIEL MOSTAZA",
  "MARACUSTAZA","MEXIBOOM","TROPIMOST","GUSTOZA","AJO"
];

// Productos por sección
const similares = {
  alitas:[
      {nombre:"combo1: 4 piezas+papa", precio:12000},
    {nombre:"combo2: 6 piezas+papa", precio:16000},
    {nombre:"combo3: 10piezas+papa", precio:25000},
    {nombre:"combo4: 14 piezas+papa", precio:34000},
    {nombre:"combo amigos: 20 piezas+papa", precio:48000},
    {nombre:"combo familiar: 30 piezas+papa", precio:72000},
  ],
  costillas:[
    {nombre:"Combo1: 250gr+papa",precio:17000},
    {nombre:"Combo2: 500gr+papa",precio:26000},
    {nombre:"Combo Amigo: 1000gr+papa",precio:40000},
    {nombre:"Combo Familiar: 1250gr+papa",precio:66000},
  ],
  costialitas:[
    {nombre:"Combo1: 4 piezas+150gr costilla",precio:22000},
    {nombre:"Combo2: 6 piezas+250gr Costilla",precio:30000},
    {nombre:"Combo3: 14 piezas+300gr costilla",precio:55000},
    {nombre:"Combo4: 20 piezas+500gr costilla",precio:80000},
  ],
  chuleta:[
    {nombre:"Combo 1 personal: papas+arroz",precio:15000},
    {nombre:"Combo 2 dos personas: + papa+arroz",precio:26000},
    {nombre:"Combo 3 para cuatro personas: + costilla+papa+arroz",precio:55000},
    {nombre:"Combo 4 para ocho personas: + costilla+papa+arroz",precio:95000},
  ],
  salchipapas:[
    {nombre:"SALCHIPAPA SENCILLA: papa parda,papa amarilla,salchicha,ripio,salsas",precio:7000},
    {nombre:"SALCHIPAPA SENCILLA CON QUESO: papa parda,papa amarilla,salchicha,ripio,salsa,queso",precio:9000},
    {nombre:"SALCHIPAPA MAICITOS Y POLLO: papa parda,papa amarilla,salchicha,ripio,salsas,queso,maicitos,pollo",precio:12000},
    {nombre:"SALCHIPAPA CARNE: papa parda,papa amarilla,salchicha,ripio,salsas,queso,carne",precio:12000},
    {nombre:"SALCHIPAPA COSTILLA: papa parda,papa amarilla,salchicha,ripio,salsas,queso,costilla",precio:12000},
    {nombre:"SALCHIPAPA ESPECIAL: papa parda,papa amarilla,salchicha,ripio,salsas,queso,pollo,carne,maicitos,tocineta",precio:15000},
    {nombre:"SALCHIPAPA PARA DOS: papa parda,papa amarilla,salchicha,ripio,salsas,queso,pollo,carne,maicitos,tocineta,costillaa",precio:28000},
    {nombre:"SALCHIPAPA SUPREMA: papa parda,papa amarilla,salchicha,ripio,salsas,queso,pollo,carne,maicitos,tocineta,costillaa",precio:58000},
  ],
  bebidas:[
    {nombre:"Gaseosa 400ml",precio:5000},
    {nombre:"Cerveza poker",precio:5000}, 
    {nombre:"Cerveza budweiser",precio:5000},
    {nombre:"Cerveza club colombia",precio:5000}, 
    {nombre:"Cerveza coronita",precio:6500},
    {nombre:"Cerveza corona",precio:8000},
    {nombre:"Agua",precio:3500},
  ]
};

// Abrir modal con productos de una sección
function abrirModal(tipo){
  const cont = document.getElementById("modalProductos");
  cont.innerHTML = "";
  document.getElementById("modalTitulo").textContent = "Selecciona tu pedido";

  similares[tipo].forEach((p,index)=>{
    let html = `<div class="card">
      <h3>${p.nombre}</h3>
      <span>$${p.precio}</span>
      <div class="cantidad">
        <button onclick="cambiarCantidad(this,-1)">-</button>
        <input value="0" readonly data-index="${index}">
        <button onclick="cambiarCantidad(this,1)">+</button>
      </div>`;

    if(tipo !== "bebidas"){
      html += `<div class="salsas"><strong>🧂 2 salsas gratis</strong>`;
      salsas.forEach(s=>{
        html += `<label><span>${s}</span><input type="checkbox" onchange="contarSalsas(this)" data-index="${index}"></label>`;
      });
      html += `<small class="recargo"></small></div>`;
    }

    html += "</div>"; // cierre card
    cont.innerHTML += html;
  });

  // Botón único para agregar toda la sección al carrito
  const botonFinal = document.createElement("button");
  botonFinal.textContent = "Agregar al Carrito 🛒";
  botonFinal.className = "btn-enviar";
  botonFinal.onclick = () => agregarModalSeccion(tipo);
  cont.appendChild(botonFinal);

  document.getElementById("modal").style.display = "flex";
}

// Cambiar cantidad de producto
function cambiarCantidad(btn, v){
  const i = btn.parentElement.querySelector("input");
  let nuevo = parseInt(i.value) + v;
  i.value = Math.max(0, nuevo);
}

// Contar salsas y mostrar recargo
function contarSalsas(cb){
  const box = cb.closest(".salsas");
  const extras = Math.max(0, box.querySelectorAll("input:checked").length - SALSAS_GRATIS);
  box.querySelector(".recargo").textContent = extras ? `Recargo: $${extras*RECARGO_SALSA}` : "";
}

// Cerrar modal
function cerrarModal(){ document.getElementById("modal").style.display = "none"; }
window.onclick = e => { if(e.target.id==="modal") cerrarModal(); }

// Agregar todos los productos de una sección al carrito
function agregarModalSeccion(tipo){
  const cont = document.getElementById("modalProductos");
  const cards = cont.querySelectorAll(".card");
  let anySelected = false;

  cards.forEach((card)=>{
    const cant = parseInt(card.querySelector("input").value);
    if(cant>0){
      anySelected = true;
      const checks = card.querySelectorAll(".salsas input:checked");
      const lista = [...checks].map(c => c.previousSibling.textContent.trim());
      const recargo = Math.max(0, lista.length - SALSAS_GRATIS) * RECARGO_SALSA;
      const nombre = card.querySelector("h3").textContent;
      const precio = parseInt(card.querySelector("span").textContent.replace("$",""));
      carrito.push({nombre, precio, cant, salsa: lista.join(", "), recargo});
    }
  });

  if(!anySelected){
    alert("Selecciona al menos un producto con cantidad mayor a 0");
    return;
  }

  actualizar();
  cerrarModal();
}

// Actualizar carrito
function actualizar(){
  const ul = document.getElementById("lista");
  ul.innerHTML = "";
  let totalProductos = 0;

  carrito.forEach((p, i)=>{
    const sub = p.precio * p.cant + p.recargo;
    totalProductos += sub;
    ul.innerHTML += `<li class="item-carrito">${p.nombre} x${p.cant} (${p.salsa || ""}) <span class="precio">$${sub}</span>
    <button class="btn-quitar" onclick="quitar(${i})">✖</button></li>`;
  });

  // Total siempre incluye domicilio
  let totalConDomicilio = totalProductos;
  if(totalProductos>0) totalConDomicilio += DOMICILIO;
  total = totalConDomicilio;

  document.getElementById("total").textContent = "TOTAL (incluye domicilio): $" + totalConDomicilio;
}

// Quitar producto del carrito
function quitar(i){ carrito.splice(i,1); actualizar(); }

// Enviar pedido a WhatsApp
function enviar(){
  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const telefono = document.getElementById("telefonoCliente").value.trim();
  const pago = document.getElementById("pagoCliente").value;
  if(!nombre || !direccion || !telefono){ alert("Completa Nombre, Dirección y Teléfono"); return; }

  let msg = "*🍗 PEDIDO CRAZY WINGS 🍖*\n\n";
  msg += `*Cliente:* ${nombre}\n*Tel:* ${telefono}\n*Dirección:* ${direccion}\n`;
  msg += `*Pago:* ${pago==='efectivo'?'💵 Efectivo':'🏦 Transferencia (Nequi 3174230522)'}\n\n`;
  msg += "*Productos:*\n";

  carrito.forEach(p=>{
    msg += `- ${p.nombre} x${p.cant}`;
    if(p.salsa) msg += ` (Salsas: ${p.salsa})`;
    msg += ` - $${p.precio*p.cant+p.recargo}\n`;
  });

  if(carrito.length>0) msg += `\n*Domicilio:* $${DOMICILIO}\n`;
  msg += `\n*TOTAL:* $${total}`;

  window.open("https://wa.me/573108987237?text="+encodeURIComponent(msg), "_blank");
}


