"""Partition the accepted roller coaster painting into aligned detail layers.

The separate track/train sheets have different geometry. This extraction uses
the complete painting and complementary binary masks, so recomposition is
pixel-identical while the train remains at its original stationary position.
"""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Image.open(ROOT / "public/assets/illustrations/roller-coaster.png").convert("RGBA")
OUT = ROOT / "public/assets/coaster-detail"
REVIEW = ROOT.parent / "portfolio-assets/03-roller-coaster"
OUT.mkdir(parents=True, exist_ok=True)
REVIEW.mkdir(parents=True, exist_ok=True)

train_mask = Image.new("L", SOURCE.size)
train_draw = ImageDraw.Draw(train_mask)
# Five visible cars on the high descent. The source rail remains in the base
# wherever it can be distinguished from the car undercarriages.
car_outlines = [
    [(518, 137), (532, 128), (568, 135), (585, 154), (591, 195), (575, 220), (517, 202)],
    [(575, 177), (597, 167), (635, 180), (656, 201), (661, 239), (641, 264), (577, 230)],
    [(636, 217), (661, 205), (698, 221), (720, 243), (725, 280), (704, 303), (641, 265)],
    [(697, 260), (719, 248), (756, 264), (778, 287), (784, 325), (766, 349), (704, 311)],
    [(750, 309), (774, 298), (810, 317), (832, 340), (839, 374), (821, 400), (756, 363)],
]
for points in car_outlines:
    train_draw.polygon(points, fill=255)

foreground_mask = Image.new("L", SOURCE.size)
front_draw = ImageDraw.Draw(foreground_mask)
# Bottom vegetation is the only foreground occlusion needed for this scene.
for points in [
    [(59, 405), (139, 380), (218, 399), (295, 514), (335, 706), (279, 786), (90, 688)],
    [(330, 519), (423, 510), (544, 619), (644, 752), (590, 835), (356, 793)],
    [(675, 511), (790, 539), (990, 674), (993, 811), (734, 838), (654, 686)],
    [(1045, 580), (1195, 593), (1408, 747), (1414, 989), (1156, 1008), (1014, 834)],
]:
    front_draw.polygon(points, fill=255)

# The masks do not overlap. Exact 0/255 partitioning retains every existing
# watercolor pixel without an artificial edge or opacity change.
assert ImageChops.multiply(train_mask, foreground_mask).getbbox() is None
base_mask = ImageChops.invert(ImageChops.lighter(train_mask, foreground_mask))
empty = Image.new("RGBA", SOURCE.size)
layers = {
    "coaster-track-static.png": Image.composite(SOURCE, empty, base_mask),
    "coaster-train-static.png": Image.composite(SOURCE, empty, train_mask),
    "coaster-foreground.png": Image.composite(SOURCE, empty, foreground_mask),
}
for filename, layer in layers.items():
    layer.save(OUT / filename)

preview = Image.new("RGBA", SOURCE.size, "white")
for layer in layers.values():
    preview.alpha_composite(layer)
reference = Image.new("RGBA", SOURCE.size, "white")
reference.alpha_composite(SOURCE)
assert ImageChops.difference(preview, reference).getbbox() is None
preview.convert("RGB").save(REVIEW / "coaster-static-preview.png")
print("Wrote three aligned layers; static recomposition is pixel-identical to the original.")
