/*
 * features/mascaras.js — máscaras de entrada (CPF, telefone, CEP).
 * Formata enquanto o usuário digita; a validação fica em validacao.js.
 */
(function (ONG) {
  'use strict';

  const formatadores = {
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

  ONG.mascaras = {
    formatar(tipo, valor) {
      return formatadores[tipo] ? formatadores[tipo](valor) : valor;
    },

    /** Liga as máscaras a todos os campos [data-mascara] dentro do container */
    aplicar(container) {
      ONG.dom.$$('[data-mascara]', container).forEach((campo) => {
        campo.addEventListener('input', () => {
          campo.value = ONG.mascaras.formatar(campo.dataset.mascara, campo.value);
        });
      });
    }
  };
})(window.ONG);
