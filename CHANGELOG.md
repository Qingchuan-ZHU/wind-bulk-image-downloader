# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-04-03

### Added

- Added a Chinese / English language switch inside the popup and localized the live progress + summary output.
- Added separate `README.md` and `README.zh-CN.md` variants for English-first discovery and Chinese-friendly onboarding.
- Added a shared Wind brand SVG source for repository visuals and extension UI branding.

### Changed

- Renamed the public-facing project to `Wind Bulk Image Downloader` and prepared repository metadata for the `wind-bulk-image-downloader` repository name.
- Replaced the extension icon set with PNG assets generated from the provided Wind brand mark.
- Updated the popup header and showcase artwork to consistently use the Wind brand icon.

## [1.2.1] - 2026-04-03

### Changed

- Tightened host permissions from `<all_urls>` to `http://*/*` and `https://*/*` so the extension permissions better match its actual scanning scope.
- Refreshed README copy and repository metadata for public release readiness, bilingual discoverability, and better GitHub search visibility.
- Aligned the extension manifest version with the package version and added homepage/icon metadata for cleaner public distribution.

## [1.2.0] - 2026-03-30

### Added

- Added `MIT` license, contribution guide, privacy note, security policy, roadmap, and code of conduct.
- Added lightweight engineering setup with `npm`, `ESLint`, `Prettier`, Node built-in tests, and GitHub Actions CI.
- Added shared pure helper module for option normalization, path sanitization, file naming, and URL parsing.
- Added extension icons and repository showcase asset.

### Changed

- Repositioned the repository as a GitHub-first open-source browser extension with bilingual documentation.
- Updated extension metadata, homepage links, icons, and open-source/privacy messaging.
- Refined the popup UI copy to better explain local-only processing and project links.

## [1.1.0] - 2026-03-28

### Changed

- Unified the `Wind` branding and open-source neutral wording.
- Simplified settings to minimum width, optional minimum height, root folder, and current-window mode.
- Improved popup layout and clarified result messages.
- Expanded scanning scope to regular web pages with broader image source detection.
