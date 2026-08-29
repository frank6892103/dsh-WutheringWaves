# spec007：鸣潮清宵主题

> 状态：v0.1.0 已完成最终视觉深化、真 Alpha 人物分层、双 HUD 安全轨道、人物关联动效、正式环境安装与真实页面验收
> 初次验收：2026-08-26
> 最终视觉验收：2026-08-28
> 文档补全：2026-08-29
> 目标环境：`@deepseek-ai/dsh@0.1.1-rc.2`、Windows 11、DSH `web` profile、多主题同时安装

## 1. 目标与最终结论

新增一个可独立安装、可在主题中心互斥切换的“鸣潮 · 清宵”客户端皮肤包。主题体现清宵的梦州剑仙气质，并延续仓库既有的本地素材、明暗适配、副作用完整清理、默认省资源档和离线发布约束。

初版已具备云海、月门、水墨山形、琴弦、万剑、青玉与篆印等视觉元素，但实际 DSH 页面连续暴露出三个问题：

1. 角色宣传海报与背景仍是一张完整矩形画面，人物没有从环境中独立出来，主体识别度不足；
2. 动态效果分散在全屏装饰层，与人物姿态和武器关系不强，因此“有动画但感知不明显”；
3. 右上、右下 HUD 未形成统一视觉轨道，宽屏右下 HUD 位置过高，且需要同时避让 Session Log 与输入框。

最终方案不再把完整宣传海报直接作为主界面人物框，而是拆成三层：

- **背景氛围层**：使用 CSS 构建月门、远山、云海、星点、琴弦和剑阵；
- **独立人物层**：使用真 Alpha 清宵全身立绘，保持人物、服装、武器和飘带完整；
- **前景共鸣层**：把光环、武器脉冲、共鸣节点和弧形剑气锚定在人物周围。

宣传海报仅继续用于主题中心预览和素材溯源。正式 DSH 页面已确认人物清晰、正文可读、HUD 完整，完整动态档的角色关联效果可见。

## 2. 包与集成规格

| 项目 | 最终值 |
| --- | --- |
| 包名 | `@dsh-external/dsh-client-ui-skin-wuthering-qingxiao` |
| 版本 | `0.1.0` |
| 主题 ID | `wuthering-qingxiao` |
| Cordis wiring ID | `ui-skin-wuthering-qingxiao` |
| Body 作用域 | `data-dsh-skin-qingxiao` |
| 主题排序 | `40` |
| 强调色 | `#54cbd0` |
| 性能档 | `economy` / `full` |
| 发布物 | `dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz` |

主题通过共享 `__DSH_WUTHERING_THEME_HUB__` 注册，与官方外观及仓库中其他角色主题事务式互斥。切换、卸载或禁用后，必须撤销主题自有 DOM、样式、Body 属性、标题、`theme-color` 和 `MutationObserver`。

## 3. 视觉系统

### 3.1 色彩与可读性

- 亮色模式使用宣纸白、天青、青玉与淡金；暗色模式使用月夜靛青、青碧剑光与低亮金线。
- 主界面基础透明度控制为亮色 `0.22`、暗色 `0.16`，使背景和人物可辨识，同时不牺牲正文对比度。
- 会话滚动区增加左密右疏的阅读遮罩：正文一侧更稳定，人物一侧更开放。
- 侧栏、标题栏、composer、菜单和气泡保持更高不透明度，避免主题图层穿透文字。
- 发送按钮、焦点轮廓、选区和交互态统一使用青玉冷光，保证主题一致性。

### 3.2 背景层

背景不再依赖整张人物海报，而由以下 CSS 场景共同构成：

- 青玉与靛青渐变基底；
- 双层月门及顺逆向环形刻度；
- 三层水墨远山；
- 底部流云和云海；
- 九剑阵、琴弦、浮叶、剑痕、星点和篆印；
- 浅色、暗色分别调整饱和度、明度、混合与透明度。

该结构让人物与背景在资源和 DOM 上真正分离，避免再次出现“人物只是壁纸的一部分”的问题。

## 4. 真 Alpha 人物立绘

### 4.1 生成与修复过程

人物层基于 `qingxiao-poster.webp` 使用 OpenAI 内置图像编辑模式完成背景提取。处理目标是保留清宵的面部、蓝发、角饰、姿态、服装、腿部、足部、飘带及手持武器，移除山水、文字、纸张边框、独立飞剑和其他背景元素。

第一次生成结果视觉上已经分离人物，但检查发现文件为 `RGB`，灰色棋盘格被烘入图片，不是真透明，因此未进入主题包。第二次只执行透明通道修复，保持人物主体不变并移除全部棋盘格。

最终资产验证结果：

| 检查项 | 结果 |
| --- | --- |
| 文件 | `themes/qingxiao/assets/qingxiao-character.png` |
| 尺寸 | `941 × 1672` |
| 文件大小 | `1,044,942` bytes |
| 模式 | `RGBA` |
| Alpha 范围 | `0–255` |
| 四角像素 | `(0, 0, 0, 0)`，完全透明 |

### 4.2 页面构图

- 人物使用右侧全高容器，不再使用带矩形边界的海报框。
- `object-fit: contain` 保留完整身体、武器和飘带，不裁切关键轮廓。
- 浅色和暗色分别使用饱和度、对比度、亮度与双层 `drop-shadow`，使人物从背景中浮出。
- 角色舞台保持在主题 scene 内、DSH 内容层之后；正文仍可覆盖人物区域，不拦截指针事件。
- 对话框或主题中心打开时，人物、HUD 和前景效果主动降低不透明度，保证操作层优先。

### 4.3 素材来源和权利边界

- 原始角色宣传图来源、公开 URL、获取日期和使用范围继续记录在 `assets/source.json`。
- `qingxiao-character.png` 明确记录为从 `qingxiao-poster.webp` 派生的透明人物层，并注明背景提取与 Alpha 修复过程。
- `NOTICE` 已补充衍生人物层说明；该处理不改变原素材权利归属。
- 原创程序代码使用 MIT License；角色、美术素材和包含这些素材的预览及构建产物不适用 MIT License，仅限非商业本地玩家主题场景。

## 5. 人物关联动态设计

完整动态档不再只依靠随机全屏装饰，而围绕人物重心、武器位置和心剑意象组织效果。

| 动效 | 周期 | 设计目的 |
| --- | ---: | --- |
| `qingxiao-character-breathe` | `7.6s` | 人物低频上浮、轻微横移和缩放，建立呼吸感 |
| `qingxiao-aura-pulse` | `4.6s` | 人物身后的青玉与淡金心剑光环明暗呼吸 |
| `qingxiao-orbit` | `9s / 12s / 17s` | 三层环形刻度顺逆向旋转，围绕人物躯干形成能量场 |
| `qingxiao-weapon-pulse` | `5.4s` | 沿武器高度横向展开剑光，并在握持区域形成能量核心 |
| `qingxiao-node` | `2.8s` | 七枚共鸣节点围绕头肩、武器和衣摆错相点亮 |
| `qingxiao-resonance-arc` | `6.8s` | 两层弧形剑气从人物右侧扩张，构成明显但不持续遮字的前景运动 |
| `qingxiao-foreground-blade` | 分段错相 | 七道短剑光在人物侧后方上升，强化万剑意象 |
| HUD scan / pulse / ring | `1.6–7s` | 让右上状态 HUD 与右下主题 HUD 保持可感知的运行状态 |

背景仍保留云海呼吸、月门旋转、琴弦浮动、落叶、剑阵和低频星点，但角色关联层拥有更高的视觉优先级。所有前景效果均使用右侧渐变遮罩，减少对正文区域的覆盖。

## 6. HUD 安全轨道与响应式布局

右下主题切换按钮同时承担清宵的下层 HUD。最终布局参考爱弥斯等已验证主题，宽屏使用同一条 `24px` 右侧轨道；普通桌面则分别避让 Session Log 和 composer。

| 视口 | 右上 HUD | 右下主题 HUD | 目的 |
| --- | --- | --- | --- |
| `≥1500px` | `top: 82px; right: 24px` | `right: 24px; bottom: 22px` | 上下 HUD 右边线统一；右上移到标题栏下方，右下落到安全底边 |
| `901–1499px` | `top: 7px; right: 148px` | `right: 18px; bottom: 146px` | 右上避让 Session Log；右下避让较宽 composer |
| `≤900px` | `top: 7px; right: 132px`，宽度自适应 | `right: 14px; bottom: 142px` | 收窄 HUD 并继续避让输入区 |
| `≤560px` | 隐藏 | `right: 10px; bottom: 132px`，缩为 `52 × 52` | 手机宽度只保留紧凑主题入口 |

HUD 视觉补全包括：

- 右上状态 HUD：环形标记、天地弦心剑文案、FULL/STILL 状态、四段信号柱、扫光和边框呼吸；
- 右下主题 HUD：`RESONANCE THEME // 07`、旋转标记、主题名、扫光、悬停与展开状态；
- 两个 HUD 使用同一套青玉、淡金、深靛玻璃语言，并使用切角轮廓形成完整框架；
- 主题选择面板固定在右上安全区，限制最大高度，避免因下 HUD 下移而超出视口。

## 7. 性能档与无障碍

### 7.1 完整档 `full`

- 创建琴弦、浮叶、剑痕和前景剑气；
- 九柄心剑、七枚人物共鸣节点和七道前景剑光全部启用；
- 人物、光环、轨道、武器、HUD 和环境动画运行；
- 仅完整档使用需要关系选择器的对话框、主题中心降噪规则。

### 7.2 省资源档 `economy`

- 默认保留独立人物、静态远山、月门、云海和三柄心剑；
- 不创建或隐藏琴弦、浮叶、剑痕和前景层；
- 对主题 scene 启用 `contain: strict`；
- 去除持续动画、实时主题毛玻璃、混合和非必要滤镜；
- 保持配色、人物识别度、正文可读性与主题中心切换能力。

### 7.3 减少动态效果

当系统启用 `prefers-reduced-motion: reduce` 时，人物呼吸、光环、轨道、武器脉冲、节点、弧形剑气、剑阵、琴弦、浮叶、HUD 扫光和信号动画全部停止。该约束优先于用户选择的完整动态档。

## 8. 本地资源路由与构建

### 8.1 资源路由

Host entry 的本地资源映射由单文件 WebP 扩展为带 MIME 的双资源映射：

| 资源 | MIME | 用途 |
| --- | --- | --- |
| `qingxiao-poster.webp` | `image/webp` | 主题中心预览与来源保留 |
| `qingxiao-character.png` | `image/png` | 正式页面真 Alpha 人物层 |

路由行为：

- 允许 `GET` 与 `HEAD`；
- 其他方法返回 `405` 并声明 `Allow: GET, HEAD`；
- 未知资源返回 `404`；
- 返回正确的 `Content-Type`、`Content-Length`；
- 使用 `Cache-Control: public, max-age=31536000, immutable`；
- 客户端 URL 带各自内容计算出的 12 位 SHA-1 revision；
- 运行时不访问外部 CDN，不使用 Base64 内嵌图片。

### 8.2 构建脚本

`scripts/build-client.mjs` 同时读取海报和透明人物，为两个资源生成独立 revision，并向客户端 bundle 注入：

```js
QINGXIAO_ASSET_POSTER
QINGXIAO_ASSET_CHARACTER
```

构建继续输出 `lib/client.js` 和 `lib/index.js`。`package.json#files` 已增加 `assets/qingxiao-character.png`，保证发布包包含透明人物资产。

## 9. 自动校验扩展

`scripts/verify.mjs` 在原有包元数据、主题注册、清理、本地 WebP、缓存头、无 Base64、构建体积、性能档和预览检查之外，新增：

- 发布文件必须包含 `assets/qingxiao-character.png`；
- bundle 必须包含人物光环、武器脉冲和透明人物 URL；
- 海报与人物各自只能出现一个带 12 位 revision 的资源 URL；
- Host entry 必须声明 `image/webp` 与 `image/png`；
- PNG 的 GET、HEAD、状态码、Content-Type 和文件签名必须正确；
- Runtime 必须把 `QINGXIAO_ASSET_CHARACTER` 挂载到人物节点；
- CSS 必须包含人物呼吸和共鸣弧线关键帧；
- `source.json` 必须记录透明人物从海报派生；
- 两个本地图片资源均必须大于最小体积阈值。

最终自动校验输出：

```text
Verified 鸣潮 · 清宵: bundle 69,105 chars, 2 local image assets
```

构建生成的客户端 bundle 为 `69,437` bytes，低于 `100,000` bytes 上限。

## 10. 文件级修改清单

| 文件 | 修改内容 |
| --- | --- |
| `themes/qingxiao/assets/qingxiao-character.png` | 新增真 Alpha 清宵人物资产 |
| `themes/qingxiao/assets/source.json` | 记录透明人物的派生关系、生成过程和原始来源 |
| `themes/qingxiao/NOTICE` | 补充人物背景移除与权利归属说明 |
| `themes/qingxiao/package.json` | 把透明 PNG 纳入发布文件 |
| `themes/qingxiao/src/client/runtime.js` | 新增人物、光环、三层轨道、武器脉冲、共鸣节点 DOM |
| `themes/qingxiao/src/client/theme.css` | 重构背景、人物构图、可读性、双 HUD、安全轨道、人物关联动态和降级规则 |
| `themes/qingxiao/src/index.js` | 本地资源映射支持 WebP 与 PNG 及正确 MIME |
| `themes/qingxiao/scripts/build-client.mjs` | 为两个资源生成独立 revision 并注入客户端常量 |
| `themes/qingxiao/scripts/verify.mjs` | 增加人物资源、路由、运行时、CSS 与来源回归断言 |
| `themes/qingxiao/lib/client.js` | 重新生成客户端 bundle |
| `themes/qingxiao/lib/index.js` | 重新生成 Host entry |
| `release/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz` | 重新打包，包含透明人物和全部最终代码 |

本轮清宵范围相对上一构建共计修改 11 个已跟踪文件，约 `708` 行新增、`121` 行删除，并新增 1 个透明人物资产；未把心月狐、章北海或其他主题的工作区修改混入清宵实现。

## 11. 发布包

| 项目 | 值 |
| --- | --- |
| 文件 | `release/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz` |
| 大小 | `1,626,644` bytes |
| SHA-256 | `a664b8876bda6cd5e67498339dfe87eede112fa882f12658c3cfd292962c6f63` |
| 包内图片 | `qingxiao-poster.webp`、`qingxiao-character.png` |
| 包内构建产物 | `lib/client.js`、`lib/index.js` |
| 包内说明 | `skin.json`、`README.md`、`NOTICE`、`LICENSE-CODE`、`assets/source.json` |

## 12. 正式环境安装与真实页面验收

正式环境使用本机 DSH `web` profile，而不是开发链接。安装流程先移除旧清宵包，再从最终 `.tgz` 添加同名包并重启 Web 服务。

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-qingxiao
dsh plugin --profile web add .\release\dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
.\start-web.ps1
```

服务地址：`http://127.0.0.1:3080/`

### 12.1 页面资源验收

| 检查项 | 结果 |
| --- | --- |
| 主题中心可选择“鸣潮 · 清宵” | 通过 |
| 动态效果处于“完整”档 | 通过 |
| 人物资源加载完成 | 通过 |
| 人物自然尺寸 | `941 × 1672` |
| 人物资源 HTTP 状态 | `200` |
| 人物资源 Content-Type | `image/png` |
| 人物资源响应大小 | `1,044,942` bytes |
| 人物资源 URL | 带 revision 的插件本地路由 |
| 正文、表格、代码与输入区可读 | 通过 |

### 12.2 实际布局验收

嵌入式浏览器的实际内容视口为 `1169 × 856`，命中普通桌面规则：

- 右上 HUD：`top: 7px; right: 148px`，避让 Session Log；
- 右下主题 HUD：`right: 18px; bottom: 146px`；
- HUD 与 composer 保持安全间距；
- 人物完整加载、全高显示且没有矩形海报边界；
- 宽屏 `≥1500px` 的 CSS 规则确认上下 HUD 统一为 `right: 24px`，右下 HUD 落到 `bottom: 22px`。

### 12.3 动态运行验收

页面计算样式确认以下动画均已运行：

- 人物：`qingxiao-character-breathe`；
- 光环：`qingxiao-aura-pulse`；
- 武器：`qingxiao-weapon-pulse`；
- 前景弧线：`qingxiao-resonance-arc`；
- 共鸣节点：`qingxiao-node`；
- HUD：扫光、边框呼吸、信号柱和旋转标记。

连续三次、间隔约 `1.1s` 的计算样式采样显示：

- 弧形剑气 opacity：约 `0.613 → 0.263 → 0.049`；
- 共鸣节点 opacity：约 `0.231 → 0.891 → 0.548`；
- transform 矩阵同步变化。

这证明动效并非只写入 CSS，而是在正式 DSH 页面持续运行。

## 13. 验收命令

主题级构建与校验：

```powershell
cd themes/qingxiao
node scripts/build-client.mjs
node scripts/verify.mjs
node scripts/release.mjs
```

工作区联合验收：

```powershell
pnpm run themes:build
pnpm run themes:test
pnpm run themes:release
```

安装后资源检查：

```powershell
Invoke-WebRequest `
  -Uri 'http://127.0.0.1:3080/plugins/@dsh-external/dsh-client-ui-skin-wuthering-qingxiao/assets/qingxiao-character.png?rev=verify' `
  -UseBasicParsing
```

## 14. 最终验收清单

- [x] 清宵作为独立 DSH 插件安装，并与其他主题互斥切换。
- [x] 原宣传海报不再作为主界面矩形人物框。
- [x] 人物使用真 Alpha PNG，与 CSS 背景完全分层。
- [x] 人物、武器、服装与飘带保持完整，角色主体明显。
- [x] 背景、人物和前景共鸣效果形成三层构图。
- [x] 人物呼吸、光环、轨道、武器脉冲、节点和弧形剑气均可见。
- [x] 宽屏上下 HUD 共用 `24px` 右侧轨道，右下 HUD 使用 `22px` 底边。
- [x] 普通桌面 HUD 避让 Session Log 与 composer。
- [x] 浅色、暗色和正文可读性通过实际页面检查。
- [x] `economy`、`full` 与 `prefers-reduced-motion` 均有明确降级路径。
- [x] WebP 与 PNG 均由插件本地路由提供，并使用内容 revision 和长期缓存。
- [x] 自动测试、构建、发布包和正式 `web` profile 安装通过。
- [x] 素材来源、派生过程和权利边界已记录。

## 15. 最终结论

spec007 的最终实现已从“右侧角色海报主题”升级为“独立人物驱动的清宵共鸣场景”。视觉焦点、动效叙事和 HUD 安全区三个核心问题均已解决；主题在完整档中具备明确动态表现，在省资源档和减少动态偏好下仍保持清宵辨识度与 DSH 可用性。最终包已安装到本地正式环境并通过真实页面验收。
