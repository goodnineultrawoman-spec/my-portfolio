"""Extract the ferris detail layers from the existing watercolor parts sheet.

The lower wheel is reconstructed from source pixels in its clean upper half;
no new illustration or colour adjustment is applied.
"""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Image.open(ROOT / "public/assets/layers/ferris-parts.png").convert("RGBA")
OUT = ROOT / "public/assets/ferris-detail"
OUT.mkdir(parents=True, exist_ok=True)
REVIEW = ROOT.parent / "portfolio-assets/04-ferris-wheel"
REVIEW.mkdir(parents=True, exist_ok=True)

SIZE = (800, 800)
SOURCE_CENTER = (909, 461)
OFFSET = (400 - SOURCE_CENTER[0], 360 - SOURCE_CENTER[1])


def on_canvas(source: Image.Image) -> Image.Image:
    result = Image.new("RGBA", SIZE)
    result.alpha_composite(source, OFFSET)
    return result


def masked(source: Image.Image, mask: Image.Image) -> Image.Image:
    result = source.copy()
    result.putalpha(ImageChops.multiply(result.getchannel("A"), mask))
    return result


# The ground comes from the undisturbed lower edge of the illustrated whole.
# Keep only small painted patches under the support feet so the low cabin never
# appears to pass through a broad terrain wash.
ground_mask = Image.new("L", SOURCE.size)
ground_draw = ImageDraw.Draw(ground_mask)
for x in (178, 235, 425, 503):
    ground_draw.ellipse((x - 46, 796, x + 46, 889), fill=255)
ground_mask = ground_mask.filter(ImageFilter.GaussianBlur(15))
ground = Image.new("RGBA", SIZE)
ground.alpha_composite(masked(SOURCE, ground_mask), (62, -120))

# Preserve the painted A-frame from the parts sheet while excluding the wheel.
support_mask = Image.new("L", SOURCE.size)
draw = ImageDraw.Draw(support_mask)
for end, width in [((750, 811), 27), ((813, 807), 20), ((992, 812), 20), ((1068, 810), 27)]:
    draw.line((SOURCE_CENTER, end), fill=255, width=width, joint="curve")
support_mask = support_mask.filter(ImageFilter.GaussianBlur(2.1))
support = on_canvas(masked(SOURCE, support_mask))
support.alpha_composite(ground)
support.save(OUT / "ferris-static-base.png")

# Support strokes occupy the lower half of this source drawing. Reflect the
# clean upper-half pixels about the axle; this preserves the horizontal spoke
# at the centre without creating a visible cut line.
wheel_source = SOURCE.copy()
for y in range(SOURCE_CENTER[1] + 1, 728):
    source_y = 2 * SOURCE_CENTER[1] - y
    wheel_source.paste(SOURCE.crop((0, source_y, SOURCE.width, source_y + 1)), (0, y))
ellipse = Image.new("L", SOURCE.size)
ImageDraw.Draw(ellipse).ellipse((655, 196, 1163, 727), fill=255)
ellipse = ellipse.filter(ImageFilter.GaussianBlur(1.8))
wheel = on_canvas(masked(wheel_source, ellipse))
wheel.save(OUT / "ferris-wheel-rotor.png")

# Six original cabin cutouts, kept at native resolution on matching canvases.
cabin_boxes = [
    (1200, 170, 1358, 383), (1357, 170, 1525, 383),
    (1200, 378, 1360, 579), (1357, 378, 1525, 579),
    (1200, 573, 1360, 778), (1357, 573, 1525, 778),
]
cabins = []
for index, box in enumerate(cabin_boxes, 1):
    raw = SOURCE.crop(box)
    visible = raw.getchannel("A").point(lambda a: 255 if a > 4 else 0).getbbox()
    assert visible is not None
    crop = raw.crop(visible)
    cabin = Image.new("RGBA", (180, 210))
    cabin.alpha_composite(crop, ((180 - crop.width) // 2, 9))
    cabin.save(OUT / f"ferris-cabin-{index:02d}.png")
    cabins.append(cabin)

# Static proof uses the same shared geometry as the browser view.
preview = Image.new("RGBA", SIZE, "white")
preview.alpha_composite(support)
preview.alpha_composite(wheel)
import math

for index, cabin in enumerate(cabins):
    angle = 2 * math.pi * index / 6
    anchor_x = 400 + round(253 * math.sin(angle))
    anchor_y = 360 - round(253 * math.cos(angle))
    # Native sprite's roof suspension point is 55px below its canvas top.
    preview.alpha_composite(cabin, (anchor_x - 90, anchor_y - 55))
preview.convert("RGB").save(REVIEW / "ferris-static-preview.png")
print("Wrote ferris static base, rotor, six cabins and static preview")
