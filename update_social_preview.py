#!/usr/bin/env python3
"""Generate the homepage social card from the first current story and update index.html.

Run before publishing:
    python3 update_social_preview.py
"""
from __future__ import annotations

import html
import json
import re
import textwrap
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
STORIES = ROOT / "stories.json"
INDEX = ROOT / "index.html"
ASSETS = ROOT / "assets"
SITE_URL = "https://scar197124.github.io/perical/"
FALLBACK = "pericle-social-preview-ultrasafe.png"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def shorten(text: str, limit: int = 185) -> str:
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(" ", 1)[0] + "…"


def replace_meta(document: str, key: str, value: str, prop: bool = True) -> str:
    attr = "property" if prop else "name"
    escaped = html.escape(value, quote=True)
    pattern = rf'(<meta\s+{attr}="{re.escape(key)}"\s+content=")[^"]*("\s*/?>)'
    updated, count = re.subn(pattern, rf'\g<1>{escaped}\2', document, count=1, flags=re.I)
    if count:
        return updated
    return document.replace("</head>", f'<meta {attr}="{key}" content="{escaped}"></head>', 1)


def first_current_story(data: list[dict]) -> dict:
    for story in data:
        if story.get("isCurrent"):
            return story
    if data:
        return data[0]
    raise ValueError("stories.json contains no stories")


def make_card(story: dict, output: Path) -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), (8, 12, 18))
    draw = ImageDraw.Draw(image)

    # Soft concentric glow and clean editorial frame.
    for inset in range(0, 170, 10):
        shade = max(18, 58 - inset // 5)
        draw.ellipse((650 - inset, -210 + inset // 2, 1350 + inset, 480 + inset), fill=(8, shade, 52))
    draw.rectangle((42, 42, width - 42, height - 42), outline=(83, 214, 167), width=3)
    draw.line((82, 154, width - 82, 154), fill=(83, 214, 167), width=2)

    brand = font(54, True)
    label = font(25, True)
    title_font = font(49, True)
    summary_font = font(25, False)
    footer_font = font(22, False)

    draw.text((82, 72), "PERICLE", font=brand, fill=(243, 247, 245))
    draw.text((910, 91), "LEAD STORY", font=label, fill=(83, 214, 167))

    category = str(story.get("category") or story.get("mainCategory") or "Good News").upper()
    location = str(story.get("location") or "Around the world")
    draw.text((84, 178), f"{category}  •  {location}", font=label, fill=(132, 238, 198))

    title = str(story.get("title") or "Today’s Good News")
    wrapped = textwrap.wrap(title, width=38)[:4]
    y = 226
    for line in wrapped:
        draw.text((82, y), line, font=title_font, fill=(255, 255, 255))
        y += 58

    summary = shorten(str(story.get("summary") or "Verified good news from around the world."), 145)
    summary_lines = textwrap.wrap(summary, width=72)[:2]
    sy = min(490, y + 10)
    for line in summary_lines:
        draw.text((84, sy), line, font=summary_font, fill=(202, 214, 211))
        sy += 34

    edition = str(story.get("editionDate") or datetime.now().strftime("%B %d, %Y"))
    draw.text((84, 574), f"Verified story • {edition}", font=footer_font, fill=(154, 172, 168))
    draw.text((910, 574), "pericle", font=footer_font, fill=(154, 172, 168))

    image.save(output, "PNG", optimize=True)


def main() -> None:
    data = json.loads(STORIES.read_text(encoding="utf-8"))
    story = first_current_story(data)
    raw_date = str(story.get("editionDate", ""))
    try:
        slug_date = datetime.strptime(raw_date, "%B %d, %Y").strftime("%Y-%m-%d")
    except ValueError:
        slug_date = datetime.now().strftime("%Y-%m-%d")
    image_name = f"lead-story-{slug_date}-{story.get('id', 'current')}.png"
    image_path = ASSETS / image_name

    try:
        make_card(story, image_path)
    except Exception as exc:
        print(f"Preview generation failed; keeping fallback: {exc}")
        image_name = FALLBACK

    title = shorten(str(story.get("title") or "Pericle | Today’s Good News"), 100)
    description = shorten(str(story.get("summary") or "Verified good news from around the world."), 190)
    image_url = SITE_URL + "assets/" + image_name

    document = INDEX.read_text(encoding="utf-8")
    document = replace_meta(document, "og:title", title)
    document = replace_meta(document, "og:description", description)
    document = replace_meta(document, "og:image", image_url)
    document = replace_meta(document, "og:image:secure_url", image_url)
    document = replace_meta(document, "og:image:alt", f"Pericle lead story: {title}")
    document = replace_meta(document, "twitter:title", title, prop=False)
    document = replace_meta(document, "twitter:description", description, prop=False)
    document = replace_meta(document, "twitter:image", image_url, prop=False)
    document = replace_meta(document, "twitter:image:alt", f"Pericle lead story: {title}", prop=False)
    INDEX.write_text(document, encoding="utf-8")

    print(f"Lead story: {title}")
    print(f"Social image: assets/{image_name}")
    print("Updated index.html Open Graph and Twitter metadata.")


if __name__ == "__main__":
    main()
