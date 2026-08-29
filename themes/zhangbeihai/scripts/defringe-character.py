from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit('usage: defringe-character.py INPUT OUTPUT')

    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    if target.exists():
        raise SystemExit(f'refusing to overwrite existing output: {target}')

    image = Image.open(source).convert('RGBA')
    rgba = np.asarray(image)
    alpha_image = image.getchannel('A')

    # The source already contains clean subject colors. Contract only the alpha
    # by roughly two pixels, which removes the pale extraction matte without
    # repainting hair, skin, or uniform details.
    contracted = alpha_image.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(.36))
    contracted_alpha = np.asarray(contracted).copy()
    contracted_alpha[rgba[..., 3] == 0] = 0

    # Facial features are thin, high-curvature silhouettes. Preserve the newly
    # extracted face matte around the ear, brow, nose, lips, jaw and chin while
    # keeping the stronger two-pixel contraction on hair, shoulders and body.
    face_guard = Image.new('L', image.size, 0)
    ImageDraw.Draw(face_guard).ellipse((400, 125, 700, 450), fill=255)
    face_guard = face_guard.filter(ImageFilter.GaussianBlur(10))
    guard = np.asarray(face_guard, dtype=np.float32) / 255.0
    original_alpha = rgba[..., 3].astype(np.float32)
    contracted_alpha = np.rint(
        contracted_alpha.astype(np.float32) * (1.0 - guard) + original_alpha * guard
    ).astype(np.uint8)
    contracted_alpha[rgba[..., 3] == 0] = 0

    output = rgba.copy()
    output[..., 3] = contracted_alpha
    output[contracted_alpha == 0, :3] = 0
    Image.fromarray(output, 'RGBA').save(target, optimize=True)

    original_coverage = float(np.mean(rgba[..., 3] > 0))
    new_coverage = float(np.mean(contracted_alpha > 0))
    coverage_delta = original_coverage - new_coverage
    if not 0 < coverage_delta < .02:
        raise SystemExit(f'unexpected silhouette contraction: {coverage_delta:.4%}')
    if contracted_alpha.min() != 0 or contracted_alpha.max() != 255:
        raise SystemExit('output alpha must span 0..255')
    for x, y in ((660, 280), (655, 330), (650, 360)):
        if contracted_alpha[y, x] < 250:
            raise SystemExit(f'face guard lost required silhouette pixel at ({x}, {y})')

    print(
        f'Wrote {target} ({image.width}x{image.height}, '
        f'silhouette contraction={coverage_delta:.3%})'
    )


if __name__ == '__main__':
    main()
