// script.js

const eventos = [

  {
    icone: "📖",
    dia: "Terça-feira",
    atividade: "Palestras, Passe e Atendimento Fraterno",
    horario: "19:00"
  },

  {
    icone: "💻",
    dia: "Quinta-feira",
    atividade: "Grupo de Estudos (Online)",
    horario: "19:00"
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