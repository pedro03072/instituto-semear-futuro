/*
 * Máscaras de entrada e validações complementares do formulário de cadastro.
 * A validação principal é NATIVA do HTML5 (required, pattern, type, min/max);
 * este script apenas formata os campos enquanto o usuário digita e acrescenta
 * regras que o HTML sozinho não consegue verificar (dígitos do CPF, idade mínima).
 */

(function () {
  'use strict';

  // ---------- Máscaras ----------
  const mascaras = {
    cpf(v) {
      return v.replace(/\D/g, '').slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    telefone(v) {
      const d = v.replace(/\D/g, '').slice(0, 11);
      if (d.length <= 2) return d.length ? '(' + d : '';
      if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    },
    cep(v) {
      return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  document.querySelectorAll('[data-mascara]').forEach(function (campo) {
    const aplicar = mascaras[campo.dataset.mascara];
    campo.addEventListener('input', function () {
      campo.value = aplicar(campo.value);
    });
  });

  // ---------- Validação dos dígitos verificadores do CPF ----------
  function cpfValido(cpf) {
    const n = cpf.replace(/\D/g, '');
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    for (let t = 9; t < 11; t++) {
      let soma = 0;
      for (let i = 0; i < t; i++) soma += Number(n[i]) * (t + 1 - i);
      const digito = ((soma * 10) % 11) % 10;
      if (digito !== Number(n[t])) return false;
    }
    return true;
  }

  const cpf = document.getElementById('cpf');
  if (cpf) {
    cpf.addEventListener('input', function () {
      const completo = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value);
      cpf.setCustomValidity(completo && !cpfValido(cpf.value) ? 'CPF inválido. Confira os números digitados.' : '');
    });
  }

  // ---------- Idade mínima de 16 anos (data máxima calculada a partir de hoje) ----------
  const nascimento = document.getElementById('nascimento');
  if (nascimento) {
    const hoje = new Date();
    const limite = new Date(hoje.getFullYear() - 16, hoje.getMonth(), hoje.getDate());
    nascimento.max = limite.toISOString().slice(0, 10);
  }

  // ---------- Campos obrigatórios conforme o tipo de participação ----------
  const form = document.querySelector('form[data-validar]');
  if (!form) return;

  const blocoVoluntario = document.getElementById('dados-voluntario');
  const blocoDoacao = document.getElementById('dados-doacao');
  const disponibilidade = document.getElementById('disponibilidade');
  const valor = document.getElementById('valor');
  const frequencia = document.getElementById('frequencia');

  function atualizarParticipacao() {
    const escolha = (form.querySelector('input[name="participacao"]:checked') || {}).value;
    const voluntario = escolha === 'voluntario' || escolha === 'ambos';
    const doador = escolha === 'doador' || escolha === 'ambos';

    blocoVoluntario.hidden = escolha ? !voluntario : false;
    blocoDoacao.hidden = escolha ? !doador : false;
    disponibilidade.required = voluntario;
    valor.required = doador;
    frequencia.required = doador;
    validarAreas();
  }

  form.querySelectorAll('input[name="participacao"]').forEach(function (r) {
    r.addEventListener('change', atualizarParticipacao);
  });

  // Voluntários precisam marcar ao menos uma área de interesse
  const areas = form.querySelectorAll('input[name="areas"]');
  function validarAreas() {
    const escolha = (form.querySelector('input[name="participacao"]:checked') || {}).value;
    const exige = escolha === 'voluntario' || escolha === 'ambos';
    const marcada = Array.from(areas).some(function (a) { return a.checked; });
    areas[0].setCustomValidity(exige && !marcada ? 'Marque ao menos uma área de interesse.' : '');
  }
  areas.forEach(function (a) { a.addEventListener('change', validarAreas); });

  // ---------- Envio ----------
  // ---------- Toast de confirmação ----------
  const toast = document.getElementById('toast');
  let temporizador;
  function mostrarToast(mensagem) {
    if (!toast) return;
    toast.querySelector('p').textContent = mensagem;
    toast.classList.add('toast--visivel');
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { toast.classList.remove('toast--visivel'); }, 5000);
  }

  form.addEventListener('submit', function (evento) {
    validarAreas();
    if (!form.checkValidity()) {
      evento.preventDefault();
      form.reportValidity();
      return;
    }
    // Projeto acadêmico sem back-end: simula o envio
    evento.preventDefault();
    form.reset();
    atualizarParticipacao();
    mostrarToast('Cadastro enviado com sucesso! Em breve entraremos em contato.');
  });

  // Botão "Limpar": restaura os blocos de voluntariado e doação
  form.querySelector('button[type="reset"]').addEventListener('click', function () {
    setTimeout(atualizarParticipacao, 0);
  });
})();
