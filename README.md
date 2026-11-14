# Projeto LAVINA — novo site (mockup)

Proposta de novo site para o **LAVINA — LAboratório Virtual INterAtivo**.

Site 100% estático (HTML + CSS + JavaScript puro), sem build e sem dependências.
Todos os caminhos são relativos, então funciona em qualquer hospedagem:
GitHub Pages, servidor do instituto (Apache/Nginx), Netlify, Vercel ou uma pasta local.

## Estrutura

```
index.html           página inicial
experimento.html     página de cada experimento (experimento.html?id=<id>)
404.html             página de erro
assets/css/style.css estilos
assets/js/data.js    catálogo de experimentos  ← edite aqui para adicionar/alterar
assets/js/main.js    navegação, animações e grade de experimentos
assets/js/field.js   campo elétrico interativo do topo
assets/js/experiment.js  lógica da página de experimento
assets/img/          logo e miniaturas
```

## Adicionar um experimento

Inclua um objeto em `assets/js/data.js` com `id`, `title`, `area`, `thumb`,
`url` (endereço da simulação), `summary`, `concepts` e `uses`.

## Rodar localmente

```
python3 -m http.server 8000
```

e abra http://localhost:8000.

## Publicar em outro lugar

Copie todos os arquivos para a raiz (ou subpasta) do servidor. Nada mais é necessário.
