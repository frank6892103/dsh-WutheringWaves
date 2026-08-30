# 三体 · 章北海

DeepSeek Harness Web GUI 的可切换客户端皮肤包。

> 非官方、非商业的本地爱好者主题。原创代码使用 MIT 许可；既有作品元素与美术素材不在 MIT 许可范围内，详见 `NOTICE`。

## 视觉设计

- 以舰桥晨光、恒星舰队指挥界面、单向航迹和锁定坐标为核心意象，表达章北海的克制、远见与决断。
- 使用原创电影感素材，不采用真人演员肖像或影视改编造型；v0.3.3 修正透明蒙版对面部暖色高光的误判，恢复眉眼、鼻尖、嘴唇、下颌、耳部与发际线，并只在头发、肩部和制服等身体外缘维持约 2 px 的去白边处理。
- 三恒星混沌轨道、危机纪元时间戳、黑暗森林广播、水滴式航迹与自然选择号共同建立《三体》叙事识别，不依赖影视剧照。
- 亮色模式是骨白、铁蓝、档案灰和克制朱红；暗色模式沿用相同色相关系，转为石墨海军蓝、冷钢光与低亮红色航标。
- 用直角裁切、细线坐标和编队记录替代现有主题的圆润玻璃、东方庭园或高饱和幻想语言。
- 完整模式提供人物呼吸、冬眠档案扫描、决策锁定、制服节点、三恒星混沌轨道、自然选择号单向航迹、星点漂移、微尘上升与短促跃迁线；所有效果都支持 `prefers-reduced-motion`。
- 右上三恒星 HUD 与右下“自然选择”指令 HUD 采用清霄主题验证过的安全轨道：普通桌面避让 Session Log，宽屏统一对齐到右侧 24px；主题中心作为下层 HUD 固定在 22px 底边。
- 默认“省资源”模式只保留静态航向、十二颗星点和锁定标记，不创建微尘与跃迁节点，也不启用实时模糊。
- 运行时仅从插件本地路由加载 WebP，不请求外部 CDN。

## 切换

安装后主题会出现在右下角“主题中心”。它可以和仓库中的其他主题同时安装，但任意时刻只挂载一个主题。也可以程序化切换：

```js
window.__DSH_WUTHERING_THEME_HUB__.setActive('threebody-zhangbeihai')
```

## 构建与校验

```powershell
node scripts/build-client.mjs
node scripts/verify.mjs
```

## 安装

远端（[GitHub Releases](https://github.com/frank6892103/dsh-WutheringWaves/releases)）：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
```

本地 `.tgz`（下载 Release 或执行 `pnpm run themes:release`）：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
dsh --profile web --dump-config
dsh web
```

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-threebody-zhangbeihai
```

卸载活动主题时会自动退回官方外观。
