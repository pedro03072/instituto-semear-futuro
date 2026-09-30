/*
 * components/modal.js — janela modal reutilizável (elemento <dialog> nativo).
 * ONG.modal.abrir({ titulo, conteudo })       → exibe informações
 * ONG.modal.confirmar(titulo, texto) → Promise → true/false (substitui o confirm())
 */
(function (ONG) {
  'use strict';

  function elementos() {
    const dialogo = ONG.dom.$('#modal');
    return {
      dialogo,
      titulo: ONG.dom.$('#modal-titulo', dialogo),
      corpo: ONG.dom.$('.modal__corpo', dialogo),
      acoes: ONG.dom.$('.modal__acoes', dialogo)
    };
  }

  ONG.modal = {
    iniciar() {
      const { dialogo } = elementos();
      if (!dialogo) return;
      // fecha ao clicar no fundo escurecido
      dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close('cancelar'); });
      // links dentro do modal que levam a outra rota fecham o modal
      document.addEventListener('rota:alterada', () => { if (dialogo.open) dialogo.close('cancelar'); });
    },

    abrir({ titulo, conteudo, acoes = '' }) {
      const el = elementos();
      el.titulo.textContent = titulo;
      el.corpo.innerHTML = conteudo;
      el.acoes.innerHTML = acoes;
      el.acoes.hidden = !acoes;
      el.dialogo.returnValue = '';
      el.dialogo.showModal();
      return el.dialogo;
    },

    confirmar(titulo, texto, rotuloConfirmar = 'Confirmar') {
      return new Promise((resolver) => {
        const dialogo = this.abrir({
          titulo,
          conteudo: '<p>' + ONG.dom.escapar(texto) + '</p>',
          acoes:
            '<button type="button" class="botao botao--contorno" data-valor="cancelar">Cancelar</button>' +
            '<button type="button" class="botao botao--perigo" data-valor="confirmar">' + ONG.dom.escapar(rotuloConfirmar) + '</button>'
        });

        const aoClicar = (e) => {
          const botao = e.target.closest('[data-valor]');
          if (botao) dialogo.close(botao.dataset.valor);
        };
        dialogo.addEventListener('click', aoClicar);
        dialogo.addEventListener('close', () => {
          dialogo.removeEventListener('click', aoClicar);
          resolver(dialogo.returnValue === 'confirmar');
        }, { once: true });
      });
    }
  };
})(window.ONG);
