# 三体 · 章北海 DSH 主题安装

分发文件：`dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz`

## 安装

```powershell
dsh plugin --profile web add ./dsh-external-dsh-client-ui-skin-threebody-zhangbeihai-0.3.3.tgz
dsh --profile web --dump-config
dsh web
```

组合配置中应出现 `ui-skin-threebody-zhangbeihai`。重启 Web 服务后，从右下角“主题中心”选择章北海。

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-client-ui-skin-threebody-zhangbeihai
```

卸载活动主题时会自动恢复官方外观。权利边界见包内 `NOTICE`。
