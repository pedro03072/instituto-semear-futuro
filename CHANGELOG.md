# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Modo escuro e modo de alto contraste, com preferência salva e respeito a `prefers-color-scheme`.
- Build de produção com esbuild (`npm run build`): CSS e JS minificados e unificados.
- Deploy automático no GitHub Pages via GitHub Actions.
- Documentação: README completo, relatório de acessibilidade, guia de contribuição e este changelog.

### Corrigido
- Contraste do badge secundário (2,94:1 → 5,36:1).
- O foco inicial não pula mais o link "Pular para o conteúdo" e o menu.
- O submenu passou a ser sempre acessível pelo teclado.
- Sem rolagem horizontal em 320 px (textos longos e tabela oculta do painel).

### Desempenho
- Minificação de HTML (html-minifier-terser) e otimização de SVG (SVGO) no build.
- PNGs convertidos para paleta de 64 cores (imagens: 38,4 KB → 20,5 KB).
- Chart.js carregado sob demanda, apenas no Painel.
- Altura reservada para a área principal: CLS de 0,83 → 0,07.

## [0.3.0] · Experiência Prática III — JavaScript
- SPA com roteador por hash, templates em JavaScript e código modular.
- Validação com feedback por campo, resumo de erros e regras de consistência.
- Persistência de cadastros e rascunho no localStorage; painel de cadastros.
- Integração com Chart.js e com a API ViaCEP.

## [0.2.0] · Experiência Prática II — CSS3
- Design System com variáveis, grid de 12 colunas, Flexbox e 5 breakpoints.
- Menu com submenu e hambúrguer; cartões, badges, alertas, toast e modal.

## [0.1.0] · Experiência Prática I — HTML5
- Páginas semânticas (início, projetos e cadastro) e formulário com validação nativa e máscaras.
