# Pericle — Verified Good News, Clearly Sourced

Pericle is a responsive good-news website for readers who want evidence-based stories of kindness, discovery, science, community progress, and practical innovation—without losing the link to the original source.

**Live site:** https://scar197124.github.io/Perical/

![Pericle social preview](assets/pericle-social-preview.png)

## What visitors can do

- Read the current edition on the Home page.
- Browse completed editions in the Archive.
- Explore stories by category or location.
- Open the original reporting behind every summarized story.

## Quick start

No build tools or package installation are required.

1. Download or clone the repository.
2. Open `index.html` in a browser for a local preview.
3. To publish on GitHub Pages, use the `main` branch and select `/(root)` as the Pages source.

```bash
git clone https://github.com/scar197124/Perical.git
cd Perical
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing a new edition

Story data lives in `stories.json` and `stories-data.js`. Current-edition stories use `isCurrent: true`; completed stories use `isCurrent: false` and appear in the Archive. Keep both data files synchronized when publishing.

Before deployment:

- Confirm every story has a working original-source link.
- Check the story title, summary, ripple effect, and closing thought.
- Verify Home, Archive, Categories, and Location on desktop and mobile.
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

Social preview image: `assets/pericle-social-preview.png`

## Project structure

```text
index.html            Current edition
archive.html          Completed editions
categories.html       Category browsing
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

## Current release

**v14.2 — README and Discoverability Upgrade**

- Strengthened the first-screen project pitch and live-demo presentation.
- Added a no-build quick start and publishing checklist.
- Added page-specific descriptions, canonical URLs, and social metadata.
- Added structured website data and improved sitemap signals.
- Preserved the July 31 twenty-story edition and enriched storytelling.

## Suggested GitHub repository metadata

**Description:** Verified, source-linked stories of kindness, discovery, science, innovation, and human progress.

**Topics:** `good-news`, `positive-news`, `human-interest`, `science-news`, `innovation`, `kindness`, `static-site`, `github-pages`

## License

No open-source license has been selected yet. All rights remain with the repository owner unless a license is added. Linked source reporting remains the property of its original publishers.

## Suggested commit message

`Upgrade README and improve Pericle search discoverability`
