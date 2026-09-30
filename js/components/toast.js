/*
 * components/toast.js — notificações temporárias (não bloqueiam a tela).
 * Uso: ONG.toast.mostrar('Mensagem', 'sucesso' | 'erro' | 'info')
 */
(function (ONG) {
  'use strict';

  const ICONES = { sucesso: '✓', erro: '✕', info: 'i' };
  let temporizador;

  ONG.toast = {
    mostrar(mensagem, tipo = 'sucesso', duracao = 5000) {
      const toast = ONG.dom.$('#toast');
      if (!toast) return;
      toast.className = 'toast toast--' + tipo;
      ONG.dom.$('.toast__icone', toast).textContent = ICONES[tipo] || ICONES.info;
      ONG.dom.$('.toast__texto', toast).textContent = mensagem;

      // força reflow para a transição acontecer mesmo em toasts seguidos
      void toast.offsetWidth;
      toast.classList.add('toast--visivel');

      clearTimeout(temporizador);
      temporizador = setTimeout(() => toast.classList.remove('toast--visivel'), duracao);
    }
  };
})(window.ONG);
