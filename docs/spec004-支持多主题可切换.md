# spec004：支持多主题可切换

状态：已完成
验收日期：2026-08-19
验证主题：鸣潮 · 坎特蕾拉

## 目标

允许多个角色主题包同时安装，并让用户在运行中的 DSH 页面内选择当前主题。任意时刻最多只能有一个角色主题生效；刷新页面或重启 Web 服务后应恢复上一次选择；用户还可以随时切回“官方外观”。

## 实现结论

DSH 的客户端插件组合机制允许多个皮肤插件同时加载，但其内建外观设置主要表示“浅色、深色、跟随系统”，不适合承担可扩展的角色主题 ID。spec004 因此增加独立的主题选择层，而不改变 DSH 原有的明暗色设置：

- `theme-registry.json` 描述可安装主题、选择器协议和持久化约定。
- `shared/theme-hub-runtime.js` 在浏览器中合并各插件注册信息，并只挂载当前选择的主题。
- 爱弥斯和坎特蕾拉仍是两个独立 DSH 插件；缺少其中任意一个时，选择器只展示实际已安装的主题。
- “角色主题”与“浅色/深色”正交；切换角色主题不会改写用户的 DSH 明暗偏好。

## 切换协议

所有主题包内嵌同一版本的共享运行时，并向全局 API `window.__DSH_WUTHERING_THEME_HUB__` 注册：

```js
window.__DSH_WUTHERING_THEME_HUB__.list()
window.__DSH_WUTHERING_THEME_HUB__.setActive('wuthering-cantarella')
window.__DSH_WUTHERING_THEME_HUB__.setActive('official')
```

切换采用事务式顺序：先执行旧主题的清理函数，再挂载新主题；只有挂载成功才写入选择并通知订阅者。若新主题挂载失败，运行时会重新挂载旧主题，因此不会留下半套样式。主题选择优先保存在 `localStorage`，不可用时回退到同源 Cookie。

选择器具备键盘焦点、对话框语义、Escape 关闭和点击外部关闭能力。最后一个主题插件卸载时，共享选择器与全局 API 也会被清理。

## 坎特蕾拉验证主题

坎特蕾拉主题使用深海蓝紫、梦境水流、水母与气泡意象，分别为 DSH 浅色和深色模式提供变量覆盖，并包含本地化角色立绘。主题装饰层不会给侧栏建立新的包含块，设置面板仍可脱离侧栏范围显示。

角色资料与视觉意象参考：

- Wuthering Waves 官方角色战斗演示：<https://www.youtube.com/watch?v=UcBPzBWCNW8>
- Wuthering Waves DB 角色资料及游戏 UI 素材镜像：<https://wuwa.incin.net/resonators/1607>

素材来源、获取日期和权利边界记录在 `themes/cantarella/assets/source.json` 与 `themes/cantarella/NOTICE`。该角色素材仅定位为非商业、本地玩家主题，不随原创代码的 MIT 许可授权。

## 验收结果

在 `@deepseek-ai/dsh@0.1.0-rc.6` 的真实 1280×720 页面完成以下验证：

| 场景 | 结果 |
| --- | --- |
| 两个插件同时安装 | `dump-config` 同时出现 `ui-skin-wuthering-aemeath` 与 `ui-skin-wuthering-cantarella` |
| 选择坎特蕾拉 | 仅 `data-dsh-skin-cantarella` 生效，标题、主题色和装饰正确 |
| 选择爱弥斯 | 坎特蕾拉节点全部清理，仅爱弥斯生效 |
| 连续互切 20 轮 | 始终只有一个主题属性、一个主题色节点，无残留所有者 |
| 恢复官方外观 | 两套主题属性和节点均归零，页面标题恢复 `DeepSeek Harness` |
| 刷新与服务重启 | 坎特蕾拉选择自动恢复 |
| DSH 明暗切换 | 主题保持激活，浅色和深色样式均正确；设置面板未被裁剪 |
| 浏览器控制台 | 验收流程中错误数为 0 |

自动化校验覆盖注册表结构、主题 ID 唯一性、互斥激活、持久化、失败回滚、官方外观清理、构建产物和本地素材引用：

```powershell
pnpm run themes:build
pnpm run themes:test
pnpm run themes:release
```

## 安装与交付

`release/` 中的爱弥斯与坎特蕾拉 `.tgz` 可同时安装，联合校验和见 `THEME-SHA256SUMS.txt`，机器可读清单见 `theme-release.json`，完整命令见 `INSTALL-THEMES.md`。

主题选择按浏览器同源保存，不跨不同主机名、端口或浏览器同步。这是当前实现的明确边界。
