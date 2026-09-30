/*
 * features/projetos.js — filtro por categoria e busca na lista de projetos.
 * O estado do filtro fica na URL (#/projetos?categoria=educacao), então
 * o link pode ser compartilhado e o botão "voltar" do navegador funciona.
 */
(function (ONG) {
  'use strict';

  function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function filtrar(categoria, busca) {
    const termo = normalizar(busca.trim());
    return ONG.dados.projetos.filter((p) => {
      const naCategoria = categoria === 'todos' || p.categoria === categoria;
      const texto = normalizar([p.titulo, p.subtitulo, p.resumo, p.detalhes].join(' '));
      return naCategoria && (!termo || texto.includes(termo));
    });
  }

  ONG.projetos = {
    montarLista({ query }) {
      const estado = { categoria: query.categoria || 'todos', busca: query.busca || '' };
      const lista = ONG.dom.$('#lista-projetos');
      const contagem = ONG.dom.$('#contagem-projetos');
      const campoBusca = ONG.dom.$('#busca-projeto');

      function renderizarLista() {
        const resultado = filtrar(estado.categoria, estado.busca);
        lista.innerHTML = resultado.length
          ? resultado.map((p) => ONG.templates.cartaoProjeto(p)).join('')
          : ONG.templates.estadoVazio('Nenhum projeto encontrado', 'Tente outra palavra ou escolha outra categoria.');
        contagem.textContent = resultado.length === 1 ? '1 projeto encontrado.' : resultado.length + ' projetos encontrados.';

        ONG.dom.$$('.filtro').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.categoria === estado.categoria)));

        // guarda o filtro na URL sem disparar nova renderização da rota
        const params = new URLSearchParams();
        if (estado.categoria !== 'todos') params.set('categoria', estado.categoria);
        if (estado.busca) params.set('busca', estado.busca);
        const novo = '#/projetos' + (params.toString() ? '?' + params : '');
        if (location.hash !== novo) history.replaceState(null, '', novo);
      }

      // Delegação de eventos: um único listener para todos os botões de filtro
      ONG.dom.$('.filtros').addEventListener('click', (e) => {
        const botao = e.target.closest('.filtro');
        if (!botao) return;
        estado.categoria = botao.dataset.categoria;
        renderizarLista();
      });

      campoBusca.addEventListener('input', ONG.dom.debounce(() => {
        estado.busca = campoBusca.value;
        renderizarLista();
      }, 250));

      ONG.dom.$('#abrir-como-doar').addEventListener('click', () => {
        ONG.modal.abrir({ titulo: 'Como funciona a doação', conteudo: ONG.templates.comoDoar() });
      });

      renderizarLista();
    }
  };
})(window.ONG);
