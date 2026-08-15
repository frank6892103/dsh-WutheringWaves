# dsh-WutheringWaves

DeepSeek Harness Web GUI 的可替换《鸣潮》主题集合。

当前主题：

- `鸣潮 · 爱弥斯`：`themes/aemeath`

需求规格：[spec000：DeepSeek Harness Web GUI 鸣潮爱弥斯主题皮肤插件](spec000-DeepSeek-Harness-Web-GUI鸣潮爱弥斯主题皮肤插件.md)

每个主题都是独立的 DSH 客户端皮肤包，拥有自己的 `skin.json`、Cordis patch、构建产物和清理逻辑。安装另一个主题包即可替换，禁用或移除主题包后页面会恢复原始样式。

## 开发命令

```powershell
pnpm run theme:aemeath:build
pnpm run theme:aemeath:test
pnpm run web
```

主题素材来源、用途说明和版权边界见 [`themes/aemeath/NOTICE`](themes/aemeath/NOTICE)。
