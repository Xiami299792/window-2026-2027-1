/* 实训页样式：运行时注入到 <style>，全部作用在 #f12-lab 之下，组件卸载即移除。 */
export const LAB_CSS = `#f12-lab /* ============ 基础重置与动效系统 ============ */
  *,
#f12-lab *::before,
#f12-lab *::after{box-sizing:border-box}#f12-lab html,
#f12-lab{margin:0;min-height:100%}#f12-lab{
    font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif;
    line-height:1.65;
    transition:background .35s ease,color .35s ease;
    -webkit-font-smoothing:antialiased;
    text-rendering:optimizeLegibility;
  }#f12-lab button,
#f12-lab input{font:inherit}#f12-lab button{cursor:pointer}#f12-lab code,
#f12-lab kbd,
#f12-lab .mono{font-family:"Cascadia Mono","JetBrains Mono","Fira Code",Consolas,"SFMono-Regular",monospace}@keyframes fadeUp{#f12-lab from{opacity:0;transform:translateY(10px)}#f12-lab to{opacity:1;transform:translateY(0)}
  }@keyframes blink{#f12-lab 0%,
#f12-lab 49%{opacity:1}#f12-lab 50%,
#f12-lab 100%{opacity:0}
  }@keyframes pulseLed{#f12-lab 0%,
#f12-lab 100%{box-shadow:0 0 0 0 rgba(255,122,47,.65)}#f12-lab 60%{box-shadow:0 0 0 7px rgba(255,122,47,0)}
  }#f12-lab #app{max-width:1060px;margin:0 auto;padding:34px 24px 104px;animation:fadeUp .3s ease both}#f12-lab .mobile-note{
    display:none;margin-bottom:20px;padding:11px 16px;font-size:13px;border-radius:8px;
    border:1px solid rgba(148,163,184,.28);background:rgba(30,41,59,.55);color:#cbd5e1;
    backdrop-filter:blur(8px);
  }@media (max-width:767px){#f12-lab .mobile-note{display:block}#f12-lab #app{padding:22px 16px 84px}
  }#f12-lab /* 自定义滚动条 */
  ::-webkit-scrollbar{width:7px;height:7px}#f12-lab ::-webkit-scrollbar-track{background:rgba(0,0,0,.2)}#f12-lab ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}#f12-lab ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.32)}#f12-lab /* ============ 首页：策展级实训大厅 ============ */
  body[data-major="home"]{
    background-color:#0b0e14;color:#edf0f5;
    background-image:
      radial-gradient(ellipse 60% 45% at 14% 8%,rgba(37,99,235,.15),transparent 65%),
      radial-gradient(ellipse 55% 40% at 88% 85%,rgba(255,122,47,.10),transparent 65%),
      radial-gradient(rgba(255,255,255,.065) 1px,transparent 1px);
    background-size:100% 100%,100% 100%,24px 24px;
    background-attachment:fixed;
  }#f12-lab .home-hero{
    display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;
    padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.09);
  }#f12-lab .home-eyebrow{
    display:inline-flex;align-items:center;gap:8px;margin-bottom:12px;
    padding:4px 11px;border-radius:999px;
    border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);
    font:11px/1.2 "Cascadia Mono",Consolas,monospace;letter-spacing:.14em;color:#94a3b8;
  }#f12-lab .home-eyebrow i{width:6px;height:6px;border-radius:50%;background:#38f294;box-shadow:0 0 8px #38f294}#f12-lab .home-hero h1{
    margin:0;font-size:34px;font-weight:750;letter-spacing:-.01em;line-height:1.18;
    background:linear-gradient(135deg,#ffffff 0%,#cbd5e1 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  }#f12-lab .home-lead{margin:14px 0 0;max-width:620px;font-size:15px;color:#9ca6b8;line-height:1.8}#f12-lab .home-meter{
    display:flex;align-items:center;gap:16px;padding:12px 16px;border-radius:12px;
    border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.03);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.05);
  }#f12-lab .meter-ring{position:relative;width:46px;height:46px;flex-shrink:0}#f12-lab .meter-ring svg{width:46px;height:46px;transform:rotate(-90deg)}#f12-lab .meter-ring .track{fill:none;stroke:rgba(255,255,255,.1);stroke-width:3.5}#f12-lab .meter-ring .fill{fill:none;stroke:#38f294;stroke-width:3.5;stroke-linecap:round;transition:stroke-dashoffset .4s ease}#f12-lab .meter-ring span{
    position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    font:11px/1 "Cascadia Mono",Consolas,monospace;color:#e2e8f0;
  }#f12-lab .meter-info{display:flex;flex-direction:column;gap:4px}#f12-lab .meter-info strong{font:13.5px/1.2 "Cascadia Mono",Consolas,monospace;color:#f1f5f9}#f12-lab .meter-info span{font-size:12px;color:#7f8a9c}#f12-lab .reset-bar{
    display:none;margin-top:16px;padding:12px 16px;border-radius:10px;
    border:1px solid rgba(239,68,68,.38);background:rgba(127,29,29,.22);
    color:#fecaca;font-size:13px;align-items:center;gap:12px;flex-wrap:wrap;
  }#f12-lab .reset-bar.show{display:flex;animation:fadeUp .2s ease}#f12-lab .reset-bar button{padding:5px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.2);background:transparent;color:inherit;font-size:12px}#f12-lab .reset-bar .danger{background:#dc2626;border-color:#dc2626;color:#fff;font-weight:600}#f12-lab .portal-grid{
    display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin-top:28px;
  }@media (max-width:740px){#f12-lab .portal-grid{grid-template-columns:1fr}}#f12-lab .portal{
    position:relative;display:flex;flex-direction:column;justify-content:space-between;
    min-height:232px;padding:26px 24px 22px;border-radius:14px;border:1px solid;
    text-align:left;overflow:hidden;
    transition:transform .24s cubic-bezier(.2,.8,.2,1),box-shadow .24s ease,border-color .24s ease;
  }#f12-lab .portal:hover{transform:translateY(-4px)}#f12-lab .portal:active{transform:translateY(-1px)}#f12-lab .portal-art{
    position:absolute;right:-8px;bottom:-10px;width:154px;height:154px;
    pointer-events:none;opacity:.16;transition:transform .35s ease,opacity .25s ease;
  }#f12-lab .portal:hover .portal-art{transform:scale(1.06) rotate(-2deg);opacity:.26}#f12-lab .portal-head{display:flex;justify-content:space-between;align-items:center;gap:10px;position:relative;z-index:1}#f12-lab .portal .tag{
    font:11px/1 "Cascadia Mono",Consolas,monospace;letter-spacing:.16em;text-transform:uppercase;
    padding:4px 8px;border-radius:4px;
  }#f12-lab .portal .enter-hint{
    font:11.5px/1 "Cascadia Mono",Consolas,monospace;opacity:.55;
    transition:transform .2s ease,opacity .2s ease;
  }#f12-lab .portal:hover .enter-hint{opacity:1;transform:translateX(3px)}#f12-lab .portal-body{position:relative;z-index:1;margin:16px 0 22px}#f12-lab .portal h2{margin:0 0 6px;font-size:23px;font-weight:750;letter-spacing:.01em;display:flex;align-items:center;gap:8px}#f12-lab .portal .panel-name{font:12px/1.4 "Cascadia Mono",Consolas,monospace;opacity:.75}#f12-lab .portal .desc{margin:12px 0 0;font-size:13.8px;line-height:1.7;max-width:88%;opacity:.88}#f12-lab .portal .foot{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;gap:12px;padding-top:14px;border-top:1px solid rgba(255,255,255,.09)}#f12-lab .pips{display:flex;gap:6px}#f12-lab .pips i{display:block;width:28px;height:5px;border-radius:99px;background:currentColor;opacity:.18;transition:opacity .2s}#f12-lab .pips i.done{opacity:1}#f12-lab .portal .stat{font:12px/1 "Cascadia Mono",Consolas,monospace;font-weight:600}#f12-lab /* 首页四张高质感入口卡 */
  .portal[data-th="el"]{
    background:
      linear-gradient(155deg,rgba(19,59,107,.96) 0%,rgba(8,25,48,.98) 100%);
    color:#eef6ff;border-color:rgba(96,165,250,.38);
    box-shadow:0 12px 32px rgba(4,16,34,.45),inset 0 1px 0 rgba(255,255,255,.12);
  }#f12-lab .portal[data-th="el"]::before{
    content:"";position:absolute;inset:0;pointer-events:none;
    background-image:
      linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);
    background-size:22px 22px;
  }#f12-lab .portal[data-th="el"] .tag{background:rgba(244,201,93,.15);color:#f4c95d;border:1px solid rgba(244,201,93,.35)}#f12-lab .portal[data-th="el"]:hover{border-color:#f4c95d;box-shadow:0 18px 40px rgba(8,32,68,.65),0 0 0 1px rgba(244,201,93,.55)}#f12-lab .portal[data-th="el"] .stat{color:#f4c95d}#f12-lab .portal[data-th="el"] .pips i.done{background:#f4c95d;box-shadow:0 0 8px rgba(244,201,93,.5)}#f12-lab .portal[data-th="cn"]{
    background:
      radial-gradient(circle at 80% 15%,rgba(56,242,148,.12),transparent 55%),
      linear-gradient(160deg,#08110c 0%,#040806 100%);
    color:#4df5a2;border-color:rgba(45,160,102,.42);
    font-family:"Cascadia Mono",Consolas,monospace;
    box-shadow:0 12px 32px rgba(0,0,0,.55),inset 0 1px 0 rgba(77,245,162,.12);
  }#f12-lab .portal[data-th="cn"] .tag{background:rgba(56,242,148,.12);color:#5cf8ab;border:1px solid rgba(56,242,148,.3)}#f12-lab .portal[data-th="cn"]:hover{border-color:#38f294;box-shadow:0 18px 40px rgba(0,0,0,.65),0 0 28px rgba(56,242,148,.18)}#f12-lab .portal[data-th="cn"] .cursor{display:inline-block;width:10px;height:20px;background:#38f294;animation:blink 1.1s steps(1) infinite}#f12-lab .portal[data-th="cn"] .pips i.done{background:#38f294;box-shadow:0 0 8px rgba(56,242,148,.6)}#f12-lab .portal[data-th="so"]{
    background:
      radial-gradient(circle at 15% 15%,rgba(157,140,255,.14),transparent 55%),
      linear-gradient(160deg,#191c2b 0%,#121420 100%);
    color:#e9ecfa;border-color:rgba(139,124,246,.32);
    box-shadow:0 12px 32px rgba(7,8,18,.5),inset 0 1px 0 rgba(255,255,255,.08);
  }#f12-lab .portal[data-th="so"] .tag{background:rgba(167,139,250,.15);color:#c4b5fd;border:1px solid rgba(167,139,250,.32)}#f12-lab .portal[data-th="so"]:hover{border-color:#a78bfa;box-shadow:0 18px 42px rgba(10,10,24,.7),0 0 28px rgba(167,139,250,.18)}#f12-lab .portal[data-th="so"] .stat{color:#c4b5fd}#f12-lab .portal[data-th="so"] .pips i.done{background:#a78bfa;box-shadow:0 0 8px rgba(167,139,250,.55)}#f12-lab .portal[data-th="ne"]{
    background:
      radial-gradient(circle at 85% 20%,rgba(255,122,47,.12),transparent 55%),
      linear-gradient(160deg,#191d22 0%,#111418 100%);
    color:#f0ede7;border-color:rgba(255,122,47,.28);
    box-shadow:0 12px 32px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.06);
  }#f12-lab .portal[data-th="ne"] .tag{background:rgba(255,122,47,.14);color:#ff944d;border:1px solid rgba(255,122,47,.32)}#f12-lab .portal[data-th="ne"]:hover{border-color:#ff7a2f;box-shadow:0 18px 40px rgba(0,0,0,.68),0 0 26px rgba(255,122,47,.16)}#f12-lab .portal[data-th="ne"] .stat{color:#ff944d}#f12-lab .portal[data-th="ne"] .pips i.done{background:#ff7a2f;box-shadow:0 0 8px rgba(255,122,47,.55)}#f12-lab .home-foot{
    margin-top:26px;padding-top:16px;border-top:1px solid rgba(255,255,255,.07);
    font-size:12.5px;color:#737e91;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;
  }#f12-lab /* ============ 通用按钮与交互部件 ============ */
  .ghost-btn{
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.22);color:inherit;
    padding:7px 14px;border-radius:7px;font-size:12.5px;opacity:.88;
    transition:all .16s ease;
  }#f12-lab .ghost-btn:hover{opacity:1;background:rgba(255,255,255,.09);border-color:currentColor}#f12-lab .ghost-btn:disabled{opacity:.35;cursor:not-allowed}#f12-lab .submit-row{display:flex;gap:10px;align-items:stretch;margin-top:18px;flex-wrap:wrap}#f12-lab .ans-input{
    flex:1;min-width:220px;padding:12px 14px;border:1px solid;border-radius:8px;
    background:rgba(0,0,0,.22);color:inherit;
    font:14px/1.2 "Cascadia Mono",Consolas,monospace;letter-spacing:.04em;
    transition:border-color .16s,box-shadow .16s;
  }#f12-lab .ans-input:focus{outline:none;box-shadow:0 0 0 3px rgba(255,255,255,.14)}#f12-lab .primary-btn{
    padding:12px 22px;border:1px solid;border-radius:8px;font-size:13.5px;font-weight:700;
    letter-spacing:.04em;transition:transform .14s ease,filter .14s ease,box-shadow .16s ease;
  }#f12-lab .primary-btn:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.06)}#f12-lab .primary-btn:active:not(:disabled){transform:translateY(0)}#f12-lab .primary-btn:disabled{opacity:.38;cursor:not-allowed}#f12-lab .hint-list{margin-top:14px;display:flex;flex-direction:column;gap:8px}#f12-lab .hint-item{
    padding:11px 14px;border:1px solid;border-radius:8px;font-size:13.5px;line-height:1.72;
    animation:fadeUp .2s ease;
  }#f12-lab .feedback{margin-top:12px;min-height:22px;font:13px/1.65 "Cascadia Mono",Consolas,monospace}#f12-lab .feedback.ok{color:#34d399}#f12-lab .feedback.err{color:#f87171}#f12-lab .debrief{
    display:none;margin-top:20px;padding:18px 20px;border:1px solid;border-left-width:4px;border-radius:10px;
  }#f12-lab .debrief.show{display:block;animation:fadeUp .25s ease}#f12-lab .debrief-title{
    display:flex;align-items:center;gap:8px;font:12px/1 "Cascadia Mono",Consolas,monospace;
    letter-spacing:.12em;text-transform:uppercase;opacity:.85;margin-bottom:8px;font-weight:700;
  }#f12-lab .debrief p{margin:0 0 16px;font-size:14.2px;line-height:1.78}#f12-lab .step-nav{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}#f12-lab .step-pill{
    padding:6px 13px;border:1px solid;border-radius:6px;background:transparent;color:inherit;
    font:12px/1.2 "Cascadia Mono",Consolas,monospace;opacity:.72;transition:all .16s ease;
  }#f12-lab .step-pill:hover:not(:disabled){opacity:1}#f12-lab .step-pill.active{opacity:1;font-weight:700}#f12-lab .step-pill.locked{opacity:.3;cursor:not-allowed}#f12-lab .ltitle{margin:8px 0 4px;font-size:24px;font-weight:750;letter-spacing:.01em}#f12-lab .lsub{font:12px/1.4 "Cascadia Mono",Consolas,monospace;opacity:.7;letter-spacing:.06em}#f12-lab .stage-btn{
    padding:9px 16px;border-radius:7px;border:1px solid currentColor;background:rgba(255,255,255,.04);color:inherit;
    font:13px/1.2 "Cascadia Mono",Consolas,monospace;transition:all .16s ease;
  }#f12-lab .stage-btn:hover:not(:disabled){background:rgba(255,255,255,.12);transform:translateY(-1px)}#f12-lab .stage-btn:disabled{opacity:.4;cursor:not-allowed}#f12-lab .stage-out{margin-top:12px;font:13px/1.65 "Cascadia Mono",Consolas,monospace;opacity:.92}#f12-lab /* =====================================================================
     大关一：Elements（建筑工程蓝图美学）
     ===================================================================== */
  body[data-major="el"]{
    background-color:#081c34;color:#eef6ff;
    background-image:
      radial-gradient(ellipse 70% 50% at 20% 0%,rgba(56,139,253,.18),transparent 65%),
      linear-gradient(rgba(147,197,253,.11) 1px,transparent 1px),
      linear-gradient(90deg,rgba(147,197,253,.11) 1px,transparent 1px),
      linear-gradient(rgba(147,197,253,.045) 1px,transparent 1px),
      linear-gradient(90deg,rgba(147,197,253,.045) 1px,transparent 1px);
    background-size:100% 100%,100px 100px,100px 100px,20px 20px,20px 20px;
    background-attachment:fixed;
  }#f12-lab .bp-ruler{
    display:flex;justify-content:space-between;align-items:center;padding:6px 12px;margin-bottom:14px;
    border:1px solid rgba(147,197,253,.32);border-radius:6px;
    background:rgba(6,20,38,.82);
    font:10.5px/1 "Cascadia Mono",Consolas,monospace;color:#8bb9ef;letter-spacing:.1em;
  }#f12-lab .bp-sheet{
    position:relative;border:1.5px solid rgba(191,219,254,.55);border-radius:10px;
    background:rgba(9,28,52,.88);padding:26px 28px 30px;
    box-shadow:0 24px 60px rgba(2,10,24,.55),inset 0 0 0 5px rgba(8,28,52,.85),inset 0 0 0 6px rgba(147,197,253,.18);
    backdrop-filter:blur(6px);
  }#f12-lab .bp-corner{position:absolute;width:14px;height:14px;border-color:#f4c95d;pointer-events:none}#f12-lab .bp-corner.tl{top:-2px;left:-2px;border-top:2px solid;border-left:2px solid}#f12-lab .bp-corner.tr{top:-2px;right:-2px;border-top:2px solid;border-right:2px solid}#f12-lab .bp-corner.bl{bottom:-2px;left:-2px;border-bottom:2px solid;border-left:2px solid}#f12-lab .bp-corner.br{bottom:-2px;right:-2px;border-bottom:2px solid;border-right:2px solid}#f12-lab .bp-header{
    display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;
    padding-bottom:16px;border-bottom:1px dashed rgba(147,197,253,.35);
  }#f12-lab .bp-header h1{margin:4px 0 0;font-size:20px;font-family:"Cascadia Mono",Consolas,monospace}#f12-lab .bp-fig{font:11.5px/1 "Cascadia Mono",Consolas,monospace;color:#f4c95d;letter-spacing:.14em}#f12-lab .bp-stamp{
    display:flex;align-items:center;gap:12px;
  }#f12-lab .bp-scale{
    padding:4px 9px;border:1px solid rgba(244,201,93,.4);border-radius:4px;
    font:10.5px/1 "Cascadia Mono",Consolas,monospace;color:#f4c95d;background:rgba(244,201,93,.08);
  }#f12-lab[data-major="el"] .step-pill{border-color:rgba(147,197,253,.38)}#f12-lab[data-major="el"] .step-pill.active{background:#f4c95d;border-color:#f4c95d;color:#081c34;box-shadow:0 0 14px rgba(244,201,93,.35)}#f12-lab .bp-task{
    margin:16px 0;padding:15px 18px;border-left:3px solid #f4c95d;border-radius:0 8px 8px 0;
    background:rgba(147,197,253,.08);font-size:15px;line-height:1.82;
  }#f12-lab .bp-stage{
    margin:20px 0;padding:24px;border:1px solid rgba(147,197,253,.35);border-radius:10px;
    background:rgba(5,16,32,.78);position:relative;
  }#f12-lab[data-major="el"] .ans-input{border-color:rgba(147,197,253,.48);background:rgba(5,16,32,.75)}#f12-lab[data-major="el"] .ans-input:focus{border-color:#f4c95d;box-shadow:0 0 0 3px rgba(244,201,93,.22)}#f12-lab[data-major="el"] .primary-btn{background:#f4c95d;border-color:#f4c95d;color:#081c34;box-shadow:0 6px 18px rgba(244,201,93,.22)}#f12-lab[data-major="el"] .hint-item{border-color:rgba(244,201,93,.38);background:rgba(244,201,93,.08)}#f12-lab[data-major="el"] .debrief{border-color:rgba(244,201,93,.55);background:rgba(244,201,93,.09)}#f12-lab /* Elements 拟真微场景卡片 */
  .paper-box{
    position:relative;max-width:460px;padding:22px;border-radius:10px;
    background:#f8fafc;color:#1e293b;border:1px solid #cbd5e1;
    box-shadow:0 12px 28px rgba(0,0,0,.3);overflow:hidden;
  }#f12-lab .paper-box h3{margin:0 0 10px;font-size:16.5px;color:#0f172a}#f12-lab .paper-box p{margin:7px 0;font-size:13.8px;line-height:1.72;color:#334155}#f12-lab .vip-mask{
    position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:9px;padding:18px;text-align:center;
    background:rgba(15,23,42,.92);backdrop-filter:blur(6px);color:#f8fafc;
  }#f12-lab .vip-mask .vip-badge{
    padding:4px 11px;border-radius:999px;border:1px solid #f4c95d;color:#f4c95d;
    font:11px/1 "Cascadia Mono",Consolas,monospace;letter-spacing:.12em;
  }#f12-lab .vip-toast{margin-top:12px;font:12.5px/1.5 "Cascadia Mono",Consolas,monospace;color:#f4c95d;min-height:19px}#f12-lab .legacy-form{
    max-width:400px;padding:20px;border-radius:10px;background:#f8fafc;color:#1e293b;
    border:1px solid #cbd5e1;box-shadow:0 12px 28px rgba(0,0,0,.28);
  }#f12-lab .legacy-form label{display:block;font-size:12px;font-weight:600;color:#475569;margin:10px 0 5px}#f12-lab .legacy-form input{width:100%;padding:9px 11px;border-radius:6px;border:1px solid #94a3b8;font-family:"Cascadia Mono",monospace;background:#fff}#f12-lab .legacy-form button{margin-top:14px;padding:9px 16px;border-radius:6px;border:none;background:#0f294a;color:#fff;font-weight:600}#f12-lab .legacy-form button:disabled{opacity:.42;cursor:not-allowed}#f12-lab .swatch-card{
    max-width:480px;padding:20px 22px;border-radius:10px;
    background:linear-gradient(145deg,#0f172a,#1e293b);border:1px solid #334155;
    box-shadow:0 12px 28px rgba(0,0,0,.32);
  }#f12-lab .price-card{
    max-width:460px;padding:20px 22px;border-radius:10px;background:#f8fafc;color:#1e293b;
    border:1px solid #cbd5e1;box-shadow:0 12px 28px rgba(0,0,0,.28);
  }#f12-lab .price-tag{font-size:24px;font-weight:800;color:#dc2626;margin:8px 0 4px}#f12-lab /* =====================================================================
     大关二：Console（高质感复古荧光终端）
     ===================================================================== */
  body[data-major="cn"]{
    background-color:#040806;color:#52f2a0;
    background-image:radial-gradient(ellipse 65% 45% at 50% 0%,rgba(42,209,129,.12),transparent 70%);
    font-family:"Cascadia Mono",Consolas,monospace;
    background-attachment:fixed;
  }#f12-lab[data-major="cn"]::after{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:99;
    background:repeating-linear-gradient(to bottom,transparent 0 2px,rgba(0,0,0,.18) 2px 3px);
  }#f12-lab .tty-win{
    border:1px solid rgba(56,242,148,.34);border-radius:12px;background:#07110c;
    box-shadow:0 24px 64px rgba(0,0,0,.72),0 0 42px rgba(35,209,139,.09),inset 0 1px 0 rgba(82,242,160,.16);
    overflow:hidden;
  }#f12-lab .tty-bar{
    display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;
    padding:12px 18px;border-bottom:1px solid rgba(56,242,148,.24);background:#0a1911;font-size:12px;
  }#f12-lab .tty-dots{display:flex;align-items:center;gap:8px}#f12-lab .tty-dots i{width:10px;height:10px;border-radius:50%;display:inline-block;border:1px solid rgba(82,242,160,.45)}#f12-lab .tty-dots i.on{background:#38f294;box-shadow:0 0 8px #38f294;border-color:#38f294}#f12-lab .tty-body{padding:24px 26px 30px}#f12-lab[data-major="cn"] .step-pill{border-color:rgba(56,242,148,.32);color:#52f2a0}#f12-lab[data-major="cn"] .step-pill.active{background:#38f294;border-color:#38f294;color:#04140b;box-shadow:0 0 16px rgba(56,242,148,.35)}#f12-lab .tty-task{
    margin:16px 0;padding:15px 18px;border:1px solid rgba(56,242,148,.24);border-radius:8px;
    background:#040c08;font-size:14px;line-height:1.85;
  }#f12-lab .tty-task::before{content:"$ task --brief\\A";white-space:pre;display:block;font-size:11.5px;color:#ffb347;margin-bottom:5px}#f12-lab .tty-stage{
    margin:18px 0;padding:18px 20px;border:1px dashed rgba(56,242,148,.36);border-radius:8px;
    background:#030906;
  }#f12-lab[data-major="cn"] .ans-input{border-color:rgba(56,242,148,.4);color:#7dfab0;background:#030806}#f12-lab[data-major="cn"] .ans-input:focus{border-color:#38f294;box-shadow:0 0 0 3px rgba(56,242,148,.2)}#f12-lab[data-major="cn"] .primary-btn{background:#38f294;border-color:#38f294;color:#04140b;box-shadow:0 0 18px rgba(56,242,148,.24)}#f12-lab[data-major="cn"] .hint-item{border-color:rgba(56,242,148,.32);background:#07170f;color:#9df7c6}#f12-lab[data-major="cn"] .debrief{border-color:#38f294;background:#081d12}#f12-lab .tty-tip{margin-top:10px;font-size:12px;color:#7ec9a0;opacity:.85}#f12-lab .notice-scroll{
    max-height:210px;overflow:auto;border:1px solid rgba(56,242,148,.25);border-radius:6px;
    background:#020705;padding:6px 12px;font-size:12.5px;
  }#f12-lab .notice-row{padding:6px 4px;border-bottom:1px solid rgba(56,242,148,.1);color:#7ec9a0}#f12-lab .frame-wrap{border:1px solid rgba(56,242,148,.35);border-radius:8px;background:#020705;padding:10px}#f12-lab .frame-wrap iframe{width:100%;height:132px;border:1px solid rgba(56,242,148,.22);border-radius:4px;background:#0a1710}#f12-lab /* =====================================================================
     大关三：Sources（现代精良 IDE 调试台）
     ===================================================================== */
  body[data-major="so"]{
    background-color:#0f111a;color:#e6e9f6;
    background-image:radial-gradient(ellipse 60% 45% at 85% 0%,rgba(139,124,246,.14),transparent 65%);
    background-attachment:fixed;
  }#f12-lab .ide-shell{
    border:1px solid rgba(139,124,246,.28);border-radius:12px;background:#161925;
    box-shadow:0 26px 64px rgba(4,5,14,.65),inset 0 1px 0 rgba(255,255,255,.06);
    overflow:hidden;
  }#f12-lab .ide-topbar{
    display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;
    padding:11px 18px;background:#11131d;border-bottom:1px solid #262a3d;
  }#f12-lab .ide-brand{display:flex;align-items:center;gap:12px}#f12-lab .ide-lights{display:flex;gap:6px}#f12-lab .ide-lights span{width:10px;height:10px;border-radius:50%;display:inline-block}#f12-lab .ide-lights span:nth-child(1){background:#ff5f56}#f12-lab .ide-lights span:nth-child(2){background:#ffbd2e}#f12-lab .ide-lights span:nth-child(3){background:#27c93f}#f12-lab .ide-topbar h1{margin:0;font-size:13.5px;font-family:"Cascadia Mono",Consolas,monospace;color:#c4b5fd}#f12-lab .ide-tabs{
    display:flex;background:#131621;border-bottom:1px solid #262a3d;overflow-x:auto;
  }#f12-lab .ide-tab{
    display:inline-flex;align-items:center;gap:7px;padding:10px 18px;
    border:none;border-right:1px solid #262a3d;background:transparent;
    color:#8e96b3;font:12.5px/1.2 "Cascadia Mono",Consolas,monospace;white-space:nowrap;
    transition:background .15s,color .15s;
  }#f12-lab .ide-tab:hover:not(:disabled){background:#1a1e2e;color:#d6dcf2}#f12-lab .ide-tab.active{background:#161925;color:#f1f5ff;box-shadow:inset 0 2px 0 #a78bfa}#f12-lab .ide-tab.locked{opacity:.36;cursor:not-allowed}#f12-lab .ide-tab .js-dot{width:7px;height:7px;border-radius:2px;background:#facc15;display:inline-block}#f12-lab .ide-body{display:grid;grid-template-columns:228px minmax(0,1fr)}@media (max-width:760px){#f12-lab .ide-body{grid-template-columns:1fr}}#f12-lab .ide-side{
    padding:18px 14px;border-right:1px solid #262a3d;background:#12151f;
    font:12px/1.85 "Cascadia Mono",Consolas,monospace;color:#8e96b3;
  }@media (max-width:760px){#f12-lab .ide-side{border-right:none;border-bottom:1px solid #262a3d}}#f12-lab .ide-side .sec-h{font-size:10.5px;letter-spacing:.14em;color:#666f8f;margin-bottom:8px;text-transform:uppercase}#f12-lab .ide-folder{color:#cbd5e1;font-weight:600;margin-bottom:4px}#f12-lab .ide-file{padding:5px 10px 5px 18px;border-radius:5px;color:#9aa3bf;margin:2px 0}#f12-lab .ide-file.cur{background:rgba(167,139,250,.16);color:#5ce1e6;border-left:2px solid #5ce1e6}#f12-lab .ide-main{padding:24px 26px 28px}#f12-lab .ide-crumb{
    display:inline-flex;align-items:center;gap:6px;margin-bottom:8px;
    font:11.5px/1 "Cascadia Mono",Consolas,monospace;color:#828ba8;
  }#f12-lab .ide-crumb strong{color:#5ce1e6;font-weight:600}#f12-lab .ide-task{
    margin:14px 0 18px;padding:15px 18px;border:1px solid #2d334c;border-left:3px solid #a78bfa;
    border-radius:0 8px 8px 0;background:#11141e;font-size:14.5px;line-height:1.82;
  }#f12-lab .ide-stage{margin:18px 0;padding:20px;border:1px solid #2d334c;border-radius:8px;background:#0f121b}#f12-lab .ide-status{
    display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;
    padding:7px 16px;background:#1d1a33;border-top:1px solid #2d324c;
    font:11px/1.2 "Cascadia Mono",Consolas,monospace;color:#c4b5fd;
  }#f12-lab[data-major="so"] .ans-input{border-color:#3a4160;background:#10121c;color:#e6e9f6}#f12-lab[data-major="so"] .ans-input:focus{border-color:#a78bfa;box-shadow:0 0 0 3px rgba(167,139,250,.22)}#f12-lab[data-major="so"] .primary-btn{background:#a78bfa;border-color:#a78bfa;color:#120f24;box-shadow:0 6px 18px rgba(167,139,250,.22)}#f12-lab[data-major="so"] .hint-item{border-color:#393f5d;background:#1c1f30;color:#d6dbf2}#f12-lab[data-major="so"] .debrief{border-color:#a78bfa;background:#1d1b33}#f12-lab /* =====================================================================
     大关四：Network（工业级信号抓包监测台）
     ===================================================================== */
  body[data-major="ne"]{
    background-color:#0e1114;color:#f0ede7;
    background-image:
      radial-gradient(ellipse 65% 40% at 80% 0%,rgba(255,122,47,.12),transparent 65%),
      repeating-linear-gradient(135deg,rgba(255,255,255,.014) 0 2px,transparent 2px 10px);
    background-attachment:fixed;
  }#f12-lab .net-rack{
    border:1px solid #2f363f;border-radius:12px;background:#15191e;
    box-shadow:0 26px 64px rgba(0,0,0,.66),inset 0 1px 0 rgba(255,255,255,.06);
    overflow:hidden;
  }#f12-lab .net-head{
    display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;
    padding:14px 20px;background:#1b2027;border-bottom:1px solid #2f363f;
  }#f12-lab .net-title-wrap{display:flex;align-items:center;gap:10px}#f12-lab .net-led{
    width:9px;height:9px;border-radius:50%;background:#ff7a2f;
    animation:pulseLed 2s ease-out infinite;
  }#f12-lab .net-head h1{margin:0;font-size:16px;font-family:"Cascadia Mono",Consolas,monospace;color:#ffa05c}#f12-lab .telemetry{
    display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;
    background:#2a3038;border-bottom:1px solid #2a3038;
    font:12px/1.4 "Cascadia Mono",Consolas,monospace;
  }#f12-lab .telemetry > div{background:#111418;padding:11px 16px}#f12-lab .telemetry span{display:block;font-size:10px;color:#788390;letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px}#f12-lab .telemetry strong{color:#e6eaef;font-size:13px}#f12-lab .telemetry strong.st-ok{color:#34d399}#f12-lab .telemetry strong.st-err{color:#f87171}#f12-lab .net-body{padding:24px 26px 30px}#f12-lab[data-major="ne"] .step-pill{border-color:#3a434e;color:#c9d0d8}#f12-lab[data-major="ne"] .step-pill.active{background:#ff7a2f;border-color:#ff7a2f;color:#1a1008;box-shadow:0 0 16px rgba(255,122,47,.32)}#f12-lab .net-task{
    margin:16px 0;padding:15px 18px;border-left:3px solid #ff7a2f;border-radius:0 8px 8px 0;
    background:#101317;font-size:14.5px;line-height:1.82;
  }#f12-lab .net-stage{margin:18px 0;padding:20px;border:1px solid #2d343d;border-radius:8px;background:#0e1115}#f12-lab .pkt-log{margin-top:14px;font:12px/1.65 "Cascadia Mono",Consolas,monospace;color:#9aa5b2}#f12-lab .pkt-log div{padding:6px 0;border-bottom:1px solid #1f252c;display:flex;gap:8px;align-items:baseline}#f12-lab .pkt-log .ts{color:#66707d;flex-shrink:0}#f12-lab[data-major="ne"] .ans-input{border-color:#424b57;background:#0e1115;color:#f0ede7}#f12-lab[data-major="ne"] .ans-input:focus{border-color:#ff7a2f;box-shadow:0 0 0 3px rgba(255,122,47,.22)}#f12-lab[data-major="ne"] .primary-btn{background:#ff7a2f;border-color:#ff7a2f;color:#1a1008;box-shadow:0 6px 18px rgba(255,122,47,.24)}#f12-lab[data-major="ne"] .hint-item{border-color:rgba(255,122,47,.35);background:#1f1914;color:#f2d8c5}#f12-lab[data-major="ne"] .debrief{border-color:#ff7a2f;background:#211812}
`;
