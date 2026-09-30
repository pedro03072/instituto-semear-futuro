/*
 * templates/painel.js — vista do painel de cadastros salvos no localStorage (#/painel).
 */
(function (ONG) {
  'use strict';

  ONG.templates.painel = function () {
    return `
      <section class="destaque destaque--compacto" aria-labelledby="titulo-painel">
        <div class="container">
          <h1 id="titulo-painel">Painel de cadastros</h1>
          <p>Cadastros enviados por este navegador, armazenados localmente com localStorage.</p>
        </div>
      </section>

      <section class="secao" aria-labelledby="titulo-resumo">
        <div class="container">
          <h2 id="titulo-resumo" class="sr-only">Resumo</h2>
          <dl class="grid mb-5" id="estatisticas"></dl>

          <figure class="cartao grafico mb-5" id="grafico-bloco" hidden>
            <figcaption>
              <h2 id="titulo-grafico" class="mb-0">Cadastros por tipo de participação</h2>
              <span class="texto-suave texto-sm">Gráfico gerado com a biblioteca Chart.js</span>
            </figcaption>
            <div class="grafico__area">
              <canvas id="grafico-participacao" role="img" aria-labelledby="titulo-grafico" aria-describedby="tabela-grafico"></canvas>
            </div>
            <table class="sr-only" id="tabela-grafico">
              <caption>Quantidade de cadastros por tipo de participação</caption>
              <thead><tr><th scope="col">Tipo</th><th scope="col">Cadastros</th></tr></thead>
              <tbody></tbody>
            </table>
          </figure>

          <div class="barra-filtros">
            <div class="campo">
              <label for="filtro-tipo">Tipo de participação</label>
              <select id="filtro-tipo">
                <option value="">Todos</option>
                <option value="voluntario">Voluntários</option>
                <option value="doador">Doadores</option>
                <option value="ambos">Voluntários e doadores</option>
              </select>
            </div>
            <div class="campo barra-filtros__busca">
              <label for="busca-cadastro">Buscar por nome ou cidade</label>
              <input type="search" id="busca-cadastro" placeholder="Digite para filtrar">
            </div>
            <button type="button" class="botao botao--perigo alinhar-fim" id="limpar-cadastros">Excluir todos</button>
          </div>
          <p class="texto-suave texto-sm" id="contagem-cadastros" role="status" aria-live="polite"></p>

          <div class="grid" id="lista-cadastros"></div>
        </div>
      </section>`;
  };

  ONG.templates.estatisticas = function (cadastros) {
    const voluntarios = cadastros.filter((c) => c.participacao !== 'doador').length;
    const doadores = cadastros.filter((c) => c.participacao !== 'voluntario');
    const mensal = doadores.filter((c) => c.frequencia === 'mensal').reduce((soma, c) => soma + Number(c.valor || 0), 0);

    const item = (rotulo, valor) =>
      `<div class="numero col-12 col-sm-6 col-lg-3"><dt>${rotulo}</dt><dd>${valor}</dd></div>`;

    return item('Total de cadastros', cadastros.length) +
      item('Voluntários', voluntarios) +
      item('Doadores', doadores.length) +
      item('Doações mensais previstas', ONG.dom.formatarMoeda(mensal));
  };
})(window.ONG);
