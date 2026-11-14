/* Página de detalhe de um experimento: experimento.html?id=<id> */
(function () {
  const EXP = window.LAVINA_EXPERIMENTS || [];
  const AREAS = window.LAVINA_AREAS || {};
  const esc = window.LAVINA_ESC;
  const root = document.getElementById("exp-root");
  const id = new URLSearchParams(location.search).get("id");
  const idx = EXP.findIndex(e => e.id === id);

  const svg = {
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    reload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M10 14 21 3M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/></svg>',
    atom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>'
  };

  if (idx < 0) {
    document.title = "Experimento não encontrado — Projeto LAVINA";
    root.innerHTML = `
      <section class="container not-found">
        <span class="eyebrow">Erro 404</span>
        <h1 style="margin-top:20px">Experimento não encontrado</h1>
        <p>Talvez ele tenha mudado de lugar. Que tal escolher outro?</p>
        <a class="btn btn-primary" href="index.html#experimentos">Ver todos os experimentos</a>
      </section>`;
    renderMore(-1);
    return;
  }

  const e = EXP[idx];
  const prev = EXP[(idx - 1 + EXP.length) % EXP.length];
  const next = EXP[(idx + 1) % EXP.length];
  document.title = `${e.title} — Projeto LAVINA`;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", e.summary);

  root.innerHTML = `
    <section class="exp-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Você está em">
          <a href="index.html">Início</a>${svg.chev}
          <a href="index.html#experimentos">Experimentos</a>${svg.chev}
          <span aria-current="page">${esc(e.title)}</span>
        </nav>
        <span class="tag ${AREAS[e.area] || "c-cyan"}" style="margin-top:28px">${esc(e.area)}</span>
        <h1 class="exp-title" style="margin-top:14px">${esc(e.title)}</h1>
        <p class="exp-summary">${esc(e.summary)}</p>
      </div>
    </section>

    <section class="container" id="sim">
      <div class="player">
        <div class="player-bar">
          <div class="dots" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="url" title="${esc(e.url)}">${esc(e.url.replace(/^https?:\/\//, ""))}</div>
          <div class="tools">
            <button class="icon-btn" type="button" id="btn-reload" aria-label="Reiniciar simulação" title="Reiniciar">${svg.reload}</button>
            <button class="icon-btn" type="button" id="btn-full" aria-label="Tela cheia" title="Tela cheia">${svg.full}</button>
            <a class="icon-btn" href="${esc(e.url)}" target="_blank" rel="noopener" aria-label="Abrir em nova aba" title="Abrir em nova aba">${svg.ext}</a>
          </div>
        </div>
        <div class="frame-wrap" id="frame-wrap">
          <div class="loading"><div><div class="spinner"></div>Carregando simulação…</div></div>
          <iframe id="frame" src="${esc(e.url)}" title="Simulação: ${esc(e.title)}" allow="fullscreen" allowfullscreen loading="eager"></iframe>
        </div>
      </div>
      <a class="btn btn-primary mobile-open" href="${esc(e.url)}" target="_blank" rel="noopener">Abrir simulação em tela cheia ${svg.ext}</a>

      <div class="exp-layout">
        <div class="panel reveal">
          <h2>${svg.bulb} Sugestões de uso</h2>
          <ol class="uses">${e.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ol>
        </div>
        <div class="panel reveal" data-d="1">
          <h2>${svg.atom} Conceitos envolvidos</h2>
          <div class="concepts">${e.concepts.map(c => `<span>${esc(c)}</span>`).join("")}</div>
          <dl class="meta">
            <div><dt>Área</dt><dd>${esc(e.area)}</dd></div>
            <div><dt>Plataforma</dt><dd>Navegador · desktop e tablet</dd></div>
            <div><dt>Custo</dt><dd>Gratuito</dd></div>
          </dl>
        </div>
      </div>

      <nav class="pager" aria-label="Navegar entre experimentos">
        <a href="experimento.html?id=${encodeURIComponent(prev.id)}"><small>← Anterior</small><strong>${esc(prev.title)}</strong></a>
        <a class="next" href="experimento.html?id=${encodeURIComponent(next.id)}"><small>Próximo →</small><strong>${esc(next.title)}</strong></a>
      </nav>
    </section>`;

  root.querySelectorAll(".reveal").forEach(el => window.LAVINA_REVEAL(el));

  const frame = document.getElementById("frame");
  const wrap = document.getElementById("frame-wrap");
  frame.addEventListener("load", () => wrap.classList.add("loaded"));
  setTimeout(() => wrap.classList.add("loaded"), 6000);
  document.getElementById("btn-reload").addEventListener("click", () => {
    wrap.classList.remove("loaded");
    frame.src = e.url;
  });
  document.getElementById("btn-full").addEventListener("click", () => {
    const el = wrap;
    (el.requestFullscreen || el.webkitRequestFullscreen || (() => window.open(e.url, "_blank"))).call(el);
  });

  renderMore(idx);

  function renderMore(skip) {
    const grid = document.getElementById("more-grid");
    const others = EXP.filter((_, i) => i !== skip);
    const pick = skip < 0 ? others.slice(0, 3) : [1, 2, 3].map(k => EXP[(skip + k) % EXP.length]);
    grid.innerHTML = pick.map((x, i) => window.LAVINA_CARD(x, i + 1)).join("");
    grid.querySelectorAll(".reveal").forEach(el => window.LAVINA_REVEAL(el));
    window.LAVINA_GLOW(grid);
  }
})();
