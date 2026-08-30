# 原神 · 若娜瓦

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地玩家主题。原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- 以赤月终焉、黑曜神门、六翼神瞳、死亡之翎和灵魂渡界为核心意象。
- 真 Alpha 人物层与 16:9 环境背景完全分离，可独立调整位置、亮度、动效与响应式尺寸。
- 浅色模式使用骨白、烟灰、暗酒红和古金；暗色模式切换为黑曜、深绯与低亮金线。
- 右上律令 HUD、右下终焉 HUD 和主题入口共享安全轨道，不遮挡 Session Log 与输入区。
- 默认“省资源”模式停止所有持续主题动画并减少装饰节点；主题中心可切换“完整”动态。
- 所有图片从插件本地路由加载，不请求外部 CDN，不使用 Base64 内嵌。

## 切换

安装后主题会出现在右下角“主题中心”。它可与仓库内其他主题同时安装，但任意时刻最多只有一个主题挂载：

```js
window.__DSH_WUTHERING_THEME_HUB__.setActive('genshin-ronova')
```

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

## 安装与卸载

远端（[GitHub Releases](https://github.com/frank6892103/dsh-WutheringWaves/releases)）：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
```

本地 `.tgz`（下载 Release 或执行 `pnpm run themes:release`）：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
dsh --profile web --dump-config
dsh web

dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-genshin-ronova
```

卸载活动主题时会自动退回官方外观。
