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

]


const listaAgenda = document.getElementById("lista-agenda")


eventos.forEach((evento) => {

  listaAgenda.innerHTML += `

    <div class="card">

      <span>${evento.icone}</span>

      <h3>${evento.dia}</h3>

      <p>${evento.atividade}</p>

      <strong>${evento.horario}</strong>

    </div>

  `

})


const darkModeBtn = document.getElementById("dark-mode-btn")


darkModeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode")

})


const menuBtn = document.getElementById("menu-btn")
const nav = document.getElementById("nav")


menuBtn.addEventListener("click", () => {

  nav.classList.toggle("active")

})

window.addEventListener("scroll", () => {

  const banner = document.querySelector(".banner")

  const scroll = window.pageYOffset

  banner.style.backgroundPositionY =
    scroll * 0.4 + "px"

})


let mensagens = [];
let indiceAtual = 0;

function renderMensagem(indice) {

  const mensagem = mensagens[indice];

  const container =
    document.getElementById('mensagem-container');

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

fetch('mensagens.json')
  .then(response => response.json())
  .then(data => {

    mensagens = data;

    const hoje = new Date();

    indiceAtual =
      (hoje.getDate() + hoje.getMonth())
      % mensagens.length;

    renderMensagem(indiceAtual);

    document
      .getElementById('nova-mensagem-btn')
      .addEventListener('click', () => {

        let novoIndice;

        do {

          novoIndice =
            Math.floor(Math.random() * mensagens.length);

        } while (novoIndice === indiceAtual);

        indiceAtual = novoIndice;

        renderMensagem(indiceAtual);
      });
  });