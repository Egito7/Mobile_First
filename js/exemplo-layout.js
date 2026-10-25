// Abre e fecha o menu ☰ no celular
const botaoMenu = document.getElementById('botao-menu');
const navegacao = document.getElementById('navegacao');

botaoMenu.addEventListener('click', () => {
  const aberto = navegacao.classList.toggle('aberta');
  botaoMenu.setAttribute('aria-expanded', aberto);
});
