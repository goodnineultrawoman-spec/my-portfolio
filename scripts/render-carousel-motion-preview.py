"""Export exactly one cycle of the carousel detail's layered CSS motion."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "portfolio" / "public" / "assets" / "carousel-detail"
OUTPUT = ROOT / "portfolio-assets" / "02-carousel" / "carousel-front-horses-one-cycle.gif"
STAGE = 620
PERIOD_MS = 5200
FRAME_MS = 80
PHASES = (0, .25, .5, .75)

# Sixteen linear samples of the shared 6px sine curve in app/map-demo.css.
LIFT = (0, -2.3, -4.24, -5.54, -6, -5.54, -4.24, -2.3,
        0, 2.3, 4.24, 5.54, 6, 5.54, 4.24, 2.3, 0)


def lift_at(progress: float) -> float:
    sample = progress * 16
    index = int(sample) % 16
    fraction = sample - int(sample)
    return LIFT[index] * (1 - fraction) + LIFT[index + 1] * fraction


def layer(name: str) -> Image.Image:
    return Image.open(ASSETS / name).convert("RGBA").resize(
        (STAGE, STAGE), Image.Resampling.LANCZOS)


base = layer("carousel-static-base.png")
horses = [layer(f"horse-front-{number:02}.png") for number in range(1, 5)]
poles = layer("carousel-front-poles.png")
canopy = layer("carousel-canopy-clean.png")

frames = []
positions = []
for step in range(PERIOD_MS // FRAME_MS):
    progress = step * FRAME_MS / PERIOD_MS
    offsets = tuple(round(lift_at((progress + phase) % 1)) for phase in PHASES)
    frame = Image.new("RGBA", (STAGE, STAGE), "white")
    frame.alpha_composite(base)
    frame.alpha_composite(poles)
    for horse, offset in zip(horses, offsets):
        frame.alpha_composite(horse, (0, offset))
    frame.alpha_composite(canopy)
    frames.append(frame.convert("RGB"))
    positions.append(offsets)

# A stationary pole/roof patch must match pixel for pixel throughout the cycle.
for x in (141, 225, 310, 422):
    reference = frames[0].crop((x - 2, 295, x + 3, 320)).tobytes()
    assert all(frame.crop((x - 2, 295, x + 3, 320)).tobytes() == reference
               for frame in frames), f"Roof attachment moved at x={x}"
assert all(max(p[i] for p in positions) - min(p[i] for p in positions) >= 11
           for i in range(4)), "At least one foreground horse did not move"

palette = frames[0].quantize(colors=256, dither=Image.Dither.NONE)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
indexed[0].save(OUTPUT, save_all=True, append_images=indexed[1:],
                duration=FRAME_MS, loop=0, optimize=True, disposal=2)
print(f"{OUTPUT} | {len(frames)} frames | {PERIOD_MS / 1000:.1f}s | fixed roof and rods")
