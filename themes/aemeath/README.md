# 鸣潮 · 爱弥斯

DeepSeek Harness Web GUI 的独立客户端皮肤包。

## 视觉设计

- 星海蓝、樱粉与暖金组成主色。
- 官方爱弥斯海报作为沉浸式背景，透明立绘作为右侧装饰层。
- 适配 DSH 明暗模式、窄屏和 `prefers-reduced-motion`。
- 所有图片在构建时转为 Data URL，运行时不访问官方 CDN。

## 可替换性

该主题只通过 `data-dsh-skin-aemeath` 作用域生效。DSH 停用或移除插件时，注册的 effect 会清除主题节点、样式、标题和浏览器主题色。后续主题可按相同包结构添加到仓库根目录的 `theme-registry.json`。

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

`lib/client.js` 是生成文件，包含运行时代码、CSS 和内嵌图片。
