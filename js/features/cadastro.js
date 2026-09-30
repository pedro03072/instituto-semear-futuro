/*
 * features/cadastro.js — controlador do formulário de cadastro.
 * Responsável por: mostrar/ocultar blocos conforme a participação,
 * salvar e recuperar rascunho, verificar a consistência dos dados,
 * exibir o resumo de erros e gravar o cadastro no localStorage.
 */
(function (ONG) {
  'use strict';

  const { $, $$ } = ONG.dom;

  // ---------- Leitura e escrita dos dados do formulário ----------
  function coletar(form) {
    const fd = new FormData(form);
    const dados = Object.fromEntries(fd.entries());
    dados.areas = fd.getAll('areas');
    dados.lgpd = fd.has('lgpd');
    return dados;
  }

  function preencher(form, dados) {
    Object.entries(dados).forEach(([nome, valor]) => {
      const campos = $$(`[name="${nome}"]`, form);
      campos.forEach((campo) => {
        if (campo.type === 'radio') campo.checked = campo.value === valor;
        else if (campo.type === 'checkbox' && nome === 'areas') campo.checked = (valor || []).includes(campo.value);
        else if (campo.type === 'checkbox') campo.checked = Boolean(valor);
        else campo.value = valor ?? '';
      });
    });
  }

  function participacaoDe(dados) {
    return {
      voluntario: dados.participacao === 'voluntario' || dados.participacao === 'ambos',
      doador: dados.participacao === 'doador' || dados.participacao === 'ambos'
    };
  }

  /** Hash simples (djb2) para detectar CPF repetido sem guardar o número completo */
  function chaveCpf(cpf) {
    const digitos = String(cpf).replace(/\D/g, '');
    let h = 5381;
    for (const c of digitos) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
    return h.toString(36);
  }

  function mascararCpf(cpf) {
    const d = String(cpf).replace(/\D/g, '');
    return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
  }

  // ---------- Regras de consistência entre campos ----------
  function regrasConsistencia(form) {
    const dados = coletar(form);
    const tipo = participacaoDe(dados);
    const erros = [];

    if (!dados.participacao) {
      erros.push({ id: 'grupo-participacao', rotulo: 'Como deseja participar', mensagem: 'Escolha se deseja ser voluntário, doador ou ambos.' });
    }
    if (tipo.voluntario) {
      if (!dados.areas.length) erros.push({ id: 'grupo-areas', rotulo: 'Áreas de interesse', mensagem: 'Marque pelo menos uma área de interesse.' });
      if (!dados.disponibilidade) erros.push({ id: 'disponibilidade', mensagem: 'Informe em qual período você pode atuar.' });
    }
    if (tipo.doador) {
      if (!dados.valor || Number(dados.valor) < 10) erros.push({ id: 'valor', mensagem: 'Informe o valor da doação (mínimo de R$ 10,00).' });
      if (!dados.frequencia) erros.push({ id: 'frequencia', mensagem: 'Escolha a frequência da doação.' });
    }

    // Verificação de duplicidade com os cadastros já salvos
    const existentes = ONG.storage.listarCadastros();
    if (dados.email && existentes.some((c) => c.email.toLowerCase() === dados.email.trim().toLowerCase())) {
      erros.push({ id: 'email', mensagem: 'Já existe um cadastro com este e-mail neste navegador.' });
    }
    if (ONG.validacao.cpfValido(dados.cpf) && existentes.some((c) => c.cpfChave === chaveCpf(dados.cpf))) {
      erros.push({ id: 'cpf', mensagem: 'Este CPF já foi cadastrado.' });
    }
    return erros;
  }

  // ---------- Resumo de erros (topo do formulário) ----------
  function mostrarResumo(erros) {
    const caixa = $('#resumo-erros');
    $('#resumo-erros-titulo').textContent = erros.length === 1
      ? 'Encontramos 1 problema no formulário:'
      : `Encontramos ${erros.length} problemas no formulário:`;
    $('#resumo-erros-lista').innerHTML = erros
      .map((e) => `<li><a href="#${e.id}" data-ir-para="${e.id}">${ONG.dom.escapar(e.rotulo)}: ${ONG.dom.escapar(e.mensagem)}</a></li>`)
      .join('');
    caixa.hidden = false;
    caixa.focus();
    caixa.scrollIntoView({ behavior: ONG.dom.prefereMenosMovimento() ? 'auto' : 'smooth', block: 'center' });
  }

  function limparErros(form) {
    $('#resumo-erros').hidden = true;
    $$('.erro-campo', form).forEach((p) => { p.textContent = ''; });
    $$('[aria-invalid]', form).forEach((c) => c.removeAttribute('aria-invalid'));
  }

  // ---------- Montagem da vista ----------
  ONG.cadastro = {
    montar({ query }) {
      const form = $('#form-cadastro');
      const blocoVoluntario = $('#dados-voluntario');
      const blocoDoacao = $('#dados-doacao');

      ONG.mascaras.aplicar(form);
      ONG.cep.ativar(form);           // biblioteca externa: API ViaCEP
      ONG.validacao.ativarTempoReal(form);

      function atualizarBlocos() {
        const tipo = participacaoDe(coletar(form));
        blocoVoluntario.hidden = !tipo.voluntario;
        blocoDoacao.hidden = !tipo.doador;
        $('#disponibilidade').required = tipo.voluntario;
        $('#valor').required = tipo.doador;
        $('#frequencia').required = tipo.doador;
      }

      // 1) Recupera rascunho salvo anteriormente
      const rascunho = ONG.storage.lerRascunho();
      if (rascunho) {
        preencher(form, rascunho);
        $('#aviso-rascunho').hidden = false;
      }

      // 2) Parâmetros vindos de outras vistas (#/cadastro?projeto=... ou ?tipo=doador)
      const projeto = query.projeto && ONG.dados.buscarProjeto(query.projeto);
      if (projeto) {
        const atual = coletar(form).participacao;
        form.participacao.value = atual === 'doador' || atual === 'ambos' ? 'ambos' : 'voluntario';
        const area = $(`input[name="areas"][value="${projeto.area}"]`, form);
        if (area) area.checked = true;
      }
      if (query.tipo === 'doador' && !coletar(form).participacao) form.participacao.value = 'doador';
      atualizarBlocos();

      // 3) Eventos
      form.addEventListener('change', (e) => {
        if (e.target.name === 'participacao') {
          atualizarBlocos();
          ONG.validacao.mostrarErro('grupo-participacao', '');
        }
        if (e.target.name === 'areas') ONG.validacao.mostrarErro('grupo-areas', '');
      });

      // salva rascunho enquanto o usuário digita (sem CPF, por privacidade)
      form.addEventListener('input', ONG.dom.debounce(() => {
        const { cpf, lgpd, ...seguro } = coletar(form);
        ONG.storage.salvarRascunho(seguro);
      }, 400));

      const mensagem = $('#mensagem');
      const contador = $('#mensagem-contador');
      const atualizarContador = () => { contador.textContent = `${mensagem.value.length} de 500 caracteres.`; };
      mensagem.addEventListener('input', atualizarContador);
      atualizarContador();

      $('#descartar-rascunho').addEventListener('click', () => {
        ONG.storage.limparRascunho();
        form.reset();
      });

      $('#resumo-erros').addEventListener('click', (e) => {
        const link = e.target.closest('[data-ir-para]');
        if (!link) return;
        e.preventDefault();
        const alvo = document.getElementById(link.dataset.irPara);
        const focavel = alvo.matches('input, select, textarea') ? alvo : $('input, select, textarea', alvo);
        if (focavel) focavel.focus();
      });

      form.addEventListener('reset', () => {
        setTimeout(() => {
          ONG.storage.limparRascunho();
          $('#aviso-rascunho').hidden = true;
          limparErros(form);
          atualizarBlocos();
          atualizarContador();
        }, 0);
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const erros = ONG.validacao.validarFormulario(form, regrasConsistencia);

        if (erros.length) {
          mostrarResumo(erros);
          ONG.toast.mostrar('Revise os campos destacados antes de enviar.', 'erro');
          return;
        }

        const d = coletar(form);
        const tipo = participacaoDe(d);
        const salvo = ONG.storage.adicionarCadastro({
          nome: d.nome.trim(),
          email: d.email.trim().toLowerCase(),
          telefone: d.telefone,
          nascimento: d.nascimento,
          cpfMascarado: mascararCpf(d.cpf),
          cpfChave: chaveCpf(d.cpf),
          cep: d.cep, logradouro: d.logradouro, numero: d.numero, complemento: d.complemento,
          cidade: d.cidade.trim(), uf: d.uf,
          participacao: d.participacao,
          areas: tipo.voluntario ? d.areas : [],
          disponibilidade: tipo.voluntario ? d.disponibilidade : '',
          horas: tipo.voluntario ? d.horas : '',
          valor: tipo.doador ? Number(d.valor) : 0,
          frequencia: tipo.doador ? d.frequencia : '',
          mensagem: d.mensagem
        });

        if (!salvo) {
          ONG.toast.mostrar('Não foi possível salvar. Verifique se o navegador permite armazenamento local.', 'erro');
          return;
        }

        ONG.storage.limparRascunho();
        ONG.toast.mostrar(`Obrigado, ${salvo.nome.split(' ')[0]}! Cadastro enviado com sucesso.`, 'sucesso');
        ONG.router.ir('#/painel');
      });
    },

    // expostas para testes
    _regrasConsistencia: regrasConsistencia,
    _mascararCpf: mascararCpf
  };
})(window.ONG);
