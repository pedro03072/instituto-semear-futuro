/*
 * app.js — ponto de entrada da aplicação.
 * Registra as rotas (vista + comportamento) e inicia os componentes globais.
 */
(function (ONG) {
  'use strict';

  document.documentElement.classList.add('js');

  ONG.router
    .registrar('/', { titulo: 'Início', template: ONG.templates.inicio, montar: ONG.inicio.montar })
    .registrar('/projetos', { titulo: 'Projetos', template: ONG.templates.projetos, montar: ONG.projetos.montarLista })
    .registrar('/projetos/:id', {
      titulo: ({ params }) => (ONG.dados.buscarProjeto(params.id) || { titulo: 'Projeto não encontrado' }).titulo,
      template: ONG.templates.projetoDetalhe
    })
    .registrar('/cadastro', { titulo: 'Seja voluntário ou doador', template: ONG.templates.cadastro, montar: ONG.cadastro.montar })
    .registrar('/painel', { titulo: 'Painel de cadastros', template: ONG.templates.painel, montar: ONG.painel.montar })
    .naoEncontrada({ titulo: 'Página não encontrada', template: ONG.templates.naoEncontrado });

  ONG.tema.iniciar();
  ONG.menu.iniciar();
  ONG.modal.iniciar();
  ONG.router.iniciar(document.getElementById('app'));
})(window.ONG);
