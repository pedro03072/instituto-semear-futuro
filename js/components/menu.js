/*
 * components/menu.js — menu hambúrguer da navegação principal.
 */
(function (ONG) {
  'use strict';

  ONG.menu = {
    iniciar() {
      const botao = ONG.dom.$('.nav__toggle');
      const menu = ONG.dom.$('#menu-principal');
      if (!botao || !menu) return;

      const alternar = (abrir) => {
        botao.setAttribute('aria-expanded', String(abrir));
        menu.classList.toggle('menu--aberto', abrir);
      };

      botao.addEventListener('click', () => alternar(botao.getAttribute('aria-expanded') !== 'true'));

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
          alternar(false);
          botao.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav')) alternar(false);
      });

      // Na SPA a página não recarrega: fecha o menu sempre que a rota muda
      document.addEventListener('rota:alterada', () => alternar(false));
    }
  };
})(window.ONG);
