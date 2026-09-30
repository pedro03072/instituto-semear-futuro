/*
 * core/storage.js — camada de acesso ao localStorage.
 * Centraliza leitura/gravação em JSON, trata erros (modo privado, cota cheia)
 * e oferece uma API específica para cadastros e rascunho do formulário.
 */
(function (ONG) {
  'use strict';

  const PREFIXO = 'semear-futuro:';
  const CHAVE_CADASTROS = 'cadastros';
  const CHAVE_RASCUNHO = 'rascunho-cadastro';

  function ler(chave, padrao) {
    try {
      const bruto = localStorage.getItem(PREFIXO + chave);
      return bruto === null ? padrao : JSON.parse(bruto);
    } catch (erro) {
      console.warn('[storage] não foi possível ler', chave, erro);
      return padrao;
    }
  }

  function salvar(chave, valor) {
    try {
      localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.warn('[storage] não foi possível salvar', chave, erro);
      return false;
    }
  }

  function remover(chave) {
    try { localStorage.removeItem(PREFIXO + chave); } catch (erro) { /* ignora */ }
  }

  ONG.storage = {
    ler, salvar, remover,

    // ---------- Cadastros ----------
    listarCadastros() {
      return ler(CHAVE_CADASTROS, []);
    },

    adicionarCadastro(dados) {
      const cadastros = this.listarCadastros();
      const novo = {
        ...dados,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        criadoEm: new Date().toISOString()
      };
      cadastros.push(novo);
      return salvar(CHAVE_CADASTROS, cadastros) ? novo : null;
    },

    removerCadastro(id) {
      const restantes = this.listarCadastros().filter((c) => c.id !== id);
      salvar(CHAVE_CADASTROS, restantes);
      return restantes;
    },

    limparCadastros() {
      remover(CHAVE_CADASTROS);
    },

    // ---------- Rascunho do formulário ----------
    lerRascunho() { return ler(CHAVE_RASCUNHO, null); },
    salvarRascunho(dados) { salvar(CHAVE_RASCUNHO, dados); },
    limparRascunho() { remover(CHAVE_RASCUNHO); }
  };
})(window.ONG);
