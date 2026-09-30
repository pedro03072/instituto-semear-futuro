# Como contribuir

## Fluxo de trabalho (GitFlow)

O projeto usa **GitFlow**: `main` guarda apenas versões publicadas e `develop` recebe o trabalho em andamento.

**Nova funcionalidade ou correção comum**
```bash
git checkout develop && git pull
git checkout -b feature/nome-curto        # ou fix/, perf/, docs/, ci/
# ... commits semânticos ...
git push -u origin feature/nome-curto
```
Abra um **pull request para `develop`**. Depois da revisão, faça o merge com "Create a merge commit".

**Publicar uma versão**
```bash
git checkout develop && git pull
git checkout -b release/1.1.0
# atualizar a versão no package.json e o CHANGELOG.md
git commit -am "chore(release): versão 1.1.0"
```
Faça o PR de `release/1.1.0` para **`main`**. Após o merge, crie a tag e leve a release de volta para a `develop`:
```bash
git checkout main && git pull && git tag -a v1.1.0 -m "Versão 1.1.0" && git push origin v1.1.0
git checkout develop && git merge --no-ff release/1.1.0 && git push
```

**Correção urgente em produção**: crie `hotfix/1.1.1` a partir da `main`, corrija, e integre em `main` (com nova tag) e em `develop`.

## Commits semânticos

Formato: `tipo(escopo opcional): descrição no imperativo`
```
feat(cadastro): preenche endereço pelo CEP com a API ViaCEP
fix(a11y): aumenta contraste do badge secundário
perf: carrega o Chart.js sob demanda
docs: descreve o processo de deploy
chore(release): versão 1.0.0
```
Use o corpo do commit para explicar o **porquê** da mudança.

## Checklist do pull request

- [ ] `npm run build` executa sem erros
- [ ] Testado nas larguras de 375 px, 768 px e 1280 px
- [ ] Testado pelo teclado (Tab, Enter, Esc)
- [ ] Sem violações no axe DevTools / Lighthouse Acessibilidade 100
- [ ] HTML válido no [W3C Validator](https://validator.w3.org/)
- [ ] Sem erros no console do navegador
- [ ] README/CHANGELOG atualizados, se necessário

## Padrões de código

- **CSS:** use os tokens de `css/01-variaveis.css` (nada de cores soltas) e classes no padrão BEM (`bloco__elemento--modificador`).
- **JS:** um módulo por responsabilidade, publicado em `window.ONG`; templates não acessam o DOM nem o storage; texto digitado pelo usuário sempre passa por `ONG.dom.escapar()`.
- **Acessibilidade:** todo campo com `label`, todo botão com nome acessível, contraste mínimo de 4,5:1.
