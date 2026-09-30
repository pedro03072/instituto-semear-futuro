# Instituto Semear Futuro — Experiência Prática I (Desenvolvimento Front-end)

Plataforma web para uma ONG fictícia do terceiro setor, construída com **HTML5 semântico**, organizada em diretórios e com formulário de cadastro com **validações nativas** e **máscaras de entrada** (CPF, telefone e CEP).

## Estrutura de diretórios

```
projeto-ong/
├── index.html                 → atalho: redireciona para html/index.html
├── html/
│   └── index.html             → casca da SPA (cabeçalho, <main id="app">, rodapé, toast e modal)
├── css/                       → 01-variaveis … 06-aplicacao (ver Experiência II)
├── imagens/                   → logotipo e ilustração em SVG, PNG, WebP e JPG
└── js/
    ├── app.js                 → ponto de entrada: registra as rotas e inicia os componentes
    ├── core/
    │   ├── dom.js             → utilitários ($, $$, escapar, debounce, formatação)
    │   ├── storage.js         → acesso ao localStorage (cadastros e rascunho)
    │   └── router.js          → roteador por hash (#/rota), títulos, foco e menu ativo
    ├── lib/
    │   └── chart.umd.min.js   → biblioteca externa Chart.js 4.5.1 (cópia local, licença MIT)
    ├── data/
    │   └── projetos.js        → dados dos projetos, categorias e rótulos
    ├── components/
    │   ├── menu.js            → menu hambúrguer
    │   ├── modal.js           → modal reutilizável e confirmação (Promise)
    │   └── toast.js           → notificações temporárias
    ├── templates/             → funções que devolvem o HTML de cada vista
    │   ├── componentes.js     → cartão de projeto, campo de formulário, item de cadastro, estado vazio
    │   ├── inicio.js · projetos.js · cadastro.js · painel.js
    └── features/              → comportamento de cada área
        ├── mascaras.js        → máscaras de CPF, telefone e CEP
        ├── validacao.js       → validação com mensagens por campo
        ├── cep.js             → integração com a API ViaCEP (preenchimento automático)
        ├── inicio.js          → contadores animados
        ├── projetos.js        → filtro por categoria e busca
        ├── cadastro.js        → formulário: consistência, rascunho, envio
        └── painel.js          → listagem, filtros e exclusão de cadastros
```

## Experiência Prática III — JavaScript (SPA)

**Rotas:** `#/` início · `#/projetos` (filtros na URL: `?categoria=educacao&busca=horta`) · `#/projetos/:id` detalhe · `#/cadastro` (aceita `?projeto=id` e `?tipo=doador`) · `#/painel` · qualquer outra → página não encontrada.

**Navegação fluida:** o roteador troca apenas o conteúdo de `<main id="app">`, atualiza o `<title>`, marca o item do menu com `aria-current`, leva o foco ao `<h1>` (leitores de tela anunciam a nova página), volta ao topo e anima a entrada. Os botões voltar/avançar do navegador funcionam.

**Templates:** cada vista é uma função que recebe dados e devolve uma template string. A lista de projetos, os destaques da página inicial e o painel são gerados a partir de arrays; todo texto digitado pelo usuário passa por `escapar()` para evitar injeção de HTML (XSS).

**Validação e feedback:**
- mensagens específicas abaixo de cada campo (`aria-invalid` + `aria-describedby`), em tempo real ao sair do campo;
- regras próprias: dígitos verificadores do CPF, idade mínima de 16 anos, data no futuro;
- consistência entre campos: voluntário precisa de área e disponibilidade; doador precisa de valor ≥ R$ 10 e frequência;
- duplicidade: e-mail ou CPF já cadastrados são recusados;
- resumo de erros no topo com links que levam ao campo, e toast de erro ou sucesso.

**localStorage:** cadastros enviados (com CPF mascarado; a duplicidade é conferida por um hash) e rascunho do formulário, salvo automaticamente enquanto o usuário digita e recuperado ao voltar à página.

**Bibliotecas e serviços externos:**
- **Chart.js** (js/lib): gráfico de barras horizontais no Painel com a quantidade de cadastros por tipo de participação, com rótulos diretos, dica ao passar o mouse e uma tabela equivalente para leitores de tela. A cópia é local para funcionar sem internet; se a biblioteca não carregar, o painel funciona normalmente sem o gráfico.
- **ViaCEP** (API pública): ao completar o CEP, preenche endereço, cidade e UF. Tem tempo limite de 5 s e trata CEP inexistente e falta de conexão; nesses casos o usuário preenche manualmente.

**Como executar:** abra `index.html` (ou `html/index.html`) no navegador. Não precisa de servidor nem de instalação — os scripts usam um namespace global (`window.ONG`) carregado em ordem, em vez de ES Modules, que exigiriam um servidor.

## Experiência Prática II — CSS3

**Design system (01-variaveis.css)**
- Paleta: primária (5 tons), secundária (3 tons), neutras (7 tons) e cores de feedback (sucesso, erro, aviso, informação), com aliases semânticos (`--cor-texto`, `--cor-fundo`...).
- Tipografia: escala modular 1.25 com 7 tamanhos (`--texto-xs` a `--texto-2xl`, este fluido com `clamp()`), 3 pesos e alturas de linha.
- Espaçamento modular em base 8px: `--espaco-1` (4px) a `--espaco-9` (96px).
- Raios, sombras, transições e camadas (z-index) também como tokens.

**Layout**
- Grid de 12 colunas (`.grid` + `.col-*`) mobile-first, com variantes `sm`, `md`, `lg`, `xl` e `xxl`.
- Breakpoints: < 480px (padrão), ≥ 480px, ≥ 768px, ≥ 1024px, ≥ 1280px, ≥ 1536px.
- Grid para a estrutura macro (seções, formulário, rodapé); Flexbox para alinhamentos internos (cabeçalho, menu, botões, cartões, badges, alertas).

**Componentes (BEM)**: menu com hambúrguer e submenu dropdown, botões (4 variantes + estados hover/focus/active/disabled), cartões, badges, alertas, campos com estados de validação, toast e modal (`<dialog>` nativo).

**Acessibilidade**: foco visível, área de toque mínima de 44px, `aria-expanded` no menu, fechamento com Esc, `prefers-reduced-motion` e menu funcional mesmo sem JavaScript.

## HTML5 semântico e acessibilidade

- Estrutura com `header`, `nav`, `main`, `section`, `article`, `figure`/`figcaption`, `footer`, `address`, `time`, `blockquote`, `dl`.
- Um único `h1` por página e hierarquia de títulos sem saltos (`h1 → h2 → h3`).
- `lang="pt-BR"`, `meta description` (SEO) e `title` específico em cada página.
- Link "Pular para o conteúdo principal", `aria-current="page"` no menu, `aria-labelledby` nas seções.
- Todos os campos com `<label for>`; grupos em `<fieldset>` + `<legend>`; dicas ligadas por `aria-describedby`.
- Mensagem de envio anunciada por leitores de tela (`role="status"` + `aria-live`).

## Validações do formulário (`cadastro.html`)

| Campo | Validação nativa (HTML5) | Complemento em JS |
|---|---|---|
| Nome | `required`, `minlength`, `maxlength`, `pattern` (nome e sobrenome) | — |
| CPF | `required`, `pattern="^\d{3}\.\d{3}\.\d{3}-\d{2}$"` | máscara `000.000.000-00` + cálculo dos dígitos verificadores |
| Nascimento | `type="date"`, `required`, `min`/`max` | `max` recalculado para idade mínima de 16 anos |
| E-mail | `type="email"`, `required` | — |
| Telefone | `type="tel"`, `required`, `pattern` para celular e fixo | máscara `(00) 00000-0000` / `(00) 0000-0000` |
| CEP | `required`, `pattern="^\d{5}-\d{3}$"` | máscara `00000-000` |
| Número | `pattern` (número ou S/N) | — |
| UF / Participação / LGPD | `required` | — |
| Horas, valor da doação | `type="number"`, `min`, `max`, `step` | obrigatórios conforme o tipo de participação |

As máscaras apenas formatam a digitação; quem bloqueia o envio é sempre a validação nativa do navegador (`checkValidity` / `reportValidity` e `setCustomValidity`).

## Imagens otimizadas

Cada imagem existe em três formatos, servidos com `<picture>`: **SVG** (vetorial, nítido em qualquer tela e mais leve), **WebP** (compacto, para navegadores que não usam o SVG) e **PNG** (compatibilidade universal). O PNG é gerado em 2x para telas de alta densidade; a ilustração usa `loading="lazy"`, `width`/`height` definidos e `alt` descritivo, e o logotipo decorativo usa `alt=""`.

## Como executar

Abra `index.html` em qualquer navegador moderno. Não há dependências nem back-end: o envio do formulário é simulado.
