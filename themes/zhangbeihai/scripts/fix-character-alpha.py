from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


def extract_edge_connected_background(rgb: np.ndarray) -> np.ndarray:
    minimum = rgb.min(axis=2)
    maximum = rgb.max(axis=2)
    chroma = maximum - minimum
    # The generated checkerboard is essentially neutral (usually <= 6 chroma).
    # Keep the threshold tight so warm facial highlights at the nose, lips and
    # jaw are never connected to the exterior background and erased.
    candidate = (minimum >= 205) & (chroma <= 12)

    height, width = candidate.shape
    connected = np.zeros((height, width), dtype=bool)
    visited = np.zeros((height, width), dtype=bool)

    # Retain only tiny enclosed highlights. Large neutral components inside the
    # silhouette are checkerboard holes, such as the space between arm and torso.
    for start_y, start_x in zip(*np.nonzero(candidate & ~visited)):
        if visited[start_y, start_x]:
            continue
        queue: deque[tuple[int, int]] = deque([(int(start_y), int(start_x))])
        component: list[tuple[int, int]] = []
        touches_edge = False
        while queue:
            y, x = queue.popleft()
            if visited[y, x] or not candidate[y, x]:
                continue
            visited[y, x] = True
            component.append((y, x))
            touches_edge = touches_edge or y == 0 or x == 0 or y == height - 1 or x == width - 1
            if y > 0:
                queue.append((y - 1, x))
            if y + 1 < height:
                queue.append((y + 1, x))
            if x > 0:
                queue.append((y, x - 1))
            if x + 1 < width:
                queue.append((y, x + 1))
        if touches_edge or len(component) >= 192:
            ys, xs = zip(*component)
            connected[np.asarray(ys), np.asarray(xs)] = True

    return connected


def build_alpha(rgb: np.ndarray, background: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.int16)
    minimum = values.min(axis=2)
    maximum = values.max(axis=2)
    chroma = maximum - minimum

    # The generated checkerboard uses neutral values around 240 and 254.
    # Color distance and luminance distance retain partially covered edge pixels.
    soft_edge = np.maximum(chroma * 4, np.maximum(0, 235 - minimum) * 8)
    alpha = np.full(background.shape, 255, dtype=np.int16)
    alpha[background] = np.clip(soft_edge[background], 0, 255)
    alpha[(background) & (minimum >= 238) & (chroma <= 6)] = 0
    alpha[alpha < 7] = 0
    return alpha.astype(np.uint8)


def decontaminate_edges(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    result = rgb.astype(np.float32)
    edge = (alpha > 0) & (alpha < 250)
    if not np.any(edge):
        return rgb

    normalized = alpha[edge].astype(np.float32)[:, None] / 255.0
    background = 247.0
    recovered = (result[edge] - background * (1.0 - normalized)) / np.maximum(normalized, 0.04)
    result[edge] = np.clip(recovered, 0, 255)
    result[alpha == 0] = 0
    return result.astype(np.uint8)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit('usage: fix-character-alpha.py INPUT OUTPUT')

    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    if target.exists():
        raise SystemExit(f'refusing to overwrite existing output: {target}')

    rgb = np.asarray(Image.open(source).convert('RGB'))
    background = extract_edge_connected_background(rgb)
    alpha = build_alpha(rgb, background)
    cleaned = decontaminate_edges(rgb, alpha)
    rgba = np.dstack((cleaned, alpha))

    target.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, 'RGBA').save(target, optimize=True)

    transparent_ratio = float(np.mean(alpha == 0))
    opaque_ratio = float(np.mean(alpha == 255))
    if not 0.45 <= transparent_ratio <= 0.88:
        raise SystemExit(f'unexpected transparent ratio: {transparent_ratio:.3f}')
    if opaque_ratio < 0.18:
        raise SystemExit(f'unexpected opaque ratio: {opaque_ratio:.3f}')

    print(
        f'Wrote {target} ({rgba.shape[1]}x{rgba.shape[0]}, '
        f'transparent={transparent_ratio:.1%}, opaque={opaque_ratio:.1%})'
    )


if __name__ == '__main__':
    main()
