"""Make higher-resolution display copies without changing the painted RGB pixels.

The originals remain available beside the display files. Only alpha edges get
a small opacity lift and a restrained unsharp pass before 2x resampling.
"""

from pathlib import Path
from PIL import Image, ImageFilter


ASSETS = Path(__file__).resolve().parents[1] / "public/assets/ferris-detail"
NAMES = ["ferris-static-base", "ferris-wheel-rotor"] + [
    f"ferris-cabin-{index:02d}" for index in range(1, 7)
]


def display_copy(source: Image.Image) -> Image.Image:
    source = source.convert("RGBA")
    # RGBa resampling avoids transparent-edge colour bleed.
    large = source.convert("RGBa").resize(
        (source.width * 2, source.height * 2), Image.Resampling.LANCZOS
    ).convert("RGBA")
    red, green, blue, alpha = large.split()
    # No RGB adjustment: the source watercolour and its palette stay intact.
    alpha = alpha.point(lambda value: min(255, round(value * 1.07)))
    alpha = alpha.filter(ImageFilter.UnsharpMask(radius=1.1, percent=65, threshold=3))
    return Image.merge("RGBA", (red, green, blue, alpha))


for name in NAMES:
    source = Image.open(ASSETS / f"{name}.png")
    result = display_copy(source)
    result.save(ASSETS / f"{name}-clear.png", optimize=True)
    print(f"{name}: {source.size} -> {result.size}")
