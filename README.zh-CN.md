# Wind 图片批量下载器

[English README](README.md)

[![CI](https://github.com/Qingchuan-ZHU/wind-bulk-image-downloader/actions/workflows/ci.yml/badge.svg)](https://github.com/Qingchuan-ZHU/wind-bulk-image-downloader/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome / Edge](https://img.shields.io/badge/Chrome%20%7C%20Edge-Manifest%20V3-1f6feb)](extension/manifest.json)
[![隐私：本地优先](https://img.shields.io/badge/privacy-local--first-0a7f5a)](PRIVACY.md)

<p>
  <img src="docs/assets/wind-brand.svg" alt="Wind 品牌图标" width="88" />
</p>

Wind 图片批量下载器是一个带有 Wind 品牌、本地优先的 Chrome / Edge 扩展，用来批量下载当前已打开网页中的图片，并按页面自动归档到本地目录。

AI 开发说明：本仓库及其发布文案在 Windows 版 OpenAI Codex App 中持续迭代，使用 OpenAI GPT-5.4 进行编码辅助、README 优化和发布整理。

<p>
  <img src="docs/assets/zh/屏幕截图%202026-04-03%20204705.png" alt="Wind 图片批量下载器中文界面" width="48%" />
  <img src="docs/assets/zh/屏幕截图%202026-04-03%20204711.png" alt="Wind 图片批量下载器中文状态面板" width="48%" />
</p>

<p>
  <img src="docs/assets/zh/屏幕截图%202026-04-03%20205902.png" alt="Wind 图片批量下载器中文实战场景" width="96%" />
</p>

## 为什么值得公开发布

- 直接扫描当前已打开标签页，不依赖远程爬虫、代理账号或第三方服务。
- 本地优先，无登录、无埋点、无云同步、无服务器上传。
- 支持按最小宽度和可选最小高度筛选，更适合保留大图。
- 下载结果按页面分文件夹保存，便于整理、复查和二次处理。
- 弹窗支持中英文切换，便于公开仓库和更广泛使用者理解。

## AI 辅助开发说明

- 该项目在 Windows 版 OpenAI Codex App 中完成多轮 AI 辅助开发与文档整理。
- 编码实现、文案优化和公开发布准备过程中使用了 OpenAI GPT-5.4。
- 运行行为、权限边界和合规判断仍建议由人工复核。

## 适用场景

- 收集设计参考图、灵感图
- 批量保存多个已打开网页中的图片
- 从文章页、图库页、列表页中初筛大图
- 在 Chrome 或 Edge 中保留轻量本地工作流

## 安装方式

1. 打开 Chrome、Edge 或其他 Chromium 浏览器。
2. 进入扩展管理页：
   - Chrome：`chrome://extensions`
   - Edge：`edge://extensions`
3. 打开开发者模式。
4. 选择“加载已解压的扩展程序”。
5. 选择本仓库中的 `extension/` 目录。

## 使用方式

1. 在浏览器中打开一个或多个普通 `http` / `https` 网页。
2. 点击扩展图标。
3. 设置最小宽度、最小高度、下载根目录，以及是否仅扫描当前窗口。
4. 如有需要，可在弹窗中切换中文 / English。
5. 点击“开始下载”。

下载结果会按 `wind_images/页面标识_页面标题/` 的结构保存。

## 权限与合规

- 仅申请 `downloads`、`storage`、`tabs`、`scripting`、`http://*/*`、`https://*/*`。
- 不要求登录，不上传页面内容、图片列表、Cookie、访问历史或下载结果。
- 不尝试绕过付费墙、登录态或其他站点访问控制。

详细说明见 [PRIVACY.md](PRIVACY.md) 与 [SECURITY.md](SECURITY.md)。

## 开发命令

```bash
npm install
npm run format:check
npm run lint
npm test
```

## 项目文档

- [README.md](README.md)
- [PRIVACY.md](PRIVACY.md)
- [SECURITY.md](SECURITY.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [ROADMAP.md](ROADMAP.md)
- [CHANGELOG.md](CHANGELOG.md)

## 搜索关键词

Wind 图片下载器，Wind Bulk Image Downloader，Chrome 图片下载扩展，Edge 图片下载扩展，批量图片下载器，打开标签页图片下载，本地优先图片保存，Manifest V3 图片下载扩展，AI 辅助开发浏览器扩展，OpenAI Codex App，OpenAI GPT-5.4，Codex 生成文档。
