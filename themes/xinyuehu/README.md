# 鸣潮 · 心月狐

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地玩家主题。原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- v0.2 使用“玄方月苑”视觉语言：月门、四扇屏风、印章、梦州灯路和六重机关分形。
- 角色预告图收纳在右侧拱形月屏内，不再作为全屏海报覆盖正文，与爱弥斯的星海构图区分。
- 浅色主题统一为暖纸灰、鼠尾草绿和低饱和朱砂；面板改用偏实体纸张材质，避免橙红、青绿大色块互相抢夺。
- 完整动态模式包含月门双向旋转、分形开合、灯路浮动、月相呼吸、屏风人物轻微景深和印章脉冲。
- 适配 DSH 明暗模式、窄屏和 `prefers-reduced-motion`。
- 运行时仅从插件本地路由加载 WebP，不请求外部 CDN。
- 默认“省资源”模式保留人物月屏、月门和简化分形，但停止持续动画并减少机关与灯笼节点；可在主题中心恢复完整效果。

## 切换

安装后主题会出现在右下角“主题中心”。它可与仓库中的其他角色主题同时安装，但与官方外观之间始终互斥挂载。也可以程序化切换：

```js
window.__DSH_WUTHERING_THEME_HUB__.setActive('wuthering-xinyuehu')
```

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

## 安装

远端（[GitHub Releases](https://github.com/frank6892103/dsh-WutheringWaves/releases)）：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
```

本地 `.tgz`（下载 Release 或执行 `pnpm run themes:release`）：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
dsh --profile web --dump-config
dsh web
```

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-xinyuehu
```

卸载活动主题时会自动退回官方外观。
