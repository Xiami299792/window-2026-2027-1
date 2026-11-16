/** 版面装饰：报头、把「一、」染朱、卷末「终」、插图逐笔入场。
 *  全部是版式行为，不改动正文任何字；卸载时把自己加的东西全部撤掉。 */

type Cls = Record<string, string>;

export function decorate(page: HTMLElement, cls: Cls): () => void {
  const added: Node[] = [];
  const fig = page.querySelectorAll('figure');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add(cls.in);
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
  );

  // 报头
  const head = document.createElement('div');
  head.className = cls.masthead;
  head.setAttribute('data-nohorror', '');
  head.innerHTML = '<span><strong>科协之窗</strong></span><span>2026-2027 学年第 1 期</span>';
  page.insertBefore(head, page.firstChild);
  added.push(head);

  // 「一、」染朱：把标题开头那个原有的序号包一层，不加字
  page.querySelectorAll('h2').forEach((h) => {
    const text = h.textContent ?? '';
    const m = /^([一二三四五六七八九十]+、)/.exec(text);
    if (!m) return;
    const span = document.createElement('span');
    span.className = cls.cn;
    span.setAttribute('data-nohorror', '');
    span.textContent = m[1];
    h.textContent = text.slice(m[1].length);
    h.insertBefore(span, h.firstChild);
  });

  // 卷末「终」
  const body = page.querySelector('[data-body]') ?? page;
  const end = document.createElement('p');
  end.className = cls.end;
  end.setAttribute('data-nohorror', '');
  end.textContent = '终';
  body.appendChild(end);
  added.push(end);

  // 插图：观察 + 首屏立即入场
  fig.forEach((f) => {
    io.observe(f);
    if (f.getBoundingClientRect().top < window.innerHeight * 0.9) f.classList.add(cls.in);
  });

  // 逐笔自绘的样式：用真实的哈希类名拼，避免污染主站
  const style = document.createElement('style');
  style.setAttribute('data-nohorror', '');
  const f = '.' + cls.fig;
  const on = f + '.' + cls.in;
  style.textContent = [
    `${f} .dr{stroke-dasharray:1;stroke-dashoffset:1}`,
    `${f} .df,${f} .nd{opacity:0}`,
    `${on} .dr{animation:figDraw .9s ease-out forwards;animation-delay:var(--d,0s)}`,
    `${on} .df,${on} .nd{animation:figUp .6s ease-out forwards;animation-delay:var(--d,0s)}`,
    `${on} .pulse{animation:figDraw .9s ease-out forwards var(--d,0s),figPulse 3.6s ease-in-out 1.8s infinite}`,
    '@keyframes figDraw{to{stroke-dashoffset:0}}',
    '@keyframes figUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}',
    '@keyframes figPulse{0%,100%{opacity:1}50%{opacity:.4}}',
    '@media (prefers-reduced-motion:reduce){',
    `  ${f} .dr{stroke-dashoffset:0}`,
    `  ${f} .df,${f} .nd{opacity:1}`,
    `  ${on} .dr,${on} .df,${on} .nd,${on} .pulse{animation:none}`,
    '}',
  ].join('\n');
  document.head.appendChild(style);
  added.push(style);

  return () => {
    io.disconnect();
    added.forEach((n) => n.parentNode?.removeChild(n));
    fig.forEach((f2) => f2.classList.remove(cls.in));
  };
}
