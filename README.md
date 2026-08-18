# dsh-WutheringWaves

DeepSeek Harness Web GUI 的可替换《鸣潮》主题集合。

当前主题：

- `鸣潮 · 爱弥斯`：`themes/aemeath`

需求规格：

- [spec000：DeepSeek Harness Web GUI 鸣潮爱弥斯主题皮肤插件](docs/spec000-DeepSeek-Harness-Web-GUI鸣潮爱弥斯主题皮肤插件.md)
- [spec001：按照 DSH 插件发布规范打包](docs/spec001-按照DSH插件发布规范打包.md)
- [spec002：研究并增强浅色主题辨识度](docs/spec002-研究并增强浅色主题辨识度.md)
- [spec003：修复设置面板被侧栏裁剪](docs/spec003-修复设置面板被侧栏裁剪.md)

每个主题都是独立的 DSH 客户端皮肤包，拥有自己的 `skin.json`、Cordis patch、构建产物和清理逻辑。安装另一个主题包即可替换，禁用或移除主题包后页面会恢复原始样式。

## 开发命令

```powershell
pnpm run theme:aemeath:build
pnpm run theme:aemeath:test
pnpm run theme:aemeath:release
pnpm run web
```

`theme:aemeath:release` 会在 `release/` 生成可直接交付的 DSH 插件 `.tgz`、SHA-256 校验和、机器可读发布清单和安装说明。该流程不会发布到 npm。

主题素材来源、用途说明和版权边界见 [`themes/aemeath/NOTICE`](themes/aemeath/NOTICE)。
