# spec001：按照 DSH 插件发布规范打包

> 状态：v0.1.0 技术分发包已实现并完成隔离验收
> 日期：2026-08-17

## 1. 目标

把 `themes/aemeath` 整理为可由其他 DSH 用户通过标准 profile 插件命令安装的离线 `.tgz`，同时保留可重复构建、内容校验、安装恢复和素材权利边界。

本次不执行 npm 发布。包保留 `private: true`，避免在包名 scope 和素材公开发布权利尚未确认时被误推送到 registry。

## 2. DSH 包规范

主题包必须具备：

- `package.json` 中的 `dsh.bundle.patch`，指向包内 `cordis.patch.yml`；
- `package.json` 中面向 Web 的 `dsh.client` 声明；
- `cordis.patch.yml` 中稳定且唯一的 Cordis row ID；
- 预构建 `lib/index.js` 与 `lib/client.js`，接收方无需源码构建；
- 标准 `skin.json` 元数据、亮暗预览、代码许可、素材 `NOTICE` 和安装/卸载说明；
- npm `files` 白名单，排除源码构建依赖、根仓库文件和未使用的原始素材副本。

DSH 安装器会把 `dsh plugin --profile web` 后的参数转交给 pnpm，并把声明了 `dsh.bundle` 的真实包名加入 profile 的 `dsh.profile.bundles`。因此 `.tgz` 是无需 npm registry 的标准离线分发形式。

## 3. 发布物

执行：

```powershell
pnpm run theme:aemeath:release
```

生成：

```text
release/
├── dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.0.tgz
├── INSTALL.md
├── release.json
└── SHA256SUMS.txt
```

发布脚本先重建 `lib/client.js`，再运行主题一致性测试，最后调用 `pnpm pack` 并计算 SHA-256。`.tgz` 只包含运行所需的构建产物和分发文档，不包含 `node_modules`、开发脚本或根仓库配置。

## 4. 接收方安装与恢复

安装：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.0.tgz
dsh --profile web --dump-config
dsh web
```

卸载：

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
```

安装后组合配置必须包含 `ui-skin-wuthering-aemeath`。卸载并重启后，页面必须恢复官方外观，且不存在主题 owner 节点、body scope、标题或 `theme-color` 残留。

## 5. 兼容性

- 已验证 DSH：`@deepseek-ai/dsh@0.1.0-rc.6`。
- Cordis peer：`@deepseek-ai/cordis@^4.0.1`。
- DSH 官方仍将项目标记为开发者预览，存在兼容性破坏风险；每次升级 DSH 后必须重新执行发布与隔离安装验收。

## 6. 权利边界

- 原创代码：MIT，见 `themes/aemeath/LICENSE-CODE`。
- 角色和美术素材：不在 MIT 范围内，来源与限制见 `themes/aemeath/NOTICE` 和 `assets/source.json`。
- 当前技术包定位为非商业、本地玩家主题。素材公开发布许可尚未得到本仓库证据确认；公开发布或扩大分发前，由分发者完成适用的权利和平台规则确认。

## 7. 验收标准

- 构建与 `scripts/verify.mjs` 通过；
- `pnpm pack` 成功且内容只来自 `files` 白名单；
- 亮暗预览为真实 DSH 页面截图，格式为 WebP；
- SHA-256 与 `release.json`、`SHA256SUMS.txt` 一致；
- 在隔离的 DSH home 中从 `.tgz` 安装成功；
- profile 依赖与 `dsh.profile.bundles` 使用真实包名；
- `--dump-config` 能解析 `ui-skin-wuthering-aemeath`；
- 卸载命令和恢复说明随发布物交付。
