# Instituto Semear Futuro — Experiência Prática I (Desenvolvimento Front-end)

Plataforma web para uma ONG fictícia do terceiro setor, construída com **HTML5 semântico**, organizada em diretórios e com formulário de cadastro com **validações nativas** e **máscaras de entrada** (CPF, telefone e CEP).

## Estrutura de diretórios

```
projeto-ong/
├── index.html      → página inicial: quem somos, missão/visão/valores, impacto, transparência, depoimentos
├── projetos.html   → iniciativas solidárias e formas de ajudar
├── cadastro.html   → formulário de voluntários e doadores
├── css/
│   ├── style.css            → arquivo principal (importa as camadas abaixo, em ordem)
│   ├── 01-variaveis.css     → design system: cores, tipografia, espaçamentos, sombras
│   ├── 02-base.css          → reset e estilos globais dos elementos
│   ├── 03-layout.css        → container, grid de 12 colunas, breakpoints, cabeçalho e rodapé
│   ├── 04-componentes.css   → menu, botões, cartões, badges, alertas, formulário, toast, modal
│   └── 05-utilitarios.css   → classes de ajuste pontual
├── js/
│   ├── menu.js     → menu hambúrguer e abertura do modal
│   └── mascaras.js → máscaras de entrada, validações complementares e toast
└── img/
    ├── logo.svg / logo.png / logo.webp                  → logotipo e favicon
    └── voluntarios.svg / voluntarios.png / voluntarios.webp → ilustração da página inicial
```

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
