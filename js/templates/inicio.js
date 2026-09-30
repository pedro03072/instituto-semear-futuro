/*
 * templates/inicio.js — vista da página inicial (#/).
 */
(function (ONG) {
  'use strict';

  ONG.templates.inicio = function () {
    const destaques = ONG.dados.projetos.slice(0, 3).map((p) => ONG.templates.cartaoProjeto(p)).join('');
    const totalCadastros = ONG.storage.listarCadastros().length;

    return `
      <section class="destaque" aria-labelledby="titulo-principal">
        <div class="container">
          <h1 id="titulo-principal">Semeando oportunidades, colhendo futuros</h1>
          <p>Desde 2012, o Instituto Semear Futuro apoia crianças, jovens e famílias em situação de vulnerabilidade social com educação, alimentação e inclusão digital.</p>
          <div class="destaque__acoes">
            <a class="botao" href="#/cadastro">Quero ajudar</a>
            <a class="botao botao--claro" href="#/projetos">Conheça nossos projetos</a>
          </div>
        </div>
      </section>

      <section class="secao" aria-labelledby="titulo-sobre">
        <div class="container">
          <div class="grid">
            <div class="col-12 col-md-6 alinhar-centro">
              <h2 id="titulo-sobre">Quem somos</h2>
              <p>Somos uma organização da sociedade civil sem fins lucrativos, formada por educadores, assistentes sociais e voluntários que acreditam que a transformação social começa na comunidade.</p>
              <p>Atuamos em bairros periféricos em parceria com escolas públicas, unidades de saúde e associações de moradores.</p>
              <ul class="lista-badges" aria-label="Áreas de atuação">
                ${ONG.dados.categorias.map((c) => `<li class="badge ${c.badge}">${c.nome}</li>`).join('')}
              </ul>
            </div>
            <figure class="figura col-12 col-md-6">
              <picture>
                <source srcset="../imagens/voluntarios.svg" type="image/svg+xml">
                <source srcset="../imagens/voluntarios.webp" type="image/webp">
                <img src="../imagens/voluntarios.png" width="480" height="300"
                     alt="Ilustração de três voluntários do Instituto em frente à horta comunitária, segurando uma cesta de alimentos.">
              </picture>
              <figcaption>Voluntários na horta comunitária do projeto Mesa Cheia.</figcaption>
            </figure>
          </div>

          <div class="grid mt-5">
            <article class="cartao col-12 col-md-4">
              <span class="cartao__icone" aria-hidden="true">🎯</span>
              <h3>Missão</h3>
              <p>Promover o desenvolvimento integral de crianças e famílias por meio da educação, da segurança alimentar e do acesso à tecnologia.</p>
            </article>
            <article class="cartao col-12 col-md-4">
              <span class="cartao__icone" aria-hidden="true">🔭</span>
              <h3>Visão</h3>
              <p>Ser referência regional em projetos sociais transparentes, com impacto mensurável e participação ativa da comunidade.</p>
            </article>
            <article class="cartao col-12 col-md-4">
              <span class="cartao__icone" aria-hidden="true">🤝</span>
              <h3>Valores</h3>
              <ul>
                <li>Transparência</li>
                <li>Respeito à diversidade</li>
                <li>Protagonismo comunitário</li>
                <li>Compromisso com resultados</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section class="secao secao--alternada" aria-labelledby="titulo-impacto">
        <div class="container">
          <h2 id="titulo-impacto" class="secao__titulo">Nosso impacto em números</h2>
          <dl class="grid mb-0">
            <div class="numero col-12 col-sm-6 col-lg-3"><dt>Crianças atendidas por ano</dt><dd data-contador="1250">1.250</dd></div>
            <div class="numero col-12 col-sm-6 col-lg-3"><dt>Cestas básicas distribuídas em 2025</dt><dd data-contador="8400">8.400</dd></div>
            <div class="numero col-12 col-sm-6 col-lg-3"><dt>Voluntários ativos</dt><dd data-contador="320">320</dd></div>
            <div class="numero col-12 col-sm-6 col-lg-3"><dt>Cadastros feitos neste navegador</dt><dd data-contador="${totalCadastros}">${totalCadastros}</dd></div>
          </dl>
        </div>
      </section>

      <section class="secao" aria-labelledby="titulo-destaques">
        <div class="container">
          <div class="flex flex-wrap entre itens-centro gap-4 secao__titulo">
            <h2 id="titulo-destaques" class="mb-0">Projetos em destaque</h2>
            <a class="botao botao--contorno botao--pequeno" href="#/projetos">Ver todos os projetos</a>
          </div>
          <div class="grid">${destaques}</div>
        </div>
      </section>

      <section class="secao secao--alternada" aria-labelledby="titulo-depoimentos">
        <div class="container">
          <h2 id="titulo-depoimentos" class="secao__titulo">Depoimentos</h2>
          <div class="grid">
            <blockquote class="depoimento col-12 col-md-6">
              <p>“Meu filho aprendeu a ler no reforço escolar do Instituto. Hoje ele sonha em ser professor.”</p>
              <footer>— Maria, mãe atendida pelo projeto Aprender Juntos</footer>
            </blockquote>
            <blockquote class="depoimento col-12 col-md-6">
              <p>“Ser voluntária aqui me mostrou que duas horas por semana podem mudar a vida de alguém.”</p>
              <footer>— Juliana, voluntária desde 2021</footer>
            </blockquote>
          </div>
        </div>
      </section>`;
  };
})(window.ONG);
