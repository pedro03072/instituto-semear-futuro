/*
 * templates/componentes.js — pequenos templates reutilizados por várias vistas.
 * Cada template é uma função pura: recebe dados e devolve uma string HTML
 * (template literal). Dados digitados pelo usuário SEMPRE passam por escapar().
 */
(function (ONG) {
  'use strict';

  ONG.templates = ONG.templates || {};
  const esc = (t) => ONG.dom.escapar(t);

  ONG.templates.badgeCategoria = function (idCategoria) {
    const cat = ONG.dados.buscarCategoria(idCategoria);
    return `<span class="badge ${cat.badge}">${esc(cat.nome)}</span>`;
  };

  ONG.templates.cartaoProjeto = function (p, classesColuna = 'col-12 col-md-6 col-lg-4') {
    return `
      <article class="cartao ${classesColuna}">
        <header class="projeto__cabecalho">
          <h3>${esc(p.titulo)}</h3>
          ${ONG.templates.badgeCategoria(p.categoria)}
        </header>
        <p class="texto-suave texto-sm mb-0">${esc(p.subtitulo)} · ${esc(p.publico)}</p>
        <p>${esc(p.resumo)}</p>
        <ul class="projeto__info">
          <li><strong>Onde:</strong> ${esc(p.onde)}</li>
          <li><strong>Quando:</strong> ${esc(p.quando)}</li>
        </ul>
        <div class="cartao__rodape">
          <span class="badge badge--sucesso">${esc(p.resultado)}</span>
          <a class="botao botao--contorno botao--pequeno" href="#/projetos/${encodeURIComponent(p.id)}">
            Ver detalhes<span class="sr-only"> de ${esc(p.titulo)}</span>
          </a>
        </div>
      </article>`;
  };

  ONG.templates.estadoVazio = function (titulo, texto, acaoHTML = '') {
    return `
      <div class="vazio col-12">
        <span class="vazio__icone" aria-hidden="true">🌱</span>
        <h3>${esc(titulo)}</h3>
        <p>${esc(texto)}</p>
        ${acaoHTML}
      </div>`;
  };

  /** Campo de formulário padronizado: label + input + dica + área de erro */
  ONG.templates.campo = function ({ id, rotulo, obrigatorio = false, dica = '', colunas = 'col-12', atributos = '', tipo = 'text' }) {
    const descritores = [dica ? id + '-dica' : '', id + '-erro'].filter(Boolean).join(' ');
    return `
      <div class="campo ${colunas}">
        <label for="${id}">${rotulo}${obrigatorio ? ' <abbr title="obrigatório" class="obrigatorio">*</abbr>' : ''}</label>
        <input type="${tipo}" id="${id}" name="${id}" ${obrigatorio ? 'required' : ''} ${atributos}
               aria-describedby="${descritores}">
        ${dica ? `<small id="${id}-dica" class="dica">${dica}</small>` : ''}
        <p class="erro-campo" id="${id}-erro"></p>
      </div>`;
  };

  ONG.templates.itemCadastro = function (c) {
    const r = ONG.dados.rotulos;
    const tipo = r.participacao[c.participacao] || c.participacao;
    const ehVoluntario = c.participacao !== 'doador';
    const ehDoador = c.participacao !== 'voluntario';
    const classeTipo = c.participacao === 'doador' ? 'badge--secundaria' : c.participacao === 'ambos' ? 'badge--info' : 'badge--primaria';

    return `
      <article class="cartao cadastro-item col-12 col-md-6 col-xl-4" data-id="${esc(c.id)}">
        <header class="projeto__cabecalho">
          <h3>${esc(c.nome)}</h3>
          <span class="badge ${classeTipo}">${esc(tipo)}</span>
        </header>
        <p class="texto-suave texto-sm mb-0">Cadastrado em ${ONG.dom.formatarData(c.criadoEm)}</p>
        <ul class="projeto__info">
          <li><strong>E-mail:</strong> ${esc(c.email)}</li>
          <li><strong>Telefone:</strong> ${esc(c.telefone)}</li>
          <li><strong>Cidade:</strong> ${esc(c.cidade)} — ${esc(c.uf)}</li>
          <li><strong>CPF:</strong> ${esc(c.cpfMascarado)}</li>
          ${ehVoluntario ? `<li><strong>Áreas:</strong> ${esc((c.areas || []).map((a) => r.areas[a] || a).join(', '))}</li>
          <li><strong>Disponibilidade:</strong> ${esc(r.disponibilidade[c.disponibilidade] || '—')}${c.horas ? ` · ${esc(c.horas)}h/semana` : ''}</li>` : ''}
          ${ehDoador ? `<li><strong>Doação:</strong> ${ONG.dom.formatarMoeda(c.valor)} · ${esc(r.frequencia[c.frequencia] || '')}</li>` : ''}
        </ul>
        <div class="cartao__rodape">
          <button type="button" class="botao botao--perigo botao--pequeno" data-remover="${esc(c.id)}">
            Excluir<span class="sr-only"> cadastro de ${esc(c.nome)}</span>
          </button>
        </div>
      </article>`;
  };
})(window.ONG);
