# Wind Bulk Image Downloader

[中文说明](README.zh-CN.md)

[![CI](https://github.com/Qingchuan-ZHU/wind-bulk-image-downloader/actions/workflows/ci.yml/badge.svg)](https://github.com/Qingchuan-ZHU/wind-bulk-image-downloader/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome / Edge](https://img.shields.io/badge/Chrome%20%7C%20Edge-Manifest%20V3-1f6feb)](extension/manifest.json)
[![Privacy: Local-first](https://img.shields.io/badge/privacy-local--first-0a7f5a)](PRIVACY.md)

<p>
  <img src="docs/assets/wind-brand.svg" alt="Wind brand icon" width="88" />
</p>

Wind Bulk Image Downloader is a Wind-branded, local-first Chrome and Edge extension for batch downloading images from already opened web pages and grouping them into page-based folders on your machine.

AI-assisted development note: this repository and its release copy were iterated in the OpenAI Codex app on Windows, using GPT-5.4 for coding assistance, README refinement, and release preparation.

<p>
  <img src="docs/assets/en/屏幕截图%202026-04-03%20204720.png" alt="Wind Bulk Image Downloader English popup" width="48%" />
  <img src="docs/assets/en/屏幕截图%202026-04-03%20204732.png" alt="Wind Bulk Image Downloader English status panel" width="48%" />
</p>

<p>
  <img src="docs/assets/en/屏幕截图%202026-04-03%20204845.png" alt="Wind Bulk Image Downloader live workflow on image search pages" width="96%" />
</p>

## Why It Stands Out

- Scan images from already opened tabs instead of using remote crawlers or third-party accounts.
- Stay local-first: no sign-in, no analytics, no cloud sync, no server upload.
- Filter by minimum width and optional minimum height to focus on large images.
- Save downloads into page-based folders for easier review, cleanup, and reuse.
- Use a simple bilingual UI with Chinese / English switching inside the popup.

## AI-Assisted Development

- Built and iterated with AI assistance in the OpenAI Codex app on Windows.
- Development and copy refinement used OpenAI GPT-5.4 in Codex.
- Human review is still required for runtime behavior, permissions, and compliance decisions.

## Good Fit

- Collecting visual references or inspiration boards
- Saving image sets from multiple opened tabs
- Reviewing large images from article pages, galleries, or listings
- Keeping a lightweight local workflow for Chrome or Edge

## Quick Start

1. Open Chrome, Edge, or another Chromium-based browser.
2. Visit the extension page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Turn on Developer Mode.
4. Choose `Load unpacked`.
5. Select the `extension/` folder from this repository.

## How To Use

1. Open one or more regular `http` / `https` web pages in your browser.
2. Click the extension icon.
3. Set minimum width, optional minimum height, download root folder, and whether to scan only the current window.
4. Choose Chinese or English in the popup if needed.
5. Click `Start Download`.

Downloads are stored in a structure like `wind_images/page_id_page_title/`.

## Permissions And Privacy

- Requests only `downloads`, `storage`, `tabs`, `scripting`, `http://*/*`, and `https://*/*`.
- Does not require an account or upload page contents, image lists, cookies, browsing history, or download results.
- Does not attempt to bypass paywalls, login requirements, or site access controls.

See [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md) for details.

## Development

```bash
npm install
npm run format:check
npm run lint
npm test
```

## Project Docs

- [README.zh-CN.md](README.zh-CN.md)
- [PRIVACY.md](PRIVACY.md)
- [SECURITY.md](SECURITY.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [ROADMAP.md](ROADMAP.md)
- [CHANGELOG.md](CHANGELOG.md)

## Search Keywords

Wind Bulk Image Downloader, Chrome image downloader extension, Edge image downloader, batch image downloader, open tabs image downloader, local-first image saver, Manifest V3 image downloader, AI-assisted browser extension, OpenAI Codex app, OpenAI GPT-5.4, Codex-generated project documentation.
