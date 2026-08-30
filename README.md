# dsh-WutheringWaves

DeepSeek Harness Web GUI 的可替换角色主题集合，最初以《鸣潮》主题起步。

当前主题：

- `鸣潮 · 爱弥斯`：`themes/aemeath`
- `鸣潮 · 坎特蕾拉`：`themes/cantarella`
- `鸣潮 · 心月狐`：`themes/xinyuehu`
- `鸣潮 · 清宵`：`themes/qingxiao`
- `三体 · 章北海`：`themes/zhangbeihai`
- `原神 · 若娜瓦`：`themes/ronova`

需求规格：

- [spec000：DeepSeek Harness Web GUI 鸣潮爱弥斯主题皮肤插件](docs/spec000-DeepSeek-Harness-Web-GUI鸣潮爱弥斯主题皮肤插件.md)
- [spec001：按照 DSH 插件发布规范打包](docs/spec001-按照DSH插件发布规范打包.md)
- [spec002：研究并增强浅色主题辨识度](docs/spec002-研究并增强浅色主题辨识度.md)
- [spec003：修复设置面板被侧栏裁剪](docs/spec003-修复设置面板被侧栏裁剪.md)
- [spec004：支持多主题切换](docs/spec004-支持多主题可切换.md)
- [spec005：主题插件性能极致优化](docs/spec005-主题插件性能极致优化.md)
- [spec006：鸣潮心月狐主题](docs/spec006-鸣潮心月狐主题.md)
- [spec007：鸣潮清宵主题](docs/spec007-鸣潮清宵主题.md)
- [spec008：三体章北海主题](docs/spec008-三体章北海主题.md)
- [spec009：原神若娜瓦主题](docs/spec009-原神若娜瓦主题.md)

每个主题都是独立的 DSH 客户端皮肤包，拥有自己的 `skin.json`、Cordis patch、构建产物和清理逻辑。多个主题包可以同时安装；页面右下角的“主题中心”负责互斥切换，并把选择保存在当前 DSH 站点。选择“官方外观”或禁用全部主题包后，页面会恢复原始样式。

主题中心默认启用面向云电脑的“省资源”模式：主题保持完整配色和人物主体，但不运行持续动画、实时模糊或非必要装饰层，隐藏的主题预览也不会提前加载。可在主题中心切换为“完整”动态效果；选择会按站点持久化。程序化接口为 `setPerformance('economy' | 'full')`。

## 开发命令

```powershell
pnpm run theme:aemeath:build
pnpm run theme:aemeath:test
pnpm run theme:cantarella:build
pnpm run theme:cantarella:test
pnpm run theme:xinyuehu:build
pnpm run theme:xinyuehu:test
pnpm run theme:qingxiao:build
pnpm run theme:qingxiao:test
pnpm run theme:zhangbeihai:build
pnpm run theme:zhangbeihai:test
pnpm run theme:ronova:build
pnpm run theme:ronova:test
pnpm run themes:build
pnpm run themes:test
pnpm run themes:release
pnpm run web
```

`themes:release` 会在 `release/` 同时生成六套可直接交付的 DSH 插件 `.tgz`、联合 SHA-256 校验和、机器可读发布清单和安装说明。该流程不会发布到 npm。

主题素材来源、用途说明和版权边界分别见 [`themes/aemeath/NOTICE`](themes/aemeath/NOTICE)、[`themes/cantarella/NOTICE`](themes/cantarella/NOTICE)、[`themes/xinyuehu/NOTICE`](themes/xinyuehu/NOTICE)、[`themes/qingxiao/NOTICE`](themes/qingxiao/NOTICE)、[`themes/zhangbeihai/NOTICE`](themes/zhangbeihai/NOTICE) 与 [`themes/ronova/NOTICE`](themes/ronova/NOTICE)。
