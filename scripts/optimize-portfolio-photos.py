"""Build web-sized copies of the photography albums and Interests photos.

The source files under public/assets are never changed. The generated WebP
files are committed so the static GitHub Pages build needs no image service.
Requires Pillow: python -m pip install Pillow
"""

from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1] / "public" / "assets"
PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png"}
INTEREST_FOLDERS = ("travel", "exhibitions", "concerts", "theater", "new-things")


def web_copy(source: Path, target: Path, longest_edge: int, quality: int) -> int:
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        image.thumbnail((longest_edge, longest_edge), Image.Resampling.LANCZOS)
        options = {"format": "WEBP", "quality": quality, "method": 4}
        if original.info.get("icc_profile"):
            options["icc_profile"] = original.info["icc_profile"]
        image.save(target, **options)
    return target.stat().st_size


def source_photos(folder: Path) -> list[Path]:
    files = sorted(path for path in folder.iterdir() if path.is_file() and path.suffix.lower() in PHOTO_EXTENSIONS)
    stems = [path.stem for path in files]
    if len(stems) != len(set(stems)):
        raise ValueError(f"Duplicate photo stems in {folder}")
    return files


def main() -> None:
    for album in ("portraits", "landscapes"):
        folder = ROOT / "my-work" / album
        files = source_photos(folder)
        original_bytes = sum(path.stat().st_size for path in files)
        web_bytes = sum(
            web_copy(path, ROOT / "my-work" / f"{album}-web" / f"{path.stem}.webp", 2400, 85)
            for path in files
        )
        print(f"{album}: {len(files)} photos, {original_bytes / 2**20:.1f} -> {web_bytes / 2**20:.1f} MiB")

    for name in INTEREST_FOLDERS:
        folder = ROOT / "interests" / name
        files = source_photos(folder)
        original_bytes = sum(path.stat().st_size for path in files)
        preview_bytes = 0
        full_bytes = 0
        for path in files:
            preview_bytes += web_copy(path, folder / "preview" / f"{path.stem}.webp", 900, 80)
            full_bytes += web_copy(path, folder / "full" / f"{path.stem}.webp", 2200, 84)
        print(
            f"{name}: {len(files)} photos, {original_bytes / 2**20:.1f} -> "
            f"{preview_bytes / 2**20:.1f} MiB preview + {full_bytes / 2**20:.1f} MiB full"
        )


if __name__ == "__main__":
    main()
