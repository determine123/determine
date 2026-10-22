# determine · ThoughtLite

This directory uses the actual [Astro Theme ThoughtLite](https://github.com/tuyuritio/astro-theme-thought-lite) template by tuyuritio, version 0.41.1, under GPL-3.0. See LICENSE. Upstream layout, components, content lists, pagination, tags, theme switcher and heatmap are retained.

Site modifications: determine identity and navigation; local/system font fallbacks; existing Waline, blog Agent, search and music widgets; original-URL redirects; scoped compatibility pages for photo maps, travel diaries and static resources. Optional upstream navigation transitions are disabled so the original page scripts initialize reliably.

## Build

From the repository root, first build the existing Jekyll sources into `_site`, then:

```sh
python -m pip install beautifulsoup4 PyYAML
python .github/scripts/prepare_astro.py
pnpm --dir astro-site install --frozen-lockfile
pnpm --dir astro-site build
python .github/scripts/verify_astro.py
```

Jekyll is a lossless content import step, not the final frontend. Astro produces the deployed site. Generated content and copied assets are excluded from Git. Source content remains in `_posts`, `_essays`, `_learning`, and the existing pages, so there is one editable source for each record. The importer fails on missing content instead of silently omitting it.

Historical URLs redirect to native note/jotting pages. Original comment-path attributes are retained, keeping existing discussions attached. No content-wide Creative Commons license is introduced; original authorship and rights remain as stated in the original pages. The GPL applies to theme code, not automatically to the articles or photographs.
