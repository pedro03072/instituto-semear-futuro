/*
 * core/router.js — roteador da Single Page Application.
 * Usa o hash da URL (#/projetos, #/cadastro...) para trocar a "página"
 * sem recarregar o navegador. Cada rota tem um título, um template
 * (função que devolve HTML) e uma função "montar" que liga os eventos.
 */
(function (ONG) {
  'use strict';

  const rotas = [];
  let rotaNaoEncontrada = null;
  let saida = null; // elemento onde as vistas são renderizadas

  /** Converte "#/projetos/mesa-cheia?filtro=x" em { caminho, query } */
  function lerHash() {
    const hash = location.hash.slice(1) || '/';
    const [caminho, busca = ''] = hash.split('?');
    const query = Object.fromEntries(new URLSearchParams(busca));
    return { caminho: caminho || '/', query };
  }

  /** Compara "/projetos/:id" com "/projetos/mesa-cheia" e extrai parâmetros */
  function combinar(padrao, caminho) {
    const p = padrao.split('/').filter(Boolean);
    const c = caminho.split('/').filter(Boolean);
    if (p.length !== c.length) return null;
    const params = {};
    for (let i = 0; i < p.length; i++) {
      if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(c[i]);
      else if (p[i] !== c[i]) return null;
    }
    return params;
  }

  function atualizarMenu(caminho) {
    const secao = '/' + (caminho.split('/')[1] || '');
    ONG.dom.$$('[data-rota]').forEach((link) => {
      if (link.dataset.rota === secao) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function renderizar() {
    // Âncoras internas (#conteudo, #rodape-contato) não são rotas: o navegador rola sozinho
    if (location.hash && !location.hash.startsWith('#/')) return;

    const { caminho, query } = lerHash();
    let encontrada = null;
    let params = {};

    for (const rota of rotas) {
      const resultado = combinar(rota.caminho, caminho);
      if (resultado) { encontrada = rota; params = resultado; break; }
    }
    if (!encontrada) encontrada = rotaNaoEncontrada;

    const contexto = { params, query };
    const titulo = typeof encontrada.titulo === 'function' ? encontrada.titulo(contexto) : encontrada.titulo;

    // Renderiza o template e reinicia a animação de entrada
    saida.innerHTML = encontrada.template(contexto);
    saida.classList.remove('vista--entrando');
    void saida.offsetWidth; // força o navegador a reiniciar a animação CSS
    saida.classList.add('vista--entrando');

    document.title = titulo + ' | Instituto Semear Futuro';
    atualizarMenu(caminho);
    window.scrollTo(0, 0);

    // Acessibilidade: leva o foco ao título da nova vista (leitores de tela anunciam a troca)
    const h1 = ONG.dom.$('h1', saida);
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }

    if (typeof encontrada.montar === 'function') encontrada.montar(contexto);

    document.dispatchEvent(new CustomEvent('rota:alterada', { detail: { caminho, params, query } }));
  }

  ONG.router = {
    registrar(caminho, config) {
      rotas.push({ caminho, ...config });
      return this;
    },
    naoEncontrada(config) {
      rotaNaoEncontrada = config;
      return this;
    },
    ir(destino) {
      if (location.hash === destino) renderizar();
      else location.hash = destino;
    },
    iniciar(elementoSaida) {
      saida = elementoSaida;
      window.addEventListener('hashchange', renderizar);
      renderizar();
    }
  };
})(window.ONG);
