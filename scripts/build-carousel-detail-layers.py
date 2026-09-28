"""Separate approved carousel PNGs into fixed structure and four moving horses.

Only narrow painted pole strips in the stationary plate are repaired. The source
PNGs remain untouched.
"""

from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT
OUTPUT = ROOT / "portfolio" / "public" / "assets" / "carousel-detail"
SIZE = 1254

HORSE_LAYOUT = (
    ("01", .31, 113, 571),
    ("02", .30, 259, 585),
    ("03", .31, 412, 574),
    ("04", .28, 637, 597),
)

# Existing front poles in carousel-still-clean.png: shaft and wider foot caps.
BASE_POLE_RECTS = (
    ((281, 590, 294, 892), (273, 888, 300, 927)),
    ((447, 616, 462, 935), (440, 930, 469, 973)),
    ((617, 615, 635, 957), (609, 952, 641, 995)),
    ((845, 590, 862, 891), (836, 885, 869, 932)),
)

# Each horse's exposed source pole is cleared; its original saddle fittings
# remain attached to the horse to preserve the approved watercolor detailing.
HORSE_BODY_BANDS = ((640, 835), (605, 850), (648, 860), (615, 870))
HORSE_POLE_CLEAR_X = ((495, 575), (600, 715), (630, 708), (730, 810))


def rectangle_mask(rectangles, blur=0):
    mask = Image.new("L", (SIZE, SIZE), 0)
    drawing = ImageDraw.Draw(mask)
    for rectangle in rectangles:
        drawing.rectangle(rectangle, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(blur)) if blur else mask


def repair_thin_strips(source: Image.Image, mask: Image.Image) -> Image.Image:
    """Bridge a painted pole with the immediately adjacent source pixels.

    A horizontal interpolation is deliberately local: the widest repair is 85
    source pixels in an individual horse, and its result is then scaled to less
    than 26 display pixels. Transparent background stays transparent.
    """
    pixels = np.asarray(source.convert("RGBA"), dtype=np.float32)
    target = np.asarray(mask) > 127
    result = pixels.copy()
    if not target.any():
        return source.copy()
    for row in np.flatnonzero(target.any(axis=1)):
        columns = np.flatnonzero(target[row])
        splits = np.flatnonzero(np.diff(columns) > 1) + 1
        for group in np.split(columns, splits):
            left, right = int(group[0]), int(group[-1])
            outer_left = max(0, left - 2)
            outer_right = min(SIZE - 1, right + 2)
            a = pixels[row, outer_left]
            b = pixels[row, outer_right]
            fraction = ((group - outer_left) / max(1, outer_right - outer_left))[:, None]
            # Interpolate premultiplied paint to prevent dark/color fringes at
            # transparent edges, then convert back to straight alpha PNG.
            alpha = a[3] * (1 - fraction) + b[3] * fraction
            premult = a[:3] * a[3] * (1 - fraction) + b[:3] * b[3] * fraction
            rgb = np.divide(premult, alpha, out=np.zeros_like(premult), where=alpha > 0)
            result[row, group, :3] = rgb
            result[row, group, 3] = alpha[:, 0]
    return Image.fromarray(np.clip(result, 0, 255).astype(np.uint8), "RGBA")


original = Image.open(SOURCE / "carousel-still-clean.png").convert("RGBA")
base_pole_mask = rectangle_mask(tuple(rect for group in BASE_POLE_RECTS for rect in group))
repaired = repair_thin_strips(original, base_pole_mask)

# Retain pole watercolor from the approved stationary plate. Keep the narrow
# painted center and soft edges, without copying broad paper-colored strips.
pole_pixels = np.asarray(original, dtype=np.uint8).copy()
spatial = np.asarray(base_pole_mask, dtype=np.float32) / 255
red_minus_blue = (pole_pixels[:, :, 0].astype(np.float32)
                  - pole_pixels[:, :, 2].astype(np.float32))
paint_strength = np.clip((red_minus_blue - 14) / 38, 0, 1)
pole_alpha = pole_pixels[:, :, 3].astype(np.float32) * spatial * paint_strength
pole_pixels[:, :, 3] = pole_alpha.astype(np.uint8)
poles = Image.fromarray(pole_pixels, "RGBA")

# The canopy mask follows the roof and its scalloped outside edge. The rest of
# the original plate stays in the static base, preserving lamps, trees and floor.
canopy_mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(canopy_mask).polygon([
    (585, 30), (770, 35), (770, 165), (865, 245), (950, 305), (1057, 377),
    (1065, 557), (1010, 590), (955, 594), (904, 606), (853, 611),
    (800, 620), (744, 615), (690, 627), (628, 631), (564, 626),
    (511, 617), (458, 630), (401, 612), (348, 611), (293, 598),
    (238, 579), (201, 550), (194, 394), (270, 363), (339, 329),
    (418, 279), (501, 218), (575, 158),
], fill=255)
canopy_area = np.asarray(canopy_mask, dtype=np.uint8)
clean_pixels = np.asarray(repaired, dtype=np.uint8).copy()
roof_pixels = clean_pixels.copy()
roof_pixels[:, :, 3] = np.where(canopy_area > 0, roof_pixels[:, :, 3], 0)
clean_pixels[:, :, 3] = np.where(canopy_area > 0, 0, clean_pixels[:, :, 3])
static_base = Image.fromarray(clean_pixels, "RGBA")
canopy = Image.fromarray(roof_pixels, "RGBA")

OUTPUT.mkdir(parents=True, exist_ok=True)
static_base.save(OUTPUT / "carousel-static-base.png")
canopy.save(OUTPUT / "carousel-canopy-clean.png")
poles.save(OUTPUT / "carousel-front-poles.png")

for number, scale, x, y in HORSE_LAYOUT:
    horse = Image.open(SOURCE / f"horse-{number}.png").convert("RGBA")
    horse_index = int(number) - 1
    # The saddle's gold fittings belong to the horse and must retain their
    # original watercolor detail. Remove the exposed pole above and below.
    # Its few pixels inside the painted saddle read as fittings, not a second
    # free-standing rod, once the original fixed front pole is layered above.
    horse_pixels = np.asarray(horse, dtype=np.uint8).copy()
    x_start, x_end = HORSE_POLE_CLEAR_X[horse_index]
    body_start, body_end = HORSE_BODY_BANDS[horse_index]
    horse_pixels[:body_start, x_start:x_end, 3] = 0
    horse_pixels[body_end:, x_start:x_end, 3] = 0
    horse = Image.fromarray(horse_pixels, "RGBA")
    size = round(SIZE * scale)
    horse = horse.resize((size, size), Image.Resampling.LANCZOS)
    aligned = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    aligned.alpha_composite(horse, (x, y))
    aligned.save(OUTPUT / f"horse-front-{number}.png")

print(f"Created 7 aligned carousel layers in {OUTPUT}")
