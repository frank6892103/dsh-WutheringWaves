# spec010：GitHub Release 发布

> 状态：仓库已按集合版本 GitHub Release 改造；`v0.5.0` 起由推送标签后的 Actions 创建，当前集合版本见根 `package.json`（`v0.6.0` 起包含可拖动主题中心）
> 日期：2026-08-30
> 仓库：`frank6892103/dsh-WutheringWaves`
> 集合版本：根 `package.json` 的 `0.5.0`，对应 Git 标签与 Release `v0.5.0`

## 1. 目标

把可安装产物从“只存在于当前 `release/` 工作副本”升级为 GitHub Release：

- 按**集合版本号**浏览、下载和回滚历史发布；
- 每个 Release 附带标准 npm pack `.tgz`，DSH、pnpm、npm 都能从**远端 URL**或**本地文件**安装；
- 不把主题推到 npm registry 或 GitHub Packages，继续遵守 spec001 的 `private: true` 与素材权利边界。

## 2. 现状问题

改造前的分发方式是把当前六个 `.tgz` 放进 `release/` 并提交到 Git：

- GitHub 上没有 Release、没有版本标签，无法按版本号查看历史包；
- `release/` 只保留**最新**一套压缩包，旧版本被覆盖，git 历史里虽有 blob，但不构成可用的版本通道；
- README 只能写本地相对路径，克隆仓库的人才能安装，不能 `dsh plugin add <URL>`；
- 每次改主题都会重写数 MB 二进制，仓库膨胀但并不提供版本浏览。

`.tgz` 本身已经是合格的离线分发物（spec001）：`dsh plugin --profile web add` 把参数转交给 pnpm。缺的是稳定、按版本归档的托管位置。

## 3. 方案比较

| 方案 | 按版本浏览 | DSH / pnpm / npm 安装 | 与 `private: true` | 素材权利 | 结论 |
| --- | --- | --- | --- | --- | --- |
| 继续只提交 `release/*.tgz` | 无 | 仅本地路径 | 兼容 | 仅随 git clone 扩散 | 不满足目标 |
| 公开 npm registry | 有（registry 版本） | `npm i` / `pnpm add` 包名 | 必须去掉 `private` | 等于公开发布到公共库 | 否决（spec001） |
| GitHub Packages (`npm.pkg.github.com`) | 有 | 需改 scope registry，认证摩擦大 | 仍像“发 npm” | 同样扩大分发面 | 否决 |
| `github:owner/repo#tag` 装根包 | 有 tag | 装到的是仓库根 `dsh-wutheringwaves`，不是主题包 | 兼容 | 拉取整仓源码 | 否决 |
| `github:owner/repo#path:themes/...` | 有 tag | pnpm 可用，npm 不稳定；含源码与开发文件 | 兼容 | 下载大于 pack 白名单 | 仅开发备选 |
| **GitHub Release 上传 npm pack `.tgz`** | **Releases 页按 `vX.Y.Z` 浏览** | **HTTPS tarball 与本地 `.tgz` 均为标准包源** | **不需要 publish** | **按版本提供既有技术包，不新增 registry** | **采用** |

采用 GitHub Release 的直接原因：

1. GitHub 原生按标签列出 Release，满足“按版本号查看”。
2. `pnpm pack` 生成的 `.tgz` 是 npm/pnpm 的标准 tarball 源：本地路径与 `https://` URL 均可。
3. DSH 安装器把参数交给 pnpm，因此同一 URL 也可用于 `dsh plugin add`。
4. 不执行 `npm publish`，主题包保持 `private: true`。

## 4. 版本与标签约定

本仓库是多包集合：六个主题**各自**有 `package.json` 版本，GitHub Release 使用**集合版本**。

| 层级 | 来源 | 示例 |
| --- | --- | --- |
| 集合版本 | 根 `package.json` `version` | `0.5.0` |
| Git 标签 / Release | `v` + 集合版本 | `v0.5.0` |
| 主题包版本 | `themes/<id>/package.json` | 爱弥斯 `0.3.1`、若娜瓦 `0.2.2` |

规则：

- 新增主题、主题版本变化、发布通道或主题中心协议变化时，递增集合版本并打新标签。
- 禁止把主题包版本当成 Git 标签（例如 `aemeath-0.3.1`）。那会让 Releases 页出现多条并行“最新”，无法表达一套可共装主题。
- 主题版本仍出现在资源文件名里，便于核对 pack 内容。
- 标签必须与根 `package.json` 一致；CI 在 `GITHUB_REF_NAME != v${version}` 时失败。

## 5. Release 资源

每个 `vX.Y.Z` Release 上传：

```text
# 钉死某一集合版本（推荐生产安装）
dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
...（其余主题带版本号的 pack）

# 同字节副本，供 /releases/latest/download/ 使用
dsh-external-dsh-client-ui-skin-wuthering-aemeath.tgz
...（其余主题不带版本号的别名）

THEME-SHA256SUMS.txt
theme-release.json
INSTALL-THEMES.md
```

URL 形态：

```text
https://github.com/frank6892103/dsh-WutheringWaves/releases/tag/v0.5.0
https://github.com/frank6892103/dsh-WutheringWaves/releases/latest
https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/<带版本文件名>.tgz
https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/<不带版本文件名>.tgz
```

`/releases/latest/download/` 要求资源文件名在各次 Release 中保持不变，因此每个主题额外复制一份去掉 `-<version>` 的别名；内容与带版本文件相同，SHA-256 相同。

## 6. 安装矩阵

DSH 用户应使用 `dsh plugin --profile web add`，它会把包写入 web profile。pnpm / npm 能安装同一 `.tgz`，证明包是标准 tarball；若目标是 DSH GUI，仍应走 `dsh plugin`。

### 6.1 远端（GitHub Release）

钉死 `v0.5.0` 中的爱弥斯：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
```

跟随最新 Release：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-wuthering-aemeath.tgz
```

### 6.2 本地

下载 Release 资源，或在仓库根目录执行 `pnpm run themes:release`：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
```

开发期也可直接指向主题目录（非 pack，不作为对外分发）：

```powershell
dsh plugin --profile web add ./themes/aemeath
```

## 7. 仓库改造

| 改动 | 作用 |
| --- | --- |
| 根版本 `0.4.0` → `0.5.0`，写入 `repository` | 集合版本即 Release 标签 |
| `release/*.tgz` 不再纳入 Git | 二进制只活在 GitHub Release；本地仍由 `themes:release` 生成 |
| `theme-release.json` schema 2 | 增加集合版本、标签、下载 URL、latest 别名 |
| `scripts/release-meta.mjs` | 统一仓库名、标签、文件名与 URL |
| `scripts/release-themes.mjs` | 复制 latest 别名、写 RELEASE-NOTES 与远端安装命令 |
| `scripts/github-release.mjs` | 本地用 `gh` 发版（可选） |
| `.github/workflows/release.yml` | 推送 `v*.*.*` 标签后校验、打包并创建 Release |
| README / 各主题 README / INSTALL-THEMES | 同时给出远端 URL 与本地路径 |

发布流程：

1. 主题与集合版本已写入对应 `package.json`；
2. `pnpm run themes:test` 与 `pnpm run themes:release`；
3. 提交清单与说明（不含 `.tgz`）；
4. `git tag v0.5.0` 并推送标签；
5. Actions 创建 GitHub Release 并上传资源。

本地等价：`pnpm run github:release`（需已登录 `gh`）。不要在 Actions 与本地对同一标签各发一次。

## 8. 明确不做

- 不执行 `npm publish` / `pnpm publish`；
- 不配置 GitHub Packages npm registry；
- 不为单个主题建立独立 GitHub Release；
- 不把 GitHub 自动打包的 source tarball/zipball 当作安装源（含源码与开发文件，不是 `files` 白名单 pack）。

## 9. 验收标准

- GitHub Releases 页存在 `v0.5.0`（或后续集合版本），可与其它 `v*` 并列浏览；
- 该 Release 含全部带版本 `.tgz`、latest 别名、校验和与 `theme-release.json`；
- `dsh plugin --profile web add <Release 带版本 URL>` 成功；
- 下载到本地后 `dsh plugin --profile web add ./<file>.tgz` 成功；
- `pnpm add <同一 URL>` 与 `pnpm add ./<file>.tgz` 能解析该包名；
- `npm install <同一 URL>` 与 `npm install ./<file>.tgz` 能解析该包名；
- 主题包 `private` 仍为 `true`；
- 仓库 Git 树不再跟踪 `release/*.tgz`。
