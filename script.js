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

const bannerEl = document.querySelector(".banner");

// A mensagem usa background-attachment: fixed — parallax nativo, sem JS necessário.
// iOS não suporta fixed; o fallback é tratado via classe .ios no CSS.

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) document.documentElement.classList.add("ios");

function onScroll() {
  const scrollY = window.pageYOffset;
  if (bannerEl) {
    bannerEl.style.backgroundPositionY = (scrollY * 0.35) + "px";
  }
}

window.addEventListener("scroll", onScroll, { passive: true });


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

const slider = document.getElementById("slider");
const cards  = slider.querySelectorAll(".membro-card");
const quantidadeOriginal = cards.length / 3;

let larguraLoop = 0;
let autoScroll  = true;
let rafId       = null;

// Calcula largura após o layout estar pronto
function calcLarguraLoop() {
  larguraLoop = 0;
  for (let i = 0; i < quantidadeOriginal; i++) {
    larguraLoop += cards[i].offsetWidth + 30; // 30 = gap
  }
}

// Reposicionamento sem scroll-behavior smooth
function jumpSlider(delta) {
  slider.style.scrollBehavior = "auto";
  slider.scrollLeft += delta;
  // Restaura depois de um frame para não afetar
  // outros scrolls intencionais
  requestAnimationFrame(() => {
    slider.style.scrollBehavior = "";
  });
}

function checkLoop() {
  if (!larguraLoop) return;
  const min = larguraLoop * 0.5;       // guarda de segurança: 50% do bloco
  const max = larguraLoop * 2 - min;

  if (slider.scrollLeft <= min) {
    jumpSlider(larguraLoop);
  } else if (slider.scrollLeft >= max) {
    jumpSlider(-larguraLoop);
  }
}

// =========================
// AUTO SCROLL (rAF)
// =========================

function tickAutoScroll() {
  if (autoScroll) {
    slider.scrollLeft += 0.7;
    checkLoop();
  }
  rafId = requestAnimationFrame(tickAutoScroll);
}

// =========================
// DRAG DESKTOP
// =========================

let isDown = false;
let ultimoX = 0;
let autoScrollTimer = null;

function pauseAutoScroll() {
  autoScroll = false;
  clearTimeout(autoScrollTimer);
  autoScrollTimer = setTimeout(() => { autoScroll = true; }, 1200);
}

slider.addEventListener("mousedown", (e) => {
  isDown  = true;
  ultimoX = e.pageX;
  slider.classList.add("dragging");
  pauseAutoScroll();
});

window.addEventListener("mouseup", () => {
  if (!isDown) return;
  isDown = false;
  slider.classList.remove("dragging");
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();

  const delta = e.pageX - ultimoX;
  slider.scrollLeft -= delta;
  ultimoX = e.pageX;

  checkLoop();
});

// =========================
// TOUCH MOBILE
// =========================

let touchUltimoX  = 0;
let touchUltimoY  = 0;
let touchTracking = false;

slider.addEventListener("touchstart", (e) => {
  touchUltimoX  = e.touches[0].clientX;
  touchUltimoY  = e.touches[0].clientY;
  touchTracking = true;
  pauseAutoScroll();
}, { passive: true });

slider.addEventListener("touchmove", (e) => {
  if (!touchTracking) return;

  const dx = e.touches[0].clientX - touchUltimoX;
  const dy = e.touches[0].clientY - touchUltimoY;

  // Só trata o toque como horizontal (evita conflito com scroll da página)
  if (Math.abs(dx) > Math.abs(dy)) {
    e.preventDefault();
    slider.scrollLeft -= dx;
    checkLoop();
  }

  touchUltimoX = e.touches[0].clientX;
  touchUltimoY = e.touches[0].clientY;
}, { passive: false });

slider.addEventListener("touchend", () => {
  touchTracking = false;
  checkLoop(); // verifica uma última vez após a inércia nativa
});

// =========================
// INIT
// =========================

// Aguarda fontes + imagens carregarem para medir corretamente
window.addEventListener("load", () => {
  calcLarguraLoop();
  // Começa no bloco do meio (posição neutra do loop)
  slider.style.scrollBehavior = "auto";
  slider.scrollLeft = larguraLoop;
  slider.style.scrollBehavior = "";

  // Recalcula se a janela for redimensionada
  window.addEventListener("resize", () => {
    calcLarguraLoop();
  });

  tickAutoScroll();
});