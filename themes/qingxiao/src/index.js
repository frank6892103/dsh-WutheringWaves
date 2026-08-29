import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QINGXIAO_ASSET_ROUTE = '/plugins/@dsh-external/dsh-client-ui-skin-wuthering-qingxiao/assets';
const assetRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const assets = new Map([
  ['qingxiao-poster.webp', {
    path: join(assetRoot, 'qingxiao-poster.webp'),
    contentType: 'image/webp',
  }],
  ['qingxiao-character.png', {
    path: join(assetRoot, 'qingxiao-character.png'),
    contentType: 'image/png',
  }],
]);

export const inject = ['webServer'];

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: QINGXIAO_ASSET_ROUTE,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { allow: 'GET, HEAD' });
          res.end();
          return;
        }

        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
        const fileName = pathname.startsWith(`${QINGXIAO_ASSET_ROUTE}/`)
          ? pathname.slice(QINGXIAO_ASSET_ROUTE.length + 1)
          : '';
        const asset = assets.get(fileName);
        if (!asset) {
          res.writeHead(404);
          res.end();
          return;
        }

        try {
          const body = await readFile(asset.path);
          res.writeHead(200, {
            'cache-control': 'public, max-age=31536000, immutable',
            'content-length': body.length,
            'content-type': asset.contentType,
          });
          res.end(req.method === 'HEAD' ? undefined : body);
        } catch {
          res.writeHead(404);
          res.end();
        }
      },
    }),
    'Serve cacheable Qingxiao theme assets',
  );
}
