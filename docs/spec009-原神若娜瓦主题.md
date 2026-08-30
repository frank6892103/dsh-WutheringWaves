# spec009：原神若娜瓦主题

> 状态：v0.2.2 已完成主题实现、立绘主视觉重构、输入区双外观可读性修复、真 Alpha 人物分层、双性能档、联合构建校验、发布打包与 DSH web profile 实机验收
> 完成日期：2026-08-29
> 目标环境：`@deepseek-ai/dsh@0.1.1-rc.2`
> 主题 ID：`genshin-ronova`
> 包名：`@dsh-external/dsh-client-ui-skin-genshin-ronova`
> Body 作用域：`data-dsh-skin-ronova`

## 1. 目标

为 DeepSeek Harness Web GUI 新增一套可独立安装、可与仓库内其他主题共存并通过主题中心互斥切换的“原神 · 若娜瓦”主题。

若娜瓦主题以“赤月终焉、黑曜神门、六翼神瞳、死亡之翎与灵魂渡界”为核心视觉语言。它完整支持 DSH 浅色/深色外观、`economy`/`full` 性能档、系统减少动态偏好、切换失败回滚和卸载清理。

本规格没有改写共享主题中心的既有协议，也没有覆盖 `spec006` 心月狐、`spec007` 清宵或 `spec008` 章北海主题。

## 2. 从既有主题吸取的经验

### 2.1 多主题共存

沿用 `spec004` 的共享主题中心：

- 主题只在成为活动主题后执行 `mount()`；
- 切换时先清理旧主题，再挂载新主题；
- 挂载失败时重新挂载旧主题；
- 角色主题与 DSH 自身的浅色/深色偏好正交；
- 选择保存到同源存储，主题包缺失时只展示实际注册的主题。

若娜瓦使用独立的 `genshin-ronova` ID 和 `ui-skin-genshin-ronova` Cordis 接线，避免沿用现有 `wuthering-*` 或 `threebody-*` 命名空间。

### 2.2 默认性能预算

沿用 `spec005` 的结论：首次安装默认使用 `economy`，并把视觉识别度与持续渲染成本分开。

- `economy` 停止全部持续主题动画；
- 省资源档只创建 3 条地脉、3 个神瞳、3 条灵魂丝和 5 枚死亡之翎；
- 不创建灵魂微光、律令环阵和前景裂隙；
- 场景启用 `contain: strict`；
- 不运行关系选择器；
- 主题预览继续由共享运行时延迟到选择面板首次打开时加载。

### 2.3 人物与环境分层

沿用 `spec006` 与 `spec007` 的人物分层经验：

- 环境背景使用独立 16:9 WebP；
- 人物使用独立 RGBA PNG；
- 人物不裁进海报框，不与场景背景合成；
- 光环、律令轨道位于人物后方，终焉刻印、神瞳与灵魂丝位于人物前方；
- 人物、环境与前景效果可以分别调整响应式位置、亮度、透明度和动画。

### 2.4 真 Alpha 与边缘修复

沿用 `spec008` 的确定性透明提取经验。图像编辑输出把棋盘格烘焙进 RGB 后，没有直接作为立绘交付，而是：

1. 使用严格的中性色候选阈值识别棋盘格；
2. 仅移除与图像边缘相连或面积足够大的中性色组件；
3. 按色差和亮度恢复半透明边缘；
4. 对边缘颜色执行去污染，避免白色棋盘格残留；
5. 验证最终 PNG 尺寸、RGBA color type、透明/不透明像素比例和文件签名。

处理脚本为 `themes/ronova/scripts/extract-character-alpha.py`，最终人物为 `1024 × 1536` RGBA PNG。

### 2.5 HUD 安全轨道

沿用 `spec007` 与 `spec008` 的视口安全轨道：

- 普通桌面右上律令 HUD 使用 `top: 7px; right: 148px`，避让 Session Log；
- 右下终焉 HUD 使用 `right: 18px; bottom: 91px`；
- 主题入口使用 `right: 18px; bottom: 18px`；
- 右下两块 HUD 同宽 258 px，并保留 15 px 间距；
- 宽屏三块 HUD 统一对齐 `right: 24px`；
- 窄屏隐藏资料 HUD，只保留紧凑主题入口。

## 3. 视觉系统

### 3.1 角色语义

- 赤月终焉：巨型不完整日蚀、深绯光晕与低速终焉轨道。
- 死之执政：克制的律令 HUD、菱形终焉刻印和不可逆的单向灵魂上升。
- 六翼神瞳：人物六枚眼翼、场景眼形灯和六段 HUD 信号共同建立识别。
- 黑曜神门：拱门、断裂环和纵向地脉线建立神域秩序，不使用海洋、舰桥或水墨语言。
- 死亡之翎：细长羽片以低频位移和亮度变化表现死亡法则，不使用活泼弹跳。

公开角色称号与视觉参考来自 Genshin Impact 官方《提瓦特篇》幕间 PV “The Gods' Limits”：<https://www.youtube.com/watch?v=jvXVmvW8ZQw>。

### 3.2 与现有主题的差异

1. 不复用爱弥斯的青粉霓虹、星海圆框与电子幽灵语言。
2. 不复用坎特蕾拉的深海玻璃、水母与潮汐扩散语言。
3. 不复用心月狐的暖纸月苑、朱砂印与机关折屏语言。
4. 不复用清宵的水墨远山、琴弦、心剑与青玉剑阵语言。
5. 不复用章北海的舰桥、军方档案、航迹与铁蓝坐标语言。
6. 若娜瓦由赤月、黑曜门、六翼眼纹、死亡之翎和灵魂律令共同识别，不能只依赖主题名或人物图片。

### 3.3 色彩

| 语义 | 浅色 | 深色 | 用途 |
| --- | --- | --- | --- |
| 骨白 | `#eee4dd` | `#f4e9e2` | 正文、高亮和神性轮廓 |
| 黑曜 | `#24191d` | `#100b0e` | 环境、侧栏与 HUD 基底 |
| 律令绯红 | `#a93439` | `#d25352` | 主交互、刻印、神瞳和扫描线 |
| 终焉猩红 | `#d45b54` | `#f17b69` | 高亮、轮廓与动态确认 |
| 暗酒红 | `#601e29` | `#852d39` | 面板、轨道与次级层次 |
| 古金 | `#b89763` | `#d0ad73` | 神性刻度、眼瞳与 HUD 元数据 |

浅色模式使用较强骨白阅读幕压住背景暗部，同时让右侧人物和赤月保持可见；深色模式使用黑曜渐变保持场景深度。两种模式分别重建面板透明度和正文对比度，不做简单反相。

## 4. 场景结构

```text
DSH content
  ├─ sanctuary background plate
  ├─ reading veil / atmosphere
  ├─ crimson eclipse / judgment gate / ley lines
  ├─ character stage
  │    ├─ aura
  │    ├─ three decree orbits
  │    ├─ transparent character
  │    ├─ death mark
  │    ├─ six eye sigils
  │    └─ soul threads
  ├─ plume field
  ├─ full only: soul motes / edict lattice / foreground rifts
  ├─ top judgment HUD
  ├─ bottom final-decree HUD
  └─ theme hub trigger and panel
```

`#root`、主题场景、前景层和 HUD 使用不同 z-index。所有主题节点均禁用指针事件；唯一交互入口仍是共享主题中心，不拦截 DSH 正文、设置或输入区。

## 5. 动态设计

| 动态 | 周期 | 叙事作用 |
| --- | --- | --- |
| `ronova-character-breathe` | 6.8 s | 人物低幅呼吸与重心上提 |
| `ronova-aura-pulse` | 4.6 s | 赤月神性场缓慢扩张与旋转 |
| `ronova-decree-orbit` | 10/15/19 s | 三层律令轨道正反向演算 |
| `ronova-death-mark` | 3.8 s | 终焉刻印确认死亡法则 |
| `ronova-sigil` | 2.8 s | 六枚眼纹依次注视与确认 |
| `ronova-thread` | 5.2 s | 灵魂丝从人物附近短促展开 |
| `ronova-soul-rise` | 6–9.2 s | 灵魂微光单向上升，不回弹 |
| `ronova-rift` | 7.6 s | 前景裂隙低频掠过人物右侧 |
| `ronova-hud-scan` | 4.2 s | 三块 HUD 使用统一扫描节奏 |

动画只使用 CSS keyframes，不使用持续定时器或 `requestAnimationFrame`。`prefers-reduced-motion: reduce` 与 `economy` 均会停止全部持续动画。

## 6. 资源与本地路由

| 文件 | 格式 | 用途 |
| --- | --- | --- |
| `assets/ronova-sanctuary.webp` | WebP, 1672×941 | 16:9 环境背景与选择器预览 |
| `assets/ronova-character.png` | RGBA PNG, 1024×1536 | 真 Alpha 前景人物 |
| `assets/ronova-character-source.png` | RGB PNG | 透明提取输入，仅保留在源码仓库，不进入发布包 |
| `preview/light.webp` | WebP, 1280×720 | 浅色主题预览 |
| `preview/dark.webp` | WebP, 1280×720 | 深色主题预览 |

背景与人物均由 OpenAI 内置图像生成工具为本项目生成。正式人物不是游戏截图或 PV 帧裁切。生成摘要、派生关系和非商业权利边界记录在 `assets/source.json` 与 `NOTICE`。

本地路由：`/plugins/@dsh-external/dsh-client-ui-skin-genshin-ronova/assets`。

- 允许 `GET` 与 `HEAD`；
- 未知资源返回 `404`；
- 其他方法返回 `405` 并声明 `Allow: GET, HEAD`；
- 返回正确的 `Content-Type` 与 `Content-Length`；
- 使用 `Cache-Control: public, max-age=31536000, immutable`；
- 资源 URL 带 12 位内容 SHA-1 revision；
- 客户端 bundle 不内嵌 Base64 图片。

## 7. 文件落点

| 文件 | 内容 |
| --- | --- |
| `themes/ronova/src/client/runtime.js` | 场景 DOM、人物舞台、三块 HUD、双性能档分支与清理逻辑 |
| `themes/ronova/src/client/theme.css` | 明暗配色、背景/人物分层、动态、响应式和 DSH 组件覆盖 |
| `themes/ronova/src/index.js` | WebP/PNG 只读本地资源路由 |
| `themes/ronova/scripts/build-client.mjs` | 内容 revision 与客户端 bundle 构建 |
| `themes/ronova/scripts/verify.mjs` | 包、路由、RGBA、性能、HUD、动画和预览回归断言 |
| `themes/ronova/scripts/extract-character-alpha.py` | 棋盘格识别、Alpha 构建和边缘去污染 |
| `themes/ronova/scripts/generate-previews.py` | 生成 1280×720 明暗预览 |
| `themes/ronova/skin.json` | 主题元数据、预览、许可与排序 |
| `theme-registry.json` | 注册 `genshin-ronova`，排序 60 |
| `scripts/release-themes.mjs` | 将联合发布扩展为六主题 |

## 8. 验收结果

- [x] `genshin-ronova` 主题元数据、包名、Cordis 接线和注册表一致。
- [x] 与另外五个主题共同通过注册表唯一性和共享主题中心互斥校验。
- [x] 人物为 `1024 × 1536`、PNG color type 6 的 RGBA 文件，不是矩形海报。
- [x] 背景与人物分别通过带 revision 的插件本地路由加载。
- [x] GET、HEAD、404、405、MIME、长度和一年不可变缓存均通过自动校验。
- [x] 客户端 bundle 为 64,520 bytes，低于 100,000 bytes 上限。
- [x] `economy` 不创建灵魂微光、律令环阵和前景裂隙，并停止持续动画。
- [x] `full` 创建人物关联动效、场景动效和三块 HUD 扫描联动。
- [x] `prefers-reduced-motion` 停止全部主题动画。
- [x] 右上、右下和主题入口具备普通桌面、宽屏、窄屏安全轨道。
- [x] 浅色、深色 1280×720 预览已生成并完成视觉检查。
- [x] 联合构建、六主题校验与联合发布均通过。

### v0.2.1 立绘主视觉复核

- [x] 修复隐藏主题面板仍被 `:has([role='dialog'])` 命中、使人物舞台长期降至 `0.38` 透明度的问题；只有可见弹窗才会触发弱化。
- [x] 桌面宽屏人物舞台提升为最高 `900px` 宽、`114vh` 高，加入骨白核心光、猩红轮廓场和底部神性辉光。
- [x] 深色人物使用更强的亮度、对比度、暖白轮廓光和双层投影，拉开白发、黑翼与酒红场景的明度层次。
- [x] 正文阅读幕改为四段渐变，在中心内容区增强承托、右侧人物区快速退让；窄屏人物透明度单独回调。
- [x] 主题面板隐藏时人物舞台透明度实测为 `1`（1920×960）/ `0.9`（806×856），面板展开时才降至 `0.68`。
- [x] 正式安装到 DSH `web` profile，已安装 bundle 与源码 bundle 的 SHA-256 一致，页面和人物资源均返回 HTTP 200。

### v0.2.2 输入区可读性修复

- [x] 移除主题直接施加在 `textarea` 上的不透明背景，恢复 DSH 的“透明输入层 + 文字背板”原生渲染结构。
- [x] 浅色文字背板使用 `#3a252b`，占位符使用 `#806d73`，光标使用 `#a93439`。
- [x] 深色文字背板使用 `#fff1eb`，占位符使用 `#c7b4b1`，光标使用 `#f17b69`。
- [x] 浅色、深色均使用实际输入文本完成浏览器实机验收，测试文字在验收后已清空。

## 9. 发布

- 版本：`0.2.2`
- 发布包：`release/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz`
- 包大小：`2,578,913` bytes
- SHA-256：`61bc90f308583fdfd4eb9d5be91dec9877f06942afdf83e615ba0e8d514d60b2`
- 发布包只包含正式 WebP/PNG，不包含 `ronova-character-source.png` 或处理脚本。

验收命令：

```powershell
pnpm run theme:ronova:build
pnpm run theme:ronova:test
pnpm run themes:build
pnpm run themes:test
pnpm run themes:release
```

## 10. 结论

spec009 已完成一个独立于既有主题视觉语言的若娜瓦主题。实现复用了经过验证的多主题互斥、默认省资源、人物/背景真分层、确定性 Alpha 修复和 HUD 安全轨道方案，同时建立了赤月、黑曜门、六翼神瞳与终焉律令构成的新视觉体系。
