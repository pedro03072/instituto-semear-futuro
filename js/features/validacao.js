/*
 * features/validacao.js — validação de formulários com feedback ao usuário.
 * Combina a Constraint Validation API do HTML5 (required, pattern, type...)
 * com regras próprias (dígitos do CPF, idade mínima) e mostra a mensagem
 * de erro logo abaixo de cada campo, anunciada por leitores de tela.
 */
(function (ONG) {
  'use strict';

  const IDADE_MINIMA = 16;

  // ---------- Regras de negócio ----------
  function cpfValido(cpf) {
    const n = String(cpf).replace(/\D/g, '');
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    for (let t = 9; t < 11; t++) {
      let soma = 0;
      for (let i = 0; i < t; i++) soma += Number(n[i]) * (t + 1 - i);
      if (((soma * 10) % 11) % 10 !== Number(n[t])) return false;
    }
    return true;
  }

  function calcularIdade(dataISO) {
    const nasc = new Date(dataISO + 'T00:00:00');
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  // ---------- Mensagens amigáveis para cada tipo de erro nativo ----------
  function mensagemPara(campo) {
    const v = campo.validity;
    if (v.valid) return '';
    if (v.customError) return campo.validationMessage;
    if (v.valueMissing) return campo.dataset.msgObrigatorio || 'Este campo é obrigatório.';
    if (v.typeMismatch && campo.type === 'email') return 'Informe um e-mail válido, como nome@exemplo.com.';
    if (v.patternMismatch) return campo.dataset.msgFormato || 'Formato inválido.';
    if (v.tooShort) return 'Digite pelo menos ' + campo.minLength + ' caracteres.';
    if (v.rangeUnderflow) return 'O valor mínimo é ' + campo.min + '.';
    if (v.rangeOverflow) return 'O valor máximo é ' + campo.max + '.';
    if (v.badInput) return 'Valor inválido.';
    return campo.validationMessage;
  }

  // ---------- Exibição do feedback ----------
  function mostrarErro(idCampo, mensagem) {
    const saida = document.getElementById(idCampo + '-erro');
    const campo = document.getElementById(idCampo);
    if (saida) saida.textContent = mensagem;
    // aria-invalid só em controles de formulário (grupos usam a mensagem vinculada)
    if (campo && /^(INPUT|SELECT|TEXTAREA)$/.test(campo.tagName)) {
      if (mensagem) campo.setAttribute('aria-invalid', 'true');
      else campo.removeAttribute('aria-invalid');
    }
  }

  /** Valida um único campo: regras próprias + nativas. Retorna a mensagem ('' = válido). */
  function validarCampo(campo) {
    if (!campo.id || campo.disabled || campo.closest('[hidden]')) return '';
    campo.setCustomValidity('');

    const valor = campo.value.trim();
    if (valor && campo.dataset.validar === 'cpf' && /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valor) && !cpfValido(valor)) {
      campo.setCustomValidity('CPF inválido: os dígitos verificadores não conferem.');
    }
    if (valor && campo.dataset.validar === 'idade' && calcularIdade(valor) < IDADE_MINIMA) {
      campo.setCustomValidity('É preciso ter pelo menos ' + IDADE_MINIMA + ' anos para se cadastrar.');
    }
    if (valor && campo.dataset.validar === 'idade' && new Date(valor) > new Date()) {
      campo.setCustomValidity('A data de nascimento não pode estar no futuro.');
    }

    const mensagem = mensagemPara(campo);
    mostrarErro(campo.id, mensagem);
    return mensagem;
  }

  /**
   * Valida o formulário inteiro.
   * regrasExtras(form) → [{ id, mensagem }] permite checagens de consistência
   * entre campos (ex.: doador precisa informar valor). Retorna a lista de erros.
   */
  function validarFormulario(form, regrasExtras) {
    const erros = [];
    const vistos = new Set();

    ONG.dom.$$('input, select, textarea', form).forEach((campo) => {
      // grupos de radio/checkbox sem id são validados nas regras de consistência
      if (campo.type === 'radio' || (campo.type === 'checkbox' && !campo.id)) return;
      const mensagem = validarCampo(campo);
      if (mensagem) erros.push({ id: campo.id, mensagem, rotulo: rotuloDe(campo) });
    });

    if (typeof regrasExtras === 'function') {
      regrasExtras(form).forEach((erro) => {
        if (vistos.has(erro.id)) return;
        vistos.add(erro.id);
        const campo = document.getElementById(erro.id);
        if (campo && campo.setCustomValidity) campo.setCustomValidity(erro.mensagem);
        mostrarErro(erro.id, erro.mensagem);
        const existente = erros.find((e) => e.id === erro.id);
        if (existente) existente.mensagem = erro.mensagem; // mensagem de negócio é mais específica
        else erros.push({ ...erro, rotulo: erro.rotulo || (campo ? rotuloDe(campo) : '') });
      });
    }
    return erros;
  }

  function rotuloDe(campo) {
    const label = campo.id && document.querySelector('label[for="' + campo.id + '"]');
    return label ? label.textContent.replace('*', '').trim() : campo.name;
  }

  /** Validação em tempo real: ao sair do campo e, depois de um erro, a cada digitação */
  function ativarTempoReal(form) {
    ONG.dom.$$('input, select, textarea', form).forEach((campo) => {
      if (!campo.id || campo.type === 'radio') return;
      campo.addEventListener('blur', () => { if (campo.value) validarCampo(campo); });
      campo.addEventListener('input', () => {
        if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
      });
      campo.addEventListener('change', () => {
        if (campo.tagName === 'SELECT' || campo.type === 'date') validarCampo(campo);
      });
    });
  }

  ONG.validacao = { cpfValido, calcularIdade, validarCampo, validarFormulario, ativarTempoReal, mostrarErro, IDADE_MINIMA };
})(window.ONG);
