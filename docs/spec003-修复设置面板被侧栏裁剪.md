# spec003：修复设置面板被侧栏裁剪

> 状态：已修复、已部署并通过正式环境验收
> 日期：2026-08-17
> 对应提交：`bugfix: 修复主题设置面板被侧栏裁剪`

## 1. 问题现象

安装“鸣潮 · 爱弥斯”主题后，点击 Web GUI 左下角“设置”，设置遮罩和面板被限制在左侧栏范围内：

- 设置内容区宽度仅约 91px，中文逐字换行；
- “浅色”“深色”“跟随系统”等控件纵向溢出；
- 面板被侧栏的 `overflow: hidden` 裁剪，无法正常操作。

在 1280 × 720 复现视口中，异常遮罩宽度为 279px，设置面板宽度同为 279px。

## 2. 根因

主题使用了范围过宽的玻璃效果选择器：

```css
body[data-dsh-skin-aemeath] [class*='sidebar'] {
  backdrop-filter: blur(20px) saturate(1.18);
}
```

该选择器命中了承载设置组件的 `*_sidebarCol`。`backdrop-filter` 会为后代的固定定位元素建立新的包含块，导致设置组件的 `position: fixed` 遮罩不再相对浏览器视口定位，而是相对 280px 宽的侧栏定位，并被侧栏裁剪。

## 3. 修复方案

- 侧栏继续保留主题边框色，不再对外层侧栏容器应用 `backdrop-filter`；
- 玻璃模糊效果仅保留在 `titlebar` 和 `composer`；
- 新增 CSS 回归断言：任何匹配 `[class*='sidebar']` 的主题规则均不得声明 `backdrop-filter`；
- 重新生成 `themes/aemeath/lib/client.js`，重新构建发布 tarball，并覆盖安装正式 `web` profile。

## 4. 验收结果

- 正式环境：`C:\Users\wangb\.dsh\profiles\web`
- 访问地址：`http://127.0.0.1:3180/`

| 检查项 | 结果 |
| --- | --- |
| DSH profile 中包含 `ui-skin-wuthering-aemeath` | 通过 |
| 安装目录为 tarball 实体目录，而非开发链接 | 通过 |
| 安装包 `lib/client.js` 与源码构建哈希一致 | 通过 |
| HTTP 响应 | 200 |
| 1280 × 720 下设置遮罩尺寸 | 1280 × 720 |
| 设置面板尺寸与位置 | 800 × 672，`x=240`、`y=24` |
| 设置内容区滚动尺寸 | `clientHeight=618`、`scrollHeight=618` |
| 侧栏计算样式 `backdrop-filter` | `none` |
| 页面控制台 error | 0 |
| 用户验收 | 已确认恢复正常 |

## 5. 发布信息

- 包：`@dsh-external/dsh-client-ui-skin-wuthering-aemeath@0.1.0`
- 发布文件：`release/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.0.tgz`
- 发布包 SHA-256：`8fa2129892b4dd7cd5f21fac0c373259162d6b83863760dffd7f31f4e9f2f40b`
- 安装客户端 SHA-256：`dd80345ae3790c73c7c062795edfe035d6b942787e5d6b7ea0b99c24b531a059`

## 6. 回滚

如需恢复官方外观：

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
```

重新启动 `dsh web` 后生效。
