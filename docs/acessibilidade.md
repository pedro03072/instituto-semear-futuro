# Relatório de acessibilidade — WCAG 2.1 nível AA

**Projeto:** Instituto Semear Futuro · **Data:** 30/09/2026 · **Autor:** Pedro Henrique Barcante Santana

## Metodologia

| Ferramenta / método | Escopo |
|---|---|
| **axe-core 4.13** (automatizado) | 6 telas (início, projetos, detalhe, cadastro com erros, painel, 404) × 3 temas (claro, escuro, alto contraste) = 18 auditorias; regras `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `best-practice` |
| **Lighthouse 12** | Versão de produção (`dist/`) |
| **Teste de teclado** | Navegação completa apenas com Tab, Shift+Tab, Enter e Esc |
| **Cálculo de contraste** | Fórmula de luminância relativa da WCAG para todos os pares de cor dos 3 temas |
| **W3C Nu HTML Checker** | HTML e CSS, inclusive o HTML gerado por cada tela da SPA |

## Problemas encontrados e corrigidos

| # | Critério WCAG | Problema | Correção |
|---|---|---|---|
| 1 | 1.4.3 Contraste (mínimo) | Badge "Alimentação" com texto #b8861b sobre #fdf3d8: **2,94:1** (mínimo 4,5:1) | Token `--cor-secundaria-700` alterado para #8a5a00: **5,36:1** |
| 2 | 2.4.3 Ordem do foco / 2.4.1 Ignorar blocos | Ao abrir o site, o roteador levava o foco ao `<h1>`, e o primeiro Tab pulava o link "Pular para o conteúdo" e o menu | O foco no título passou a ocorrer só nas trocas de tela, não no carregamento inicial |
| 3 | 2.1.1 Teclado | Com Tab rápido, os itens do submenu "Projetos" eram pulados, porque a transição de `visibility` atrasava a exibição | A visibilidade passou a mudar instantaneamente no `:focus-within`; só a opacidade é animada |
| 4 | 1.3.1 Informações e relações / 4.1.2 Nome, função, valor | Elementos com `hidden` e `display: flex` (gráfico, resumo de erros) continuavam visíveis e vazios | Regra global `[hidden] { display: none !important; }` |
| 5 | 1.4.10 Reflow | Em 320 px, o Painel tinha rolagem horizontal: e-mails longos não quebravam linha, e a tabela oculta do gráfico (`sr-only`) ultrapassava a tela | `overflow-wrap` nos cartões e a tabela envolvida em um `div.sr-only` |
| 6 | 1.4.3 / 1.4.11 | Não havia alternativa para quem precisa de mais contraste ou de fundo escuro | Modo escuro e alto contraste (preto, branco e amarelo), salvos no localStorage |

Resultado final: **0 violações** nas 18 auditorias do axe-core e **Acessibilidade 100** no Lighthouse.

## Checklist WCAG 2.1 AA aplicado

**Perceptível**
- [x] 1.1.1 Imagens com `alt` descritivo; imagens decorativas com `alt=""`; ícones com `aria-hidden`.
- [x] 1.3.1 Landmarks (`header`, `nav`, `main`, `footer`), títulos em ordem, `fieldset`/`legend`, `label` em todos os campos, tabelas com `th scope`.
- [x] 1.3.5 `autocomplete` nos dados pessoais (nome, e-mail, telefone, CEP, endereço).
- [x] 1.4.1 Informação não depende só da cor: erros têm ícone ⚠ e texto; badges têm rótulo.
- [x] 1.4.3 Contraste ≥ 4,5:1 nos três temas (texto principal: 14,9:1 claro, 15,2:1 escuro, 21:1 alto contraste).
- [x] 1.4.4 / 1.4.10 Texto em `rem`, sem rolagem horizontal até 320 px de largura.
- [x] 1.4.11 Bordas de campos e foco visíveis contra o fundo.
- [x] 1.4.13 O submenu aparece com foco e hover e fecha com Esc.

**Operável**
- [x] 2.1.1 Tudo funciona pelo teclado (menu, submenu, filtros, formulário, modal, exclusão).
- [x] 2.1.2 Sem armadilha de foco: o `<dialog>` nativo fecha com Esc e devolve o foco ao botão.
- [x] 2.4.1 Link "Pular para o conteúdo principal".
- [x] 2.4.2 `<title>` atualizado a cada tela.
- [x] 2.4.3 Ordem de foco lógica e foco movido para o título ao trocar de tela.
- [x] 2.4.4 Links com texto claro ("Ver detalhes de Mesa Cheia", com complemento `sr-only`).
- [x] 2.4.7 Foco visível (contorno de 3 px amarelo, ciano no alto contraste).
- [x] 2.5.5 Áreas de toque de pelo menos 44 × 44 px em botões e campos.

**Compreensível**
- [x] 3.1.1 `lang="pt-BR"`.
- [x] 3.2.3 Navegação consistente em todas as telas.
- [x] 3.3.1 Erros identificados em texto, abaixo do campo, e no resumo do topo.
- [x] 3.3.2 Rótulos, dicas de formato e marcação de campos obrigatórios.
- [x] 3.3.3 Mensagens com sugestão de correção ("Use (00) 00000-0000…").
- [x] 3.3.4 Confirmação antes de excluir cadastros.

**Robusto**
- [x] 4.1.1 HTML válido no W3C, inclusive o gerado pelos templates.
- [x] 4.1.2 `aria-expanded`, `aria-pressed`, `aria-current`, `aria-invalid` e `role="img"` no gráfico, com tabela equivalente.
- [x] 4.1.3 Mensagens de status com `role="status"`/`aria-live` (toast, contagem de resultados, busca de CEP).

## Como repetir a auditoria

1. Instale a extensão **axe DevTools** ou use o **Lighthouse** (DevTools → Lighthouse → Accessibility).
2. Rode em cada tela e em cada tema (botões ☾ e ◐ no menu).
3. Navegue só com o teclado, verificando se todo elemento interativo recebe foco visível.
