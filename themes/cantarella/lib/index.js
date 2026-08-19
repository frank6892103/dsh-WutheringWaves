import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CANTARELLA_ASSET_ROUTE = '/plugins/@dsh-external/dsh-client-ui-skin-wuthering-cantarella/assets';
const assetRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const assets = new Map([
  ['cantarella-portrait.webp', join(assetRoot, 'cantarella-portrait.webp')],
]);

export const inject = ['webServer'];

export function apply(ctx) {
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: CANTARELLA_ASSET_ROUTE,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { allow: 'GET, HEAD' });
          res.end();
          return;
        }

        const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
        const fileName = pathname.startsWith(`${CANTARELLA_ASSET_ROUTE}/`)
          ? pathname.slice(CANTARELLA_ASSET_ROUTE.length + 1)
          : '';
        const assetPath = assets.get(fileName);
        if (!assetPath) {
          res.writeHead(404);
          res.end();
          return;
        }

        try {
          const body = await readFile(assetPath);
          res.writeHead(200, {
            'cache-control': 'public, max-age=31536000, immutable',
            'content-length': body.length,
            'content-type': 'image/webp',
          });
          res.end(req.method === 'HEAD' ? undefined : body);
        } catch {
          res.writeHead(404);
          res.end();
        }
      },
    }),
    'Serve cacheable Cantarella theme assets',
  );
}
