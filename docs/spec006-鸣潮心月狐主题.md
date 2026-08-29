# spec006：鸣潮心月狐主题

> 状态：v0.3.0 已完成并安装验收
> 整理日期：2026-08-29
> 目标环境：`@deepseek-ai/dsh@0.1.1-rc.2`
> 主题 ID：`wuthering-xinyuehu`
> 包名：`@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu`
> Body 作用域：`data-dsh-skin-xinyuehu`

## 1. 项目目标

为 DeepSeek Harness Web GUI 提供一套可独立安装、可与其他主题共存并通过主题中心互斥切换的“鸣潮 · 心月狐”主题。

主题以“玄方月苑、万相分形与梦州灯影”为核心概念，通过暖纸、月门、折屏、狐火、机关轨道和朱砂印记建立独立视觉语言。它必须完整支持 DSH 浅色/深色外观、`economy`/`full` 性能档、减少动态偏好、失败回滚和卸载清理。

## 2. 本轮评审问题

v0.3.0 针对实际 DSH 预览中的四类问题进行重构：

| 问题 | 评审表现 | v0.3.0 处理结果 |
| --- | --- | --- |
| 与爱弥斯主题相似 | 同样依赖大幅角色海报、光环和悬浮信息框，角色辨识度不足 | 移除星海霓虹叙事，改用月苑折屏、纸绢层次、朱砂印、青玉机关线和非胶囊式折角 HUD |
| 浅色配色突兀 | 背景偏灰、强调色跳出界面、人物与内容层次断裂 | 重建暖象牙白、低饱和青玉、朱砂红和月金配色，并为侧栏、标题栏、输入框、气泡分别建立透明层级 |
| 人物虚化严重 | 原海报被裁进右侧画框，人物与背景、文字及边框无法分离 | 从原始海报提取独立真 Alpha 立绘，人物、折屏和环境光拆成不同层，取消人物裁切与模糊遮罩 |
| HUD 与动态不完整 | 右上、右下组件被截断，动画只在背景发生且不易感知 | 重建桌面安全轨道，补全上下 HUD 与主题入口，并增加人物呼吸、狐火尾焰、共鸣节点、三层轨道和 HUD 扫描联动 |

## 3. 设计定位

### 3.1 角色语义

- 朝月：暖月白、圆形月门、低频光晕和相位轨道。
- 心月狐：红白黑人物主色、狐火尾焰、共鸣节点与朱砂印记。
- 万相分形：同心环、机关刻度、分形节点和 HUD 数据语言。
- 梦州灯火：月金灯路、暖纸面板和克制的浮游光点。
- 孤城秩序：折屏、窗棂、细线边界与留白构图。

### 3.2 与现有主题的差异

1. 不复用爱弥斯的星海、青粉霓虹、电子幽灵和太空舷窗语言。
2. 不复用坎特蕾拉的深海玻璃、水母微光与潮汐扩散语言。
3. 从清宵主题借鉴“人物与背景分层”的实现思路，但不使用水墨云剑、琴弦或剑阵符号。
4. 从章北海主题借鉴“视口安全轨道”和“角色驱动动态”的组织方法，但不使用舰桥、航迹、军事档案或铁蓝坐标系统。
5. 心月狐的识别必须同时由月苑折屏、万相分形、狐火尾焰、朱砂印与梦州灯路共同建立，不能只依赖主题名称或角色图片。

## 4. 视觉系统

### 4.1 色彩规范

| 语义 | 浅色 | 深色 | 用途 |
| --- | --- | --- | --- |
| 月纸 | `#EEECE3` | `#1B2D25` | 页面环境与纸绢基底 |
| 高光纸 | `#FAF7EE` | `#2B4337` | 输入框、浮层和高层面板 |
| 低层纸 | `#DFE3DC` | `#13231C` | 侧栏、地台与背景层 |
| 朱砂 | `#B65045` | `#E38273` | 主交互、印章、HUD 和扫描线 |
| 柔朱砂 | `#D17B6F` | `#B9675C` | 光晕、次级强调和状态过渡 |
| 青玉 | `#4F8675` | `#87B5A3` | 月门、轨道、结构线和辅助状态 |
| 月金 | `#E5D59F` | `#D8C89B` | 灯火、刻度和高亮信号 |
| 玄墨 | `#303632` | `#E9E6DA` | 正文与标题 |

浅色模式不是深色模式的简单反相。背景使用暖象牙白和低透明青玉环境色，朱砂只承担交互与局部锚点；侧栏、标题栏、输入框和消息气泡使用不同明度与透明度，保证人物可见但不降低正文对比度。

### 4.2 场景层级

```text
DSH content
  ├─ paper / terrace
  ├─ moon gate / ring / phase ticks
  ├─ folding screen
  ├─ character stage
  │    ├─ aura
  │    ├─ three orbit rings
  │    ├─ foxfire tail flames
  │    ├─ transparent portrait
  │    ├─ portrait glint
  │    └─ resonance nodes
  ├─ fractal / lantern route / clouds
  ├─ full only: fox sparks
  ├─ top HUD
  └─ bottom HUD + theme hub trigger
```

人物是独立前景层，不进入折屏蒙版，也不与海报背景合成。折屏只承担空间框架；光环和轨道位于人物后方，扫光与节点位于人物前方，从而保持面部、发丝、服装和尾部轮廓清晰。

### 4.3 人物资产

- 原始参考：`assets/xinyuehu-poster.webp`。
- 独立立绘：`assets/xinyuehu-character-v2.png`。
- 尺寸：`941 × 1672`。
- 格式：RGBA PNG，Alpha 范围 `0–255`。
- 处理方式：使用 OpenAI ImageGen 在保留人物面部、姿势、服装和角色特征的前提下移除海报背景、文字与边框；随后对生成图中的烘焙棋盘底执行确定性 Alpha 清理。
- 禁止在最终立绘中保留白底、棋盘格、海报文字、背景建筑或整体模糊遮罩。
- 人物在浅色模式使用轻度饱和、对比度和亮度提升；深色模式提高轮廓亮度并增加低强度朱砂描光，不降低到背景水印级透明度。

## 5. HUD 与版式安全轨道

### 5.1 桌面布局

| 组件 | 位置与尺寸 | 设计内容 |
| --- | --- | --- |
| 右上 HUD | `top: 7px; right: 148px; width: clamp(268px, 23vw, 308px); height: 42px` | 避让 Session Log；显示“心月狐 · 万相分形”、完整/静态状态和五段信号 |
| 右下共鸣 HUD | `right: 18px; bottom: 91px; width: 258px; height: 56px` | 显示“灯随月转 · 狐影相生”和相位同步状态 |
| 主题入口 HUD | `right: 18px; bottom: 18px; width: 258px; height: 58px` | 作为可交互的第三块 HUD，显示当前主题并打开主题中心 |

三块 HUD 使用同一折角切片、朱砂边线、月金扫描和青玉底色。右下共鸣 HUD 与主题入口之间保留 15 px 安全间距，不能互相重叠或超出视口。

### 5.2 响应式规则

- `≤1180px`：人物舞台和折屏向右退让，右上 HUD 收窄。
- `≤980px`：隐藏右上 HUD；右下 HUD 与主题入口继续留在视口安全区，人物降低占屏比例。
- `≤620px`：隐藏装饰 HUD 和灯路，只保留 52 px 紧凑主题入口；人物继续右移并降低不透明度，避免遮挡输入区。
- 主题中心面板使用固定顶部安全区和视口最大高度，不允许从右下方越界展开。

## 6. 动态设计

完整动态模式必须让运动围绕人物和 HUD 发生，而不是只在远景增加不易察觉的粒子。

| 动态 | 周期 | 叙事与视觉作用 |
| --- | --- | --- |
| `xinyuehu-portrait-breathe` | 6.8 s | 人物低幅呼吸、轻微上提和横向重心变化，增强角色存在感 |
| `xinyuehu-aura-pulse` | 4.4 s | 人物后方狐火光场扩张、旋转并改变饱和度 |
| `xinyuehu-portrait-orbit` | 13/17/9 s | 三层轨道正反向旋转，表现万相分形与月相演算 |
| `xinyuehu-tail-flame` | 3.6 s | 七组狐火尾焰错峰摆动、伸展和提亮 |
| `xinyuehu-resonance-node` | 2.4 s | 八个节点沿人物轮廓依次确认和脉冲 |
| `xinyuehu-portrait-glint` | 5.2 s | 扫光穿过人物前景，强化人物与背景分层 |
| `xinyuehu-fox-spark` | 5.4 s | 十二枚朱砂/月金火种从人物附近缓慢上升 |
| `xinyuehu-hud-scan` | 3.8 s | 右上、右下和主题入口使用统一扫描节奏 |
| `xinyuehu-hud-signal` | 1.5 s | 五段信号错峰缩放，明确 HUD 处于活动状态 |
| 月门/刻度/分形/灯路 | 14–26 s | 低速背景运动，建立环境深度但不抢夺正文注意力 |

动画仅使用 CSS keyframes，不使用持续定时器或 `requestAnimationFrame`。`prefers-reduced-motion: reduce` 会停止全部主题动画。

## 7. 性能档

### 7.1 `full`

- 创建 6 个分形节点、9 盏灯、7 组尾焰、8 个共鸣节点和 12 枚狐火火种。
- 启用人物呼吸、光环、轨道、尾焰、扫光、HUD 扫描和环境动画。
- 允许使用受作用域约束的 `:has()`，在 DSH 对话框出现时降低人物舞台与 HUD 存在感。

### 7.2 `economy`

- 创建 3 个分形节点、4 盏灯、3 组尾焰和 4 个共鸣节点，不创建狐火火种。
- 停止全部持续动画并移除实时滤镜负担。
- 不执行关系选择器，确保远程桌面和低性能环境保持稳定。

## 8. 运行时与清理

主题通过共享 `__DSH_WUTHERING_THEME_HUB__` 注册并互斥挂载。所有顶层 DOM 和样式节点带 `data-xinyuehu-theme-owned` 标记。

挂载时：

1. 注入作用域 CSS 和场景 DOM；
2. 从插件本地路由加载透明立绘；
3. 设置 `data-dsh-skin-xinyuehu`、页面标题和明暗对应的 `theme-color`；
4. 使用 `MutationObserver` 跟随 DSH 的 `data-ds-dark-theme`。

卸载或切换时：

1. 断开 `MutationObserver`；
2. 删除全部自有 DOM 和样式节点；
3. 恢复原 Body 属性、页面标题和 `theme-color`；
4. 不修改会话、模型、设置和其他业务数据。

## 9. 资源与分发要求

- 本地资源路由：`/plugins/@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu/assets`。
- `xinyuehu-poster.webp` 使用 `image/webp`；`xinyuehu-character-v2.png` 使用 `image/png`。
- 路由支持 `GET`、`HEAD`、`404` 和 `405`，并返回 `public, max-age=31536000, immutable`。
- Client bundle 不得内嵌 Base64 图片，构建后必须小于 100 KB。
- 代码采用 MIT 许可；角色素材仅用于本地非商业同人主题，来源和处理过程记录在 `assets/source.json` 与 `NOTICE`。
- 明暗预览分别输出为 `preview/light.webp` 和 `preview/dark.webp`。

参考资料：

1. [《鸣潮》公开全新角色预告（含“心”）](https://www.ourplay.net/news/detail/10888)
2. [《鸣潮》官方微博](https://weibo.com/7730797357)
3. [鸣潮同人创作指引](https://wutheringwaves.kurogames.com/p/jp/produce.html)

## 10. 交付与安装

- 主题版本：`0.3.0`。
- 发布包：`release/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz`。
- SHA-256：`caef187257730b5e15f65e674c93c56172b30203ca9c806a4750573ed7ca6e0e`。
- DSH 安装目标：`web` profile。
- 实际安装结果：`@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu@0.3.0`。

验收命令：

```powershell
pnpm --dir themes/xinyuehu run build
pnpm --dir themes/xinyuehu run test
pnpm run themes:build
pnpm run themes:test
pnpm run themes:release
```

## 11. 验收结果

- [x] 透明人物资源以 RGBA PNG 形式独立加载，实机尺寸为 `941 × 1672`，不存在 404、白底或棋盘格。
- [x] 人物面部、发丝、服装和尾部轮廓在浅色/深色模式下均清晰可辨，不再作为背景水印显示。
- [x] 1280 × 720 实机中，右上 HUD、右下 HUD 和主题入口完整处于视口内。
- [x] 右下 HUD 与主题入口同宽、右侧对齐并保留 15 px 间距。
- [x] 完整模式下人物呼吸、光环、三层轨道、尾焰和 HUD 动画在不同时刻的计算样式均发生变化。
- [x] 浅色主题采用暖纸、青玉、朱砂和月金层次，侧栏、内容区与人物之间无突兀断层。
- [x] `prefers-reduced-motion` 和 `economy` 模式能够停止持续动画。
- [x] Host 资源路由、长期缓存、GET/HEAD/404/405、无 Base64 和 bundle 体积校验通过。
- [x] 独立主题构建与测试通过；联合主题构建、测试和发布通过。
- [x] `0.3.0` 发布包已安装到 DSH `web` profile，并完成真实页面视觉检查。
