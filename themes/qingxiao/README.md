# 鸣潮 · 清宵

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地玩家主题。原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- 以梦州云海、琴弦心剑、青玉冷光和水墨山形为主要意象。
- 清宵角色宣传图作为右侧视觉锚点，CSS 绘制月门、远山、剑阵、流云与篆印。
- 亮色模式使用宣纸白、天青与淡金；暗色模式切换为月夜靛青、青碧剑光与低亮金线。
- 适配 DSH 明暗模式、窄屏和 `prefers-reduced-motion`。
- 运行时仅从插件本地路由加载 WebP，不请求外部 CDN。
- 默认“省资源”模式保留人物、静态远山、月门和三柄心剑，不创建琴弦、浮叶、剑痕等动态层；可在主题中心恢复完整效果。

## 切换

安装后主题会出现在右下角“主题中心”。它可与爱弥斯、坎特蕾拉主题同时安装，但与官方外观之间始终互斥挂载。也可以程序化切换：

```js
window.__DSH_WUTHERING_THEME_HUB__.setActive('wuthering-qingxiao')
```

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

## 安装

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
dsh --profile web --dump-config
dsh web
```

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-qingxiao
```

卸载活动主题时会自动退回官方外观。
