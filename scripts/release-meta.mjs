export const GITHUB_REPOSITORY = 'frank6892103/dsh-WutheringWaves';

export const collectionTag = (version) => `v${version}`;

export const packedArchiveName = (packageName, version) =>
  `${packageName.replace(/^@/, '').replaceAll('/', '-')}-${version}.tgz`;

export const latestArchiveName = (packageName) =>
  `${packageName.replace(/^@/, '').replaceAll('/', '-')}.tgz`;

export const releaseDownloadUrl = (repository, tag, archive) =>
  `https://github.com/${repository}/releases/download/${tag}/${archive}`;

export const latestDownloadUrl = (repository, archive) =>
  `https://github.com/${repository}/releases/latest/download/${archive}`;

export const releaseTagUrl = (repository, tag) =>
  `https://github.com/${repository}/releases/tag/${tag}`;

export const latestReleaseUrl = (repository) =>
  `https://github.com/${repository}/releases/latest`;
