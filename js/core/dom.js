/*
 * core/dom.js — utilitários de manipulação do DOM e formatação.
 * Todos os módulos do projeto ficam no namespace global "ONG"
 * (funciona abrindo o arquivo direto no navegador, sem servidor).
 */
window.ONG = window.ONG || {};

(function (ONG) {
  'use strict';

  const MAPA_ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  ONG.dom = {
    /** Retorna o primeiro elemento que corresponde ao seletor. */
    $(seletor, contexto) {
      return (contexto || document).querySelector(seletor);
    },

    /** Retorna todos os elementos como array (permite forEach, map, filter). */
    $$(seletor, contexto) {
      return Array.from((contexto || document).querySelectorAll(seletor));
    },

    /** Escapa texto digitado pelo usuário antes de inserir em HTML (evita XSS). */
    escapar(texto) {
      return String(texto ?? '').replace(/[&<>"']/g, (c) => MAPA_ESCAPE[c]);
    },

    /** Executa a função só depois que o usuário para de digitar por "espera" ms. */
    debounce(funcao, espera) {
      let temporizador;
      return function (...args) {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcao.apply(this, args), espera);
      };
    },

    formatarMoeda(valor) {
      return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    formatarData(iso) {
      return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    /** Usuário pediu menos animação no sistema operacional? */
    prefereMenosMovimento() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  };
})(window.ONG);
