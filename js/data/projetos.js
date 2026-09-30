/*
 * data/projetos.js — dados dos projetos sociais.
 * As vistas são geradas a partir deste array: para incluir um projeto novo,
 * basta adicionar um objeto aqui (em uma aplicação real, viria de uma API).
 */
(function (ONG) {
  'use strict';

  ONG.dados = ONG.dados || {};

  ONG.dados.categorias = [
    { id: 'educacao', nome: 'Educação', badge: 'badge--primaria' },
    { id: 'alimentacao', nome: 'Alimentação', badge: 'badge--secundaria' },
    { id: 'tecnologia', nome: 'Tecnologia', badge: 'badge--info' }
  ];

  ONG.dados.projetos = [
    {
      id: 'aprender-juntos',
      titulo: 'Aprender Juntos',
      subtitulo: 'Reforço escolar',
      categoria: 'educacao',
      area: 'educacao',
      publico: '6 a 14 anos',
      resumo: 'Aulas de reforço em português e matemática no contraturno escolar, com acompanhamento pedagógico individual e oficinas de leitura.',
      detalhes: 'Cada turma tem no máximo 12 alunos e conta com um educador e dois voluntários. Os responsáveis recebem um boletim bimestral com a evolução das crianças.',
      onde: 'Sede do Instituto e duas escolas parceiras',
      quando: 'Segunda a quinta, 14h às 17h',
      resultado: '87% melhoraram as notas',
      vagasVoluntarios: 8
    },
    {
      id: 'mesa-cheia',
      titulo: 'Mesa Cheia',
      subtitulo: 'Segurança alimentar',
      categoria: 'alimentacao',
      area: 'alimentacao',
      publico: 'Famílias',
      resumo: 'Distribuição mensal de cestas básicas e hortaliças da horta comunitária, com oficinas de nutrição e aproveitamento de alimentos.',
      detalhes: 'As famílias são cadastradas junto ao CRAS do bairro. Voluntários ajudam na montagem das cestas, na horta e nas oficinas de culinária.',
      onde: 'Centro de distribuição do bairro',
      quando: 'Todo primeiro sábado do mês',
      resultado: '700 famílias por mês',
      vagasVoluntarios: 15
    },
    {
      id: 'conecta-jovem',
      titulo: 'Conecta Jovem',
      subtitulo: 'Inclusão digital',
      categoria: 'tecnologia',
      area: 'tecnologia',
      publico: '15 a 24 anos',
      resumo: 'Curso gratuito de informática básica, pacote de escritório e introdução à programação web, com orientação para o primeiro emprego.',
      detalhes: 'Turmas semestrais de 20 alunos no laboratório da sede. Voluntários atuam como monitores e em simulações de entrevista de emprego.',
      onde: 'Laboratório de informática da sede',
      quando: 'Turmas semestrais, noite e sábado',
      resultado: '42% empregados em 6 meses',
      vagasVoluntarios: 5
    },
    {
      id: 'leitura-na-praca',
      titulo: 'Leitura na Praça',
      subtitulo: 'Incentivo à leitura',
      categoria: 'educacao',
      area: 'educacao',
      publico: 'Todas as idades',
      resumo: 'Biblioteca itinerante e rodas de contação de histórias em praças do bairro, com empréstimo gratuito de livros.',
      detalhes: 'O acervo de 3 mil livros foi formado por doações. Voluntários organizam o empréstimo e conduzem as rodas de leitura.',
      onde: 'Praças do bairro (rodízio mensal)',
      quando: 'Domingos, 9h às 12h',
      resultado: '1.900 livros emprestados',
      vagasVoluntarios: 10
    }
  ];

  ONG.dados.buscarProjeto = function (id) {
    return ONG.dados.projetos.find((p) => p.id === id) || null;
  };

  ONG.dados.buscarCategoria = function (id) {
    return ONG.dados.categorias.find((c) => c.id === id) || { nome: id, badge: '' };
  };

  // Rótulos usados nos formulários e no painel
  ONG.dados.rotulos = {
    participacao: { voluntario: 'Voluntário', doador: 'Doador', ambos: 'Voluntário e doador' },
    areas: {
      educacao: 'Reforço escolar e leitura',
      alimentacao: 'Distribuição de alimentos',
      tecnologia: 'Aulas de informática',
      eventos: 'Eventos e campanhas',
      comunicacao: 'Comunicação e redes sociais'
    },
    frequencia: { unica: 'Doação única', mensal: 'Mensal', anual: 'Anual' },
    disponibilidade: { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite', 'fim-de-semana': 'Fins de semana' }
  };
})(window.ONG);
