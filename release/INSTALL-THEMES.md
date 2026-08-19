# 鸣潮多主题 DSH 安装

本目录中的两个主题包可以同时安装。安装并重启 DSH 后，从页面右下角“主题中心”选择“爱弥斯”“坎特蕾拉”或“官方外观”。

## 校验

PowerShell：

```powershell
Get-Content .\THEME-SHA256SUMS.txt
Get-FileHash -Algorithm SHA256 .\*.tgz
```

## 安装

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-aemeath-0.2.1.tgz
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-wuthering-cantarella-0.2.0.tgz
dsh --profile web --dump-config
dsh web
```

组合配置中应同时出现 `ui-skin-wuthering-aemeath` 和 `ui-skin-wuthering-cantarella`。主题选择保存在当前 DSH 站点，刷新和重启服务后仍会恢复；DSH 自身的浅色/深色设置与角色主题相互独立。

## 恢复官方外观

直接在“主题中心”选择“官方外观”。如需卸载：

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-aemeath
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-wuthering-cantarella
```

主题代码使用 MIT 许可；角色与美术素材不属于 MIT 许可范围，详情见各压缩包中的 `NOTICE`。
