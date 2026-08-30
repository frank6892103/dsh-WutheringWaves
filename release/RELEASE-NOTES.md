# dsh-WutheringWaves v0.5.0

已针对 `@deepseek-ai/dsh@0.1.1-rc.2` 验证。主题包保持 `private: true`，不发布 npm registry；安装使用本 Release 中的 `.tgz`。

## 主题包

| 主题 | 包名 | 版本 | 文件 |
| --- | --- | --- | --- |
| 鸣潮 · 爱弥斯 | `@dsh-external/dsh-client-ui-skin-wuthering-aemeath` | 0.3.1 | `dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz` |
| 鸣潮 · 坎特蕾拉 | `@dsh-external/dsh-client-ui-skin-wuthering-cantarella` | 0.3.1 | `dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz` |
| 鸣潮 · 心月狐 | `@dsh-external/dsh-client-ui-skin-wuthering-xinyuehu` | 0.3.0 | `dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz` |
| 鸣潮 · 清宵 | `@dsh-external/dsh-client-ui-skin-wuthering-qingxiao` | 0.1.0 | `dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz` |
| 三体 · 章北海 | `@dsh-external/dsh-client-ui-skin-threebody-zhangbeihai` | 0.3.3 | `dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz` |
| 原神 · 若娜瓦 | `@dsh-external/dsh-client-ui-skin-genshin-ronova` | 0.2.2 | `dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz` |

## DSH（推荐）

```powershell
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
dsh plugin --profile web add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
dsh --profile web --dump-config
dsh web
```

## pnpm / npm

远端：

```powershell
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
pnpm add https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
```

```powershell
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
npm install https://github.com/frank6892103/dsh-WutheringWaves/releases/download/v0.5.0/dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
```

本地（先下载对应 `.tgz`）：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
pnpm add ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.3.1.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.3.1.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-xinyuehu-0.3.0.tgz
npm install ./dsh-external-dsh-client-ui-skin-wuthering-qingxiao-0.1.0.tgz
npm install ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
npm install ./dsh-external-dsh-client-ui-skin-genshin-ronova-0.2.2.tgz
```

最新版别名：https://github.com/frank6892103/dsh-WutheringWaves/releases/latest

校验和见 `THEME-SHA256SUMS.txt`。权利边界见各包内 `NOTICE`。
