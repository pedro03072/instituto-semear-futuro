/*
 * features/inicio.js — comportamento da página inicial:
 * anima os números de impacto quando entram na tela.
 */
(function (ONG) {
  'use strict';

  function animarContador(elemento) {
    const alvo = Number(elemento.dataset.contador);
    if (!alvo || ONG.dom.prefereMenosMovimento()) return;
    const duracao = 1200;
    const inicio = performance.now();

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3); // ease-out
      elemento.textContent = Math.round(alvo * suavizado).toLocaleString('pt-BR');
      if (progresso < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  ONG.inicio = {
    montar() {
      const contadores = ONG.dom.$$('[data-contador]');
      if (!('IntersectionObserver' in window)) return;

      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            observador.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.6 });

      contadores.forEach((c) => observador.observe(c));
    }
  };
})(window.ONG);
