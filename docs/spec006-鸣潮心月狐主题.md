# spec006：鸣潮心月狐主题

> 状态：v0.1.0 已实现并完成自动化、预览视觉与联合打包验收
> 日期：2026-08-26
> 主题 ID：`wuthering-xinyuehu`
> 包名：`@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu`

## 1. 摘要

为 DeepSeek Harness Web GUI 新增第三套可独立安装、可与现有主题共存的《鸣潮》心月狐主题。主题继续复用仓库现有“主题中心”完成互斥切换，并完整支持 DSH 浅色/深色外观、默认省资源模式、完整动态效果、失败回滚和卸载清理。

心月狐主题不复制坎特蕾拉的深海语言，也不复制爱弥斯的星海霓虹语言。其视觉中心是“朝月清辉照孤城”：月白纸绢、玄墨面板、朱砂机关、青玉狐火、金色灯火和万相分形星盘。

## 2. 角色资料与设计依据

截至 2026-08-26，官方公开资料将“心”描述为梦州文明的导引者与岁主，角色预告语为“朝月清辉照孤城”；公开档案还给出“万相分形”权能。主题据此使用以下视觉语义：

- 朝月：大面积偏暖月白与月门光晕；
- 孤城：克制的格栅、窗棂和边框结构；
- 心月狐：青玉狐火、尾焰和红白黑角色配色；
- 万相分形：星盘、同心环、机关刻度与相互连接的 HUD；
- 人间灯火：金色微尘、朱砂交互状态与温暖纸绢面板。

参考资料：

1. [《鸣潮》公开全新角色预告（含“心”）](https://www.ourplay.net/news/detail/10888)
2. [《鸣潮》官方微博](https://weibo.com/7730797357)
3. [鸣潮同人创作指引](https://wutheringwaves.kurogames.com/p/jp/produce.html)

## 3. 功能目标

### 3.1 P0

- 新增独立主题包、`skin.json`、Cordis patch、host 入口、client bundle、测试和发布脚本。
- 注册到全局主题中心，排序位于爱弥斯和坎特蕾拉之后。
- 同时安装多套主题时仅挂载一个活动主题；切换到官方外观后撤销全部主题副作用。
- 跟随 DSH 的 `data-ds-dark-theme` 即时切换亮暗色，并恢复原 `theme-color` 与页面标题。
- 默认省资源模式只保留静态场景、角色海报、机关格栅和两簇狐火。
- 完整模式增加星盘、绸带、微尘、星芒、频谱和 HUD 扫描，不引入定时器或 rAF。
- 素材只从插件本地路由加载，使用内容哈希查询参数和长期不可变缓存。

### 3.2 非目标

- 不改变 DSH 会话、模型请求、设置数据或业务交互。
- 不把角色素材嵌入 base64 client bundle。
- 不把本地玩家主题表述为官方产品或获得官方授权的作品。
- 不复刻游戏 UI；仅以角色公开资料为视觉灵感。

## 4. 视觉规范

| 语义 | 浅色 | 深色 | 用途 |
| --- | --- | --- | --- |
| 月白 | `#FFF8E9` | `#FFF2D8` | 标题、高光、月门 |
| 朱砂 | `#B43B31` | `#EF7568` | 主交互、刻度、发送按钮 |
| 青玉 | `#2F8174` | `#69C7B5` | 狐火、状态、次强调 |
| 纸绢 | `rgba(249,243,231,.62)` | `rgba(31,24,21,.68)` | 面板与 HUD |
| 玄墨 | `#29231F` | `#171110` | 正文与暗色基底 |

角色预告图以低透明度放在右侧，使用横向遮罩融入背景，不进入正文列。左侧机关分形图案和顶部月门负责平衡构图；浮层出现时，完整模式通过 `:has()` 降低人物与 HUD 存在感，省资源模式不执行关系选择器。

## 5. 运行时结构

```text
theme hub
  └─ register(wuthering-xinyuehu)
       └─ mountXinyuehuTheme()
            ├─ style
            ├─ scene
            │    ├─ dreamscape / lattice / moon
            │    ├─ foxfire field
            │    └─ full only: orbits / astrolabe / silks / motes / sparks
            ├─ poster / brand
            └─ HUD
```

所有顶层节点带 `data-xinyuehu-theme-owned` 标记。清理器断开 `MutationObserver`，移除自有节点，恢复 body 属性、标题和 `meta[name=theme-color]`。

## 6. 交付清单

- `themes/xinyuehu/` 完整独立主题包；
- `theme-registry.json` 新注册项；
- 根目录构建、测试与发布命令；
- 亮色/深色 WebP 预览；
- 素材来源记录与非商业边界说明；
- 多主题联合发布清单与安装文档。

## 7. 验收标准

- `pnpm run themes:build` 成功，client bundle 不含 base64 图片；
- `pnpm run themes:test` 成功，注册表中的主题 ID、包名和 body 属性全部唯一；
- 心月狐 host 路由正确处理 GET、HEAD、404 和 405；
- bundle 小于 100 KB，角色素材保持为独立 WebP；
- 省资源模式不创建完整模式专属节点，不运行持续动画或实时模糊；
- `prefers-reduced-motion: reduce` 停止全部主题动画；
- 预览图均为有效 WebP，单张大于 20 KB；
- 联合发布流程生成心月狐 `.tgz`、SHA-256、清单和多主题安装说明。
