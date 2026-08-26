from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
POSTER = Image.open(ROOT / "assets" / "xinyuehu-poster.webp").convert("RGB")
FONT_PATH = Path(r"C:\Windows\Fonts\msyh.ttc")


def font(size: int, bold: bool = False):
    candidate = Path(r"C:\Windows\Fonts\msyhbd.ttc") if bold else FONT_PATH
    try:
        return ImageFont.truetype(str(candidate), size)
    except OSError:
        return ImageFont.load_default()


def gradient(size, start, end):
    width, height = size
    image = Image.new("RGB", size)
    pixels = image.load()
    for y in range(height):
        vertical = y / max(height - 1, 1)
        for x in range(width):
            horizontal = x / max(width - 1, 1)
            ratio = min(1, horizontal * .72 + vertical * .28)
            pixels[x, y] = tuple(round(a + (b - a) * ratio) for a, b in zip(start, end))
    return image


def panel(draw, box, fill, outline, radius=18, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def make_preview(dark: bool):
    size = (1280, 720)
    if dark:
        image = gradient(size, (12, 17, 16), (50, 25, 22))
        ink, muted = (255, 241, 216, 245), (205, 183, 162, 190)
        glass, glass_strong = (29, 23, 21, 205), (48, 33, 29, 220)
        border, red, jade = (229, 117, 99, 74), (239, 117, 104, 255), (105, 199, 181, 255)
        moon = (244, 202, 133, 34)
    else:
        image = gradient(size, (242, 235, 221), (185, 158, 134))
        ink, muted = (45, 37, 32, 245), (102, 87, 75, 210)
        glass, glass_strong = (250, 245, 234, 194), (255, 251, 242, 220)
        border, red, jade = (151, 72, 52, 70), (180, 59, 49, 255), (47, 129, 116, 255)
        moon = (255, 246, 209, 120)

    image = image.convert("RGBA")
    draw = ImageDraw.Draw(image, "RGBA")

    draw.ellipse((710, -310, 1340, 320), fill=moon, outline=border, width=2)
    for radius in (105, 165, 225):
        draw.ellipse((1020-radius, 5-radius, 1020+radius, 5+radius), outline=(*red[:3], 24), width=1)
    for offset in range(-720, 1440, 44):
        draw.line((offset, 0, offset + 720, 720), fill=(*red[:3], 12), width=1)
        draw.line((offset + 720, 0, offset, 720), fill=(*jade[:3], 10), width=1)

    portrait = POSTER.resize((405, 720), Image.Resampling.LANCZOS)
    portrait = ImageEnhance.Color(portrait).enhance(.82 if dark else .9).convert("RGBA")
    if dark:
        portrait = ImageEnhance.Brightness(portrait).enhance(.64)
    alpha = Image.new("L", portrait.size)
    alpha_pixels = alpha.load()
    for y in range(alpha.height):
        for x in range(alpha.width):
            horizontal = max(0, min(1, (x - 5) / 150))
            vertical = max(0, min(1, (720 - y) / 120))
            alpha_pixels[x, y] = round(118 * horizontal * vertical)
    portrait.putalpha(alpha.filter(ImageFilter.GaussianBlur(5)))
    image.alpha_composite(portrait, (875, 0))

    panel(draw, (18, 18, 246, 702), glass, border, 22)
    draw.text((38, 38), "鸣潮 · 心月狐", font=font(21, True), fill=ink)
    draw.text((38, 70), "MOONLIT HEART", font=font(10), fill=muted)
    draw.line((38, 98, 220, 98), fill=border, width=1)

    nav_items = ("新对话", "工作区", "轨迹", "主题中心")
    for index, label in enumerate(nav_items):
        top = 126 + index * 54
        active = index == 0
        panel(draw, (32, top, 232, top + 42), (*red[:3], 30) if active else (0, 0, 0, 0), (*red[:3], 70) if active else (0, 0, 0, 0), 11)
        draw.ellipse((45, top + 14, 55, top + 24), fill=red if active else muted)
        draw.text((68, top + 10), label, font=font(15), fill=ink if active else muted)
    draw.text((38, 650), "省资源模式", font=font(12), fill=jade)
    draw.text((38, 674), "多套主题互斥切换", font=font(11), fill=muted)

    draw.text((294, 40), "朝月清辉照孤城", font=font(30, True), fill=ink)
    draw.text((296, 84), "万相分形已连接 · 梦州灯火长明", font=font(13), fill=muted)

    panel(draw, (286, 132, 860, 258), glass, border, 20)
    draw.ellipse((308, 155, 342, 189), fill=(*jade[:3], 48), outline=jade, width=2)
    draw.text((360, 151), "如何规划今天的开发任务？", font=font(17, True), fill=ink)
    draw.text((360, 186), "我会先收敛目标，再拆分实现、验证与交付。", font=font(14), fill=muted)
    draw.line((360, 222, 700, 222), fill=(*jade[:3], 52), width=2)

    panel(draw, (344, 286, 842, 405), glass_strong, border, 20)
    draw.text((370, 310), "计划已整理：", font=font(15, True), fill=ink)
    draw.text((370, 344), "01  主题运行时   02  视觉系统   03  自动验收", font=font(13), fill=muted)
    draw.rectangle((370, 378, 520, 382), fill=red)
    draw.rectangle((520, 378, 686, 382), fill=jade)

    panel(draw, (286, 532, 860, 654), glass_strong, border, 22)
    draw.text((316, 556), "继续询问…", font=font(15), fill=muted)
    draw.line((316, 608, 786, 608), fill=border, width=1)
    draw.ellipse((796, 594, 836, 634), fill=red)
    draw.polygon(((809, 614), (822, 605), (822, 623)), fill=(255, 248, 232, 255))

    panel(draw, (1002, 26, 1254, 105), (*glass_strong[:3], 214), border, 12)
    draw.ellipse((1018, 42, 1068, 92), outline=red, width=2)
    draw.ellipse((1030, 54, 1056, 80), outline=jade, width=1)
    draw.text((1081, 44), "LUNAR FRACTAL", font=font(9), fill=muted)
    draw.text((1081, 62), "MYRIAD FORMS", font=font(11, True), fill=red)
    draw.text((1081, 82), "LINKED 99.7%", font=font(9), fill=jade)

    draw.text((300, 683), "XIN · 心   /   朝月清辉 · MOONLIT HEART", font=font(11), fill=muted)
    return image.convert("RGB")


for mode in ("light", "dark"):
    output = ROOT / "preview" / f"{mode}.webp"
    output.parent.mkdir(parents=True, exist_ok=True)
    make_preview(mode == "dark").save(output, "WEBP", quality=88, method=6)
    print(output)
