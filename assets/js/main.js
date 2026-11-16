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

  // Verdadeiro se o foco está em um campo de texto (ou num iframe), onde atalhos não devem agir.
  const isTyping = el => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|IFRAME)$/.test(el.tagName));
  window.LAVINA_IS_TYPING = isTyping;

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
    const closeMenu = () => {
      nav.classList.remove("open");
      btn && btn.setAttribute("aria-expanded", "false");
    };
    $$(".nav-links a", nav).forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape" && nav.classList.contains("open")) { closeMenu(); btn && btn.focus(); }
    });

    // link ativo conforme a seção visível (só links de texto; o botão CTA nunca fica "ativo")
    const links = $$('.nav-links a:not(.btn)', nav).filter(a => a.getAttribute("href").startsWith("#"));
    const map = new Map();
    links.forEach(a => {
      const sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) map.set(sec, a);
    });
    if (map.size) {
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const a = map.get(e.target); // undefined no hero / seções sem link → limpa
        links.forEach(l => l.classList.toggle("active", l === a));
      }), { rootMargin: "-45% 0px -50% 0px" });
      $$("main > section").forEach(s => io.observe(s));
    }
  }

  /* ---------- Reveal ---------- */
  // Depois da animação de entrada, remove as classes para não sobrescrever as transições de hover.
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      revealIO.unobserve(el);
      el.addEventListener("transitionend", function done(ev) {
        if (ev.target !== el) return;
        el.classList.remove("reveal", "in");
        el.removeEventListener("transitionend", done);
      });
    });
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
    const cards = $$(".card:not(.soon)", grid);
    const search = $("#exp-search");
    const searchBox = search && search.closest(".search");
    const clearBtn = $("#exp-search-clear");
    const empty = $("#exp-empty");
    const emptyMsg = $("#exp-empty-msg");
    const status = $("#exp-status");

    // Texto normalizado: minúsculo e sem acentos ("Elétrico" -> "eletrico").
    const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const haystacks = EXP.map(e => norm([e.title, e.summary, e.area, ...(e.concepts || [])].join(" ")));

    const areas = ["Todos", ...Object.keys(AREAS).filter(a => EXP.some(e => e.area === a))];
    filters.innerHTML = areas.map(a =>
      `<button class="chip" type="button" data-area="${esc(a)}" aria-pressed="${a === "Todos"}">${esc(a)}<span class="n" aria-hidden="true"></span><span class="sr-only"></span></button>`
    ).join("");
    const chips = $$(".chip", filters);

    let area = "Todos";
    let statusTimer;

    function apply() {
      const q = search ? search.value.trim() : "";
      const terms = norm(q).split(/\s+/).filter(Boolean);
      const hit = haystacks.map(h => terms.every(t => h.includes(t)));

      // contagem de cada área considerando a busca atual
      chips.forEach(c => {
        const a = c.dataset.area;
        const n = hit.filter((h, i) => h && (a === "Todos" || EXP[i].area === a)).length;
        $(".n", c).textContent = n;
        $(".sr-only", c).textContent = ` (${n} ${n === 1 ? "experimento" : "experimentos"})`;
        c.classList.toggle("zero", n === 0);
        c.setAttribute("aria-pressed", a === area);
      });

      let shown = 0;
      cards.forEach((c, i) => {
        const ok = hit[i] && (area === "Todos" || EXP[i].area === area);
        c.hidden = !ok;
        if (ok) shown++;
        c.classList.add("in");
      });

      // layout "bento" (card em destaque + card "em breve") só sem nenhum filtro
      const filtered = area !== "Todos" || terms.length > 0;
      grid.classList.toggle("all", !filtered);
      grid.hidden = shown === 0;
      if (empty) {
        empty.hidden = shown > 0;
        if (shown === 0) {
          const where = area !== "Todos" ? ` em <b>${esc(area)}</b>` : "";
          emptyMsg.innerHTML = q
            ? `Não encontramos nada para “<b>${esc(q)}</b>”${where}. Tente outro termo ou explore todas as áreas.`
            : `Ainda não há experimentos${where}.`;
        }
      }
      if (searchBox) searchBox.classList.toggle("has-value", q.length > 0);
      if (clearBtn) clearBtn.hidden = q.length === 0;

      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => {
        if (!status) return;
        status.textContent = !filtered ? "" : shown === 0
          ? "Nenhum experimento encontrado."
          : `${shown} ${shown === 1 ? "experimento encontrado" : "experimentos encontrados"}.`;
      }, 400);
    }

    function clearSearch() {
      if (search) search.value = "";
      apply();
    }

    filters.addEventListener("click", ev => {
      const b = ev.target.closest(".chip"); if (!b) return;
      area = b.dataset.area;
      apply();
    });

    if (search) {
      search.addEventListener("input", apply);
      search.addEventListener("keydown", ev => {
        if (ev.key !== "Escape") return;
        ev.preventDefault();
        if (search.value) clearSearch();
        else search.blur();
      });
    }
    if (clearBtn) clearBtn.addEventListener("click", () => { clearSearch(); search.focus(); });
    const reset = $("#exp-reset");
    if (reset) reset.addEventListener("click", () => {
      area = "Todos";
      clearSearch();
      (search || chips[0]).focus();
    });

    // "/" foca a busca quando não se está digitando em outro campo
    document.addEventListener("keydown", ev => {
      if (!search || ev.key !== "/" || ev.ctrlKey || ev.metaKey || ev.altKey || ev.defaultPrevented) return;
      if (isTyping(document.activeElement)) return;
      ev.preventDefault();
      const bar = $("#filter-bar");
      if (bar) bar.classList.add("in");
      const r = search.getBoundingClientRect();
      if (r.top < 90 || r.bottom > window.innerHeight) search.scrollIntoView({ block: "center" });
      search.focus({ preventScroll: true });
    });

    apply();
  }

  /* ---------- Lista do rodapé ---------- */
  const fl = $("#foot-exps");
  if (fl) fl.innerHTML = EXP.slice(0, 7).map(e => `<li><a href="experimento.html?id=${encodeURIComponent(e.id)}">${esc(e.title)}</a></li>`).join("");

  const n = $("#exp-count");
  if (n) n.textContent = EXP.length;
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
