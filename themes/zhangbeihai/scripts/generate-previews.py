from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ARTWORK = Image.open(ROOT / "assets" / "zhangbeihai-command.webp").convert("RGB")


def font(size: int, bold: bool = False):
    candidates = [
        Path(r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc"),
        Path(r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf"),
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(str(candidate), size)
        except OSError:
            pass
    return ImageFont.load_default()


def rgba(color, alpha):
    return (*color, alpha)


def panel(draw, box, fill, outline, radius=5, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def make_preview(dark: bool):
    width, height = 1280, 720
    art = ImageOps.fit(ARTWORK, (width, height), Image.Resampling.LANCZOS, centering=(.5, .5))
    if dark:
        art = ImageEnhance.Color(art).enhance(.72)
        art = ImageEnhance.Brightness(art).enhance(.62)
        base = Image.new("RGB", (width, height), (7, 14, 21))
        base = Image.blend(base, art, .68).convert("RGBA")
        wash = Image.new("RGBA", (width, height), (5, 12, 18, 0))
        wash_draw = ImageDraw.Draw(wash)
        for x in range(width):
            center_weight = max(0.0, 1.0 - abs(x - 690) / 520)
            wash_draw.line((x, 0, x, height), fill=(5, 12, 18, round(18 + center_weight * 104)))
        base.alpha_composite(wash)
        ink, muted = (235, 238, 236), (164, 177, 185)
        steel, red, gold = (116, 145, 165), (202, 96, 86), (198, 158, 96)
        sidebar = (7, 15, 22, 244)
        card = (12, 23, 32, 230)
        bubble = (18, 31, 42, 224)
        line = (130, 154, 172, 58)
    else:
        art = ImageEnhance.Color(art).enhance(.48)
        art = ImageEnhance.Brightness(art).enhance(1.22)
        base = Image.new("RGB", (width, height), (227, 228, 224))
        base = Image.blend(base, art, .31).convert("RGBA")
        wash = Image.new("RGBA", (width, height), (232, 233, 229, 0))
        wash_draw = ImageDraw.Draw(wash)
        for x in range(width):
            center_weight = max(0.0, 1.0 - abs(x - 690) / 500)
            wash_draw.line((x, 0, x, height), fill=(232, 233, 229, round(24 + center_weight * 148)))
        base.alpha_composite(wash)
        ink, muted = (31, 41, 50), (91, 105, 114)
        steel, red, gold = (76, 103, 123), (166, 65, 58), (160, 124, 74)
        sidebar = (223, 225, 222, 246)
        card = (240, 240, 235, 236)
        bubble = (232, 233, 229, 230)
        line = (54, 69, 81, 58)

    image = base
    draw = ImageDraw.Draw(image, "RGBA")

    # A complete right-side command rail separates Three-Body telemetry from
    # the conversation surface and keeps the portrait at full tonal range.
    tri_fill = (8, 19, 28, 244) if dark else (236, 238, 234, 246)
    draw.polygon(((916, 80), (1234, 80), (1254, 100), (1254, 158), (916, 158)), fill=tri_fill)
    draw.line((916, 80, 1234, 80), fill=rgba(red, 220), width=1)
    draw.rectangle((916, 80, 919, 158), fill=red)
    orbit_center = (954, 119)
    draw.ellipse((925, 94, 983, 144), outline=rgba(steel, 130), width=1)
    draw.ellipse((929, 104, 979, 134), outline=rgba(red, 105), width=1)
    draw.ellipse((948, 113, 956, 121), fill=red)
    draw.ellipse((971, 106, 980, 115), fill=gold)
    draw.ellipse((936, 126, 943, 133), fill=steel)
    draw.text((999, 94), "TRISOLARIS / CHAOTIC ORBIT", font=font(7, True), fill=steel)
    draw.text((999, 111), "三体恒星系统", font=font(15, True), fill=ink)
    draw.text((999, 136), "危机纪元 208 · HUMAN FLEET LINK", font=font(7, True), fill=gold)

    frame_box = (916, 170, 1254, 520)
    portrait = ImageOps.fit(ARTWORK, (338, 350), Image.Resampling.LANCZOS, centering=(.16, .45))
    portrait = ImageEnhance.Color(portrait).enhance(.9 if dark else .72)
    portrait = ImageEnhance.Contrast(portrait).enhance(1.12)
    portrait = ImageEnhance.Brightness(portrait).enhance(1.14 if dark else 1.2).convert("RGBA")
    portrait_mask = Image.new("L", portrait.size, 0)
    mask_draw = ImageDraw.Draw(portrait_mask)
    mask_draw.polygon(((0, 0), (308, 0), (338, 30), (338, 350), (22, 350), (0, 328)), fill=255)
    portrait.putalpha(portrait_mask)
    image.alpha_composite(portrait, (frame_box[0], frame_box[1]))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.line((928, 182, 1226, 182), fill=rgba(red, 205), width=1)
    draw.line((1242, 194, 1242, 506), fill=rgba(steel, 165), width=1)
    identity_fill = (4, 11, 17, 230) if dark else (224, 228, 225, 232)
    draw.rectangle((916, 422, 1254, 520), fill=identity_fill)
    draw.rectangle((930, 440, 933, 504), fill=red)
    draw.text((948, 439), "HUMAN FLEET / COMMAND RECORD 07", font=font(8, True), fill=steel)
    draw.text((947, 458), "章 北 海", font=font(27, True), fill=ink)
    draw.text((948, 497), "自然选择号执行舰长 · 危机纪元 208", font=font(9, True), fill=muted)

    # Technical alignment marks and a one-way course establish the command language.
    draw.line((280, 94, 1252, 94), fill=line, width=1)
    draw.line((362, 0, 362, 720), fill=line, width=1)
    draw.line((922, 0, 922, 720), fill=rgba(steel, 36), width=1)
    draw.arc((430, 250, 1170, 720), 198, 331, fill=rgba(steel, 92), width=1)
    draw.arc((433, 253, 1167, 717), 198, 302, fill=rgba(red, 170), width=2)
    for x, y in ((562, 430), (748, 365), (962, 321), (1110, 307)):
        draw.polygon(((x, y - 6), (x + 6, y), (x, y + 6), (x - 6, y)), fill=rgba(card[:3], 230), outline=rgba(red, 190))

    # Sparse target reticle, deliberately asymmetrical and utilitarian.
    cx, cy, radius = 760, 166, 64
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=rgba(steel, 100), width=1)
    draw.ellipse((cx - 40, cy - 40, cx + 40, cy + 40), outline=rgba(red, 100), width=1)
    draw.line((cx, cy - 78, cx, cy + 78), fill=rgba(steel, 76), width=1)
    draw.line((cx - 78, cy, cx + 78, cy), fill=rgba(steel, 76), width=1)
    draw.ellipse((cx - 3, cy - 3, cx + 3, cy + 3), fill=red)

    # Sidebar is opaque enough to keep both modes readable over the same artwork.
    draw.rectangle((0, 0, 280, 720), fill=sidebar, outline=line, width=1)
    draw.text((18, 25), "◆  deepseek", font=font(19, True), fill=ink)
    draw.text((151, 31), "HARNESS", font=font(8), fill=muted)
    panel(draw, (14, 74, 266, 113), rgba(card[:3], 245), rgba(line[:3], 120), 4)
    draw.rectangle((14, 74, 17, 113), fill=red)
    draw.text((105, 84), "⊕ 新会话", font=font(14), fill=ink)
    draw.text((16, 136), "工作区", font=font(15), fill=muted)
    draw.text((198, 136), "⌕  ☷  +", font=font(13), fill=muted)
    draw.text((20, 178), "▱ dsh", font=font(14), fill=steel)
    draw.rounded_rectangle((12, 202, 268, 234), radius=3, fill=rgba(red, 24))
    draw.rectangle((12, 202, 15, 234), fill=red)
    draw.text((40, 209), "新会话", font=font(14), fill=ink)
    draw.text((40, 249), "恒星级航向备忘", font=font(13), fill=ink)
    draw.text((224, 251), "刚刚", font=font(10), fill=muted)
    draw.text((40, 283), "冬眠唤醒记录", font=font(13), fill=ink)
    draw.text((238, 285), "7天", font=font(10), fill=muted)
    draw.text((18, 680), "⚙  设置", font=font(13), fill=ink)

    # Main product surface stays rectilinear; no decorative glass capsule.
    draw.text((612, 220), "探索未至之境", font=font(29, True), fill=ink)
    panel(draw, (822, 225, 882, 247), rgba(red, 34), rgba(red, 92), 3)
    draw.text((833, 228), "预览版", font=font(9), fill=red)
    draw.text((400, 281), "▱ dsh   ⌄      ♧ 标准模式", font=font(12), fill=ink)
    panel(draw, (386, 309, 1158, 431), card, rgba(line[:3], 130), 5)
    draw.rectangle((386, 309, 389, 431), fill=red)
    draw.text((405, 330), "描述你想要构建的内容", font=font(15), fill=muted)
    draw.text((403, 392), "+", font=font(20), fill=ink)
    draw.text((448, 396), "♧ Workspace Write⌄", font=font(11), fill=ink)
    draw.text((944, 396), "DeepSeek-V4-Flash Max⌄", font=font(11), fill=ink)
    draw.rounded_rectangle((1115, 380, 1151, 416), radius=4, fill=red)
    draw.polygon(((1133, 389), (1125, 401), (1141, 401)), fill=(250, 247, 240, 255))

    # Quiet command log messages show the palette in real content surfaces.
    panel(draw, (594, 468, 1118, 522), rgba(bubble[:3], 222), rgba(line[:3], 82), 4)
    draw.text((611, 478), "航向已确认。保持静默，继续向前。", font=font(13), fill=ink)
    draw.text((611, 502), "COURSE AUTHORITY · LOCKED", font=font(8, True), fill=steel)

    panel(draw, (916, 514, 1254, 621), rgba(card[:3], 246), rgba(line[:3], 125), 0)
    draw.rectangle((916, 514, 919, 621), fill=red)
    draw.text((937, 526), "NATURAL SELECTION / COMMAND AUTHORITY", font=font(7, True), fill=steel)
    draw.text((937, 543), "自然选择 · 前进四", font=font(14, True), fill=ink)
    draw.text((937, 565), "ESCAPE VECTOR / ACTIVE", font=font(8, True), fill=gold)
    draw.line((937, 584, 1232, 584), fill=rgba(steel, 120), width=1)
    for x in (960, 1084, 1210):
        draw.polygon(((x, 580), (x + 4, 584), (x, 588), (x - 4, 584)), outline=rgba(red, 180))
    draw.ellipse((1120, 579, 1135, 588), fill=rgba(red, 220))
    draw.text((937, 600), "COURSE 120.0° · STELLAR CLASS", font=font(7, True), fill=steel)
    return image.convert("RGB")


for mode in ("light", "dark"):
    output = ROOT / "preview" / f"{mode}.webp"
    output.parent.mkdir(parents=True, exist_ok=True)
    make_preview(mode == "dark").save(output, "WEBP", quality=89, method=6)
    print(output)
