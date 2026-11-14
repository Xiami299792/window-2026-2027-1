/** 「小惊喜」：按下 F12 之后，这一页会换一种形态。不读写存储、不碰 cookie。 */

type Cls = Record<string, string>;

const TARGET = '我看见你了';
const CW = 61;
const CH = 19;
const AR = 1.75;

interface Node {
  el: HTMLSpanElement;
  a: string[];
  eaten: boolean[];
  i: number;
}

interface EyeStyle {
  a: number;
  b: number;
  rx: number;
  ry: number;
  slit: boolean;
  lash: number;
  tilt: number;
  dark: boolean;
  shine: boolean;
  vein: Record<string, string>;
}

interface Eye {
  el: HTMLPreElement;
  s: EyeStyle;
  x: number;
  y: number;
  openAt: number;
  dur: number;
  phase: number;
  breath: number;
  last: number;
  nextBlink: number;
  blinkLeft: number;
  quick: number;
}

function esc(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function makeVeins(): Record<string, string> {
  const map: Record<string, string> = {};
  const n = Math.random() < 0.55 ? 3 : 1;
  for (let i = 0; i < n; i += 1) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const sx = (CW - 1) / 2 + side * (10 + Math.random() * 8);
    const sy = (CH - 1) / 2 + (Math.random() - 0.5) * 4;
    const len = 4 + Math.random() * 7;
    const dx = -side * 0.55;
    const dy = Math.random() < 0.5 ? -0.55 : 0.55;
    for (let t = 0; t < len; t += 0.5) {
      const px = Math.round(sx + dx * t);
      const py = Math.round(sy + dy * t);
      if (px < 0 || px >= CW || py < 0 || py >= CH) continue;
      map[`${px},${py}`] = dx < 0 ? '/' : '\\';
    }
  }
  return map;
}

function makeStyle(): EyeStyle {
  return {
    a: 21 + Math.random() * 7,
    b: 3.4 + Math.random() * 2.4,
    rx: 5.4 + Math.random() * 3.2,
    ry: 2.2 + Math.random() * 1.7,
    slit: Math.random() < 0.58,
    lash: Math.floor(Math.random() * 3),
    tilt: (Math.random() - 0.5) * 7,
    dark: Math.random() < 0.28,
    shine: Math.random() < 0.8,
    vein: makeVeins(),
  };
}

function art(open: number, ox: number, oy: number, s: EyeStyle): string {
  const cx = (CW - 1) / 2;
  const cy = (CH - 1) / 2;
  const rows: string[] = [];
  for (let y = 0; y < CH; y += 1) {
    let line = '';
    for (let x = 0; x < CW; x += 1) {
      const dx = (x - cx) / s.a;
      const dy = y - cy;
      if (Math.abs(dx) > 1.02) {
        let mark = ' ';
        if (s.lash > 0 && open > 0.35) {
          const lim = s.lash === 2 ? 1.34 : 1.2;
          if (Math.abs(dx) < lim && Math.abs(dy) < (s.lash === 2 ? 1.9 : 1.1)) {
            mark = dx < 0 ? '/' : '\\';
          }
        }
        line += mark;
        continue;
      }
      const base = Math.pow(Math.max(0, 1 - dx * dx), 0.62);
      const h = s.b * base * (0.04 + 0.96 * open);
      const outer = s.b * base * 1.45;
      let ch = ' ';
      if (Math.abs(dy) <= h) {
        const ex = x - cx - ox;
        const ey = (y - cy - oy) * AR;
        const q = (ex * ex) / (s.rx * s.rx) + (ey * ey) / (s.ry * s.ry);
        if (q < 1) {
          const isPupil = s.slit
            ? (ex * ex) / 1.5 + (ey * ey) / 12.5 < 1
            : ex * ex + ey * ey < 5.2;
          if (isPupil) ch = '<b>@</b>';
          else ch = s.dark ? '<em>o</em>' : '<i>o</i>';
          if (s.shine && ex < -2.6 && ey < -1.8) ch = '<u>&#39;</u>';
        } else {
          const q2 =
            (ex * ex) / ((s.rx + 2.2) * (s.rx + 2.2)) +
            (ey * ey) / ((s.ry + 2) * (s.ry + 2));
          if (q2 < 1) ch = '·';
          else if ((x * 7 + y * 5) % 5 === 0) ch = '.';
          const v = s.vein[`${x},${y}`];
          if (v && open > 0.5) ch = `<span class="v">${v}</span>`;
        }
        if (Math.abs(Math.abs(dy) - h) < 0.7) ch = '=';
      } else if (Math.abs(dy) <= h + 1.1) {
        if (Math.abs(dx) < 0.99) ch = '-';
      } else if (Math.abs(Math.abs(dy) - outer) < 0.6) {
        ch = x % 2 ? '.' : "'";
      }
      line += ch;
    }
    rows.push(line);
  }
  return rows.join('\n');
}

export function startHorror(article: HTMLElement, layer: HTMLDivElement, cls: Cls): () => void {
  let started = false;
  let armed = false;
  let disposed = false;
  let hits = 0;
  const timers: number[] = [];
  const nodes: Node[] = [];
  let eyes: Eye[] = [];
  let px = 0;
  let py = 0;
  let dirty = true;
  let tickTimer = 0;
  let t0 = 0;

  const render = (o: Node) => {
    let out = '';
    let cur = o.eaten[0];
    let start = 0;
    for (let i = 1; i <= o.a.length; i += 1) {
      if (i === o.a.length || o.eaten[i] !== cur) {
        const seg = esc(o.a.slice(start, i).join(''));
        out += cur ? `<em>${seg}</em>` : seg;
        if (i < o.a.length) {
          cur = o.eaten[i];
          start = i;
        }
      }
    }
    o.el.innerHTML = out;
  };

  const collect = () => {
    const walk = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    const list: Text[] = [];
    let n = walk.nextNode();
    while (n) {
      const t = n as Text;
      if (t.nodeValue && t.nodeValue.trim().length) list.push(t);
      n = walk.nextNode();
    }
    list.forEach((t) => {
      const span = document.createElement('span');
      span.className = cls.txt;
      span.textContent = t.nodeValue;
      t.parentNode?.replaceChild(span, t);
      const a = Array.from(t.nodeValue ?? '');
      nodes.push({ el: span, a, eaten: new Array(a.length).fill(false), i: 0 });
    });
  };

  const tick = () => {
    if (!t0) return;
    const t = performance.now() - t0;
    eyes.forEach((e) => {
      const dt = t - e.openAt;
      let open: number;
      if (dt <= 0) {
        open = 0.02;
      } else {
        const p = Math.min(1, dt / e.dur);
        open = 0.02 + 0.98 * (1 - Math.pow(1 - p, 3));
      }
      if (open > 0.9) {
        open = 0.97 + 0.03 * Math.sin((t / 1000) * e.breath + e.phase);
        if (e.quick && t > e.quick) {
          e.blinkLeft = 22;
          e.quick = 0;
          e.nextBlink = 6000 + Math.random() * 12000;
        }
        e.nextBlink -= 70;
        if (e.nextBlink <= 0) {
          e.blinkLeft = 24;
          e.nextBlink = 7000 + Math.random() * 12000;
          const veil = layer.querySelector(`.${cls.veil}`);
          if (veil && !veil.classList.contains(cls.veilOn)) {
            veil.classList.add(cls.veilOn);
            timers.push(window.setTimeout(() => veil.classList.remove(cls.veilOn), 110));
          }
        }
        if (e.blinkLeft > 0) {
          e.blinkLeft -= 1;
          const bp = 1 - Math.abs((e.blinkLeft - 12) / 12);
          open = Math.max(0.03, open * (1 - bp));
        }
      }
      const q = Math.round(open * 12) / 12;
      if (q !== e.last || dirty) {
        e.el.innerHTML = art(q, px, py, e.s);
        e.last = q;
        e.el.classList.toggle(cls.eyeOn, q >= 0.2);
      }
    });
    dirty = false;
  };

  const buildEyes = (instant: boolean) => {
    layer.innerHTML = '';
    eyes = [];
    const W = Math.max(document.documentElement.clientWidth, window.innerWidth);
    const H = Math.max(document.documentElement.clientHeight, window.innerHeight);
    const cols = Math.max(4, Math.round(W / 172));
    const cw = W / cols;
    const fsBase = Math.min(8.4, (cw * 0.96) / (CW * 0.55));
    const lhBase = fsBase * 1.04;
    const rowsN = Math.max(4, Math.round(H / (CH * lhBase * 0.78)));
    const chh = H / rowsN;

    const veil = document.createElement('div');
    veil.className = cls.veil;
    layer.appendChild(veil);

    for (let r = -1; r <= rowsN; r += 1) {
      const offset = r % 2 ? cw * 0.45 : 0;
      for (let c = -1; c <= cols; c += 1) {
        const s = makeStyle();
        const el = document.createElement('pre');
        el.className = cls.eye;
        const x = cw * (c + 0.5) + offset + (Math.random() - 0.5) * cw * 0.5;
        const y = chh * (r + 0.5) + (Math.random() - 0.5) * chh * 0.45;
        const scale = 0.84 + Math.random() * 0.34;
        el.style.left = `${x.toFixed(1)}px`;
        el.style.top = `${y.toFixed(1)}px`;
        el.style.fontSize = `${(fsBase * scale).toFixed(2)}px`;
        el.style.lineHeight = `${(lhBase * scale).toFixed(2)}px`;
        el.style.transform = `translate(-50%,-50%) rotate(${s.tilt.toFixed(1)}deg)`;
        el.innerHTML = art(0.02, 0, 0, s);
        layer.appendChild(el);
        eyes.push({
          el, s, x, y,
          openAt: 0,
          dur: 800 + Math.random() * 1000,
          phase: Math.random() * 6,
          breath: 0.5 + Math.random() * 0.7,
          last: -1,
          nextBlink: 5000 + Math.random() * 12000,
          blinkLeft: 0,
          quick: 0,
        });
      }
    }

    const ox = W * (0.28 + Math.random() * 0.44);
    const oy = H * (0.28 + Math.random() * 0.44);
    const maxD = Math.sqrt(
      Math.max(ox, W - ox) ** 2 + Math.max(oy, H - oy) ** 2,
    );
    eyes.forEach((e) => {
      const d = Math.sqrt((e.x - ox) ** 2 + (e.y - oy) ** 2) / maxD;
      e.openAt = instant ? 0 : 120 + Math.pow(d, 1.5) * 2200 + Math.random() * 260;
      if (Math.random() < 0.26) e.quick = e.openAt + e.dur + 60 + Math.random() * 160;
    });

    t0 = performance.now();
    if (instant) tick();
    else if (!tickTimer) tickTimer = window.setInterval(tick, 70);
  };

  const blackout = () => {
    layer.style.display = 'block';
    article.classList.add(cls.gone);
    window.setTimeout(() => { if (!disposed) buildEyes(false); }, 900);
  };

  const begin = () => {
    if (started) return;
    started = true;
    collect();
    article.classList.add(cls.melting);
    let total = 0;
    let done = 0;
    let k = 0;
    let tc = 0;
    nodes.forEach((o) => { total += o.a.length; });
    const timer = window.setInterval(() => {
      let budget = Math.min(120, Math.round(16 * Math.pow(1.0065, tc)));
      tc += 1;
      let guard = 0;
      while (budget > 0 && done < total && guard < 400) {
        guard += 1;
        const o = nodes[Math.floor(Math.random() * nodes.length)];
        if (o.i >= o.a.length) continue;
        const take = Math.min(budget, o.a.length - o.i, 9);
        for (let j = 0; j < take; j += 1) {
          o.a[o.i] = TARGET[k % 5];
          o.eaten[o.i] = true;
          o.i += 1;
          k += 1;
        }
        render(o);
        budget -= take;
        done += take;
      }
      if (done >= total) {
        window.clearInterval(timer);
        window.setTimeout(blackout, 600);
      }
    }, 18);
    timers.push(timer);
  };

  const inFrame = (() => {
    try { return window.top !== window.self; } catch { return true; }
  })();

  const docked = () => {
    if (inFrame) return false;
    const dx = (window.outerWidth || 0) - window.innerWidth;
    const dy = (window.outerHeight || 0) - window.innerHeight;
    return (dx > 150 && dx < 1200) || (dy > 150 && dy < 1200);
  };

  const watch = window.setInterval(() => {
    if (disposed || started) return;
    if (!armed) return;
    if (docked()) {
      hits += 1;
      if (hits > 2) begin();
    } else {
      hits = 0;
    }
  }, 500);
  timers.push(watch);
  timers.push(window.setTimeout(() => { armed = true; }, 1200));

  const probe = {} as { x?: number };
  Object.defineProperty(probe, 'x', {
    enumerable: true,
    get() {
      if (!inFrame && armed && !started) begin();
      return 1;
    },
  });
  console.log(probe);

  const onMove = (e: MouseEvent) => {
    px = Math.round((e.clientX / window.innerWidth - 0.5) * 9);
    py = Math.round((e.clientY / window.innerHeight - 0.5) * 4);
    dirty = true;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  let rsTimer = 0;
  const onResize = () => {
    window.clearTimeout(rsTimer);
    rsTimer = window.setTimeout(() => {
      if (!disposed && layer.style.display === 'block') buildEyes(true);
    }, 220);
  };
  window.addEventListener('resize', onResize);

  const onKey = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'Escape') window.location.reload();
  };
  window.addEventListener('keydown', onKey);

  return () => {
    disposed = true;
    timers.forEach((t) => window.clearTimeout(t));
    if (tickTimer) window.clearInterval(tickTimer);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onKey);
  };
}
