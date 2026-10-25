// =========================================================
// script.js — interatividade dos exemplos
// (as animações em si são todas feitas em CSS; o JavaScript
//  só troca valores quando você clica nos controles)
// =========================================================


// ---------- Largura atual da janela (selo do topo) ----------
const larguraTela = document.getElementById('largura-tela');

function mostrarLarguraTela() {
  larguraTela.textContent = `janela: ${window.innerWidth}px`;
}
window.addEventListener('resize', mostrarLarguraTela);
mostrarLarguraTela();


// ---------- Simulador de telas ----------
const moldura = document.getElementById('moldura');
const larguraMoldura = document.getElementById('largura-moldura');
const botoesSimulador = document.querySelectorAll('#botoes-simulador button');
const BORDA_MOLDURA = 16; // 8px de borda de cada lado (ver .moldura no CSS)

botoesSimulador.forEach(botao => {
  botao.addEventListener('click', () => {
    botoesSimulador.forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    moldura.style.width = (Number(botao.dataset.largura) + BORDA_MOLDURA) + 'px';
  });
});

// atualiza o número também quando a moldura é arrastada com o mouse
new ResizeObserver(() => {
  larguraMoldura.textContent = moldura.clientWidth + 'px';
}).observe(moldura);


// ---------- GPU: ocupar a CPU ----------
const botaoCpu = document.getElementById('ocupar-cpu');
const statusCpu = document.getElementById('status-cpu');

botaoCpu.addEventListener('click', () => {
  botaoCpu.disabled = true;
  statusCpu.textContent = '⏳ CPU ocupada… observe as bolinhas!';

  // espera um instante para o texto acima aparecer na tela antes de travar
  setTimeout(() => {
    const fim = Date.now() + 3000;
    while (Date.now() < fim) {
      // laço vazio: prende a CPU (a "thread principal") por 3 segundos
    }
    statusCpu.textContent = '✅ CPU liberada.';
    botaoCpu.disabled = false;
  }, 100);
});


// ---------- transform: exemplos prontos e controles deslizantes ----------
const caixaTransform = document.getElementById('caixa-transform');
const codigoTransform = document.getElementById('codigo-transform');
const botoesPreset = document.querySelectorAll('[data-transform]');
const deslizantes = document.querySelectorAll('.controles-deslizantes input');

function aplicarTransform(valor) {
  caixaTransform.style.transform = valor;
  codigoTransform.textContent = `.box {\n  transform: ${valor};\n}`;
}

botoesPreset.forEach(botao => {
  botao.addEventListener('click', () => {
    botoesPreset.forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    // volta os controles deslizantes para o valor neutro
    deslizantes.forEach(d => {
      d.value = d.dataset.fn === 'scale' ? 1 : 0;
      d.nextElementSibling.textContent = d.value + d.dataset.un;
    });
    aplicarTransform(botao.dataset.transform);
  });
});

deslizantes.forEach(deslizante => {
  deslizante.addEventListener('input', () => {
    botoesPreset.forEach(b => b.classList.remove('ativo'));
    deslizante.nextElementSibling.textContent = deslizante.value + deslizante.dataset.un;

    // monta o transform só com as funções que saíram do valor neutro
    const partes = [];
    deslizantes.forEach(d => {
      const neutro = d.dataset.fn === 'scale' ? '1' : '0';
      if (d.value !== neutro) partes.push(`${d.dataset.fn}(${d.value}${d.dataset.un})`);
    });
    aplicarTransform(partes.length ? partes.join(' ') : 'none');
  });
});


// ---------- timing-function: corrida ----------
const corrida = document.querySelector('.corrida');
const botaoCorrida = document.getElementById('iniciar-corrida');

botaoCorrida.addEventListener('click', () => {
  // distância = largura da raia menos o tamanho da bolinha e as margens
  const raia = corrida.querySelector('.raia');
  corrida.style.setProperty('--distancia', (raia.clientWidth - 28) + 'px');

  const correndo = corrida.classList.toggle('correndo');
  botaoCorrida.textContent = correndo ? '↺ Voltar ao início' : '▶ Iniciar corrida';
});


// ---------- animation: laboratório ----------
const caixaAnimacao = document.getElementById('caixa-animation');
const codigoLongo = document.getElementById('codigo-animation-longo');
const codigoCurto = document.getElementById('codigo-animation-curto');
const botaoPausar = document.getElementById('an-pausar');
const campos = {
  name: document.getElementById('an-name'),
  duration: document.getElementById('an-duration'),
  timing: document.getElementById('an-timing-fn'),
  delay: document.getElementById('an-delay'),
  iteration: document.getElementById('an-iteration'),
  direction: document.getElementById('an-direction')
};

function aplicarAnimacao() {
  const v = Object.fromEntries(Object.entries(campos).map(([k, el]) => [k, el.value]));
  const atalho = `${v.name} ${v.duration} ${v.timing} ${v.delay} ${v.iteration} ${v.direction}`;

  // tirar a animação e colocar de novo faz ela recomeçar do zero
  caixaAnimacao.style.animation = 'none';
  void caixaAnimacao.offsetWidth; // força o navegador a "perceber" a remoção
  caixaAnimacao.style.animation = atalho;
  botaoPausar.textContent = '⏸ Pausar (animation-play-state)';

  codigoLongo.textContent =
`.box {
  animation-name: ${v.name};
  animation-duration: ${v.duration};
  animation-timing-function: ${v.timing};
  animation-delay: ${v.delay};
  animation-iteration-count: ${v.iteration};
  animation-direction: ${v.direction};
}`;
  codigoCurto.textContent =
`.box {
  animation: ${atalho};
}

/* ordem: nome duração timing atraso repetição direção */`;
}

Object.values(campos).forEach(campo => campo.addEventListener('change', aplicarAnimacao));
document.getElementById('an-reiniciar').addEventListener('click', aplicarAnimacao);

botaoPausar.addEventListener('click', () => {
  const pausado = caixaAnimacao.style.animationPlayState === 'paused';
  caixaAnimacao.style.animationPlayState = pausado ? 'running' : 'paused';
  botaoPausar.textContent = pausado ? '⏸ Pausar (animation-play-state)' : '▶ Continuar (animation-play-state)';
});

aplicarAnimacao();


// ---------- prefers-reduced-motion ----------
const statusMovimento = document.getElementById('status-movimento');
const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

function mostrarPreferencia() {
  statusMovimento.textContent = prefereMenosMovimento.matches
    ? 'prefere menos movimento (reduce)'
    : 'sem preferência (no-preference)';
}
prefereMenosMovimento.addEventListener('change', mostrarPreferencia);
mostrarPreferencia();
