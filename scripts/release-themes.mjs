import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  GITHUB_REPOSITORY,
  collectionTag,
  packedArchiveName,
  latestArchiveName,
  releaseDownloadUrl,
  latestDownloadUrl,
  releaseTagUrl,
  latestReleaseUrl,
} from './release-meta.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = join(repoRoot, 'release');
const themePaths = ['themes/aemeath', 'themes/cantarella', 'themes/xinyuehu', 'themes/qingxiao', 'themes/zhangbeihai', 'themes/ronova'];

const run = (command, args, cwd = repoRoot, shell = false) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
};

const packTheme = async (relativePath, collection) => {
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

  const archive = packedArchiveName(packageJson.name, packageJson.version);
  const latestArchive = latestArchiveName(packageJson.name);
  await copyFile(join(releaseDir, archive), join(releaseDir, latestArchive));
  const bytes = await readFile(join(releaseDir, archive));
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const skin = JSON.parse(await readFile(join(themeRoot, 'skin.json'), 'utf8'));
  return {
    id: skin.id,
    name: skin.name,
    package: packageJson.name,
    version: packageJson.version,
    archive,
    latestArchive,
    size: bytes.length,
    sha256,
    downloadUrl: releaseDownloadUrl(GITHUB_REPOSITORY, collection.tag, archive),
    latestDownloadUrl: latestDownloadUrl(GITHUB_REPOSITORY, latestArchive),
  };
};

const rootPackage = JSON.parse(await readFile(join(repoRoot, 'package.json'), 'utf8'));
const collection = {
  version: rootPackage.version,
  tag: collectionTag(rootPackage.version),
};

await mkdir(releaseDir, { recursive: true });
for (const name of await readdir(releaseDir)) {
  if (name.endsWith('.tgz')) await unlink(join(releaseDir, name));
}
const themes = [];
for (const themePath of themePaths) themes.push(await packTheme(themePath, collection));

const checksumLines = themes.flatMap((theme) => [
  `${theme.sha256}  ${theme.archive}`,
  `${theme.sha256}  ${theme.latestArchive}`,
]);

await writeFile(
  join(releaseDir, 'THEME-SHA256SUMS.txt'),
  `${checksumLines.join('\n')}\n`,
  'utf8',
);

const manifest = {
  schemaVersion: 2,
  collectionVersion: collection.version,
  releaseTag: collection.tag,
  repository: GITHUB_REPOSITORY,
  releaseUrl: releaseTagUrl(GITHUB_REPOSITORY, collection.tag),
  latestReleaseUrl: latestReleaseUrl(GITHUB_REPOSITORY),
  mode: 'coinstallable-exclusive-selection',
  selector: {
    globalApi: '__DSH_WUTHERING_THEME_HUB__',
    officialThemeId: 'official',
    persistence: 'local-storage-with-cookie-fallback',
    defaultPerformance: 'economy',
    performanceModes: ['economy', 'full'],
  },
  testedWith: '@deepseek-ai/dsh@0.1.1-rc.2',
  themes,
};

await writeFile(
  join(releaseDir, 'theme-release.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

const remoteInstallCommands = themes
  .map((theme) => `dsh plugin --profile web add ${theme.downloadUrl}`)
  .join('\n');
const localInstallCommands = themes
  .map((theme) => `dsh plugin --profile web add ./${theme.archive}`)
  .join('\n');
const pnpmRemoteCommands = themes
  .map((theme) => `pnpm add ${theme.downloadUrl}`)
  .join('\n');
const npmRemoteCommands = themes
  .map((theme) => `npm install ${theme.downloadUrl}`)
  .join('\n');
const pnpmLocalCommands = themes
  .map((theme) => `pnpm add ./${theme.archive}`)
  .join('\n');
const npmLocalCommands = themes
  .map((theme) => `npm install ./${theme.archive}`)
  .join('\n');
const removeCommands = themes
  .map((theme) => `dsh plugin --profile web remove ${theme.package}`)
  .join('\n');
const themeTable = themes
  .map((theme) => `| ${theme.name} | \`${theme.package}\` | ${theme.version} | \`${theme.archive}\` |`)
  .join('\n');

const guide = `# 角色多主题 DSH 安装

六个主题包可以同时安装。安装并重启 DSH 后，从“主题中心”选择“爱弥斯”“坎特蕾拉”“心月狐”“清宵”“章北海”“若娜瓦”或“官方外观”。主题中心默认在页面右下角，按住按钮或标题可拖到其他位置，刷新后仍留在那里。心月狐、章北海、若娜瓦贴在选择框上的铭牌会一起移动，打开列表时先让开。爱弥斯右上角的“RESONANCE SIGNAL”避开 DSH 功能按钮。

集合版本 \`${collection.version}\` 对应 GitHub Release [\`${collection.tag}\`](${manifest.releaseUrl})。浏览全部版本：${manifest.latestReleaseUrl.replace(/\/latest$/, '')}

## 校验

PowerShell：

\`\`\`powershell
Get-Content .\\THEME-SHA256SUMS.txt
Get-FileHash -Algorithm SHA256 .\\*.tgz
\`\`\`

## 从 GitHub Release 安装

DSH（写入 web profile，推荐）：

\`\`\`powershell
${remoteInstallCommands}
dsh --profile web --dump-config
dsh web
\`\`\`

同一 tarball 也可用包管理器安装：

\`\`\`powershell
${pnpmRemoteCommands}
\`\`\`

\`\`\`powershell
${npmRemoteCommands}
\`\`\`

跟随最新 Release（文件名不含主题版本号）：

\`\`\`powershell
${themes.map((theme) => `dsh plugin --profile web add ${theme.latestDownloadUrl}`).join('\n')}
\`\`\`

若目标是 DSH GUI，请使用 \`dsh plugin\`；\`pnpm add\` / \`npm install\` 只证明该 \`.tgz\` 是标准 npm 包。

## 从本地文件安装

下载 Release 资源，或在仓库根目录执行 \`pnpm run themes:release\` 后，在 \`.tgz\` 所在目录执行：

\`\`\`powershell
${localInstallCommands}
dsh --profile web --dump-config
dsh web
\`\`\`

\`\`\`powershell
${pnpmLocalCommands}
\`\`\`

\`\`\`powershell
${npmLocalCommands}
\`\`\`

不必一次装完；只装需要的主题即可。组合配置中应同时出现 \`ui-skin-wuthering-aemeath\`、\`ui-skin-wuthering-cantarella\`、\`ui-skin-wuthering-xinyuehu\`、\`ui-skin-wuthering-qingxiao\`、\`ui-skin-threebody-zhangbeihai\` 和 \`ui-skin-genshin-ronova\`。主题选择保存在当前 DSH 站点，刷新和重启服务后仍会恢复；DSH 自身的浅色/深色设置与角色主题相互独立。

主题中心默认使用“省资源”模式，适合公司云电脑；它会关闭持续动画和实时毛玻璃，并减少装饰节点。需要完整动态效果时，可在主题中心切换，性能选择也会保存在当前站点。

## 恢复官方外观

直接在“主题中心”选择“官方外观”。如需卸载：

\`\`\`powershell
${removeCommands}
\`\`\`

主题代码使用 MIT 许可；角色与美术素材不属于 MIT 许可范围，详情见各压缩包中的 \`NOTICE\`。
`;

await writeFile(join(releaseDir, 'INSTALL-THEMES.md'), guide, 'utf8');

const notes = `# dsh-WutheringWaves ${collection.tag}

已针对 \`@deepseek-ai/dsh@0.1.1-rc.2\` 验证。主题包保持 \`private: true\`，不发布 npm registry；安装使用本 Release 中的 \`.tgz\`。

## 变化

- 主题中心可以拖动。默认仍在右下角；松手后把位置记在 \`dsh.wuthering-waves.theme-hub-position.v1\`，刷新后恢复。
- 心月狐、章北海、若娜瓦贴在选择框上的铭牌随选择框移动。打开主题列表时铭牌先隐藏，避免挡住选项。
- 爱弥斯右上角「RESONANCE SIGNAL」向左让开，不再盖住 DSH 功能按钮。

## 主题包

| 主题 | 包名 | 版本 | 文件 |
| --- | --- | --- | --- |
${themeTable}

## DSH（推荐）

\`\`\`powershell
${remoteInstallCommands}
dsh --profile web --dump-config
dsh web
\`\`\`

## pnpm / npm

远端：

\`\`\`powershell
${pnpmRemoteCommands}
\`\`\`

\`\`\`powershell
${npmRemoteCommands}
\`\`\`

本地（先下载对应 \`.tgz\`）：

\`\`\`powershell
${localInstallCommands}
${pnpmLocalCommands}
${npmLocalCommands}
\`\`\`

最新版别名：${manifest.latestReleaseUrl}

校验和见 \`THEME-SHA256SUMS.txt\`。权利边界见各包内 \`NOTICE\`。
`;

await writeFile(join(releaseDir, 'RELEASE-NOTES.md'), notes, 'utf8');

console.log(`Released ${themes.length} switchable themes to ${releaseDir} (${collection.tag})`);
for (const theme of themes) console.log(`${theme.archive}  ${theme.sha256}`);
