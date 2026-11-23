/* eslint-disable */
/**
 * F12 实训解密的引擎（十六关）。纯 JS：类型声明在 lab-engine.d.ts。
 * 与主站规则的差异：进度只存在本次会话的内存里，不写 localStorage；
 * 关卡间导航用内部状态，不改动地址栏。
 */

let sessionSnapshot = null;

export function mountLab(root) {
  let state = 'home';

  

  /* ==================== 工具函数：防剧透哈希与安全存储 ==================== */
  
  const DEFAULT_PROG = { el: 0, cn: 0, so: 0, ne: 0 };

  function norm(s) {
    return String(s || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function digest(str) {
    const s = 'f12lab::2026::' + norm(str);
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) {
      const ch = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
  }

  function nowStamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  let prog = Object.assign({}, DEFAULT_PROG);
  function loadProg() {
    try {
      const raw = sessionSnapshot ? JSON.stringify(sessionSnapshot) : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      ['el', 'cn', 'so', 'ne'].forEach((k) => {
        if (typeof parsed[k] === 'number' && parsed[k] >= 0 && parsed[k] <= 4) {
          prog[k] = parsed[k];
        }
      });
    } catch (_) {}
  }
  function saveProg() {
    try {
      sessionSnapshot = JSON.parse(JSON.stringify(prog));
    } catch (_) {}
  }

  /* ==================== 入口卡内联矢量装饰图 ==================== */
  const PORTAL_ART = {
    el: `<svg class="portal-art" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="14" y="14" width="92" height="92" stroke-dasharray="4 3"/>
      <rect x="30" y="30" width="60" height="24"/>
      <rect x="30" y="64" width="26" height="26"/>
      <rect x="64" y="64" width="26" height="26"/>
      <path d="M60 54v10M43 59h34M43 59v5M77 59v5"/>
    </svg>`,
    cn: `<svg class="portal-art" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="14" y="20" width="92" height="80" rx="6"/>
      <path d="M14 36h92M32 54l16 12-16 12M56 78h28"/>
    </svg>`,
    so: `<svg class="portal-art" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.6">
      <circle cx="30" cy="34" r="6" fill="currentColor"/>
      <path d="M44 34h52M30 56h66M30 74h48M30 92h58"/>
      <circle cx="30" cy="74" r="4"/>
      <path d="M30 40v30" stroke-dasharray="3 3"/>
    </svg>`,
    ne: `<svg class="portal-art" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M10 74h22l10-34 14 52 12-30 10 12h32"/>
      <circle cx="42" cy="40" r="3.5" fill="currentColor"/>
      <circle cx="68" cy="62" r="3.5" fill="currentColor"/>
      <line x1="10" y1="98" x2="110" y2="98" stroke-dasharray="4 4"/>
    </svg>`
  };

  /* ==================== 生命周期清理池 ==================== */
  let timers = [];
  let blobUrls = [];
  let injectedScripts = [];
  let cleanups = [];
  const origBtoa = window.btoa.bind(window);

  function trackTimer(id) { timers.push(id); return id; }
  function makeBlobUrl(content, mime) {
    const u = URL.createObjectURL(new Blob([content], { type: mime }));
    blobUrls.push(u);
    return u;
  }
  function injectVirtualScript(code, virtualPath) {
    const full = code + '\n//# sourceURL=' + virtualPath;
    const url = makeBlobUrl(full, 'text/javascript');
    const sc = document.createElement('script');
    sc.src = url;
    document.body.appendChild(sc);
    injectedScripts.push(sc);
    return sc;
  }
  function clearStageResources() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
    cleanups.forEach((fn) => { try { fn(); } catch (_) {} });
    cleanups = [];
    injectedScripts.forEach((sc) => { if (sc.parentNode) sc.parentNode.removeChild(sc); });
    injectedScripts = [];
    blobUrls.forEach((u) => { try { URL.revokeObjectURL(u); } catch (_) {} });
    blobUrls = [];
    window.btoa = origBtoa;
    delete window.__courseLab;
    delete window.__so1Ready;
    delete window.__so2Check;
    delete window.__so3Trigger;
    delete window.__so4Run;
    delete window.requestVault;
    delete window.submit;
  }

  /* ==================== 四大关 · 十六关配置 ==================== */
  const MAJORS = [
    {
      id: 'el',
      no: 'SECTION 01',
      name: '骨架拆解',
      panel: 'Elements · 元素面板',
      blurb: '拆开网页的外壳，看清被藏起来的节点、被盖住的样式和动态长出来的 DOM。',
      subs: [
        {
          id: 'el1',
          code: 'FIG.01',
          title: '会员弹窗挡住了答案',
          task: '下面这份校园文档被登录遮罩盖住了，页面还拦截了右键菜单。打开 Elements 面板，把遮罩层挪开，读出底下的口令。',
          placeholder: 'EL-MASK-...',
          hashes: ['f030f87531fd2084'],
          hints: [
            '右键被拦住时，直接按 F12（或 Ctrl+Shift+I）打开开发者工具，再按 Ctrl+Shift+C 启用元素选择器。',
            '把鼠标点在深色遮罩上，Elements 会定位到 id="el1-vip-mask" 的 div。',
            '选中该节点按 Delete 键删除，或在右侧 Styles 里加上 display: none。'
          ],
          debrief: '删掉遮罩层只改动了你本地浏览器里的 DOM 树，刷新页面它就会恢复原样。纯前端弹窗遮罩拦不住开发者工具，真正受保护的内容必须由服务端鉴权后再下发。',
          build(stage) {
            stage.innerHTML = `
              <div class="paper-box" id="el1-paper">
                <h3>2026 秋季实训存档</h3>
                <p>检索状态：正文已随页面下发至本地。</p>
                <p>归档口令：<strong class="mono">EL-MASK-01</strong></p>
                <div class="vip-mask" id="el1-vip-mask">
                  <span class="vip-badge">VIP ONLY</span>
                  <div style="font-weight:600">开通会员后查看全文</div>
                  <div style="font-size:12px;opacity:.7">（此区域已禁用右键菜单）</div>
                </div>
              </div>
              <div class="vip-toast" id="el1-toast"></div>
            `;
            const box = stage.querySelector('#el1-paper');
            const toast = stage.querySelector('#el1-toast');
            box.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              toast.textContent = '右键菜单已被拦截。试试直接按 F12 或 Ctrl+Shift+C。';
            });
          }
        },
        {
          id: 'el2',
          code: 'FIG.02',
          title: '星号后面的密码',
          task: '旧版系统已经把口令填进了密码框，但它用星号遮住了内容，提交按钮也被置灰。在 Elements 里改写节点属性，读出里面的明文。',
          placeholder: 'EL-PASS-...',
          hashes: ['e34fd1a0b56d003e'],
          hints: [
            '用元素选择器选中带着星号的输入框，观察它的 HTML 标签属性。',
            '输入框的 type="password" 决定了浏览器把它显示成圆点或星号。',
            '双击 type="password"，把 password 改成 text 回车，明文就会直接显示出来。'
          ],
          debrief: 'password 只是浏览器渲染层的视觉遮挡，并不对输入框里的字符串加密。顺手删掉按钮上的 disabled 属性还能解除置灰状态，这就是客户端限制不能替代服务端校验的原因。',
          build(stage) {
            stage.innerHTML = `
              <div class="legacy-form">
                <label>归档账号</label>
                <input type="text" value="ruixin_2026" readonly>
                <label>预置口令</label>
                <input id="el2-pwd" type="password" value="EL-PASS-4821" readonly>
                <button type="button" id="el2-btn" disabled>读取校验</button>
                <div id="el2-out" style="margin-top:10px;font-size:12.5px;color:#0f766e"></div>
              </div>
            `;
            const btn = stage.querySelector('#el2-btn');
            const out = stage.querySelector('#el2-out');
            const pwd = stage.querySelector('#el2-pwd');
            btn.addEventListener('click', () => {
              out.textContent = '按钮已解锁，当前框内值：' + pwd.value;
            });
          }
        },
        {
          id: 'el3',
          code: 'FIG.03',
          title: '层叠覆盖的真相',
          task: '下面这段标本文字同时命中了三条 CSS 颜色规则。用 Elements 查出最终生效的颜色值（十六进制或 rgb 格式均可提交）。',
          placeholder: '#xxxxxx 或 rgb(...)',
          hashes: ['d6dd4d0a68862179', '35bfdcfbd1e586e1', '91bf55b94593d3a7'],
          hints: [
            '选中标本文字，看右侧 Styles 面板里被画上删除线的规则，那表示它们在优先级比拼中输掉了。',
            '也可以直接切换到 Computed（已计算）面板，搜索 color 看浏览器最终采用的值。',
            '带 !important 的规则压过了 ID 选择器，结果是 #22ff66（或 rgb(34, 255, 102)）。'
          ],
          debrief: 'Styles 面板按选择器权重从高到低排列，被划掉的规则没有生效；Computed 面板则直接给出浏览器渲染后的最终计算值，排查样式冲突时两者配合最省力。',
          build(stage) {
            stage.innerHTML = `
              <style>
                #el3-specimen { color: #3b82f6; }
                .el3-rule { color: #22ff66 !important; }
                p.el3-rule { color: #e11d48; }
              </style>
              <div class="swatch-card">
                <p id="el3-specimen" class="el3-rule" style="margin:0;font-size:17px;font-weight:600">
                  这一行标本文字最终生效的 color 是什么？
                </p>
              </div>
            `;
          }
        },
        {
          id: 'el4',
          code: 'FIG.04',
          title: '源代码里找不到的标价',
          task: '校园二手书架加载完成后，脚本会动态写入一条实时价签节点，内部折扣码藏在它的属性里。初始网页源代码（Ctrl+U）看不到它，用 Elements 找到它。',
          placeholder: 'EL-DOM-...',
          hashes: ['66298314305f8d9c'],
          hints: [
            'Ctrl+U 看到的是服务器最初发来的静态文本，而脚本运行后改动的节点只会出现在 Elements 面板的实时 DOM 树里。',
            '等下方卡片变成“现价 ¥18.00”后，用 Ctrl+Shift+C 点击这行字。',
            '观察该节点上的 data-coupon 属性，里面就是口令。'
          ],
          debrief: '网页源代码是静态起点，Elements 里看到的才是经过 JavaScript 动态修改后的实时 DOM。现代单页应用里，很多价格、列表和按钮都是在运行时才写进 DOM 的。',
          build(stage) {
            stage.innerHTML = `
              <!-- 静态注释：真正折扣码由运行时脚本写入，不保存在初始源码里 -->
              <div class="price-card" id="el4-card">
                <div style="font-size:13px;color:#64748b">《计算机网络自顶向下方法》（二手）</div>
                <div id="el4-slot" style="margin-top:8px;color:#475569">正在向本地 DOM 写入实时价签...</div>
              </div>
            `;
            trackTimer(setTimeout(() => {
              const slot = stage.querySelector('#el4-slot');
              if (!slot) return;
              const live = document.createElement('div');
              live.className = 'price-tag';
              live.setAttribute('data-coupon', 'EL-DOM-907');
              live.textContent = '现价 ¥18.00';
              const sub = document.createElement('div');
              sub.style.cssText = 'font-size:12px;color:#475569;font-weight:400';
              sub.textContent = '提示：折扣码已写入本节点属性。';
              slot.textContent = '';
              slot.appendChild(live);
              slot.appendChild(sub);
            }, 900));
          }
        }
      ]
    },
    {
      id: 'cn',
      no: 'SECTION 02',
      name: '现场对话',
      panel: 'Console · 控制台',
      blurb: '绕过灰掉的按钮，直接和页面里的脚本、变量与嵌套窗口对话。',
      subs: [
        {
          id: 'cn1',
          code: 'CMD.01',
          title: '点不动的抢课按钮',
          task: '通识课补选按钮被禁用了，剩余额度也变成了 0。但底层对象 __courseLab 还挂在 window 上。在 Console 里把额度改到至少 3，再调用它的 claim() 拿到口令。',
          placeholder: 'CN-QUOTA-...',
          hashes: ['b5cc3dcb5d63608a'],
          hints: [
            '打开 Console，直接输入 __courseLab 回车，查看它包含的属性和方法。',
            '输入 __courseLab.quota = 5 回车，把额度改大。',
            '接着输入 __courseLab.claim() 回车，返回值就是口令（也可以直接在这里执行 submit("口令") 交卷）。'
          ],
          debrief: 'Console 与当前页面共享同一个 JavaScript 运行环境。凡是挂在全局对象上的状态和函数，都可以被直接读写与调用。',
          build(stage) {
            const code = String.fromCharCode(67,78,45,81,85,79,84,65,45,51,48,53);
            window.__courseLab = {
              quota: 0,
              note: 'quota 至少为 3 时，调用 claim() 可领取口令',
              claim() {
                if (Number(this.quota) >= 3) return code;
                return '剩余额度不足（当前 ' + this.quota + '，至少需要 3）';
              }
            };
            stage.innerHTML = `
              <div>当前剩余补选额度：<strong id="cn1-q" style="color:#ffb347">0</strong></div>
              <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
                <button class="stage-btn" id="cn1-btn" disabled>提交补选（已锁定）</button>
                <button class="stage-btn" id="cn1-sync">刷新页面显示</button>
              </div>
              <div class="stage-out" id="cn1-out"></div>
            `;
            const qEl = stage.querySelector('#cn1-q');
            const out = stage.querySelector('#cn1-out');
            stage.querySelector('#cn1-sync').addEventListener('click', () => {
              qEl.textContent = String(window.__courseLab.quota);
              out.textContent = '当前 __courseLab.claim() -> ' + window.__courseLab.claim();
            });
          }
        },
        {
          id: 'cn2',
          code: 'CMD.02',
          title: '六十条通知里的暗号',
          task: '下面混排了 60 条校园通知，其中 5 条带着隐蔽标记 data-urgent="true"，它们各自的 data-frag 拼起来就是口令。别一条条肉眼翻，在 Console 用 querySelectorAll 一行提取。',
          placeholder: 'CN-DOM-...',
          hashes: ['8438a3d8ac5b7cd8'],
          hints: [
            '在 Console 里可以用 document.querySelectorAll() 按 CSS 选择器批量抓取节点。',
            '试试 document.querySelectorAll("#cn2-list [data-urgent=\'true\']")，看看选出了哪 5 条。',
            '用 [...document.querySelectorAll("#cn2-list [data-urgent=\'true\']")].map(el => el.dataset.frag).join("") 直接拼出结果。'
          ],
          debrief: '面对几十上百条重复结构的数据，Console 配合 querySelectorAll 和数组方法，两三行就能完成筛选与汇总，比手工复制准确得多。',
          build(stage) {
            const titles = [
              '关于本周实验室安全巡检的通知', '图书馆自习室预约系统例行维护',
              '秋季学期体育课体质测试时间安排', '校园网核心机房凌晨割接公告',
              '创新创业项目结题材料提交说明', '教学楼多媒体设备报修流程更新'
            ];
            const picks = { 7: 'CN', 19: '-', 33: 'DOM', 46: '-', 58: '614' };
            let rows = '';
            for (let i = 1; i <= 60; i++) {
              const t = titles[i % titles.length];
              if (picks[i]) {
                rows += `<div class="notice-row" data-urgent="true" data-frag="${picks[i]}">[#${String(i).padStart(2,'0')}] ${t}</div>`;
              } else {
                rows += `<div class="notice-row">[#${String(i).padStart(2,'0')}] ${t}</div>`;
              }
            }
            stage.innerHTML = `<div class="notice-scroll" id="cn2-list">${rows}</div>`;
          }
        },
        {
          id: 'cn3',
          code: 'CMD.03',
          title: '套娃里的登录框',
          task: '下方嵌了一个同源的统一身份认证子窗口（iframe），口令存在子窗口里的 window.__authVault.token 中。直接在默认环境里敲会报 undefined，切换执行上下文后再读。',
          placeholder: 'CN-IFRAME-...',
          hashes: ['c8db53dae541d5eb'],
          hints: [
            '每个 iframe 都有独立的 JavaScript 全局环境，主页面里的 window 读不到子窗口里的变量。',
            '看 Console 面板左上角显示 "top" 的下拉菜单，点开它切换到 cn3-auth-frame（或 about:srcdoc）。',
            '切换完成后，在 Console 输入 __authVault.token 回车即可。'
          ],
          debrief: '很多校园门户、支付框和第三方登录组件都嵌在 iframe 里。以后遇到“明明页面里有这个元素或变量，控制台却查不到”的情况，先检查左上角上下文是不是还停在 top。',
          build(stage) {
            const frameHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
              body{margin:0;padding:14px;background:#07140d;color:#6ef7b0;font:13px/1.65 Consolas,monospace}
              .tag{font-size:11px;color:#ffb347;margin-bottom:4px}
            </style></head><body>
              <div class="tag">IFRAME :: cn3-auth-frame</div>
              <div>统一身份认证子窗口已就绪。</div>
              <div style="opacity:.75;font-size:12px">变量 __authVault 已挂载在当前子窗口。</div>
              <script>
                window.__authVault = {
                  status: 'ready',
                  token: ['CN','IFRAME','729'].join('-')
                };
              <\/script>
            </body></html>`;
            stage.innerHTML = `
              <div class="frame-wrap">
                <iframe id="cn3-auth-frame" name="cn3-auth-frame" title="统一身份认证子窗口"></iframe>
              </div>
              <div style="margin-top:10px;font-size:12px;opacity:.8">
                主页面当前 typeof window.__authVault === "undefined"
              </div>
            `;
            stage.querySelector('#cn3-auth-frame').srcdoc = frameHtml;
          }
        },
        {
          id: 'cn4',
          code: 'CMD.04',
          title: '半路截胡',
          task: '点击“签发一次性凭证”后，脚本会在内部调用 window.btoa() 对明文口令编码，随后立刻销毁结果。在 Console 里劫持（Hook）window.btoa，把传进去的明文拦下来。',
          placeholder: 'CN-HOOK-...',
          hashes: ['e8f4e2511854c5c3'],
          hints: [
            'JavaScript 允许在运行时重写全局函数。先保存原函数，再给 window.btoa 赋一个带日志的新函数。',
            '在 Console 执行：const _b = btoa; window.btoa = s => { console.log("抓到明文:", s); return _b(s); };',
            '挂好钩子后，再点击下方的“签发一次性凭证”按钮，明文就会印在 Console 里。'
          ],
          debrief: '在控制台重写原生方法或业务函数（Hook），可以在不改动服务端代码的前提下，直接窥见加密前或发包前的原始入参，是分析前端逻辑的高频技巧。',
          build(stage) {
            const secret = String.fromCharCode(67,78,45,72,79,79,75,45,56,52,50);
            stage.innerHTML = `
              <button class="stage-btn" id="cn4-fire">签发一次性凭证</button>
              <div class="stage-out" id="cn4-out">等待签发...</div>
            `;
            const out = stage.querySelector('#cn4-out');
            stage.querySelector('#cn4-fire').addEventListener('click', () => {
              let encoded = '';
              try { encoded = window.btoa(secret); } catch (_) {}
              out.textContent = '凭证已调用 btoa() 完成编码（长度 ' + encoded.length + '），明文未保留在页面上。';
            });
          }
        }
      ]
    },
    {
      id: 'so',
      no: 'SECTION 03',
      name: '源码追踪',
      panel: 'Sources · 源代码面板',
      blurb: '顺着文件树、断点和调用栈，把藏在代码深处的逻辑一步步还原出来。',
      subs: [
        {
          id: 'so1',
          code: 'so-3-1.js',
          title: '忘删的调试备忘',
          task: '本关的业务脚本已加载到虚拟文件 lab/so-3-1.js 中，页面本身不展示源码。去 Sources 面板找到它，翻出上线前忘删的调试注释并解码。',
          placeholder: 'SO-NOTE-...',
          hashes: ['8a889b8fcfeddf56'],
          hints: [
            '打开 Sources 面板，按 Ctrl+P 输入 so-3-1.js，或按 Ctrl+Shift+F 全局搜索“发版前”。',
            '注释里有一段以 U08t 开头的 Base64 字符串。',
            '把这串字符拿到 Console 里用 atob("...") 解开即可。'
          ],
          debrief: '前端脚本会完整下载到用户浏览器。开发阶段留在注释里的测试账号、内网地址或密钥，一旦随构建产物上线就会完全暴露。',
          build(stage) {
            const src = [
              '/* 实验室验证模块 lab/so-3-1.js */',
              'window.__so1Ready = function () {',
              '  // 调试备忘：发版前记得删除测试口令（Base64）：U08tTk9URS0xMTg=',
              '  return "lab/so-3-1.js 已装载，源码请移步 Sources 面板查看。";',
              '};'
            ].join('\n');
            injectVirtualScript(src, 'lab/so-3-1.js');
            stage.innerHTML = `
              <button class="stage-btn" id="so1-check">检查脚本装载状态</button>
              <div class="stage-out" id="so1-out">提示：代码不在页面正文里，请打开 Sources 面板。</div>
            `;
            stage.querySelector('#so1-check').addEventListener('click', () => {
              const out = stage.querySelector('#so1-out');
              out.textContent = typeof window.__so1Ready === 'function'
                ? window.__so1Ready()
                : '脚本加载中，请稍候再试。';
            });
          }
        },
        {
          id: 'so2',
          code: 'so-3-2.js',
          title: '压成一行的加密函',
          task: 'lab/so-3-2.js 被压缩成了一整行，还把口令做了拆分、反转与 Base64 编码。在 Sources 里打开它，用格式化按钮还原排版后逆向解出明文。',
          placeholder: 'SO-PRTY-...',
          hashes: ['1c70184f3a803d64'],
          hints: [
            '在 Sources 打开 lab/so-3-2.js，点击代码区左下角的 {}（Pretty Print）把它展开成多行。',
            '读懂 unpack 逻辑：把数组 _seg 拼成字符串，先反转，再用 atob() 解码。',
            '也可以在看清函数名后，直接在 Console 反转拼接结果再 atob()，或用 __so2Check() 验算。'
          ],
          debrief: '压缩与简单混淆只增加肉眼阅读成本，按一下 Pretty Print 就能恢复缩进结构，顺着数据流一步步倒推就能还原逻辑。',
          build(stage) {
            const minified = 'window.__so2Check=function(input){var _seg=["=ATO","z0SW","UJFU","t80U"];var _rev=_seg.join("").split("").reverse().join("");var _plain=atob(_rev);return input===_plain?"匹配成功":"口令不符，请仔细阅读 unpack 逻辑";};';
            injectVirtualScript(minified, 'lab/so-3-2.js');
            stage.innerHTML = `
              <div style="font-size:13.5px;line-height:1.7">目标文件：<code style="color:#5ce1e6">lab/so-3-2.js</code>（已单行压缩）</div>
              <div class="stage-out">打开 Sources 面板找到该文件，点击左下角 <code>{}</code> 格式化后阅读。</div>
            `;
          }
        },
        {
          id: 'so3',
          code: 'so-3-3.js',
          title: '活不过一毫秒的变量',
          task: '点击“生成瞬时令牌”后，函数内部会在局部变量 transientSecret 里算出明文，随后立即覆写销毁，不挂全局也不打印日志。在 lab/so-3-3.js 下断点，在它消失前截住它。',
          placeholder: 'SO-SCOP-...',
          hashes: ['88fd741d2c8b70f9'],
          hints: [
            '在 Sources 打开 lab/so-3-3.js，找到给 transientSecret 赋值的那一行。',
            '点击它下一行的行号打上蓝色行断点，再回来点击“生成瞬时令牌”。',
            '程序暂停后，看右侧 Scope（作用域）里的 Local 栏，就能直接读出 transientSecret。'
          ],
          debrief: '断点能让代码执行在任意一行原地冻结。哪怕变量从不暴露到全局作用域、只存活几微秒，只要在赋值后暂停，就能在 Scope 面板里看得清清楚楚。',
          build(stage) {
            const src = [
              '/* 瞬时令牌模块 lab/so-3-3.js */',
              'window.__so3Trigger = function () {',
              '  const codes = [83, 79, 45, 83, 67, 79, 80, 45, 53, 52, 49];',
              '  let transientSecret = String.fromCharCode.apply(null, codes);',
              '  // 建议在下面这一行打断点，查看右侧 Scope -> Local',
              '  const digestPreview = transientSecret.slice(0, 3) + "***";',
              '  transientSecret = "EXPIRED";',
              '  return "令牌已生成并覆写（摘要：" + digestPreview + "）";',
              '};'
            ].join('\n');
            injectVirtualScript(src, 'lab/so-3-3.js');
            stage.innerHTML = `
              <button class="stage-btn" id="so3-btn">生成瞬时令牌</button>
              <div class="stage-out" id="so3-out">提示：直接点按钮只能看到覆写后的摘要。</div>
            `;
            stage.querySelector('#so3-btn').addEventListener('click', () => {
              const out = stage.querySelector('#so3-out');
              out.textContent = typeof window.__so3Trigger === 'function'
                ? window.__so3Trigger()
                : '脚本尚未就绪。';
            });
          }
        },
        {
          id: 'so4',
          code: 'so-3-4.js',
          title: '三层调用栈的真凶',
          task: '点击“运行 50 轮审批”会循环执行 50 次三层调用（dispatchAudit -> verifyBatch -> checkItem）。只有第 37 轮时，顶层 dispatchAudit 的局部变量里携带着真口令。用条件断点拦住第 37 轮，再沿调用栈向上回溯。',
          placeholder: 'SO-STCK-...',
          hashes: ['796b31ec9b6edda1'],
          hints: [
            '在 Sources 打开 lab/so-3-4.js，右键 checkItem 函数里的行号，选择“Add conditional breakpoint（添加条件断点）”。',
            '条件填写 round === 37，然后点击“运行 50 轮审批”，程序会精准停在第 37 轮。',
            '暂停后看右侧 Call Stack（调用栈），点击上层的 dispatchAudit，再看 Scope 里的 localAuditKey。'
          ],
          debrief: '在循环里盲目单步调试会耗掉大量时间。条件断点可以只在满足特定条件时停下，再配合 Call Stack 回看上游每一层栈帧的现场变量，复杂链路也能快速定位。',
          build(stage) {
            const src = [
              '/* 三层调用栈演练 lab/so-3-4.js */',
              'function checkItem(round) {',
              '  // 在这一行右键设置条件断点：round === 37',
              '  return round % 7 === 0 ? "checked" : "pass";',
              '}',
              'function verifyBatch(round, marker) {',
              '  const stageTag = marker + "#" + round;',
              '  return checkItem(round) + ":" + stageTag;',
              '}',
              'function dispatchAudit(round) {',
              '  const localAuditKey = round === 37',
              '    ? String.fromCharCode(83, 79, 45, 83, 84, 67, 75, 45, 55, 54, 51)',
              '    : "NOISE-" + String(round).padStart(3, "0");',
              '  return verifyBatch(round, localAuditKey.slice(0, 2));',
              '}',
              'window.__so4Run = function () {',
              '  let last = "";',
              '  for (let r = 1; r <= 50; r++) {',
              '    last = dispatchAudit(r);',
              '  }',
              '  return "50 轮审批已全部跑完（末轮：" + last + "）";',
              '};'
            ].join('\n');
            injectVirtualScript(src, 'lab/so-3-4.js');
            stage.innerHTML = `
              <button class="stage-btn" id="so4-btn">运行 50 轮审批</button>
              <div class="stage-out" id="so4-out">目标文件：lab/so-3-4.js</div>
            `;
            stage.querySelector('#so4-btn').addEventListener('click', () => {
              const out = stage.querySelector('#so4-out');
              out.textContent = typeof window.__so4Run === 'function'
                ? window.__so4Run()
                : '脚本尚未就绪。';
            });
          }
        }
      ]
    },
    {
      id: 'ne',
      no: 'SECTION 04',
      name: '网络溯源',
      panel: 'Network · 网络面板',
      blurb: '盯着每一次请求与回执，抓出响应头、原始报文和隐藏接口里的线索。',
      subs: [
        {
          id: 'ne1',
          code: 'PKT.01',
          title: '拆开 JSON 回执',
          task: '点击“拉取凭据”会发出两条请求，其中 JSON 响应体里藏着拆分好的两段口令。打开 Network 面板，筛选 Fetch/XHR 拦下它并拼出完整口令。',
          placeholder: 'NET-PKT-...',
          hashes: ['8b1d905b8e75e64e'],
          hints: [
            '先打开 Network 面板，点左上角清空按钮，勾选 Fetch/XHR 过滤杂项，再点击“拉取凭据”。',
            '点开列表中 Type 为 fetch 的请求，切换到 Response 或 Preview 标签页。',
            '把 partA（NET-PKT）和 meta.partB（204）用连字符拼在一起。'
          ],
          debrief: 'Network 面板忠实记录了页面发出的每一次异步请求。学会先清空列表、再按 Fetch/XHR 筛选，就能在一堆图片和样式资源里迅速锁定接口报文。',
          build(stage, ui) {
            stage.innerHTML = `
              <button class="stage-btn" id="ne1-btn">拉取凭据</button>
              <div class="pkt-log" id="ne1-log"></div>
            `;
            const log = stage.querySelector('#ne1-log');
            stage.querySelector('#ne1-btn').addEventListener('click', async () => {
              ui.setTelemetry('200 OK', 'GET', 'application/json', 'ok');
              const u1 = makeBlobUrl('ping=ok&ts=' + Date.now(), 'text/plain');
              const u2 = makeBlobUrl(JSON.stringify({
                ok: true,
                partA: 'NET-PKT',
                meta: { channel: 'lab-v2', partB: '204' }
              }), 'application/json');
              await fetch(u1).then((r) => r.text()).catch(() => {});
              await fetch(u2).then((r) => r.text()).catch(() => {});
              log.innerHTML = `<div><span class="ts">[${nowStamp()}]</span><span>200 OK · 已收到 2 条响应，请到 Network 面板查看 JSON 响应体。</span></div>` + log.innerHTML;
            });
          }
        },
        {
          id: 'ne2',
          code: 'PKT.02',
          title: '失真的 19 位学号',
          task: '点击“拉取作者档案”，返回的 studentId 是一个 19 位长整数。对比 Network 中 Preview 和 Response 两个标签页，把 Response 原文里的最后四位数字交上来。',
          placeholder: '四位数字',
          hashes: ['ed163de3ef7ff05d', '04733c41735508f1'],
          diagnose(raw) {
            const n = norm(raw);
            if (['8800', '8900', '8920', '1789345612345678800', '1789345612345678900'].includes(n)) {
              return '你填的是 Preview 经 JavaScript 解析后的舍入值。切到旁边的 Response 标签，看服务器返回的原始文本。';
            }
            return null;
          },
          hints: [
            '点击按钮后，在 Network 中点开那条 JSON 请求。',
            'JavaScript 的最大安全整数是 9007199254740991（16 位），Preview 会先做 JSON.parse，导致 19 位整数末尾被舍入。',
            '切换到 Response 标签页直接看原始字符串，studentId 的末尾四位是答案。'
          ],
          debrief: 'Preview 是开发者工具用 JS 解析后展示的视图，遇到雪花算法 ID、订单号等超长整数会发生精度丢失；核对原始数据时，始终以 Response 原文为准。',
          build(stage, ui) {
            stage.innerHTML = `
              <button class="stage-btn" id="ne2-btn">拉取作者档案</button>
              <div class="pkt-log" id="ne2-log"></div>
            `;
            const log = stage.querySelector('#ne2-log');
            stage.querySelector('#ne2-btn').addEventListener('click', async () => {
              ui.setTelemetry('200 OK', 'GET', 'application/json', 'ok');
              const rawJson = '{"code":200,"author":"林同学","studentId":1789345612345678923,"note":"请对比 Preview 与 Response 中的 studentId"}';
              const u = makeBlobUrl(rawJson, 'application/json');
              await fetch(u).then((r) => r.text()).catch(() => {});
              log.innerHTML = `<div><span class="ts">[${nowStamp()}]</span><span>200 OK · 档案已返回，请在 Network 对比 Preview 与 Response。</span></div>` + log.innerHTML;
            });
          }
        },
        {
          id: 'ne3',
          code: 'PKT.03',
          title: '顺着链式回执找终点',
          task: '点击“启动链式追踪”会连续发出 5 条请求，其中混杂了 2 条心跳干扰包，真正有效的是由 next 字段串起来的三跳链路。在 Network 里按顺序拆包，拼出完整口令。',
          placeholder: 'NET-HOP-...',
          hashes: ['3b046236a0601460'],
          hints: [
            '在 Network 中按时间顺序查看刚发出的 5 条 fetch 请求，忽略 type 为 heartbeat 的干扰包。',
            '第二跳响应里给出了 head（NET-HOP），第三跳响应里给出了 tail（815）。',
            '将 head 与 tail 用连字符拼合即可。'
          ],
          debrief: '真实业务里一次操作往往会触发一连串级联请求。按时间轴顺序跟踪请求链、过滤掉无关的心跳上报，才能理清数据的真实流向。',
          build(stage, ui) {
            stage.innerHTML = `
              <button class="stage-btn" id="ne3-btn">启动链式追踪</button>
              <div class="pkt-log" id="ne3-log"></div>
            `;
            const log = stage.querySelector('#ne3-log');
            stage.querySelector('#ne3-btn').addEventListener('click', async () => {
              ui.setTelemetry('200 OK (x5)', 'GET', 'chain/fetch', 'ok');
              const hop3 = makeBlobUrl(JSON.stringify({ step: 3, done: true, tail: '815' }), 'application/json');
              const hop2 = makeBlobUrl(JSON.stringify({ step: 2, head: 'NET-HOP', next: hop3 }), 'application/json');
              const hop1 = makeBlobUrl(JSON.stringify({ step: 1, status: 'redirecting', next: hop2 }), 'application/json');
              const noise1 = makeBlobUrl(JSON.stringify({ type: 'heartbeat', ok: true }), 'application/json');
              const noise2 = makeBlobUrl(JSON.stringify({ type: 'heartbeat', ok: true }), 'application/json');
              await fetch(noise1).then((r) => r.text()).catch(() => {});
              await fetch(hop1).then((r) => r.text()).catch(() => {});
              await fetch(hop2).then((r) => r.text()).catch(() => {});
              await fetch(noise2).then((r) => r.text()).catch(() => {});
              await fetch(hop3).then((r) => r.text()).catch(() => {});
              log.innerHTML = `<div><span class="ts">[${nowStamp()}]</span><span>200 OK · 链式追踪完成（共发出 5 条请求，其中 2 条为心跳干扰）。</span></div>` + log.innerHTML;
            });
          }
        },
        {
          id: 'ne4',
          code: 'PKT.04',
          title: '顺着 Initiator 换卡重发',
          task: '点击“叩门核验”会以 guest 身份发包并被接口拒绝（业务码 403）。查看该请求在 Network 里的 Initiator（发起程序），定位到发包函数，改用 reviewer 角色重发请求拿到最终口令。',
          placeholder: 'NET-INIT-...',
          hashes: ['8427b32851f63cf3'],
          hints: [
            '先点“叩门核验”，在 Network 里找到刚发出的请求，看它的 Response 提示了什么角色要求。',
            '点开该请求的 Initiator 标签（或列表中的 Initiator 列），它会直接指到 lab/ne-4-4.js 里的 requestVault 函数。',
            '在 Console 里执行 requestVault("reviewer")，再去 Network 看新发出的那条成功响应。'
          ],
          debrief: 'Initiator 把 Network 和 Sources 连在了一起：抓到一条可疑接口后，顺着发起堆栈立刻就能找到发包源码，再用 Console 重放或修改参数验证接口行为。',
          build(stage, ui) {
            const src = [
              '/* 权限网关发包模块 lab/ne-4-4.js */',
              'window.requestVault = async function (role) {',
              '  const r = role || "guest";',
              '  const payload = r === "reviewer"',
              '    ? { status: 200, role: r, token: ["NET","INIT","409"].join("-"), msg: "复核权限已放行" }',
              '    : { status: 403, role: r, error: "当前角色无权访问，仅限 reviewer", hint: "查看 Initiator 找到发包函数并传参重发" };',
              '  const u = URL.createObjectURL(new Blob([JSON.stringify(payload)], { type: "application/json" }));',
              '  const resp = await fetch(u);',
              '  const text = await resp.text();',
              '  setTimeout(function () { URL.revokeObjectURL(u); }, 60000);',
              '  if (window.__ne4OnDone) window.__ne4OnDone(payload.status, r);',
              '  return "请求已完成（业务状态 " + payload.status + "），请到 Network 查看响应体。";',
              '};'
            ].join('\n');
            injectVirtualScript(src, 'lab/ne-4-4.js');
            stage.innerHTML = `
              <button class="stage-btn" id="ne4-btn">叩门核验（当前：guest）</button>
              <div class="pkt-log" id="ne4-log"></div>
            `;
            const log = stage.querySelector('#ne4-log');
            window.__ne4OnDone = (status, role) => {
              ui.setTelemetry(status === 200 ? '200 OK' : '403 DENIED', 'GET', 'role=' + role, status === 200 ? 'ok' : 'err');
              log.innerHTML = `<div><span class="ts">[${nowStamp()}]</span><span>${status} · 角色 ${role} 发包完成，详细报文请看 Network 面板。</span></div>` + log.innerHTML;
            };
            cleanups.push(() => { delete window.__ne4OnDone; });
            stage.querySelector('#ne4-btn').addEventListener('click', () => {
              if (typeof window.requestVault === 'function') window.requestVault('guest');
            });
          }
        }
      ]
    }
  ];

  /* ==================== 视图渲染 ==================== */
  const app = root;
  function majorOf(id) { return MAJORS.find((m) => m.id === id); }

  function renderHome() {
    clearStageResources();
    app.dataset.major = 'home';
    const total = MAJORS.reduce((a, m) => a + m.subs.length, 0);
    const done = MAJORS.reduce((a, m) => a + prog[m.id], 0);
    const pct = Math.round((done / total) * 100);
    const circum = 2 * Math.PI * 19;
    const offset = circum * (1 - done / total);

    app.innerHTML = `
      <div class="mobile-note">本实训需要打开浏览器开发者工具（F12），建议在电脑端 Chrome 或 Edge 访问。</div>
      <header class="home-hero">
        <div>
          <div class="home-eyebrow"><i></i><span>DEVTOOLS PUZZLE LAB · 16 CHALLENGES</span></div>
          <h1>F12 实训解密</h1>
          <p class="home-lead">
            四组风格各异的网页谜题，对应开发者工具的四个核心面板。仅靠肉眼看页面，拿不到任何一关的口令。任选一组开始，每解开一题才会放行下一题。
          </p>
        </div>
        <div class="home-meter">
          <div class="meter-ring">
            <svg viewBox="0 0 46 46">
              <circle class="track" cx="23" cy="23" r="19"/>
              <circle class="fill" cx="23" cy="23" r="19" stroke-dasharray="${circum.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"/>
            </svg>
            <span>${pct}%</span>
          </div>
          <div class="meter-info">
            <strong>已完成 ${done} / ${total} 关</strong>
            <span>本次会话有效</span>
          </div>
          <button class="ghost-btn" id="ask-reset">重置进度</button>
        </div>
      </header>
      <div class="reset-bar" id="reset-bar">
        <span>确认清空全部 16 关的通关记录吗？</span>
        <button class="danger" id="confirm-reset">确认清空</button>
        <button id="cancel-reset">取消</button>
      </div>
      <section class="portal-grid">
        ${MAJORS.map((m) => {
          const p = prog[m.id];
          const pips = m.subs.map((_, i) => `<i class="${i < p ? 'done' : ''}"></i>`).join('');
          const titleExtra = m.id === 'cn' ? '<span class="cursor"></span>' : '';
          return `
            <button type="button" class="portal" data-th="${m.id}" data-go="${m.id}">
              ${PORTAL_ART[m.id]}
              <div class="portal-head">
                <span class="tag">${m.no}</span>
                <span class="enter-hint">ENTER -&gt;</span>
              </div>
              <div class="portal-body">
                <h2>${m.name}${titleExtra}</h2>
                <div class="panel-name">${m.panel}</div>
                <p class="desc">${m.blurb}</p>
              </div>
              <div class="foot">
                <div class="pips">${pips}</div>
                <div class="stat">${p} / ${m.subs.length}</div>
              </div>
            </button>
          `;
        }).join('')}
      </section>
      <footer class="home-foot">
        <span>进度只保存在本次会话里，刷新页面会重置。</span>
        <span class="mono">Elements · Console · Sources · Network</span>
      </footer>
    `;

    app.querySelectorAll('[data-go]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.go;
        const m = majorOf(id);
        const target = Math.min(prog[id], m.subs.length - 1);
        go(id + '/' + target);
      });
    });

    const bar = document.getElementById('reset-bar');
    document.getElementById('ask-reset').addEventListener('click', () => bar.classList.toggle('show'));
    document.getElementById('cancel-reset').addEventListener('click', () => bar.classList.remove('show'));
    document.getElementById('confirm-reset').addEventListener('click', () => {
      prog = Object.assign({}, DEFAULT_PROG);
      saveProg();
      renderHome();
    });
  }

  function buildStepNav(m, idx) {
    return `<nav class="step-nav" aria-label="小关导航">${m.subs.map((sub, i) => {
      const unlocked = i <= prog[m.id];
      const cls = ['step-pill', i === idx ? 'active' : '', unlocked ? '' : 'locked'].join(' ').trim();
      const mark = i < prog[m.id] ? ' [已通]' : (unlocked ? '' : ' [锁]');
      return `<button type="button" class="${cls}" data-step="${i}" ${unlocked ? '' : 'disabled'}>${sub.code}${mark}</button>`;
    }).join('')}</nav>`;
  }

  function renderLevel(id, idx) {
    const m = majorOf(id);
    if (!m) return renderHome();
    if (idx > prog[id]) idx = prog[id];
    if (idx >= m.subs.length) idx = m.subs.length - 1;
    const s = m.subs[idx];

    clearStageResources();
    app.dataset.major = id;

    const commonControls = `
      <div class="hint-list" id="hint-list"></div>
      <div style="margin-top:14px">
        <button type="button" class="ghost-btn" id="btn-hint">查看提示（共 ${s.hints.length} 级）</button>
      </div>
      <form class="submit-row" id="ans-form">
        <input class="ans-input" id="ans-input" type="text" placeholder="${s.placeholder}" autocomplete="off" spellcheck="false">
        <button class="primary-btn" type="submit" id="ans-submit">验证口令</button>
      </form>
      <div class="feedback" id="feedback"></div>
      <div class="debrief" id="debrief">
        <div class="debrief-title">原理解密</div>
        <p>${s.debrief}</p>
        <button type="button" class="primary-btn" id="btn-next"></button>
      </div>
    `;

    if (id === 'el') {
      app.innerHTML = `
        <div class="bp-ruler">
          <span>0px</span><span>200px</span><span>400px</span><span>600px</span><span>800px</span><span>DOM · VIEWPORT</span>
        </div>
        <div class="bp-sheet">
          <i class="bp-corner tl"></i><i class="bp-corner tr"></i><i class="bp-corner bl"></i><i class="bp-corner br"></i>
          <div class="bp-header">
            <div>
              <div class="bp-fig">${m.no} / ${s.code}</div>
              <h1>${m.name} · ${m.panel}</h1>
            </div>
            <div class="bp-stamp">
              <span class="bp-scale">SCALE 1:1 · REV 2.0</span>
              <button type="button" class="ghost-btn" id="btn-home">返回大厅</button>
            </div>
          </div>
          ${buildStepNav(m, idx)}
          <h2 class="ltitle">${s.title}</h2>
          <div class="bp-task">${s.task}</div>
          <div class="bp-stage" id="stage"></div>
          ${commonControls}
        </div>
      `;
    } else if (id === 'cn') {
      app.innerHTML = `
        <div class="tty-win">
          <div class="tty-bar">
            <div class="tty-dots"><i class="on"></i><i></i><i></i><strong style="margin-left:6px">tty0 · ${m.panel} · SESSION ACTIVE</strong></div>
            <button type="button" class="ghost-btn" id="btn-home">cd ~/home</button>
          </div>
          <div class="tty-body">
            ${buildStepNav(m, idx)}
            <div class="lsub">${m.no} / ${s.code}</div>
            <h2 class="ltitle">${s.title}</h2>
            <div class="tty-task">${s.task}</div>
            <div class="tty-stage" id="stage"></div>
            ${commonControls}
            <div class="tty-tip">提示：本大关也支持直接在浏览器 Console 里调用 submit("口令") 交卷。</div>
          </div>
        </div>
      `;
    } else if (id === 'so') {
      const tabs = m.subs.map((sub, i) => {
        const unlocked = i <= prog[m.id];
        const cls = ['ide-tab', i === idx ? 'active' : '', unlocked ? '' : 'locked'].join(' ').trim();
        const tag = i < prog[m.id] ? ' ✓' : (unlocked ? '' : ' [锁]');
        return `<button type="button" class="${cls}" data-step="${i}" ${unlocked ? '' : 'disabled'}><i class="js-dot"></i>${sub.code}${tag}</button>`;
      }).join('');
      const files = m.subs.map((sub, i) => {
        const cur = i === idx ? ' cur' : '';
        const locked = i > prog[m.id] ? ' (未解锁)' : '';
        return `<div class="ide-file${cur}">${sub.code}${locked}</div>`;
      }).join('');
      app.innerHTML = `
        <div class="ide-shell">
          <div class="ide-topbar">
            <div class="ide-brand">
              <div class="ide-lights"><span></span><span></span><span></span></div>
              <h1>f12-lab — ${m.name} (${m.panel})</h1>
            </div>
            <button type="button" class="ghost-btn" id="btn-home">返回大厅</button>
          </div>
          <div class="ide-tabs">${tabs}</div>
          <div class="ide-body">
            <aside class="ide-side">
              <div class="sec-h">EXPLORER</div>
              <div class="ide-folder">▼ lab/</div>
              ${files}
              <div style="margin-top:16px;padding-top:12px;border-top:1px solid #23273a;font-size:11.5px;line-height:1.65;opacity:.78">
                在 DevTools 的 Sources 面板按 Ctrl+P 输入文件名即可打开当前关虚拟源码。
              </div>
            </aside>
            <main class="ide-main">
              <div class="ide-crumb"><span>f12-lab</span><span>/</span><span>lab</span><span>/</span><strong>${s.code}</strong></div>
              <h2 class="ltitle">${s.title}</h2>
              <div class="ide-task">${s.task}</div>
              <div class="ide-stage" id="stage"></div>
              ${commonControls}
            </main>
          </div>
          <div class="ide-status">
            <span>DevTools Sources Ready · lab/${s.code}</span>
            <span>UTF-8 · JavaScript</span>
          </div>
        </div>
      `;
    } else {
      app.innerHTML = `
        <div class="net-rack">
          <div class="net-head">
            <div class="net-title-wrap">
              <i class="net-led"></i>
              <h1>CAPTURE :: ${m.name} (${m.panel})</h1>
            </div>
            <button type="button" class="ghost-btn" id="btn-home">返回大厅</button>
          </div>
          <div class="telemetry">
            <div><span>HTTP STATUS</span><strong id="tel-status">IDLE</strong></div>
            <div><span>METHOD</span><strong id="tel-method">--</strong></div>
            <div><span>TARGET / PAYLOAD</span><strong id="tel-detail">等待发包</strong></div>
          </div>
          <div class="net-body">
            ${buildStepNav(m, idx)}
            <div class="lsub">${m.no} / ${s.code}</div>
            <h2 class="ltitle">${s.title}</h2>
            <div class="net-task">${s.task}</div>
            <div class="net-stage" id="stage"></div>
            ${commonControls}
          </div>
        </div>
      `;
    }

    const uiHelper = {
      setTelemetry(st, mt, dt, state) {
        const a = document.getElementById('tel-status');
        const b = document.getElementById('tel-method');
        const c = document.getElementById('tel-detail');
        if (a) {
          a.textContent = st;
          a.className = state === 'ok' ? 'st-ok' : (state === 'err' ? 'st-err' : '');
        }
        if (b) b.textContent = mt;
        if (c) c.textContent = dt;
      }
    };

    s.build(document.getElementById('stage'), uiHelper);

    document.getElementById('btn-home').addEventListener('click', () => {
      go('home');
    });
    app.querySelectorAll('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = Number(btn.dataset.step);
        if (target <= prog[id]) go(id + '/' + target);
      });
    });

    let hintIdx = 0;
    const hintList = document.getElementById('hint-list');
    const hintBtn = document.getElementById('btn-hint');
    hintBtn.addEventListener('click', () => {
      if (hintIdx >= s.hints.length) return;
      const item = document.createElement('div');
      item.className = 'hint-item';
      item.textContent = `提示 ${hintIdx + 1}：${s.hints[hintIdx]}`;
      hintList.appendChild(item);
      hintIdx += 1;
      if (hintIdx >= s.hints.length) {
        hintBtn.textContent = '提示已全部展开';
        hintBtn.disabled = true;
      } else {
        hintBtn.textContent = `再看一条提示（剩 ${s.hints.length - hintIdx} 级）`;
      }
    });

    const form = document.getElementById('ans-form');
    const input = document.getElementById('ans-input');
    const submitBtn = document.getElementById('ans-submit');
    const fb = document.getElementById('feedback');
    const debrief = document.getElementById('debrief');
    const nextBtn = document.getElementById('btn-next');

    function verify(rawVal) {
      const val = String(rawVal || '');
      if (!val.trim()) return false;
      const h = digest(val);
      if (s.hashes.includes(h)) {
        fb.className = 'feedback ok';
        fb.textContent = '验证通过。';
        if (prog[id] < idx + 1) {
          prog[id] = idx + 1;
          saveProg();
        }
        input.disabled = true;
        submitBtn.disabled = true;
        const isLast = idx + 1 >= m.subs.length;
        nextBtn.textContent = isLast ? '完成本大关，返回大厅' : `进入下一关（${idx + 2} / ${m.subs.length}）`;
        nextBtn.onclick = () => {
          go(isLast ? 'home' : id + '/' + (idx + 1));
        };
        debrief.classList.add('show');
        return true;
      }

      fb.className = 'feedback err';
      if (/^["'].*["']$/.test(val.trim())) {
        fb.textContent = '口令外层多带了引号，去掉引号再提交试试。';
      } else if (typeof s.diagnose === 'function' && s.diagnose(val)) {
        fb.textContent = s.diagnose(val);
      } else {
        fb.textContent = '口令不匹配。确认没有多复制空格，或打开提示核对一下排查方向。';
      }
      return false;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      verify(input.value);
    });

    if (id === 'cn') {
      window.submit = function (ans) {
        input.value = String(ans || '');
        const ok = verify(ans);
        return ok ? '验证通过，请查看页面上的原理解密并进入下一关。' : '口令不匹配，请重试。';
      };
    }

    if (idx < prog[id]) {
      fb.className = 'feedback ok';
      fb.textContent = '本关已通关，你可以重新演练，或通过上方导航切换其他关卡。';
    }
  }

  function route() {
    const h = state;
    const m = /^(el|cn|so|ne)(?:\/(\d+))?$/.exec(h);
    if (m) {
      const id = m[1];
      const idx = m[2] !== undefined ? Number(m[2]) : Math.min(prog[id], 3);
      renderLevel(id, idx);
    } else {
      renderHome();
    }
  }

  loadProg();
  
  

  function go(h) {
    state = String(h || 'home').replace(/^#/, '') || 'home';
    route();
  }

  loadProg();
  route();

  return () => {
    try { clearStageResources(); } catch (e) { /* noop */ }
    try { delete window.submit; } catch (e) { /* noop */ }
    try { delete window.__courseLab; } catch (e) { /* noop */ }
  };
}
