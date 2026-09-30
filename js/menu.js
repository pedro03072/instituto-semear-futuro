/*
 * Menu hambúrguer (telas pequenas) e abertura de modais.
 * Melhoria progressiva: sem JavaScript o menu continua visível e utilizável.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // ---------- Menu hambúrguer ----------
  const botao = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu-principal');

  if (botao && menu) {
    function alternar(abrir) {
      botao.setAttribute('aria-expanded', String(abrir));
      menu.classList.toggle('menu--aberto', abrir);
    }

    botao.addEventListener('click', function () {
      alternar(botao.getAttribute('aria-expanded') !== 'true');
    });

    // Fecha com Esc e devolve o foco ao botão
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        alternar(false);
        botao.focus();
      }
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) alternar(false);
    });

    // Fecha ao escolher um link (âncoras na mesma página)
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) alternar(false);
    });
  }

  // ---------- Modais (elemento <dialog> nativo) ----------
  document.querySelectorAll('[data-abrir-modal]').forEach(function (gatilho) {
    const modal = document.getElementById(gatilho.dataset.abrirModal);
    if (!modal || typeof modal.showModal !== 'function') return;

    gatilho.addEventListener('click', function () { modal.showModal(); });

    // Fecha ao clicar no fundo escurecido
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.close();
    });
  });
})();
