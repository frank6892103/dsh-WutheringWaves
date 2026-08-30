import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RONOVA_ASSET_ROUTE = '/plugins/@dsh-external/dsh-client-ui-skin-genshin-ronova/assets';
const assetRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const assets = new Map([
  ['ronova-sanctuary.webp', {
    path: join(assetRoot, 'ronova-sanctuary.webp'),
    contentType: 'image/webp',
  }],
  ['ronova-character.png', {
    path: join(assetRoot, 'ronova-character.png'),
    contentType: 'image/png',
  }],
]);

export const inject = ['webServer'];

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: RONOVA_ASSET_ROUTE,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { allow: 'GET, HEAD' });
          res.end();
          return;
        }

        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
        const fileName = pathname.startsWith(`${RONOVA_ASSET_ROUTE}/`)
          ? pathname.slice(RONOVA_ASSET_ROUTE.length + 1)
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
    'Serve cacheable Ronova theme assets',
  );
}

