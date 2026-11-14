/* Comportamentos compartilhados: navegação, animações e renderização. */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const EXP = window.LAVINA_EXPERIMENTS || [];
  const AREAS = window.LAVINA_AREAS || {};

  const icon = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>'
  };
  window.LAVINA_ICON = icon;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  window.LAVINA_ESC = esc;

  /* ---------- Navegação ---------- */
  const nav = $(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const btn = $(".menu-btn", nav);
    btn && btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    $$(".nav-links a", nav).forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn && btn.setAttribute("aria-expanded", "false");
    }));

    // link ativo conforme a seção visível
    const links = $$('.nav-links a[href^="#"], .nav-links a[href*="index.html#"]', nav);
    const map = new Map();
    links.forEach(a => {
      const id = a.getAttribute("href").split("#")[1];
      const sec = id && document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    if (map.size) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            links.forEach(l => l.classList.remove("active"));
            map.get(e.target).classList.add("active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      map.forEach((_, sec) => io.observe(sec));
    }
  }

  /* ---------- Reveal ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  window.LAVINA_REVEAL = el => revealIO.observe(el);
  $$(".reveal").forEach(el => revealIO.observe(el));

  /* ---------- Card ---------- */
  function cardHTML(e, i) {
    return `
      <article class="card reveal${i === 0 ? " featured" : ""}" data-area="${esc(e.area)}" data-d="${i % 3}">
        <div class="card-media">
          <img src="${esc(e.thumb)}" alt="Prévia da simulação ${esc(e.title)}" loading="lazy" width="480" height="320">
          <span class="play">${icon.play}</span>
        </div>
        <div class="card-body">
          <span class="tag ${AREAS[e.area] || "c-cyan"}">${esc(e.area)}</span>
          <h3><a class="stretched" href="experimento.html?id=${encodeURIComponent(e.id)}">${esc(e.title)}</a></h3>
          <p>${esc(e.summary)}</p>
          <div class="card-foot"><span>Abrir experimento</span><span class="arrow">${icon.arrow}</span></div>
        </div>
      </article>`;
  }
  window.LAVINA_CARD = cardHTML;

  function attachGlow(root) {
    $$(".card", root).forEach(c => c.addEventListener("pointermove", ev => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      c.style.setProperty("--my", `${ev.clientY - r.top}px`);
    }));
  }
  window.LAVINA_GLOW = attachGlow;

  /* ---------- Grade de experimentos (home) ---------- */
  const grid = $("#exp-grid");
  if (grid) {
    const soon = `
      <article class="card soon reveal">
        <div class="soon-icon">${icon.sparkle}</div>
        <h3>Novos experimentos em breve</h3>
        <p>O LAVINA está em constante atualização. Termodinâmica, ondas e óptica estão no radar — fique de olho!</p>
      </article>`;
    grid.innerHTML = EXP.map(cardHTML).join("") + soon;
    $$(".reveal", grid).forEach(el => revealIO.observe(el));
    attachGlow(grid);

    const filters = $("#filters");
    const areas = ["Todos", ...Object.keys(AREAS).filter(a => EXP.some(e => e.area === a))];
    filters.innerHTML = areas.map(a => {
      const n = a === "Todos" ? EXP.length : EXP.filter(e => e.area === a).length;
      return `<button class="chip" type="button" data-area="${esc(a)}" aria-pressed="${a === "Todos"}">${esc(a)}<span class="n">${n}</span></button>`;
    }).join("");
    filters.addEventListener("click", ev => {
      const b = ev.target.closest(".chip"); if (!b) return;
      $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", c === b));
      const area = b.dataset.area;
      grid.classList.toggle("all", area === "Todos");
      $$(".card:not(.soon)", grid).forEach(c => {
        c.hidden = !(area === "Todos" || c.dataset.area === area);
        c.classList.add("in");
      });
    });
  }

  /* ---------- Lista do rodapé ---------- */
  const fl = $("#foot-exps");
  if (fl) fl.innerHTML = EXP.slice(0, 7).map(e => `<li><a href="experimento.html?id=${encodeURIComponent(e.id)}">${esc(e.title)}</a></li>`).join("");

  const n = $("#exp-count");
  if (n) n.textContent = EXP.length;
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
