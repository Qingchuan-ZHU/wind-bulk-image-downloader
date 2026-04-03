# Contributing / 贡献指南

感谢您和所有贡献者关注这个项目。

Thank you for your interest in contributing to this project.

## 适用范围 / Scope

- 本项目优先接受与“批量下载当前已打开网页中的图片并按页面归档”直接相关的改进。
- 请避免提交与项目目标无关的大范围重构、一次性脚本或站点定制逻辑。
- This repository prefers improvements that support the core goal: downloading images from already opened pages and organizing them by page.

## 开始之前 / Before You Start

1. 先阅读 [`README.md`](README.md)、[`PRIVACY.md`](PRIVACY.md)、[`ROADMAP.md`](ROADMAP.md)。
2. 对较大变更，请先提交 Issue 讨论方向，避免重复工作。
3. 遵守 [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)。

## 本地开发 / Local Development

```bash
npm install
npm run lint
npm run format:check
npm test
```

- `extension/`：运行时代码
- `tests/`：单元测试
- `.github/workflows/ci.yml`：持续集成检查

## 提交流程 / Pull Request Workflow

1. Fork 仓库并创建清晰的分支名称。
2. 保持改动最小且聚焦，不顺手修 unrelated 问题。
3. 运行 `npm run lint`、`npm run format:check`、`npm test`。
4. 在 PR 描述中说明：
   - 改了什么
   - 为什么改
   - 如何验证
   - 是否影响权限、隐私或对外行为

## 代码与文档要求 / Code and Docs Expectations

- 优先可维护性与可读性，不引入不必要的依赖。
- 不新增远程跟踪、广告或隐式数据采集。
- 涉及权限、隐私或安全边界时，必须同步更新文档。
- 文档默认使用 UTF-8 编码，中文在前、英文补充即可。

## 提交建议 / Good First Contributions

- 改进错误提示与边界提示
- 补充单元测试
- 改进无障碍与界面细节
- 优化 README、FAQ、隐私与权限说明
