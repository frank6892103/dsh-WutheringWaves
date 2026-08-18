# spec000：DeepSeek Harness Web GUI 鸣潮爱弥斯主题皮肤插件

> 状态：v0.1.0 已实现并完成本地验收
> 日期：2026-08-15
> 目标仓库：`dsh-WutheringWaves`
> 实际皮肤 ID：`wuthering-aemeath`
> 实际显示名：`鸣潮 · 爱弥斯 / Wuthering Waves · Aemeath`

> 文档说明：第 1～15 节保留最初研究与完整产品蓝图；第 16 节记录本次实际交付，若两者存在差异，以第 16 节为准。

## 1. 摘要

本项目拟实现一套面向 DeepSeek Harness（DSH）Web GUI 的鸣潮风格主题皮肤，并把“可选、可替换”作为一等能力，而不是安装后永久覆盖界面。

推荐的产品形态是“皮肤载荷 + 选择器”两层：

1. `skin-wuthering-waves` 仅负责浏览器展示层，遵循 DSH 标准客户端皮肤包形态；
2. `skin-selector` 提供“官方默认 / 鸣潮主题”的试穿、应用、恢复与状态展示；
3. 同一页面任意时刻只允许一个皮肤处于活动状态；
4. 切换、退出试穿、卸载或加载失败时，必须完整恢复原有 DOM、CSS、favicon、标题、观察器与计时器；
5. 运行时不依赖远程素材，不修改模型请求，不注入业务服务，不改变 DSH 原生交互语义。

本 spec 对“主题可选和可替换”的解释如下：

- **可选**：安装聚合包后默认仍可保持 DSH 官方外观；用户从设置页主动试穿或应用鸣潮主题。
- **可替换**：可在官方默认、鸣潮主题以及未来注册的其他皮肤之间互斥切换，不叠加多套皮肤；切换失败回滚到切换前状态。
- **亮/暗主题**：属于同一鸣潮皮肤的配色变体，跟随 DSH 原生亮暗模式，不算两套独立皮肤。

## 2. 研究范围与结论

### 2.1 参考项目 `dsh-deep-whale`

研究对象：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)。该仓库是独立皮肤分发仓库，目前包含 `maid-atelier` 皮肤。

确认的可复用模式：

- 标准包结构包含 `package.json`、`cordis.patch.yml`、`skin.json`、`src/index.ts`、`src/client/`、`tests/`、`lib/`、预览图和许可文件。
- host 入口不承担业务逻辑；真正的主题行为位于浏览器 client bundle。
- `skin.json` 提供 `id`、中英文名称、作者、简介、标签、强调色、body 作用域属性、包名、wiring ID、亮暗预览图和排序值。
- 皮肤通过唯一 body 属性（参考项目为 `data-dsh-maid-atelier`）限定 CSS 作用域。
- `apply(ctx)` 在任何可能失败的工作之前注册 `ctx.effect` 清理器，随后才写入 body 属性、CSS 变量和皮肤 DOM。
- 所有创建节点带 owner 标记并被集中追踪；所有装饰过的宿主节点也被追踪，销毁时只撤销当前皮肤拥有的写入。
- 亮暗背景跟随宿主的 `data-ds-dark-theme`；MutationObserver 只监听必要属性和结构变化。
- 使用 ResizeObserver 跟随侧栏宽度，并覆盖宽侧栏、窄侧栏和 rail 状态。
- 素材编译进 client bundle，激活阶段不依赖临时文件、远程 URL 或额外资源服务。
- 展示层不发 Cordis 事件、不修改模型请求；可访问性上保留 focus-visible，并尊重 `prefers-reduced-motion`。

不能直接照搬的部分：

- `dsh-deep-whale` 的独立安装路径会把皮肤行写入插件图，天然更接近“安装即生效”；本项目要求默认可不启用，因此必须单独设计选择器或默认禁用行。
- 参考皮肤针对具体版本 DOM 使用了大量类名片段选择器。鸣潮皮肤应建立选择器兼容层，优先使用 `data-*`、ARIA 和稳定 slot，类名片段只能作为降级路径。
- 参考仓库整体以 CC BY-NC-SA 4.0 分发。除非明确复用其代码或素材并履行许可，本项目不能默认继承其素材；实现阶段应优先依据 Apache-2.0 脚手架独立实现。

### 2.2 DSH 皮肤中心与互斥切换机制

研究对象：[zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)，研究时 `main` 最新提交为 `1c818e6`（2026-08-15）。

确认的机制：

- `dsh-skins` 聚合包将皮肤元数据和 bundle 作为包内资产分发，皮肤本身不必全部加入启动图。
- 皮肤中心先展示元数据；用户点击“试穿”后，才通过同源 `<script>` 按需加载对应 client bundle。
- bundle 通过页面原生模块加载器注册并实例化，不使用 `eval`，无需 CSP `unsafe-eval`。
- 试穿前暂时撤回当前皮肤写入；退出时先执行试穿皮肤 disposer，再清理模块与样式，最后逐字恢复原活动皮肤快照。
- “应用”由 host API 调用皮肤切换逻辑，更新 `~/.dsh/cordis.patch.yml` 的托管区段；写入采用同目录临时文件加原子 rename，避免半写文件。
- 所有非活动皮肤通过 ID 定向写入 `disabled: true`，确保同一时间只有一个皮肤启用；“官方默认”表示禁用所有皮肤。
- 配置 watcher 在数秒内热加载配置，浏览器刷新后读取新插件图；无需重启 `dsh web`。

重要限制：

- 当前 `dsh-web-ui` 的皮肤列表和 CLI 注册表以仓库内皮肤为主。一个外部分发的 `skin.json` 并不自动等于会出现在现有皮肤中心中。
- 因此本项目不能仅写“兼容 skin-center”就视为满足“可选”。必须提供明确的注册/发现路径，或随项目分发自己的轻量选择器。

### 2.3 鸣潮主题素材与知识产权边界

鸣潮官方二次创作指南允许个人或非法人团体在非营利范围内创作二次作品，但禁止低创作度地直接复制、扫描、采样或描摹官方插画、影像、音频、文字等素材，也禁止冒充官方或造成官方关联误解。指南可能随时变化。

据此，本项目默认策略为：

- 不从游戏官网、游戏安装包或第三方壁纸站直接提取并再分发背景、角色立绘、Logo、字体、音乐或音效。
- MVP 使用原创或明确取得授权的“鸣潮氛围启发”素材，保留作者、来源、授权范围和修改记录。
- UI 可借鉴“声波、共鸣、黑白终端、青绿色信号、环形频谱”等抽象视觉语言，但不得直接描摹具体 Logo、角色、图标或界面素材。
- README 和界面必须声明“非官方粉丝作品，与库洛游戏无隶属或认可关系”。
- 默认定位为非商业分发；若未来要商业化，必须先完成独立法律审查与书面授权。

实现阶段的素材决策发生了变更：用户明确要求首个主题使用官方攻略站的爱弥斯素材。本地 v0.1.0 因而使用库街区鸣潮官方 WIKI 的海报、透明立绘和图鉴背景，并在 `themes/aemeath/NOTICE` 与 `themes/aemeath/assets/source.json` 记录来源、原始 CDN URL、获取日期和非官方声明。该决策仅覆盖本地、非商业安装与测试，不代表获得素材再分发或商业使用许可；公开发布前仍需单独完成权利审查。

## 3. 产品目标

### 3.1 P0 目标

- 提供一套完整、可用、可读的鸣潮风格 DSH Web GUI 皮肤。
- 支持官方默认与鸣潮主题之间的试穿、应用、恢复。
- 支持 DSH 原生亮色/暗色模式实时切换。
- 支持宽/窄/rail 侧栏、对话页、工作区/轨迹页、设置与弹层、浏览器和桌面壳。
- 皮肤所有副作用可撤销，连续切换不累积节点、监听器、observer 或 inline style。
- 在缺失素材、bundle 加载失败、host apply 失败或配置并发变化时安全回滚并给出可操作错误。

### 3.2 P1 目标

- 从受信任的安装清单发现其他符合 schema 的皮肤，使选择器可在多套皮肤之间替换。
- 支持鸣潮内部“场景包”替换，例如通用索拉里斯、今州、黑海岸等原创视觉包；场景包只替换 token 和素材，不产生多个同时活动的皮肤实例。
- 支持导入本地用户素材包，并在应用前校验尺寸、格式、哈希和许可声明。
- 提供自动预览截图与视觉回归基线。

### 3.3 非目标

- 不改变 DSH 模型选择、提示词、工具调用、会话状态或网络请求。
- 不实现鸣潮游戏功能、角色养成、抽卡、战斗、音频播放器或账号连接。
- 不在 MVP 中下载远程壁纸、动态脚本、字体或追踪代码。
- 不承诺兼容所有历史 DSH 版本；仅支持明确列出的版本窗口。
- 不在 MVP 中复刻鸣潮原生 UI 的每个像素。

## 4. 用户故事

1. 作为现有 DSH 用户，我安装插件后仍可保留官方默认外观，不被强制换肤。
2. 作为想预览主题的用户，我可以点击“试穿”立即查看鸣潮皮肤，退出后原界面逐项恢复。
3. 作为喜欢主题的用户，我可以点击“应用”，数秒内切换完成，刷新后仍保持选中状态。
4. 作为想恢复的用户，我可以选择“官方默认”，所有鸣潮 DOM、样式和图标都被撤回。
5. 作为使用暗色模式的用户，我切换 DSH 亮暗模式时背景和 token 同步变化，不需要重新加载皮肤。
6. 作为使用桌面壳或窄侧栏的用户，我的原生控制仍可点击，装饰层不遮挡拖动区、弹窗或审批按钮。
7. 作为维护者，我可以替换一组本地原创素材而不重写生命周期逻辑，并能通过自动测试确认没有资源泄漏。

## 5. 信息架构与交互

### 5.1 设置入口

首选入口：`设置 → 插件配置 → Web UI 插件 → 主题皮肤`。

皮肤卡片至少展示：

- 官方默认；
- 鸣潮：潮声终端；
- 当前活动标记；
- 亮/暗预览图；
- 作者、许可和非官方声明；
- `试穿`、`退出试穿`、`应用` 或 `恢复默认`；
- 加载中、应用中、成功、失败状态。

### 5.2 状态机

```text
idle(active=A)
  ├─ tryOn(B) ─> loading(B) ─> previewing(B, snapshot=A)
  │                 └─ error ─> rollback(A) ─> idle(A)
  ├─ exitPreview ─────────────────────────────> idle(A)
  └─ apply(B) ─> applying(B, revision=R)
                    ├─ success ─> refreshing ─> idle(active=B)
                    └─ conflict/error ─> rollback(A) ─> idle(A)
```

约束：

- `loading`、`applying` 期间禁用重复提交，但必须保留取消试穿能力。
- 新的试穿请求必须先完整 dispose 前一个试穿实例。
- 页面关闭、设置卡卸载、路由切换时自动退出试穿。
- 应用请求携带状态 revision；revision 不匹配返回冲突，不覆盖用户或其他工具的新配置。
- UI 不能只依赖按钮文案表达状态，需同时提供可访问的 status/live region。

### 5.3 失败提示

错误至少区分：

- `BUNDLE_NOT_FOUND`：主题资源未安装或未构建；
- `BUNDLE_LOAD_FAILED`：同源脚本加载失败；
- `INVALID_SKIN_MANIFEST`：`skin.json` 不合法；
- `PATCH_CONFLICT`：配置 revision 已变化；
- `PATCH_WRITE_FAILED`：无权限、磁盘或原子替换失败；
- `APPLY_TIMEOUT`：配置 watcher 未在期限内反映新状态；
- `ROLLBACK_FAILED`：必须建议刷新页面，并在服务端保留旧配置文件。

每个 host apply 错误都应附带一条等价的终端回退命令，但不得显示敏感路径或环境变量内容。

## 6. 视觉规范（MVP）

### 6.1 设计方向

主题名暂定“潮声终端 / Echo Terminal”，强调抽象的共鸣与声波技术感：

- 黑、雾白、石墨灰构成基础；
- 青绿色作为共鸣信号色，低饱和金色作为稀有强调；
- 使用频谱线、环形声纹、断续刻度、终端括号和轻量噪点作为原创装饰语言；
- 面板采用高可读性的半透明/磨砂层，但避免背景穿透导致正文低对比度；
- 对话内容区保持克制，装饰集中于背景、标题、侧栏、输入区边框和状态钩子；
- 不直接复刻鸣潮 Logo、角色立绘、官方字体或游戏图标。

### 6.2 暂定 token

以下为实现起点，不宣称是官方色值；视觉评审可在不改变语义名称的前提下调整数值。

| Token | 亮色 | 暗色 | 用途 |
| --- | --- | --- | --- |
| `--ww-bg-base` | `#ECEDE8` | `#0A1115` | 页面基底 |
| `--ww-surface` | `rgba(250,251,248,.86)` | `rgba(17,27,31,.84)` | 主面板 |
| `--ww-surface-strong` | `#F7F8F4` | `#132127` | 输入框/弹层 |
| `--ww-text-primary` | `#171C1E` | `#F0F5F3` | 正文 |
| `--ww-text-secondary` | `#596265` | `#AAB8B7` | 次级信息 |
| `--ww-signal` | `#168F87` | `#72E2D6` | 主强调与焦点 |
| `--ww-signal-soft` | `#9ADFD7` | `#245E5B` | 选中背景 |
| `--ww-gold` | `#9B7A39` | `#D4B56E` | 次强调 |
| `--ww-danger` | `#B33B42` | `#FF7B82` | 错误 |
| `--ww-outline` | `rgba(22,143,135,.42)` | `rgba(114,226,214,.46)` | 边框/焦点 |

### 6.3 页面覆盖面

- Landing / hero：背景声纹、标题区、响应式输入框框体。
- Conversation：消息列表保持高可读；角色/主视觉退到安全边缘，不侵入正文列。
- Sidebar：宽、窄、rail 三态；选中会话、工作区组、搜索、新会话和 footer 均可识别。
- Workspace / trace / inspector：复用克制背景，不遮挡 diff、日志、代码和审批操作。
- Settings / modal / popover：正确层叠，装饰层 `pointer-events: none`，原生焦点顺序不变。
- Desktop shell：兼容固定标题栏和 Window Controls Overlay；不得覆盖系统窗口按钮或拖动区域。

### 6.4 动效

- 只使用 opacity、transform 和小范围 filter，避免布局抖动。
- 加载、思考、工具运行可分别使用稳定的宿主状态属性作为动画钩子；找不到钩子时静态降级。
- 所有循环动效在 `prefers-reduced-motion: reduce` 下停止。
- 页面切换或试穿退出后不存在继续运行的 rAF、timer 或 observer。

## 7. 技术架构

### 7.1 推荐目录

```text
dsh-WutheringWaves/
├─ packages/
│  ├─ skin-wuthering-waves/
│  │  ├─ assets/
│  │  ├─ preview/
│  │  ├─ src/index.ts
│  │  ├─ src/client/index.ts
│  │  ├─ src/client/wuthering-waves.module.css
│  │  ├─ tests/apply.spec.ts
│  │  ├─ package.json
│  │  ├─ cordis.patch.yml
│  │  ├─ skin.json
│  │  ├─ LICENSE-CODE
│  │  └─ NOTICE-ASSETS.md
│  ├─ skin-selector/
│  │  ├─ src/index.ts
│  │  ├─ src/routes.ts
│  │  ├─ src/client/Selector.tsx
│  │  ├─ src/client/try-on.ts
│  │  └─ tests/
│  └─ dsh-wuthering-waves/
│     ├─ aggregate.yml
│     └─ package.json
├─ scripts/
│  ├─ embed-art.mjs
│  ├─ build-registry.mjs
│  └─ capture-previews.mjs
├─ docs/e2e/
└─ docs/spec000-DeepSeek-Harness-Web-GUI鸣潮爱弥斯主题皮肤插件.md
```

若实现阶段确认现有 DSH 皮肤中心已经支持安全的外部动态注册，可删除 `skin-selector`，改为最小集成；在确认前不得假定该能力存在。

### 7.2 包与 wiring

暂定标识：

| 类型 | 值 |
| --- | --- |
| skin ID | `wuthering-waves` |
| Cordis row ID | `ui-skin-wuthering-waves` |
| body scope | `data-dsh-wuthering-waves` |
| npm package | `@dsh-external/dsh-client-ui-skin-wuthering-waves` |
| selector row ID | `ui-skin-wuthering-waves-selector` |
| aggregate package | `@dsh-external/dsh-wuthering-waves` |

聚合包安装后的初始图应为：选择器启用，鸣潮 skin row 已可解析但由 home/profile 覆盖层禁用。只有用户明确“应用”后才启用皮肤。

### 7.3 `skin.json` schema

P0 必需字段：

```json
{
  "schemaVersion": 1,
  "id": "wuthering-waves",
  "name": "潮声终端",
  "nameEn": "Echo Terminal",
  "author": "TBD",
  "tagline": "共鸣声纹、黑白终端与青绿信号",
  "description": "TBD",
  "tags": ["fanwork", "wave", "terminal", "glass"],
  "accent": "#72E2D6",
  "bodyAttr": "data-dsh-wuthering-waves",
  "package": "@dsh-external/dsh-client-ui-skin-wuthering-waves",
  "wiring": {
    "id": "ui-skin-wuthering-waves",
    "bundleWired": true
  },
  "preview": {
    "light": "preview/light.webp",
    "dark": "preview/dark.webp"
  },
  "license": {
    "code": "TBD",
    "assets": "SEE-NOTICE",
    "commercialUse": false
  },
  "order": 10
}
```

选择器必须拒绝未知 `schemaVersion`、重复 ID、非法 bodyAttr、缺少 bundle 或包名与允许清单不一致的 manifest。

### 7.4 client 生命周期

`apply(ctx)` 必须遵循以下顺序：

1. 获取 `document.body` 和待修改对象的原始快照；
2. 创建本次 activation token；
3. 立即向 `ctx.effect` 注册清理器；
4. 添加唯一 body scope；
5. 写入本地素材 CSS 变量与 token；
6. 挂载 owner 标记的纯装饰节点；
7. 初始化有限范围的 MutationObserver / ResizeObserver / listener；
8. 首次同步亮暗、侧栏宽度、页面阶段和标题栏高度；
9. 任一步失败时调用同一个 disposer，并重新抛出可诊断错误。

disposer 必须：

- 幂等；可调用多次而不抛错；
- 只删除本 activation token 拥有的节点和属性；
- 清理 timer、rAF、listener、MutationObserver、ResizeObserver；
- 恢复 body inline property 的原值与优先级，而不是简单 `removeProperty`；
- 只在 favicon、title、theme-color 仍等于当前皮肤写入值时恢复，避免覆盖其他插件的新值；
- 清理装饰在宿主节点上的所有 dataset；
- 支持 apply 过程中部分失败；
- 支持 apply → dispose → apply 热切换，且不产生重复节点。

### 7.5 CSS 与 DOM 约束

- 所有常规选择器以 `body[data-dsh-wuthering-waves]` 为根作用域。
- 优先级顺序：稳定 `data-*` / slot → ARIA/role → 语义标签组合 → 类名片段降级。
- 类名片段集中在 `selectors.ts`，不得散落在业务与样式文件中；每个 fallback 需有版本注释和无匹配时的安全降级。
- 创建节点统一带 `data-skin-owner="wuthering-waves:<activation-token>"` 和 `aria-hidden="true"`。
- 所有覆盖层默认 `pointer-events: none`；如确需交互，必须单独列出键盘、焦点与清理测试。
- 不隐藏 DSH 原生可操作控件；不通过 `!important` 粗暴压制 modal、toast、approval、command palette。
- 避免对整个 body subtree 的每次 mutation 做全量查询；observer 回调应按记录分类，只更新相关区域。

### 7.6 亮暗同步

- 以宿主 `body[data-ds-dark-theme]` 为当前事实来源。
- 首次 apply 同步一次；之后只监听 `data-ds-dark-theme`。
- 亮暗切换只替换 token 与背景引用，不重复创建 DOM。
- 不修改或接管宿主主题设置服务。

### 7.7 素材管线

- 源素材位于 `assets/`，生成文件可提交，但必须可从仓库输入稳定重建。
- `embed-art.mjs` 输出 data URI/静态模块；产物不得包含绝对机器路径、临时目录或远程 URL。
- 每个素材在 `NOTICE-ASSETS.md` 记录：文件名、作者、来源、原许可、是否修改、修改者、生成链和 SHA-256。
- 预览图与运行时素材分开，皮肤选择器首屏只加载预览缩略图或元数据。
- 默认禁止 SVG 中的脚本、外链、foreignObject；用户导入素材需重新编码或净化。

### 7.8 选择器 host API

```text
GET  /api/wuthering-waves/skins
GET  /api/wuthering-waves/skins/:id/bundle
POST /api/wuthering-waves/skins/apply
```

列表响应最小模型：

```ts
interface SkinListResponse {
  revision: string
  activeId: string | null // null = official
  skins: Array<SkinMetadata>
}
```

应用请求：

```ts
interface ApplySkinRequest {
  id: string | null
  expectedRevision: string
}
```

安全要求：

- API 仅接受清单中的 ID，禁止把用户字符串拼接进 shell 命令。
- 需要调用 CLI 时使用参数数组；Windows `.cmd` 兼容路径也不得回退到未转义字符串拼接。
- 仅允许来自本机 DSH 页面且通过现有鉴权/来源检查的请求。
- patch 修改必须持锁，先校验 revision，再生成完整内容，写同目录临时文件，fsync（若平台支持）后原子替换。
- 只修改明确标记的托管区段，保留其余用户配置；写前保留最近一个可恢复备份。
- 不得与现有 `dsh-skin managed` 区段创建两个互相竞争的真相源。若检测到现有管理器，必须复用其协议或停止并提示迁移。

### 7.9 试穿引擎

试穿必须使用真实 client bundle，而非静态模拟：

1. 记录活动皮肤的可恢复视觉快照；
2. 暂时撤回活动皮肤的 scope 与皮肤直系装饰节点，并抑制其 observer 写回；
3. 通过同源 script 和 DSH 模块加载器按需载入目标 bundle；
4. 用最小 `miniCtx.effect(cb)` 接收 disposer；
5. 退出时先 dispose 试穿皮肤，再 invalidate 模块并移除其 style；
6. 最后逐字恢复原活动皮肤快照；
7. 加载或 apply 失败时走同一恢复流程。

不得使用 `eval`、`new Function`、远程模块 URL 或永久修改 `window.__DSH_MODULES__`。

## 8. 性能与可靠性预算

- 选择器冷启动元数据与 UI：压缩后目标不超过 50 KiB，不解析皮肤大图数据。
- 皮肤 JS/CSS（不含图片 data URI）：压缩后目标不超过 250 KiB。
- MVP 全部运行时素材压缩传输目标不超过 2 MiB；单张全屏图建议不超过 700 KiB。
- 首次 apply 在常规桌面设备上不产生超过 100 ms 的单个长任务；observer 更新不应连续占用主线程。
- 20 次“官方 → 鸣潮 → 官方”切换后，皮肤 owner 节点数、listener、observer、timer 与首次空闲状态一致。
- bundle 加载设置超时；超时后必须清理 script 节点并回滚。
- 页面在缺失 ResizeObserver、Window Controls Overlay 或某些宿主 selector 时仍可使用基础主题。

## 9. 测试策略

### 9.1 单元测试

- `skin.json` schema 与重复 ID 校验。
- 托管 patch 的 render、parse、strip、官方默认与活动皮肤判断。
- patch 原子写与 revision 冲突；失败不改变旧文件。
- selector registry 只接受允许的本地包和 bundle。
- 亮暗 token 选择、侧栏状态计算、页面 phase 分类。

### 9.2 jsdom 生命周期测试

- apply 添加且 dispose 删除 body scope。
- 所有 inline style 原值、priority、title、favicon、theme-color 恢复。
- 新值已被第三方改写时，dispose 不覆盖第三方值。
- 部分 apply 失败仍清理完整。
- 两次 apply 不重复挂载；旧 activation disposer 不删除新 activation 节点。
- timer、rAF、listener、MutationObserver、ResizeObserver 全部清理。
- 亮暗切换只更新背景/token，不增加节点。
- DOM selector 缺失时安全降级，不抛未处理异常。

### 9.3 选择器与试穿测试

- 官方默认 → 试穿鸣潮 → 退出：逐项恢复。
- 已活动鸣潮 → 试穿官方默认 → 退出：逐项恢复鸣潮。
- 试穿 A 时再试穿 B：A disposer 先完成，页面无叠加。
- bundle 404、脚本 error、module import error、apply error 均回滚。
- apply revision 冲突不覆盖新配置。
- apply 成功后活动标记与 boot entries 一致。

### 9.4 E2E 与视觉回归

矩阵至少包含：

- 浏览器 / 桌面壳；
- 亮色 / 暗色；
- 1440、1024、768、375 px 视口；
- wide / narrow / rail 侧栏；
- landing、conversation、workspace/trace、settings、modal、approval；
- `prefers-reduced-motion` on/off。

每个矩阵保存截图和 DOM 泄漏断言。视觉 diff 阈值按区域配置，正文和控件区域应比纯背景区域更严格。

## 10. 验收标准

### AC-01 安装不强制启用

给定用户安装聚合包且此前使用官方外观，完成安装并刷新后，选择器可见但鸣潮皮肤未自动覆盖页面。

### AC-02 真实试穿

点击鸣潮“试穿”后，真实皮肤 bundle 被按需加载，背景、面板、侧栏、输入区和状态装饰立即生效；退出后原始视觉逐项恢复。

### AC-03 互斥替换

从官方默认切换到鸣潮或从鸣潮切回官方默认时，页面任何时刻不出现两套标题栏、背景、favicon、body scope 或装饰节点。

### AC-04 持久应用

点击“应用”后，host 以原子方式更新托管配置；配置 watcher 生效并刷新页面后，活动主题与选择器标记一致，无需重启 `dsh web`。

### AC-05 失败回滚

模拟 bundle 404、apply 抛错、patch revision 冲突和写入失败，页面与磁盘配置均保持在操作前状态，并提供可操作错误信息。

### AC-06 亮暗与响应式

在支持矩阵内切换亮暗、侧栏宽度和页面类型，正文、控件、焦点环和状态色保持可读，装饰不遮挡交互。

### AC-07 完整清理

连续 20 次试穿/退出和应用切换后，无多余 owner 节点、style、script、listener、observer、timer、rAF 或 body inline property。

### AC-08 无远程运行时依赖

断网启动 DSH 后，已安装的选择器、预览元数据和鸣潮皮肤仍可正常应用；网络面板不存在主题素材外链。

### AC-09 非业务侵入

启用皮肤前后，模型请求、Cordis 业务事件、工具调用、审批操作和会话数据完全一致。

### AC-10 权利与署名

所有提交素材均在主题包 `NOTICE` 和 `assets/source.json` 中保留可核查来源、原始 URL、获取日期和用途说明；主题明确声明为非官方、非商业的本地玩家创作。若要公开分发含官方素材的构建包，必须在发布前另行确认许可。

## 11. 发布与兼容

- 首个兼容窗口在实现开始时通过真实 DSH 版本探针确定，并写入 `peerDependencies` 与 README。
- 发布物必须包含预构建 `lib/`、`skin.json`、预览、代码许可、素材 NOTICE 和安装/恢复说明。
- 源码或素材变化必须同步重建 `lib/`；CI 校验 generated 文件无漂移、无绝对路径、无远程资源依赖。
- 建议先发布 `0.1.0-alpha.1`，只面向本地 `link:` 安装；完成 E2E 矩阵和权利审查后再发布稳定版。
- 升级前保留活动主题 ID；新版本 manifest 不兼容时自动回到官方默认，而不是让 Web GUI 启动失败。
- 卸载聚合包前先恢复官方默认；卸载文档必须给出确认活动状态和清理托管区段的方法。

## 12. 实施阶段拆分

### Phase 0：兼容性探针

- 建立最小标准 DSH client skin 包并验证当前 Web GUI 的 loader、body theme attr、稳定 slots 和 disposer 行为。
- 确认现有 skin-center 是否提供外部皮肤注册协议；若无，保留本 spec 的轻量选择器。
- 产出 DOM selector 清单与支持版本矩阵。

### Phase 1：皮肤核心

- 完成 token、CSS scope、基础背景、侧栏、composer、亮暗与响应式。
- 完成生命周期与 jsdom 测试。
- 使用原创占位素材完成构建，不阻塞技术验证。

### Phase 2：选择与替换

- 完成元数据列表、真实试穿、官方默认、apply host API、原子 patch 和冲突处理。
- 完成官方 ↔ 鸣潮互斥与失败回滚测试。

### Phase 3：视觉资产与发布

- 替换为最终授权素材，补齐 NOTICE、预览和非官方声明。
- 完成全矩阵截图、性能预算、离线测试和发布包验证。

## 13. 待决策项

以下问题不阻塞 Phase 0，但必须在 Phase 3 前关闭：

1. 最终视觉是纯抽象“鸣潮氛围启发”，还是使用经作者授权的角色二创？推荐前者作为 MVP。
2. 是否接受非商业分发限制？若使用鸣潮衍生素材，推荐明确非商业；代码和素材应分开许可。
3. 包发布 scope 与维护者名称是什么？当前 `@dsh-external/*` 仅为占位。
4. 是否必须无依赖独立安装，还是允许依赖 `@linxin666/dsh-skins/skin-center`？推荐先做独立兼容探针，再选择依赖最少的方案。
5. P1 是否需要多个鸣潮场景包？如果需要，应先定义场景包 schema 和素材预算，避免把每个背景做成独立 Cordis 皮肤。

## 14. 研究来源

- [dsh-deep-whale 仓库与安装说明](https://github.com/Small-tailqwq/dsh-deep-whale)
- [maid-atelier README](https://github.com/Small-tailqwq/dsh-deep-whale/tree/main/maid-atelier)
- [maid-atelier package.json](https://github.com/Small-tailqwq/dsh-deep-whale/blob/main/maid-atelier/package.json)
- [maid-atelier skin.json](https://github.com/Small-tailqwq/dsh-deep-whale/blob/main/maid-atelier/skin.json)
- [maid-atelier client apply/dispose](https://github.com/Small-tailqwq/dsh-deep-whale/blob/main/maid-atelier/src/client/index.ts)
- [dsh-deep-whale 生命周期与分发约束](https://github.com/Small-tailqwq/dsh-deep-whale/blob/main/AGENTS.md)
- [dsh-web-ui 皮肤中心](https://github.com/zhu1090093659/dsh-web-ui/tree/main/packages/skins/skin-center)
- [dsh-skin 互斥与原子 patch 脚本](https://github.com/zhu1090093659/dsh-web-ui/blob/main/scripts/dsh-skin)
- [dsh-web-ui 插件与皮肤集成指南](https://github.com/zhu1090093659/dsh-web-ui/blob/main/docs/plugins.md)
- [鸣潮官网](https://wutheringwaves.kurogames.com/en/)
- [鸣潮官方二次创作指南（日文官方页）](https://wutheringwaves.kurogames.com/p/jp/produce.html)

## 15. 评审出口

本 spec 获批进入实现的最低条件：

- 接受第 1 节对“可选、可替换”的定义；
- 接受“安装默认不换肤”的产品决策；
- 接受“默认不打包官方素材”的权利边界；
- 允许 Phase 0 先验证外部 skin-center 注册能力，再最终决定是否自带选择器。

研究评审已完成。v0.1.0 选择“标准独立 DSH 皮肤包 + 仓库主题注册表”的落地路径；当前版本通过 DSH profile 的插件安装/移除实现选择与替换，自定义 GUI 皮肤中心留作后续增强。

## 16. v0.1.0 实施记录

### 16.1 交付范围

首个主题“鸣潮 · 爱弥斯”已经完成开发、构建、本地安装和真实 DSH Web GUI 验收。

| 项目 | 实际值 |
| --- | --- |
| 主题目录 | `themes/aemeath` |
| npm 包 | `@dsh-external/dsh-client-ui-skin-wuthering-aemeath@0.1.0` |
| 皮肤 ID | `wuthering-aemeath` |
| Cordis wiring ID | `ui-skin-wuthering-aemeath` |
| CSS scope | `data-dsh-skin-aemeath` |
| 兼容验证版本 | `@deepseek-ai/dsh@0.1.0-rc.6` |
| 本地 DSH profile | `web` |
| 本地测试地址 | `http://127.0.0.1:3180/` |

实际新增与修改内容：

- 根目录增加 `theme-registry.json` 与 JSON Schema，以稳定 ID、包名、目录和 body scope 注册主题，为后续主题替换保留统一入口。
- `themes/aemeath/package.json`、`cordis.patch.yml`、`skin.json` 和 host entry 组成可被 DSH 直接安装的标准独立皮肤包。
- `src/client/runtime.js` 实现 client `apply(ctx)`、幂等清理、owner 节点、标题与 `theme-color` 管理、亮暗监听及 Cordis effect disposer。
- `src/client/theme.css` 实现星海背景、人物立绘、青粉霓虹玻璃、全息 HUD、动态轨道环、电子网格、极光、星辉扫光及流动 composer 描边。
- 稳定选择器优先使用 body scope、ARIA、placeholder 与 `:has()` 结构定位；哈希类名只用于侧栏等降级增强。
- 支持 DSH 亮色/暗色、桌面宽屏、窄屏/rail 侧栏和 390 px 移动宽度；在窄窗口中仍保留人物、HUD 与核心霓虹动效。
- 尊重 `prefers-reduced-motion`，关闭人物入场、极光、轨道、网格、扫光、信号灯和动态边框动画。
- `scripts/build-client.mjs` 将 CSS、运行时代码和三张 PNG 编译进 `lib/client.js` Data URL；页面运行时不请求官方 CDN。
- `scripts/verify.mjs` 校验 manifest、package/skin/patch 一致性、模块加载器、effect 清理、官方域素材记录、文件尺寸与三张内嵌 PNG。
- 根目录与主题 README 记录构建、校验、安装结构和可替换策略；`NOTICE` 与 `assets/source.json` 记录素材及权利边界。

### 16.2 官方素材清单

来源页面：[库街区鸣潮官方 WIKI · 爱弥斯图鉴](https://wiki.kurobbs.com/mc/item/1457744312692867072)，获取日期为 2026-08-15。

| 本地文件 | 用途 | 官方 CDN |
| --- | --- | --- |
| `assets/aemeath-poster.png` | 全屏星海背景 | `https://prod-alicdn-community.kurobbs.com/forum/79842a0777fc4aceb3528d196260f9c020260205.png` |
| `assets/aemeath-portrait.png` | 透明人物装饰层 | `https://prod-alicdn-community.kurobbs.com/forum/dbecc24a507441428f583e36b03e329f20260105.png` |
| `assets/aemeath-wiki-background.png` | 面板纹理 | `https://prod-alicdn-community.kurobbs.com/forum/843f885dd3294dca91041d87effa534420260105.png` |

素材只用于本地非商业主题验证；《鸣潮》、爱弥斯及相关美术资产的权利归其各自权利人所有。

### 16.3 生命周期与可替换性

主题激活时：

1. 清除相同 owner 的旧节点，保证重复 apply 幂等；
2. 注入唯一 style、背景 scene 和独立 HUD overlay；
3. 设置 `data-dsh-skin-aemeath`、窗口标题和亮暗对应的 `theme-color`；
4. MutationObserver 仅监听 `data-ds-dark-theme`。

主题停用或插件移除时，effect disposer 会断开 observer、删除全部 owner 节点、恢复原 body 属性、标题和 `theme-color`。可通过标准 DSH profile 命令选择或替换主题：

```powershell
dsh plugin --profile web add C:\path\to\dsh-WutheringWaves\themes\aemeath
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
```

v0.1.0 不额外注入自定义主题选择器；“可选、可替换”由独立主题包、根主题注册表和 DSH 插件图提供。后续主题使用相同包结构即可互换，未来可在不修改各主题载荷的情况下增加 GUI 选择器。

### 16.4 构建与自动校验

最终构建命令：

```powershell
pnpm run theme:aemeath:build
pnpm run theme:aemeath:test
```

最终结果：

- `lib/client.js` 构建大小：4,545,409 bytes；
- 校验摘要：`sha256 9da5ebb259f44cdd`；
- 三张官方 PNG 均以 Data URL 内嵌；
- package、skin、Cordis patch、模块 ID 与 body scope 一致；
- disposer、observer 断开和 body scope 恢复断言通过。

### 16.5 本地 DSH 实测

在本机 `web` profile 中以 `link:` 安装主题，DSH 组合配置确认包含：

```yaml
- id: ui-skin-wuthering-aemeath
  name: '@dsh-external/dsh-client-ui-skin-wuthering-aemeath'
```

真实页面验证结果：

- 页面成功加载，标题为“鸣潮 · 爱弥斯 | DeepSeek Harness”，body scope 和主题色正确；
- DSH 设置 → 插件列表显示 `ui-skin-wuthering-aemeath`“已挂载、已启用”；
- 亮色、暗色、1440×900、默认窄窗口和 390×844 视口均完成视觉检查；
- composer 输入、清空和发送按钮 enable/disable 行为不受主题影响；
- 主题运行期间浏览器控制台无页面 error；
- 临时移除插件后，标题恢复为“DeepSeek Harness”，body scope 为 false，owner 节点和主题 style 均为 0；
- 重新安装并启动后主题完整恢复，证明安装/移除路径可逆；
- 最终状态为主题已安装、已启用，本地 DSH Web 服务运行在 `127.0.0.1:3180`。

### 16.6 验收结论与后续项

本次需求“完成第一个爱弥斯主题、使用官方攻略站素材、安装到本地 DSH 并测试”已完成。v0.1.0 达成独立安装、持久启用、可移除恢复、运行时离线素材、亮暗/响应式、完整副作用清理和非业务侵入。

与完整研究蓝图相比，以下内容明确留作后续版本：

- DSH 设置页中的“官方默认 / 主题列表 / 试穿 / 应用”自定义 GUI 选择器；
- 多主题同时安装时的自动互斥 patch 管理与失败回滚 UI；
- 20 次连续热切换、全部业务页面和桌面壳的自动截图矩阵；
- 含官方素材的公开发布许可审查与稳定版分发。
