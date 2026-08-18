# 鸣潮 · 爱弥斯 DSH 主题安装

分发文件：`dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.1.tgz`

## 校验

PowerShell：

```powershell
(Get-FileHash -Algorithm SHA256 .\dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.1.tgz).Hash.ToLower()
```

结果应与 `SHA256SUMS.txt` 一致。

## 安装

在压缩包所在目录执行：

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.1.1.tgz
dsh --profile web --dump-config
dsh web
```

组合配置中应出现 `ui-skin-wuthering-aemeath`。如果 Web 服务已运行，请先停止后重新启动。

## 卸载与恢复官方外观

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
```

重新启动 `dsh web` 后，主题注册的样式、装饰节点、标题和主题色会被清理。

## 兼容与权利说明

- 已针对 `@deepseek-ai/dsh@0.1.0-rc.6` 与 `@deepseek-ai/cordis@^4.0.1` 构建、测试。
- DSH 仍处于开发者预览期，升级后若界面结构变化，请重新验证主题。
- 原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，具体来源与限制见包内 `NOTICE`。
- 该构建定位为非商业、本地玩家主题。公开发布或扩大分发前，应由分发者确认适用的素材授权与平台规则。
