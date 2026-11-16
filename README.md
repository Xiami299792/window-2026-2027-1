# 科协之窗 · 2026-2027 学年第 1 期《F12洞开网络之门》

由模板 [ListenSnow405/RuiK-window-template](https://github.com/ListenSnow405/RuiK-window-template) 起步，
只改了一个文件夹：`src/issue/`。模板的规则与交付说明见上面那个仓库的 README。

## 这一期

| 项 | 值 |
| --- | --- |
| 学年 | 2026-2027 |
| 期数 | 第 1 期（正刊） |
| 页面地址 | `ruik.xin/window/2026-2027/1` |
| 标题 | F12洞开网络之门 |
| 摘要 | 从元素、控制台、源码到网络与存储，本期为您打开网络世界的第一道大门。 |
| 发布日期 | 2026-11-14 |
| 封面 | `cover.webp`（1200×900，4:3，61 KB） |
| 新增依赖 | 无（只用模板自带的 react / react-dom / antd / @ant-design/icons） |
| COS 大文件 | 无（正文插图是内联 SVG，不占带宽） |

## 目录

```
src/issue/
├─ index.tsx          正文与三张插图
├─ Issue.module.css   版面样式（报纸式：报头、首字下沉、例签、卷末）
├─ decorate.ts        版面装饰：报头、把「一、」染朱、卷末「终」、插图入场
└─ horror.ts          按 F12 时的一段小演出，可单独删掉
```

不需要 `horror.ts` 的话：删掉这个文件，并去掉 `index.tsx` 里的 `useEffect`
与 `<div className={styles.layer} />`，其余部分不依赖它。

## 版面

正文走「报纸」的路子：报头双线、大字标题、首字下沉、代码块左上角一枚朱色「例」签、
图注用中文序（图一/图二/图三）、文末一个「终」字。

- 单栏，版心 764px；手机上自动收窄，正文 17px
- 三张插图是手绘字符画（内联 SVG），滚动进视口时线条自绘、节点淡入
- 装饰全部由 `decorate.ts` 在挂载时加、卸载时撤；正文一个字都没有改

## 本地预览

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm lint
pnpm build
```

## 交付

把本仓库地址、`src/issue/` 的说明和上面的信息表交给开发，由开发合进主站；
或按模板 README 的 PR 路线自行合并。
