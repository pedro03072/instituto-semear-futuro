/*
 * templates/projetos.js — vistas da lista de projetos (#/projetos)
 * e do detalhe de um projeto (#/projetos/:id).
 */
(function (ONG) {
  'use strict';

  const esc = (t) => ONG.dom.escapar(t);

  ONG.templates.projetos = function ({ query }) {
    const ativa = query.categoria || 'todos';
    const botoes = [{ id: 'todos', nome: 'Todos' }, ...ONG.dados.categorias]
      .map((c) => `<button type="button" class="filtro" data-categoria="${c.id}" aria-pressed="${c.id === ativa}">${esc(c.nome)}</button>`)
      .join('');

    return `
      <section class="destaque destaque--compacto" aria-labelledby="titulo-projetos">
        <div class="container">
          <h1 id="titulo-projetos">Nossos projetos sociais</h1>
          <p>Iniciativas contínuas, construídas com a comunidade e acompanhadas por indicadores de resultado.</p>
        </div>
      </section>

      <section class="secao" aria-labelledby="titulo-lista">
        <div class="container">
          <h2 id="titulo-lista" class="secao__titulo">Projetos em andamento</h2>

          <div class="barra-filtros">
            <div class="filtros" role="group" aria-label="Filtrar projetos por categoria">${botoes}</div>
            <div class="campo barra-filtros__busca">
              <label for="busca-projeto">Buscar projeto</label>
              <input type="search" id="busca-projeto" placeholder="Ex.: leitura, horta, informática" value="${esc(query.busca || '')}">
            </div>
          </div>
          <p class="texto-suave texto-sm" id="contagem-projetos" role="status" aria-live="polite"></p>

          <div class="grid" id="lista-projetos"></div>
        </div>
      </section>

      <section id="como-ajudar" class="secao secao--alternada" aria-labelledby="titulo-ajudar">
        <div class="container">
          <h2 id="titulo-ajudar" class="secao__titulo">Como você pode ajudar</h2>
          <div class="grid">
            <article class="cartao col-12 col-md-4">
              <span class="cartao__icone" aria-hidden="true">🙋</span>
              <h3>Seja voluntário</h3>
              <p>Doe seu tempo como educador, cozinheiro, instrutor de informática ou apoio em eventos.</p>
              <div class="cartao__rodape"><a class="botao botao--primario" href="#/cadastro">Cadastrar-me</a></div>
            </article>
            <article class="cartao col-12 col-md-4">
              <span class="cartao__icone" aria-hidden="true">💚</span>
              <h3>Faça uma doação</h3>
              <p>Contribuições mensais ou pontuais mantêm os projetos funcionando o ano inteiro.</p>
              <div class="cartao__rodape">
                <a class="botao" href="#/cadastro?tipo=doador">Quero doar</a>
                <button class="botao botao--contorno" type="button" id="abrir-como-doar">Como funciona?</button>
              </div>
            </article>
            <article class="cartao col-12 col-md-4">
              <span class="cartao__icone" aria-hidden="true">🥫</span>
              <h3>Doe alimentos</h3>
              <p>Entregue alimentos não perecíveis na sede, de segunda a sexta, das 8h às 18h.</p>
              <div class="cartao__rodape"><a class="botao botao--contorno" href="#rodape-contato">Ver endereço</a></div>
            </article>
          </div>
        </div>
      </section>`;
  };

  ONG.templates.comoDoar = function () {
    return `
      <ol>
        <li>Preencha o cadastro escolhendo a opção <strong>Doador</strong>.</li>
        <li>Informe o valor (a partir de R$ 10,00) e a frequência: única, mensal ou anual.</li>
        <li>Nossa equipe envia os dados de pagamento por e-mail em até 2 dias úteis.</li>
        <li>Você recebe o relatório anual mostrando onde cada real foi aplicado.</li>
      </ol>
      <a class="botao botao--primario" href="#/cadastro?tipo=doador">Ir para o cadastro</a>`;
  };

  ONG.templates.projetoDetalhe = function ({ params }) {
    const p = ONG.dados.buscarProjeto(params.id);
    if (!p) return ONG.templates.naoEncontrado();

    const outros = ONG.dados.projetos.filter((o) => o.id !== p.id).slice(0, 3)
      .map((o) => ONG.templates.cartaoProjeto(o)).join('');

    return `
      <section class="destaque destaque--compacto" aria-labelledby="titulo-projeto">
        <div class="container">
          <nav class="trilha" aria-label="Você está em">
            <ol>
              <li><a href="#/">Início</a></li>
              <li><a href="#/projetos">Projetos</a></li>
              <li aria-current="page">${esc(p.titulo)}</li>
            </ol>
          </nav>
          <h1 id="titulo-projeto">${esc(p.titulo)}</h1>
          <p>${esc(p.subtitulo)} · ${esc(p.publico)}</p>
        </div>
      </section>

      <div class="secao">
        <div class="container grid">
          <section class="col-12 col-lg-8" aria-labelledby="titulo-sobre-projeto">
            <h2 id="titulo-sobre-projeto">Sobre o projeto</h2>
            <ul class="lista-badges mb-5">
              <li>${ONG.templates.badgeCategoria(p.categoria)}</li>
              <li><span class="badge badge--sucesso">${esc(p.resultado)}</span></li>
            </ul>
            <p>${esc(p.resumo)}</p>
            <p>${esc(p.detalhes)}</p>
            <dl class="ficha">
              <div><dt>Onde</dt><dd>${esc(p.onde)}</dd></div>
              <div><dt>Quando</dt><dd>${esc(p.quando)}</dd></div>
              <div><dt>Público</dt><dd>${esc(p.publico)}</dd></div>
            </dl>
          </section>

          <aside class="col-12 col-lg-4 alinhar-topo" aria-labelledby="titulo-participe">
            <div class="cartao">
              <h2 id="titulo-participe" class="mb-0">Participe</h2>
              <p><strong>${p.vagasVoluntarios}</strong> vagas abertas para voluntários neste projeto.</p>
              <a class="botao botao--primario" href="#/cadastro?projeto=${encodeURIComponent(p.id)}">Quero ser voluntário</a>
              <a class="botao botao--contorno" href="#/cadastro?tipo=doador">Apoiar com doação</a>
            </div>
          </aside>
        </div>
      </div>

      <section class="secao secao--alternada" aria-labelledby="titulo-outros">
        <div class="container">
          <h2 id="titulo-outros" class="secao__titulo">Conheça outros projetos</h2>
          <div class="grid">${outros}</div>
        </div>
      </section>`;
  };

  ONG.templates.naoEncontrado = function () {
    return `
      <section class="secao" aria-labelledby="titulo-404">
        <div class="container texto-centro">
          <h1 id="titulo-404">Página não encontrada</h1>
          <p>O endereço acessado não existe ou foi removido.</p>
          <a class="botao botao--primario" href="#/">Voltar para o início</a>
        </div>
      </section>`;
  };
})(window.ONG);
