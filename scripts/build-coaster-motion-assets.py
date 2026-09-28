"""Prepare the supplied clean coaster pair and inspect a short descent.

Only alpha trimming, uniform resizing, and rotation are applied to the train.
The supplied clean track is kept pixel-for-pixel as a separate scene layer.
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "portfolio-assets/03-roller-coaster"
OUT = ROOT / "public/assets/coaster-detail"
OUT.mkdir(parents=True, exist_ok=True)

track = Image.open(SOURCE / "coaster-track-clean.png").convert("RGBA")
train = Image.open(SOURCE / "coaster-train-clean.png").convert("RGBA")
assert track.size == train.size == (1448, 1086)

# The transparent sheet has an independent pennant and pole to the left of the
# five-car body. The clean track already has a pennant at its summit. Trim those
# parts so a moving train cannot create a second drifting flag.
train = train.crop((385, 240, 1188, 849))
alpha = train.getchannel("A").point(lambda value: 0 if value < 8 else value)
train.putalpha(alpha)
train = train.resize((305, 231), Image.Resampling.LANCZOS)
train = train.rotate(-10, resample=Image.Resampling.BICUBIC, expand=True)

track.save(OUT / "coaster-track-motion.png")
train.save(OUT / "coaster-train-motion.png")

positions = ((459, 108), (494, 138), (529, 168))
frames = []
for index, position in enumerate(positions):
    scene = Image.new("RGBA", track.size)
    scene.alpha_composite(track)
    scene.alpha_composite(train, position)
    frame = Image.new("RGBA", track.size, "white")
    frame.alpha_composite(scene.resize((1361, 1021), Image.Resampling.LANCZOS), (90, 40))
    frame.convert("RGB").save(SOURCE / f"coaster-motion-check-{index}.png")
    frames.append(frame.convert("RGB").resize((724, 543), Image.Resampling.LANCZOS))

strip = Image.new("RGB", (724 * 3, 543), "white")
for index, frame in enumerate(frames):
    strip.paste(frame, (index * 724, 0))
strip.save(SOURCE / "coaster-motion-check-strip.png")
(SOURCE / "coaster-motion-static-preview.png").write_bytes(
    (SOURCE / "coaster-motion-check-2.png").read_bytes()
)
print(f"Prepared train {train.size}; review start, middle, and end frames.")
