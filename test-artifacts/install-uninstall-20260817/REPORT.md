# DSH 爱弥斯主题安装/卸载验收报告

测试日期：2026-08-17

## 测试对象

- 发布包：`release/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.0.tgz`
- 包名：`@dsh-external/dsh-client-ui-skin-wuthering-aemeath`
- 版本：`0.1.0`
- DSH：`@deepseek-ai/dsh@0.1.0-rc.6`
- Web 地址：`http://127.0.0.1:3180/`

## 基线与保护范围

测试前备份了 Web profile 的：

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `cordis.patch.yml`
- `cordis.yml`

同时对用户级 `.anonymous-user-id`、`.credentials.yaml`、`settings.yaml`、`sessions/` 和 `storages/` 下共 7 个文件记录长度与 SHA-256。报告不复制凭据或会话内容。

测试前发现 profile 中已有一个旧开发 junction，指向工作区 `themes/aemeath`。该 junction 来自既有 link 安装，不属于发布 tarball。为避免把开发源码误当作发布包，先从 profile 删除该 junction，并确认工作区 `package.json` 与 `lib/client.js` 前后哈希不变。

## 干净安装结果

- `dsh plugin --profile web add <tarball>` 成功。
- profile 依赖改为发布 `.tgz` 的 `file:` 规格。
- `dsh.profile.bundles` 正确加入真实包名。
- 实际安装目录不是工作区 junction，包版本为 `0.1.0`，包含 11 个发布文件。
- `dsh --profile web --dump-config` 成功解析 `ui-skin-wuthering-aemeath`。
- 从干净重启的 DSH Web 页面验证：
  - 标题：`鸣潮 · 爱弥斯 | DeepSeek Harness`
  - body scope：存在
  - owner 节点：3
  - scene：1
  - HUD：1
  - 主题 style：1
  - `theme-color`：`#081328`
  - composer：存在
  - 新页面控制台 warning/error：0

证据：`installed-main.webp`。

## 干净卸载结果

- `dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath` 成功。
- `package.json` 不再包含插件依赖。
- `dsh.profile.bundles` 只保留 `@deepseek-ai/dsh-base` 和 `@deepseek-ai/dsh-web-app`。
- lockfile 与 profile 文件中无主题引用。
- `node_modules/@dsh-external/dsh-client-ui-skin-wuthering-aemeath` 不存在。
- `--dump-config` 中无主题 ID 或包名。
- 从卸载后重新启动的 DSH Web 页面验证：
  - 标题：`DeepSeek Harness`
  - body scope：不存在
  - owner 节点：0
  - scene：0
  - HUD：0
  - 主题 style：0
  - 主题 script：0
  - `theme-color`：恢复为 DSH 的 `rgb(21, 21, 23)`
  - composer：存在
  - 新页面控制台 warning/error：0

证据：`uninstalled-main.webp`。

## 用户数据影响对比

- 受保护文件数：安装前 7，卸载后 7。
- settings、credentials、sessions、storages：0 个新增、删除或哈希变化。
- `cordis.patch.yml`：未变化。
- `pnpm-workspace.yaml`：未变化。
- `cordis.yml`：未变化。
- `package.json` 与 `pnpm-lock.yaml`：按预期变化，因为最终状态由“旧 link 已安装”变为“插件已卸载”。
- 工作区主题源码：删除旧 junction 前后哈希一致，未被删除或改写。

## 结论

最终状态为插件已卸载、官方界面恢复。未发现对用户凭据、设置、会话、存储、工作区源码或 DSH 基础配置的破坏性影响。

安装时 pnpm 会显示 Cordis peer dependency 提示；这与参考 DSH 皮肤包的 peer 声明一致，本次实际启动、组合配置和客户端加载均通过。pnpm 的全局内容寻址缓存可能保留包数据，但 profile 中不存在可加载的插件路径或配置引用。
