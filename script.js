// script.js

const eventos = [

  {
    icone: "📖",
    dia: "Terça-feira",
    atividade: "Palestras, Passe e Atendimento Fraterno",
    horario: "19:00 - 20:00"
  },

  {
    icone: "💻",
    dia: "Segunda-Feira",
    atividade: "Grupo de Estudos (Híbrido)",
    horario: "19:00 - 20:30"
  }

];

const listaAgenda =
  document.getElementById("lista-agenda");

eventos.forEach((evento) => {

  listaAgenda.innerHTML += `

    <div class="card">

      <span>${evento.icone}</span>

      <h3>${evento.dia}</h3>

      <p>${evento.atividade}</p>

      <strong>${evento.horario}</strong>

    </div>

  `;
});


// =========================
// DARK MODE
// =========================

const darkModeBtn =
  document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

});


// =========================
// MENU MOBILE
// =========================

const menuBtn =
  document.getElementById("menu-btn");

const nav =
  document.getElementById("nav");

menuBtn.addEventListener("click", () => {

  nav.classList.toggle("active");

});


// =========================
// PARALLAX BANNER
// =========================

window.addEventListener("scroll", () => {

  const banner =
    document.querySelector(".banner");

  const scroll =
    window.pageYOffset;

  banner.style.backgroundPositionY =
    scroll * 0.4 + "px";

});


// =========================
// MENSAGEM DO DIA
// =========================

let mensagens = [];

let indiceAtual = 0;

function renderMensagem(indice) {

  const mensagem =
    mensagens[indice];

  const container =
    document.getElementById("mensagem-container");

  container.style.opacity = 0;

  setTimeout(() => {

    container.innerHTML = `

      <h3>${mensagem.titulo}</h3>

      <p>"${mensagem.trecho}"</p>

      <span>${mensagem.fonte}</span>

    `;

    container.style.opacity = 1;

  }, 200);
}

fetch("mensagens.json")

  .then(response => response.json())

  .then(data => {

    mensagens = data;

    const hoje = new Date();

    indiceAtual =
      (hoje.getDate() + hoje.getMonth())
      % mensagens.length;

    renderMensagem(indiceAtual);

    document

      .getElementById("nova-mensagem-btn")

      .addEventListener("click", () => {

        let novoIndice;

        do {

          novoIndice =
            Math.floor(
              Math.random() * mensagens.length
            );

        } while (novoIndice === indiceAtual);

        indiceAtual = novoIndice;

        renderMensagem(indiceAtual);

      });

  });


// =========================
// SLIDER INFINITO
// =========================

const slider =
  document.getElementById("slider");

const cards =
  slider.querySelectorAll(".membro-card");

const quantidadeOriginal =
  cards.length / 3;

let larguraLoop = 0;

// calcula largura da primeira sequência
for (let i = 0; i < quantidadeOriginal; i++) {

  larguraLoop +=
    cards[i].offsetWidth + 30;
}

// começa no meio
slider.scrollLeft = larguraLoop;


// =========================
// AUTO SCROLL
// =========================

let autoScroll = true;

setInterval(() => {

  if (!autoScroll) return;

  slider.scrollLeft += 0.7;

  // reset invisível
  if (slider.scrollLeft >= larguraLoop * 2) {

    slider.scrollLeft = larguraLoop;
  }

}, 16);


// =========================
// DRAG DESKTOP
// =========================

let isDown = false;

let startX;

let scrollInicial;

slider.addEventListener("mousedown", (e) => {

  isDown = true;

  autoScroll = false;

  slider.classList.add("dragging");

  startX = e.pageX;
  ultimoX = e.pageX;
  scrollInicial = slider.scrollLeft;
});

window.addEventListener("mouseup", () => {

  isDown = false;

  slider.classList.remove("dragging");

  setTimeout(() => {

    autoScroll = true;

  }, 1000);
});

let ultimoX = 0;

slider.addEventListener("mousemove", (e) => {

  if (!isDown) return;

  e.preventDefault();

  const delta =
    e.pageX - ultimoX;

  slider.scrollLeft -= delta;

  ultimoX = e.pageX;

  // LOOP INFINITO

  const limiteMin = 50;

const limiteMax =
  larguraLoop * 2 - 50;

// LOOP SUAVE ESQUERDA

  if (slider.scrollLeft <= limiteMin) {

    slider.scrollLeft += larguraLoop;
  }

  // LOOP SUAVE DIREITA

  if (slider.scrollLeft >= limiteMax) {

    slider.scrollLeft -= larguraLoop;
  }
});


// =========================
// TOUCH MOBILE
// =========================

slider.addEventListener("touchstart", () => {

  autoScroll = false;
});

slider.addEventListener("touchend", () => {

  setTimeout(() => {

    autoScroll = true;

  }, 1000);
});