# 鸣潮 · 爱弥斯

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地玩家主题。原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- 星海蓝、樱粉与暖金组成主色。
- 官方爱弥斯海报作为沉浸式背景，透明立绘作为右侧装饰层。
- 适配 DSH 明暗模式、窄屏和 `prefers-reduced-motion`。
- 图片预压缩为 WebP，由插件自己的本地路由并行加载，运行时不访问官方 CDN。
- 图片 URL 带内容哈希并使用长期缓存，刷新页面时可直接复用浏览器缓存。
- 默认“省资源”模式只挂载核心背景、立绘和一层静态轨道，不加载面板纹理或持续动画；可在主题中心恢复完整动态效果。

## 多主题切换

安装后，本主题会向页面右下角的“主题中心”注册，不再自动覆盖官方外观。多个角色主题可同时安装，但任一时刻只会挂载一个。选择会保存在浏览器 `localStorage`，且可以通过 `window.__DSH_WUTHERING_THEME_HUB__.setActive('wuthering-aemeath')` 程序化切换。

该主题只通过 `data-dsh-skin-aemeath` 作用域生效。切回官方外观、换用其他主题，或 DSH 停用/移除插件时，清理器会撤回主题节点、样式、标题和浏览器主题色。

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

`lib/client.js` 是生成文件，仅包含运行时代码、CSS 和本地 WebP 资源 URL；图片不会再以内嵌 Base64 扩大脚本体积。

## 分发包安装

发布者在仓库根目录执行：

```powershell
pnpm run theme:aemeath:release
```

命令会重建并校验主题，然后在 `release/` 生成 `.tgz`、`SHA256SUMS.txt`、`release.json` 和接收方安装说明 `INSTALL.md`。接收方在这些文件所在目录执行：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
dsh --profile web --dump-config
dsh web
```

组合配置中应出现 `ui-skin-wuthering-aemeath`。如 Web 服务已经运行，请先停止后重新启动。

## 卸载与恢复

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
```

重新启动 `dsh web` 后，主题注册的 DOM、样式、标题和 `theme-color` 会由 disposer 清理。

## 兼容范围

- 已针对 `@deepseek-ai/dsh@0.1.1-rc.2` 验证。
- Cordis peer 范围：`@deepseek-ai/cordis@^4.0.1`。
- DSH 仍处于开发者预览期；升级 DSH 后应重新运行构建、校验与隔离安装测试。
