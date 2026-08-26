# 鸣潮 · 心月狐

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地玩家主题。原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- 以朝月清辉、狐火、机关分形和朱砂金纹为主要意象。
- 心月狐角色预告图作为右侧月门视觉锚点，CSS 绘制机关格栅、分形星盘、狐火和流光绸带。
- 右上角“万相分形”仪表与右下角梦州灯火状态条组成信息框架，并主动避让主题切换按钮。
- DSH 会话区采用月白纸绢与玄墨玻璃的分层材质，以朱砂和青玉色提示交互状态。
- 适配 DSH 明暗模式、窄屏和 `prefers-reduced-motion`。
- 运行时仅从插件本地路由加载 WebP，不请求外部 CDN。
- 默认“省资源”模式保留人物、月门配色、机关格栅和两簇狐火，但不创建微尘、星芒、星盘、绸带和频谱等持续动画层；可在主题中心恢复完整效果。

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

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.1.0.tgz
dsh --profile web --dump-config
dsh web
```

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-xinyuehu
```

卸载活动主题时会自动退回官方外观。
