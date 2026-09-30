/*
 * components/tema.js — preferências de acessibilidade visual:
 * modo escuro e alto contraste (WCAG 2.1 — 1.4.3 Contraste, 1.4.8 Apresentação visual).
 * Carregado SEM defer no <head> para aplicar o tema antes da pintura da página
 * (evita o "flash" do tema claro). A escolha fica salva no localStorage;
 * sem escolha salva, segue a preferência do sistema operacional.
 */
window.ONG = window.ONG || {};

(function (ONG) {
  'use strict';

  const CHAVE = 'semear-futuro:tema';
  const raiz = document.documentElement;

  function lerPreferencia() {
    try { return JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { return null; }
  }

  function aplicar(tema) {
    if (tema && tema !== 'claro') raiz.dataset.tema = tema;
    else delete raiz.dataset.tema;
  }

  const salvo = lerPreferencia();
  const sistemaEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicar(salvo || (sistemaEscuro ? 'escuro' : 'claro'));

  ONG.tema = {
    atual() { return raiz.dataset.tema || 'claro'; },

    definir(tema) {
      aplicar(tema);
      try { localStorage.setItem(CHAVE, JSON.stringify(tema)); } catch (e) { /* ignora */ }
      this.sincronizarBotoes();
      document.dispatchEvent(new CustomEvent('tema:alterado', { detail: { tema } }));
    },

    sincronizarBotoes() {
      document.querySelectorAll('[data-tema-alvo]').forEach((botao) => {
        botao.setAttribute('aria-pressed', String(botao.dataset.temaAlvo === this.atual()));
      });
    },

    iniciar() {
      document.querySelectorAll('[data-tema-alvo]').forEach((botao) => {
        botao.addEventListener('click', () => {
          // clicar no tema já ativo volta para o tema claro (botão alternável)
          const alvo = botao.dataset.temaAlvo;
          this.definir(this.atual() === alvo ? 'claro' : alvo);
        });
      });
      this.sincronizarBotoes();
    }
  };
})(window.ONG);
