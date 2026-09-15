# Pericle — Verified Good News, Clearly Sourced

Pericle is a responsive good-news website for readers who want evidence-based stories of kindness, discovery, science, community progress, and practical innovation—without losing the link to the original source.

**Live site:** https://scar197124.github.io/perical/

![Pericle social preview](assets/pericle-social-preview-ultrasafe.png)

## What visitors can do

- Read the current edition on the Home page.
- Browse completed editions in the Archive.
- Explore stories by category, genre, or location.
- Open the original reporting behind every summarized story.

## Quick start

No build tools or package installation are required.

1. Download or clone the repository.
2. Open `index.html` in a browser for a local preview.
3. To publish on GitHub Pages, use the `main` branch and select `/(root)` as the Pages source.

```bash
git clone https://github.com/scar197124/perical.git
cd perical
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing a new edition

Story data lives in `stories.json` and `stories-data.js`. Current-edition stories use `isCurrent: true`; completed stories use `isCurrent: false` and appear in the Archive. Keep both data files synchronized when publishing.

Before deployment:

- Confirm every story has a working original-source link.
- Check the story title, summary, Why It Matters, ripple effect, evidence note, uncertainty note, and closing thought.
- Verify Home, Archive, Categories, Genre, and Location on desktop and mobile.
- Update the version query on CSS and JavaScript files when cache refresh is needed.
- Update `sitemap.xml` when public page URLs change.

## Social sharing and search discovery

The project includes:

- Open Graph and Twitter Card metadata
- A 1200 × 630 social preview image
- Canonical URLs and page-specific descriptions
- `robots.txt` and `sitemap.xml`
- JSON-LD structured data on the Home page
- `.nojekyll` for clean GitHub Pages deployment

Social preview image: `assets/pericle-social-preview-ultrasafe.png`

## Project structure

```text
index.html            Current edition
archive.html          Completed editions
categories.html       Category browsing
genre.html            Genre browsing
location.html         Location browsing
about.html            Mission and editorial approach
stories.json          Story data in JSON
stories-data.js       Browser-ready story data
app.css               Responsive design
app.js                Filtering and reader behavior
assets/                Brand and sharing images
```

## Editorial principle

Pericle summarizes independently and points readers back to original reporting. The goal is not to pretend difficult events do not exist; it is to make verified human progress easier to see.

## Current edition

**September 15, 2026 — Young People Creating, Helping & Leading**

- 15 verified, source-linked stories appear on Home.
- Earlier editions remain available through Archive, Categories, Genre, and Location.
- Each story includes context, Why It Matters, evidence, uncertainty, and a direct source link.

## License

No open-source license has been selected yet. All rights remain with the repository owner unless a license is added. Linked source reporting remains the property of its original publishers.

## Automatic lead-story social preview
Before publishing a new edition, run `python3 update_social_preview.py`. The script reads the first current story in `stories.json`, creates a unique 1200×630 Facebook/X image in `assets/`, and updates the Open Graph and Twitter tags in `index.html`. If image generation fails, the standard Pericle preview remains available as the fallback.
