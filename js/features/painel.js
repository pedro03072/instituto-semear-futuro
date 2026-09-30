/*
 * features/painel.js — lista, filtra e exclui os cadastros salvos no localStorage.
 */
(function (ONG) {
  'use strict';

  const { $ } = ONG.dom;

  function normalizar(t) {
    return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // ---------- Gráfico (biblioteca externa Chart.js) ----------
  let grafico = null; // instância atual, destruída antes de redesenhar
  let renderizarAtual = null; // referência para redesenhar quando o tema mudar

  // Registrado uma única vez (e não a cada visita ao painel), evitando listeners duplicados
  document.addEventListener('tema:alterado', () => { if (renderizarAtual) renderizarAtual(); });

  function cssVar(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  }

  /** Plugin próprio: escreve o valor no fim de cada barra (rótulo direto, cor de texto) */
  const rotuloNaBarra = {
    id: 'rotuloNaBarra',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      ctx.save();
      ctx.fillStyle = cssVar('--cor-texto');
      ctx.font = '600 14px system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      chart.getDatasetMeta(0).data.forEach((barra, i) => {
        ctx.fillText(String(chart.data.datasets[0].data[i]), barra.x + 8, barra.y);
      });
      ctx.restore();
    }
  };

  /** Chart.js (208 KB) só é baixado quando o painel precisa desenhar o gráfico */
  function garantirChart() {
    if (window.Chart) return Promise.resolve();
    const meta = document.querySelector('meta[name="chart-js"]');
    return meta ? ONG.dom.carregarScript(meta.content) : Promise.reject(new Error('Chart.js não configurado'));
  }

  async function renderizarGrafico(cadastros) {
    const bloco = $('#grafico-bloco');
    if (!bloco) return;
    if (!cadastros.length) { bloco.hidden = true; return; }
    try {
      await garantirChart();
      if (!window.Chart) throw new Error('Chart.js não disponível');
    } catch (erro) {
      // Viabilidade: se a biblioteca não carregar, o painel continua funcionando sem o gráfico
      console.warn('[painel] gráfico indisponível:', erro.message);
      bloco.hidden = true;
      return;
    }
    if (!document.body.contains(bloco)) return; // usuário já saiu do painel
    bloco.hidden = false;

    const rotulos = ONG.dados.rotulos.participacao;
    const tipos = Object.keys(rotulos);
    const valores = tipos.map((t) => cadastros.filter((c) => c.participacao === t).length);

    // tabela equivalente para leitores de tela
    $('#tabela-grafico tbody').innerHTML = tipos
      .map((t, i) => `<tr><td>${rotulos[t]}</td><td>${valores[i]}</td></tr>`).join('');

    if (grafico) grafico.destroy();
    grafico = new window.Chart($('#grafico-participacao'), {
      type: 'bar',
      data: {
        labels: tipos.map((t) => rotulos[t]),
        datasets: [{
          label: 'Cadastros',
          data: valores,
          backgroundColor: cssVar('--cor-primaria-500'),
          hoverBackgroundColor: cssVar('--cor-primaria-700'),
          borderRadius: 4,
          borderSkipped: 'start',
          maxBarThickness: 28
        }]
      },
      plugins: [rotuloNaBarra],
      options: {
        indexAxis: 'y',               // barras horizontais: rótulos longos ficam legíveis
        responsive: true,
        maintainAspectRatio: false,
        animation: ONG.dom.prefereMenosMovimento() ? false : { duration: 500 },
        layout: { padding: { right: 32 } },
        plugins: {
          legend: { display: false }, // série única: o título já identifica
          tooltip: { callbacks: { label: (item) => ` ${item.raw} cadastro(s)` } }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0, color: cssVar('--cor-texto-suave') },
            grid: { color: cssVar('--cor-neutra-100') },
            border: { display: false }
          },
          y: {
            ticks: { color: cssVar('--cor-texto'), font: { size: 14 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  ONG.painel = {
    montar() {
      const lista = $('#lista-cadastros');
      const filtroTipo = $('#filtro-tipo');
      const busca = $('#busca-cadastro');
      const botaoLimpar = $('#limpar-cadastros');

      function renderizar() {
        const todos = ONG.storage.listarCadastros().slice().reverse(); // mais recentes primeiro
        const termo = normalizar(busca.value.trim());
        const visiveis = todos.filter((c) =>
          (!filtroTipo.value || c.participacao === filtroTipo.value) &&
          (!termo || normalizar(c.nome + ' ' + c.cidade).includes(termo)));

        $('#estatisticas').innerHTML = ONG.templates.estatisticas(todos);
        renderizarGrafico(todos);
        botaoLimpar.disabled = todos.length === 0;

        if (!todos.length) {
          lista.innerHTML = ONG.templates.estadoVazio('Nenhum cadastro ainda',
            'Os cadastros enviados pelo formulário aparecem aqui e ficam salvos mesmo se você fechar o navegador.',
            '<a class="botao botao--primario" href="#/cadastro">Fazer um cadastro</a>');
        } else if (!visiveis.length) {
          lista.innerHTML = ONG.templates.estadoVazio('Nenhum resultado', 'Nenhum cadastro corresponde aos filtros escolhidos.');
        } else {
          lista.innerHTML = visiveis.map(ONG.templates.itemCadastro).join('');
        }
        $('#contagem-cadastros').textContent = `Exibindo ${visiveis.length} de ${todos.length} cadastro(s).`;
      }

      // Delegação: um listener na lista trata os botões "Excluir" de todos os cartões
      lista.addEventListener('click', async (e) => {
        const botao = e.target.closest('[data-remover]');
        if (!botao) return;
        const nome = botao.closest('.cadastro-item').querySelector('h3').textContent;
        const ok = await ONG.modal.confirmar('Excluir cadastro', `Deseja excluir o cadastro de ${nome}? Esta ação não pode ser desfeita.`, 'Excluir');
        if (!ok) return;
        ONG.storage.removerCadastro(botao.dataset.remover);
        renderizar();
        ONG.toast.mostrar('Cadastro excluído.', 'info');
      });

      botaoLimpar.addEventListener('click', async () => {
        const ok = await ONG.modal.confirmar('Excluir todos', 'Todos os cadastros salvos neste navegador serão apagados.', 'Excluir todos');
        if (!ok) return;
        ONG.storage.limparCadastros();
        renderizar();
        ONG.toast.mostrar('Todos os cadastros foram excluídos.', 'info');
      });

      filtroTipo.addEventListener('change', renderizar);
      renderizarAtual = () => { if (document.body.contains(lista)) renderizar(); };
      busca.addEventListener('input', ONG.dom.debounce(renderizar, 200));

      renderizar();
    }
  };
})(window.ONG);
