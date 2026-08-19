import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = join(repoRoot, 'release');
const themePaths = ['themes/aemeath', 'themes/cantarella'];

const run = (command, args, cwd = repoRoot, shell = false) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
};

const packTheme = async (relativePath) => {
  const themeRoot = join(repoRoot, relativePath);
  const packageJson = JSON.parse(await readFile(join(themeRoot, 'package.json'), 'utf8'));

  run(process.execPath, ['scripts/build-client.mjs'], themeRoot);
  run(process.execPath, ['scripts/verify.mjs'], themeRoot);

  const packArgs = ['pack', '--pack-destination', releaseDir];
  if (process.env.npm_execpath) {
    run(process.execPath, [process.env.npm_execpath, ...packArgs], themeRoot);
  } else {
    const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    run(command, packArgs, themeRoot, process.platform === 'win32');
  }

  const archive = `${packageJson.name.replace(/^@/, '').replaceAll('/', '-')}-${packageJson.version}.tgz`;
  const bytes = await readFile(join(releaseDir, archive));
  return {
    id: JSON.parse(await readFile(join(themeRoot, 'skin.json'), 'utf8')).id,
    name: JSON.parse(await readFile(join(themeRoot, 'skin.json'), 'utf8')).name,
    package: packageJson.name,
    version: packageJson.version,
    archive,
    size: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
};

await mkdir(releaseDir, { recursive: true });
const themes = [];
for (const themePath of themePaths) themes.push(await packTheme(themePath));

await writeFile(
  join(releaseDir, 'THEME-SHA256SUMS.txt'),
  `${themes.map((theme) => `${theme.sha256}  ${theme.archive}`).join('\n')}\n`,
  'utf8',
);

await writeFile(
  join(releaseDir, 'theme-release.json'),
  `${JSON.stringify({
    schemaVersion: 1,
    mode: 'coinstallable-exclusive-selection',
    selector: {
      globalApi: '__DSH_WUTHERING_THEME_HUB__',
      officialThemeId: 'official',
      persistence: 'local-storage-with-cookie-fallback',
    },
    testedWith: '@deepseek-ai/dsh@0.1.0-rc.6',
    themes,
  }, null, 2)}\n`,
  'utf8',
);

const installCommands = themes
  .map((theme) => `dsh plugin --profile web add ./${theme.archive}`)
  .join('\n');

const guide = `# 鸣潮多主题 DSH 安装

本目录中的两个主题包可以同时安装。安装并重启 DSH 后，从页面右下角“主题中心”选择“爱弥斯”“坎特蕾拉”或“官方外观”。

## 校验

PowerShell：

\`\`\`powershell
Get-Content .\\THEME-SHA256SUMS.txt
Get-FileHash -Algorithm SHA256 .\\*.tgz
\`\`\`

## 安装

\`\`\`powershell
${installCommands}
dsh --profile web --dump-config
dsh web
\`\`\`

组合配置中应同时出现 \`ui-skin-wuthering-aemeath\` 和 \`ui-skin-wuthering-cantarella\`。主题选择保存在当前 DSH 站点，刷新和重启服务后仍会恢复；DSH 自身的浅色/深色设置与角色主题相互独立。

## 恢复官方外观

直接在“主题中心”选择“官方外观”。如需卸载：

\`\`\`powershell
${themes.map((theme) => `dsh plugin --profile web remove ${theme.package}`).join('\n')}
\`\`\`

主题代码使用 MIT 许可；角色与美术素材不属于 MIT 许可范围，详情见各压缩包中的 \`NOTICE\`。
`;

await writeFile(join(releaseDir, 'INSTALL-THEMES.md'), guide, 'utf8');

console.log(`Released ${themes.length} switchable themes to ${releaseDir}`);
for (const theme of themes) console.log(`${theme.archive}  ${theme.sha256}`);
