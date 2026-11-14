/* Campo elétrico interativo do hero.
 * Cargas flutuam suavemente; o cursor do visitante também é uma carga.
 * Clique para inverter o sinal da carga do cursor. */
(function () {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, DPR = 1, spacing = 34, cols = 0, rows = 0;
  let t = 0, running = true, rafId = null;

  const charges = [
    { q: 1.0,  ax: 0.72, ay: 0.32, rx: 0.08, ry: 0.10, sx: 0.00021, sy: 0.00017, p: 0.0 },
    { q: -1.0, ax: 0.86, ay: 0.66, rx: 0.07, ry: 0.08, sx: 0.00016, sy: 0.00023, p: 1.7 },
    { q: 0.7,  ax: 0.50, ay: 0.80, rx: 0.10, ry: 0.06, sx: 0.00013, sy: 0.00019, p: 3.1 },
    { q: -0.6, ax: 0.38, ay: 0.20, rx: 0.06, ry: 0.07, sx: 0.00019, sy: 0.00014, p: 4.4 }
  ];
  const mouse = { x: -9999, y: -9999, q: 1.4, on: false, tx: -9999, ty: -9999 };

  function resize() {
    const r = canvas.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    spacing = W < 640 ? 28 : 34;
    cols = Math.ceil(W / spacing) + 1;
    rows = Math.ceil(H / spacing) + 1;
    if (reduce) draw();
  }

  function positions() {
    const list = charges.map(c => ({
      x: (c.ax + Math.sin(t * c.sx + c.p) * c.rx) * W,
      y: (c.ay + Math.cos(t * c.sy + c.p) * c.ry) * H,
      q: c.q
    }));
    if (mouse.on) list.push({ x: mouse.x, y: mouse.y, q: mouse.q });
    return list;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const ps = positions();
    const soft = 900;
    const maxLen = spacing * 0.78;

    ctx.lineCap = "round";
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing + (j % 2 ? spacing / 2 : 0);
        const y = j * spacing;
        let ex = 0, ey = 0;
        for (const p of ps) {
          const dx = x - p.x, dy = y - p.y;
          const r2 = dx * dx + dy * dy + soft;
          const inv = p.q / (r2 * Math.sqrt(r2));
          ex += dx * inv; ey += dy * inv;
        }
        const m = Math.hypot(ex, ey);
        if (m < 1e-12) continue;
        const s = Math.min(1, Math.log1p(m * 4e5) / 6.5);
        const len = 6 + s * (maxLen - 6);
        const ux = ex / m, uy = ey / m;
        const x0 = x - ux * len / 2, y0 = y - uy * len / 2;
        const x1 = x + ux * len / 2, y1 = y + uy * len / 2;

        // cor: ciano (fraco) -> branco-violeta (forte)
        const a = 0.12 + s * 0.6;
        const hue = 190 + s * 70;
        ctx.strokeStyle = `hsla(${hue}, 95%, ${62 + s * 18}%, ${a})`;
        ctx.lineWidth = 1 + s * 0.6;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        // ponta da seta
        const h = 3 + s * 2.5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - ux * h - uy * h * 0.6, y1 - uy * h + ux * h * 0.6);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - ux * h + uy * h * 0.6, y1 - uy * h - ux * h * 0.6);
        ctx.stroke();
      }
    }

    for (const p of ps) drawCharge(p.x, p.y, p.q);
  }

  function drawCharge(x, y, q) {
    const pos = q > 0;
    const r = 7 + Math.abs(q) * 5;
    const col = pos ? "251,113,133" : "96,165,250";
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    g.addColorStop(0, `rgba(${col},0.55)`);
    g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgb(${col})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x + r * 0.45, y);
    if (pos) { ctx.moveTo(x, y - r * 0.45); ctx.lineTo(x, y + r * 0.45); }
    ctx.stroke();
  }

  function loop(ts) {
    t = ts;
    mouse.x += (mouse.tx - mouse.x) * 0.18;
    mouse.y += (mouse.ty - mouse.y) * 0.18;
    draw();
    if (running) rafId = requestAnimationFrame(loop);
  }

  const host = canvas.closest(".hero") || canvas;
  host.addEventListener("pointermove", e => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    if (!mouse.on) { mouse.x = mouse.tx; mouse.y = mouse.ty; mouse.on = true; }
    if (reduce) { mouse.x = mouse.tx; mouse.y = mouse.ty; draw(); }
  });
  host.addEventListener("pointerleave", () => { mouse.on = false; if (reduce) draw(); });
  host.addEventListener("click", e => {
    if (e.target.closest("a, button")) return;
    mouse.q = -mouse.q;
    const badge = document.getElementById("charge-sign");
    if (badge) {
      badge.textContent = mouse.q > 0 ? "positiva (+)" : "negativa (−)";
      badge.dataset.sign = mouse.q > 0 ? "pos" : "neg";
    }
    if (reduce) draw();
  });

  // pausa quando o hero sai da tela
  new IntersectionObserver(([en]) => {
    if (reduce) return;
    if (en.isIntersecting && !running) { running = true; rafId = requestAnimationFrame(loop); }
    else if (!en.isIntersecting) { running = false; cancelAnimationFrame(rafId); }
  }).observe(canvas);

  window.addEventListener("resize", resize);
  resize();
  if (reduce) draw(); else rafId = requestAnimationFrame(loop);
})();
