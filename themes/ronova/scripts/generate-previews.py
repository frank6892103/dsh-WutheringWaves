from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
PREVIEW = ROOT / 'preview'
SIZE = (1280, 720)


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        Path('C:/Windows/Fonts/msyh.ttc'),
        Path('C:/Windows/Fonts/segoeui.ttf'),
        Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),
    )
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def vertical_gradient(size: tuple[int, int], top: tuple[int, ...], bottom: tuple[int, ...]) -> Image.Image:
    layer = Image.new('RGBA', size)
    pixels = layer.load()
    for y in range(size[1]):
        ratio = y / max(1, size[1] - 1)
        color = tuple(round(top[index] * (1 - ratio) + bottom[index] * ratio) for index in range(4))
        for x in range(size[0]):
            pixels[x, y] = color
    return layer


def render(mode: str) -> None:
    dark = mode == 'dark'
    background = cover(Image.open(ASSETS / 'ronova-sanctuary.webp').convert('RGB'), SIZE).convert('RGBA')
    background = ImageEnhance.Brightness(background).enhance(.66 if dark else 1.14)
    background = ImageEnhance.Color(background).enhance(1.03 if dark else .72)

    veil = Image.new('RGBA', SIZE, (0, 0, 0, 0))
    veil_pixels = veil.load()
    start = (14, 6, 10, 224) if dark else (240, 232, 226, 232)
    end = (14, 6, 10, 24) if dark else (240, 232, 226, 38)
    for x in range(SIZE[0]):
        ratio = min(1.0, x / 1040)
        color = tuple(round(start[index] * (1 - ratio) + end[index] * ratio) for index in range(4))
        for y in range(SIZE[1]):
            veil_pixels[x, y] = color
    background.alpha_composite(veil)

    character = Image.open(ASSETS / 'ronova-character.png').convert('RGBA')
    char_height = 710
    char_width = round(character.width * char_height / character.height)
    character = character.resize((char_width, char_height), Image.Resampling.LANCZOS)
    background.alpha_composite(character, (785, 10))

    ui = Image.new('RGBA', SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(ui)
    panel = (25, 10, 16, 232) if dark else (246, 239, 234, 238)
    panel_hi = (49, 18, 25, 220) if dark else (253, 247, 243, 235)
    border = (218, 100, 85, 74) if dark else (126, 55, 57, 48)
    text = (244, 232, 226, 230) if dark else (49, 31, 36, 230)
    muted = (205, 177, 173, 180) if dark else (105, 81, 85, 180)

    draw.rectangle((0, 0, 232, 720), fill=panel, outline=border)
    draw.rectangle((232, 0, 1280, 56), fill=panel, outline=border)
    draw.text((22, 19), 'DEEPSEEK HARNESS', font=font(14), fill=text)
    draw.text((252, 19), 'RONOVA / FINAL DECREE', font=font(13), fill=muted)

    for index, label in enumerate(('NEW SESSION', 'WORKSPACE', 'THEME CENTER', 'SETTINGS')):
        y = 88 + index * 48
        if index == 2:
            draw.rounded_rectangle((14, y - 9, 216, y + 26), radius=5, fill=(169, 52, 57, 34), outline=border)
        draw.text((28, y), label, font=font(12), fill=text if index == 2 else muted)

    draw.rounded_rectangle((272, 86, 842, 154), radius=8, fill=panel_hi, outline=border)
    draw.text((294, 105), 'RULER OF DEATH', font=font(11), fill=(202, 77, 70, 220))
    draw.text((294, 126), 'The boundary of this world returns to silence.', font=font(16), fill=text)
    draw.rounded_rectangle((380, 188, 948, 276), radius=8, fill=panel_hi, outline=border)
    draw.text((403, 211), 'The crimson eclipse has entered its final phase.', font=font(15), fill=text)
    draw.text((403, 239), 'Judgment lattice synchronized.', font=font(12), fill=muted)
    draw.rounded_rectangle((272, 310, 760, 382), radius=8, fill=panel_hi, outline=border)
    draw.text((294, 332), 'Six eyes witness every ending.', font=font(15), fill=text)
    draw.rounded_rectangle((272, 630, 915, 692), radius=10, fill=panel_hi, outline=border)
    draw.text((296, 652), 'Message DeepSeek Harness...', font=font(13), fill=muted)
    draw.ellipse((858, 644, 894, 680), fill=(169, 52, 57, 230))

    hud_fill = (30, 10, 16, 238)
    draw.polygon(((805, 8), (1119, 8), (1131, 20), (1131, 54), (817, 54), (805, 42)), fill=hud_fill, outline=(214, 93, 80, 120))
    draw.text((823, 17), 'RULER OF DEATH / JUDGMENT', font=font(9), fill=(207, 173, 116, 200))
    draw.text((823, 31), 'FINAL DECREE // FULL' if dark else 'FINAL DECREE // STILL', font=font(11), fill=(245, 230, 222, 235))

    draw.polygon(((1002, 574), (1256, 574), (1268, 586), (1268, 626), (1014, 626), (1002, 614)), fill=hud_fill, outline=(214, 93, 80, 120))
    draw.text((1021, 585), 'SOUL PASSAGE // 06', font=font(9), fill=(207, 173, 116, 200))
    draw.text((1021, 601), 'THEME: RONOVA', font=font(11), fill=(245, 230, 222, 235))
    draw.polygon(((1002, 644), (1256, 644), (1268, 656), (1268, 700), (1014, 700), (1002, 688)), fill=hud_fill, outline=(214, 93, 80, 150))
    draw.text((1021, 658), 'RESONANCE THEME', font=font(9), fill=(207, 173, 116, 200))
    draw.text((1021, 675), 'GENSHIN / RONOVA', font=font(11), fill=(245, 230, 222, 235))

    background.alpha_composite(ui)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    background.convert('RGB').save(PREVIEW / f'{mode}.webp', 'WEBP', quality=88, method=6)
    print(f'Wrote {PREVIEW / f"{mode}.webp"}')


if __name__ == '__main__':
    render('light')
    render('dark')
