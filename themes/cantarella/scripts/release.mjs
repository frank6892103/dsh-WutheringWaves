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
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
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
  testedWith: '@deepseek-ai/dsh@0.2.2-rc.1',
}, null, 2)}\n`, 'utf8');

const installGuide = `# 鸣潮 · 坎特蕾拉 DSH 主题安装

分发文件：\`${archiveName}\`

## 安装

\`\`\`powershell
dsh plugin --profile web add ./${archiveName}
dsh --profile web --dump-config
dsh web
\`\`\`

组合配置中应出现 \`ui-skin-wuthering-cantarella\`。重启 Web 服务后，从右下角“主题中心”选择坎特蕾拉。

## 卸载

\`\`\`powershell
dsh plugin --profile web remove ${packageJson.name}
\`\`\`

卸载活动主题时会自动恢复官方外观。权利边界见包内 \`NOTICE\`。
`;
await writeFile(join(releaseDir, 'INSTALL.md'), installGuide, 'utf8');
console.log(`Release: ${archivePath}`);
console.log(`SHA-256: ${sha256}`);
