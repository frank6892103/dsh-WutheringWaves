import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const themeRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(themeRoot, '..', '..');
const releaseDir = join(repoRoot, 'release');
const packageJson = JSON.parse(await readFile(join(themeRoot, 'package.json'), 'utf8'));

const run = (command, args, cwd = themeRoot, shell = false) => {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
  }
};

await mkdir(releaseDir, { recursive: true });
run(process.execPath, ['scripts/build-client.mjs']);
run(process.execPath, ['scripts/verify.mjs']);
const packArgs = ['pack', '--pack-destination', releaseDir];
if (process.env.npm_execpath) {
  run(process.execPath, [process.env.npm_execpath, ...packArgs]);
} else {
  run(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', packArgs, themeRoot, process.platform === 'win32');
}

const archiveName = `${packageJson.name.replace(/^@/, '').replaceAll('/', '-')}-${packageJson.version}.tgz`;
const archivePath = join(releaseDir, archiveName);
const archive = await readFile(archivePath);
const sha256 = createHash('sha256').update(archive).digest('hex');

await writeFile(join(releaseDir, 'SHA256SUMS.txt'), `${sha256}  ${archiveName}\n`, 'utf8');
await writeFile(join(releaseDir, 'release.json'), `${JSON.stringify({
  schemaVersion: 1,
  package: packageJson.name,
  version: packageJson.version,
  archive: archiveName,
  size: archive.length,
  sha256,
  testedWith: '@deepseek-ai/dsh@0.1.1-rc.2',
}, null, 2)}\n`, 'utf8');

const installGuide = `# 鸣潮 · 爱弥斯 DSH 主题安装

分发文件：\`${archiveName}\`

## 校验

PowerShell：

\`\`\`powershell
(Get-FileHash -Algorithm SHA256 .\\${archiveName}).Hash.ToLower()
\`\`\`

结果应与 \`SHA256SUMS.txt\` 一致。

## 安装

在压缩包所在目录执行：

\`\`\`powershell
dsh plugin --profile web add ./${archiveName}
dsh --profile web --dump-config
dsh web
\`\`\`

组合配置中应出现 \`ui-skin-wuthering-aemeath\`。如果 Web 服务已运行，请先停止后重新启动。

## 卸载与恢复官方外观

\`\`\`powershell
dsh plugin --profile web remove ${packageJson.name}
\`\`\`

重新启动 \`dsh web\` 后，主题注册的样式、装饰节点、标题和主题色会被清理。

## 兼容与权利说明

- 已针对 \`@deepseek-ai/dsh@0.1.1-rc.2\` 与 \`@deepseek-ai/cordis@^4.0.1\` 构建、测试。
- DSH 仍处于开发者预览期，升级后若界面结构变化，请重新验证主题。
- 原创代码使用 MIT 许可；角色与美术素材不在 MIT 许可范围内，具体来源与限制见包内 \`NOTICE\`。
- 该构建定位为非商业、本地玩家主题。公开发布或扩大分发前，应由分发者确认适用的素材授权与平台规则。
`;
await writeFile(join(releaseDir, 'INSTALL.md'), installGuide, 'utf8');

console.log(`Release: ${archivePath}`);
console.log(`SHA-256: ${sha256}`);
