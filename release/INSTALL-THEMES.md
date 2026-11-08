# 角色多主题 DSH 安装

六个主题包可以同时安装。安装并重启 DSH 后，从“主题中心”选择“爱弥斯”“坎特蕾拉”“心月狐”“清宵”“章北海”“若娜瓦”或“官方外观”。主题中心默认在页面右下角，按住按钮或标题可拖到其他位置，刷新后仍留在那里。心月狐、章北海、若娜瓦贴在选择框上的铭牌会一起移动，打开列表时先让开。爱弥斯右上角的“RESONANCE SIGNAL”避开 DSH 功能按钮。

集合版本 `0.6.0` 对应 GitHub Release [`v0.6.0`](https://github.com/frank6892103/dsh-WutheringWaves/releases/tag/v0.6.0)。浏览全部版本：https://github.com/frank6892103/dsh-WutheringWaves/releases

## 校验

PowerShell：

```powershell
Get-Content .\THEME-SHA256SUMS.txt
Get-FileHash -Algorithm SHA256 .\*.tgz
```

## 从 GitHub Release 安装

DSH（写入 web profile，推荐）：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.2.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.2.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.1.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.1.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.4.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.3.tgz
dsh --profile web --dump-config
dsh web
```

同一 tarball 也可用包管理器安装：

```powershell
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.2.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.2.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.1.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.1.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.4.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.3.tgz
```

```powershell
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.2.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.2.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.1.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.1.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.4.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.6.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.3.tgz
```

跟随最新 Release（文件名不含主题版本号）：

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-wuthering-aemeath.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-wuthering-cantarella.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-wuthering-qingxiao.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/latest/download/dsh-external-dsh-client-ui-skin-genshin-ronova.tgz
```

若目标是 DSH GUI，请使用 `dsh plugin`；`pnpm add` / `npm install` 只证明该 `.tgz` 是标准 npm 包。

## 从本地文件安装

下载 Release 资源，或在仓库根目录执行 `pnpm run themes:release` 后，在 `.tgz` 所在目录执行：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.2.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.2.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.1.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.1.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.4.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.3.tgz
dsh --profile web --dump-config
dsh web
```

```powershell
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.2.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.2.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.1.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.1.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.4.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.3.tgz
```

```powershell
npm install ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.2.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.2.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.1.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.1.tgz
npm install ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.4.tgz
npm install ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.3.tgz
```

不必一次装完；只装需要的主题即可。组合配置中应同时出现 `ui-skin-wuthering-aemeath`、`ui-skin-wuthering-cantarella`、`ui-skin-wuthering-xinyuehu`、`ui-skin-wuthering-qingxiao`、`ui-skin-threebody-zhangbeihai` 和 `ui-skin-genshin-ronova`。主题选择保存在当前 DSH 站点，刷新和重启服务后仍会恢复；DSH 自身的浅色/深色设置与角色主题相互独立。

主题中心默认使用“省资源”模式，适合公司云电脑；它会关闭持续动画和实时毛玻璃，并减少装饰节点。需要完整动态效果时，可在主题中心切换，性能选择也会保存在当前站点。

## 恢复官方外观

直接在“主题中心”选择“官方外观”。如需卸载：

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-cantarella
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-xinyuehu
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-qingxiao
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-threebody-zhangbeihai
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-genshin-ronova
```

主题代码使用 MIT 许可；角色与美术素材不属于 MIT 许可范围，详情见各压缩包中的 `NOTICE`。
