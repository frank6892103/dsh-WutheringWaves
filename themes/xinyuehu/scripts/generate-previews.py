from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CHARACTER = Image.open(ROOT / "assets" / "xinyuehu-character-v2.png").convert("RGBA")
FONT_PATH = Path(r"C:\Windows\Fonts\msyh.ttc")


def font(size: int, bold: bool = False):
    candidate = Path(r"C:\Windows\Fonts\msyhbd.ttc") if bold else FONT_PATH
    try:
        return ImageFont.truetype(str(candidate), size)
    except OSError:
        return ImageFont.load_default()


def vertical_gradient(size, start, end):
    width, height = size
    image = Image.new("RGB", size)
    draw = ImageDraw.Draw(image)
    for y in range(height):
        ratio = y / max(height - 1, 1)
        color = tuple(round(a + (b - a) * ratio) for a, b in zip(start, end))
        draw.line((0, y, width, y), fill=color)
    return image


def round_panel(draw, box, fill, outline, radius=12, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def make_preview(dark: bool):
    size = (1280, 720)
    if dark:
        image = vertical_gradient(size, (25, 48, 38), (18, 37, 29))
        ink, muted = (234, 231, 220, 245), (168, 176, 169, 215)
        paper, paper_high = (27, 45, 36, 248), (43, 67, 55, 246)
        line, red, jade, moon = (166, 198, 183, 56), (227, 130, 115, 255), (135, 181, 163, 255), (216, 200, 155, 178)
        terrace = (23, 44, 35, 255)
        portrait_saturation, portrait_brightness, portrait_alpha = 1.06, 1.02, 250
    else:
        image = vertical_gradient(size, (244, 241, 232), (224, 232, 224))
        ink, muted = (48, 54, 50, 245), (103, 113, 106, 220)
        paper, paper_high = (238, 236, 227, 250), (251, 248, 239, 248)
        line, red, jade, moon = (64, 79, 70, 52), (182, 80, 69, 255), (79, 134, 117, 255), (229, 213, 159, 196)
        terrace = (218, 228, 219, 255)
        portrait_saturation, portrait_brightness, portrait_alpha = 1.0, 1.03, 232

    image = image.convert("RGBA")
    draw = ImageDraw.Draw(image, "RGBA")

    # A quiet architectural base keeps the interface grounded without a color jump.
    draw.polygon(((280, 636), (470, 612), (870, 620), (1020, 720), (280, 720)), fill=terrace)
    draw.line((354, 0, 354, 720), fill=line, width=1)
    draw.line((365, 0, 365, 720), fill=(255, 255, 255, 24), width=1)

    # Moon gate and the six-fold mechanism sit left of the product UI.
    gate_center = (405, 355)
    for radius, color in ((254, (*jade[:3], 54)), (225, (*red[:3], 68)), (190, (*jade[:3], 42))):
        draw.ellipse((gate_center[0] - radius, gate_center[1] - radius, gate_center[0] + radius, gate_center[1] + radius), outline=color, width=1)
    draw.ellipse((260, 188, 398, 326), fill=moon)
    for index in range(6):
        angle = index * pi / 3 - pi / 2
        x = gate_center[0] + cos(angle) * 108
        y = gate_center[1] + sin(angle) * 108
        diamond = ((x, y - 9), (x + 7, y), (x, y + 9), (x - 7, y))
        draw.polygon(diamond, fill=(*paper_high[:3], 190), outline=red)
    draw.rectangle((386, 336, 424, 374), outline=(*red[:3], 145), width=1)
    draw.ellipse((399, 349, 411, 361), fill=(*jade[:3], 170))

    # A four-panel moon screen sits behind a genuinely separate transparent character layer.
    arch_box = (874, 28, 1262, 692)
    round_panel(draw, arch_box, (*paper[:3], 80), (*line[:3], 110), 34)
    for index in range(1, 4):
        x = arch_box[0] + index * 97
        draw.line((x, 72, x, 666), fill=(*line[:3], 72), width=1)

    draw.ellipse((858, 128, 1275, 556), fill=(*moon[:3], 34), outline=(*red[:3], 78), width=1)
    portrait = ImageOps.contain(CHARACTER, (430, 714), Image.Resampling.LANCZOS)
    portrait = ImageEnhance.Color(portrait).enhance(portrait_saturation)
    portrait = ImageEnhance.Brightness(portrait).enhance(portrait_brightness)
    portrait_alpha_channel = portrait.getchannel("A").point(lambda alpha: round(alpha * portrait_alpha / 255))
    portrait.putalpha(portrait_alpha_channel)
    image.alpha_composite(portrait, (848, 4))
    draw.rounded_rectangle(arch_box, radius=34, outline=(*red[:3], 72), width=1)

    # Solid paper sidebar and composer replace the neon/glass language.
    draw.rectangle((0, 0, 280, 720), fill=paper, outline=line, width=1)
    draw.text((18, 25), "◈  deepseek", font=font(19, True), fill=ink)
    draw.text((146, 31), "HARNESS", font=font(8), fill=muted)
    round_panel(draw, (14, 74, 266, 112), paper_high, line, 11)
    draw.text((108, 84), "⊕ 新会话", font=font(14), fill=ink)
    draw.text((16, 133), "工作区", font=font(15), fill=muted)
    draw.text((199, 133), "⌕  ☷  +", font=font(13), fill=muted)
    draw.text((20, 174), "▱ dsh", font=font(14), fill=jade)
    draw.rounded_rectangle((12, 198, 268, 230), radius=7, fill=(*red[:3], 24))
    draw.rectangle((12, 198, 15, 230), fill=(*red[:3], 160))
    draw.text((40, 205), "新会话", font=font(14), fill=ink)
    draw.text((40, 244), "查看 dsh 版本", font=font(13), fill=ink)
    draw.text((224, 245), "19小时", font=font(10), fill=muted)
    draw.text((40, 278), "测试 DSH 配置是否正常", font=font(13), fill=ink)
    draw.text((238, 280), "11天", font=font(10), fill=muted)
    draw.text((18, 680), "⚙  设置", font=font(13), fill=ink)

    # Identity uses a small seal and editorial typography.
    draw.rectangle((320, 58, 356, 94), outline=red, width=1)
    draw.text((329, 64), "心", font=font(17, True), fill=red)
    draw.text((370, 58), "心 月 狐", font=font(24, True), fill=ink)
    draw.text((370, 91), "玄方月苑 · MYRIAD MOON COURT", font=font(8), fill=muted)

    # Complete viewport-safe upper HUD.
    round_panel(draw, (826, 10, 1128, 54), (*paper_high[:3], 238), (*red[:3], 150), 11)
    draw.ellipse((839, 17, 869, 47), outline=red, width=1)
    draw.text((848, 25), "心", font=font(12, True), fill=red)
    draw.text((882, 17), "MYRIAD MOON COURT · 07", font=font(7, True), fill=red)
    draw.text((882, 29), "心月狐 · 万相分形", font=font(11, True), fill=ink)
    draw.text((882, 42), "FOXFIRE LINK // FULL", font=font(6), fill=muted)

    draw.text((646, 246), "探索未至之境", font=font(29, True), fill=ink)
    round_panel(draw, (846, 249, 896, 269), (*jade[:3], 34), (*jade[:3], 76), 9)
    draw.text((853, 252), "预览版", font=font(9), fill=jade)
    draw.text((398, 302), "▱ dsh   ⌄     ♧ 标准模式", font=font(12), fill=ink)

    round_panel(draw, (386, 332, 1165, 450), paper_high, (*line[:3], 115), 12)
    draw.rectangle((386, 332, 389, 450), fill=(*red[:3], 185))
    draw.text((403, 351), "描述你想要构建的内容", font=font(15), fill=muted)
    draw.text((402, 413), "+", font=font(20), fill=ink)
    draw.text((448, 417), "♧ Workspace Write⌄", font=font(11), fill=ink)
    draw.text((948, 417), "DeepSeek-V4-Flash Max⌄", font=font(11), fill=ink)
    draw.ellipse((1118, 403, 1153, 438), fill=red)
    draw.polygon(((1135, 412), (1127, 422), (1143, 422)), fill=(255, 248, 239, 255))

    # Lantern procession and complete lower HUD.
    draw.arc((450, 570, 1020, 760), 190, 340, fill=(*red[:3], 72), width=1)
    for index in range(8):
        x = 478 + index * 67
        y = 628 - round(sin(index / 7 * pi) * 28)
        draw.line((x + 4, y - 5, x + 4, y), fill=(*red[:3], 135), width=1)
        draw.rounded_rectangle((x, y, x + 9, y + 11), radius=3, fill=(*moon[:3], 175), outline=red, width=1)
        draw.line((x + 4, y + 11, x + 4, y + 18), fill=(*red[:3], 135), width=1)

    round_panel(draw, (984, 585, 1252, 641), (*paper[:3], 232), (*red[:3], 145), 12)
    draw.ellipse((997, 597, 1027, 627), outline=red, width=1)
    draw.text((1006, 605), "万", font=font(12, True), fill=red)
    draw.text((1040, 593), "FRACTAL RESONANCE · ACTIVE", font=font(7), fill=red)
    draw.text((1040, 607), "灯随月转 · 狐影相生", font=font(11, True), fill=ink)
    draw.text((1040, 623), "PHASE 07 / SYNC 99.7", font=font(6), fill=muted)

    round_panel(draw, (984, 652, 1252, 710), (25, 52, 40, 245), (*red[:3], 180), 14)
    draw.ellipse((998, 665, 1029, 696), outline=red, width=1)
    draw.text((1040, 660), "MYRIAD THEME // FOXFIRE 07", font=font(7), fill=moon)
    draw.text((1040, 679), "鸣潮 · 心月狐", font=font(12, True), fill=(255, 249, 239, 255))
    return image.convert("RGB")


for mode in ("light", "dark"):
    output = ROOT / "preview" / f"{mode}.webp"
    output.parent.mkdir(parents=True, exist_ok=True)
    make_preview(mode == "dark").save(output, "WEBP", quality=89, method=6)
    print(output)
