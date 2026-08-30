# 鸣潮 · 坎特蕾拉

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地玩家主题。原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- 以深海幻梦、水母、潮汐焦散和紫蓝荧光为主要意象。
- 坎特蕾拉透明角色图作为右侧视觉锚点，CSS 绘制水母、气泡、潮流、折射环与家族纹章。
- 右上角梦境声呐与右下角潮汐记忆 HUD 形成完整信息框架，并主动避让主题切换按钮。
- DSH 会话区采用分层半透明深海玻璃，叠加低频焦散、流光、星芒和波形动效。
- 适配 DSH 明暗模式、窄屏和 `prefers-reduced-motion`。
- 运行时仅从插件本地路由加载 WebP，不请求外部 CDN。
- 默认“省资源”模式保留人物、深海配色、静态焦散和两只水母，但不创建气泡、星芒、折射、潮流、波形等持续动画层；可在主题中心恢复完整效果。

## 切换

安装后主题会出现在右下角“主题中心”。它可与爱弥斯主题同时安装，但与官方外观之间始终互斥挂载。也可以程序化切换：

```js
window.__DSH_WUTHERING_THEME_HUB__.setActive('wuthering-cantarella')
```

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

## 安装

远端（[GitHub Releases](https://github.com/frank6892103/dsh-WutheringWaves/releases)）：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
```

本地 `.tgz`（下载 Release 或执行 `pnpm run themes:release`）：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
dsh --profile web --dump-config
dsh web
```

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-cantarella
```

卸载活动主题时会自动退回官方外观。
