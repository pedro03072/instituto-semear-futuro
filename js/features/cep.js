/*
 * features/cep.js — integração com a API pública ViaCEP (https://viacep.com.br).
 * Quando o CEP fica completo, busca o endereço e preenche logradouro, cidade e UF.
 * Se a API falhar (sem internet, CEP inexistente), o usuário preenche manualmente:
 * a integração melhora a experiência, mas nunca bloqueia o cadastro.
 */
(function (ONG) {
  'use strict';

  const TEMPO_LIMITE = 5000; // ms
  let ultimaBusca = '';

  async function buscarEndereco(cep) {
    const controle = new AbortController();
    const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE);
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controle.signal });
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      return await resposta.json();
    } finally {
      clearTimeout(temporizador);
    }
  }

  ONG.cep = {
    ativar(form) {
      const campoCep = ONG.dom.$('#cep', form);
      const status = ONG.dom.$('#cep-dica', form);
      if (!campoCep || !status) return;
      const textoPadrao = status.textContent;
      status.setAttribute('aria-live', 'polite'); // anuncia o resultado da busca

      campoCep.addEventListener('input', async () => {
        const digitos = campoCep.value.replace(/\D/g, '');
        if (digitos.length !== 8) { status.textContent = textoPadrao; ultimaBusca = ''; return; }
        if (digitos === ultimaBusca) return;
        ultimaBusca = digitos;

        status.textContent = 'Buscando endereço…';
        campoCep.setAttribute('aria-busy', 'true');

        try {
          const dados = await buscarEndereco(digitos);
          if (dados.erro) {
            ONG.validacao.mostrarErro('cep', 'CEP não encontrado. Confira os números ou preencha o endereço manualmente.');
            status.textContent = textoPadrao;
            return;
          }
          const preencher = (id, valor) => {
            const campo = ONG.dom.$('#' + id, form);
            if (campo && valor) {
              campo.value = valor;
              ONG.validacao.validarCampo(campo);
            }
          };
          preencher('logradouro', [dados.logradouro, dados.bairro].filter(Boolean).join(', '));
          preencher('cidade', dados.localidade);
          preencher('uf', dados.uf);
          ONG.validacao.mostrarErro('cep', '');
          status.textContent = `Endereço encontrado: ${dados.localidade} — ${dados.uf}. Confira e informe o número.`;
          form.dispatchEvent(new Event('input')); // atualiza o rascunho salvo
          ONG.dom.$('#numero', form).focus();
        } catch (erro) {
          console.warn('[cep] falha na consulta ao ViaCEP:', erro);
          status.textContent = 'Não foi possível buscar o endereço agora. Preencha os campos manualmente.';
        } finally {
          campoCep.removeAttribute('aria-busy');
        }
      });
    }
  };
})(window.ONG);
