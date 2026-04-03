# Privacy / 隐私说明

## 中文说明

`Wind Bulk Image Downloader（Wind 图片批量下载器）` 当前采用本地优先的实现方式。

### 我们会做什么

- 读取您当前浏览器中已打开的普通网页信息，以识别页面中的图片资源。
- 读取并保存扩展设置，例如最小宽度、最小高度、下载根目录、是否仅扫描当前窗口。
- 通过浏览器下载 API 创建下载任务，将图片保存到您的本地下载目录。

### 我们不会做什么

- 不要求您注册账号或登录。
- 不上传网页内容、图片列表、Cookie、访问历史或下载结果到项目服务器。
- 不集成广告、埋点、第三方分析或远程跟踪代码。
- 不尝试绕过站点登录、付费墙或其他访问控制。

### 权限用途

- `downloads`：创建浏览器下载任务。
- `storage`：保存扩展的本地设置。
- `tabs`：枚举您当前已打开的标签页。
- `scripting`：在您主动打开的网页内读取图片元素信息。
- `http://*/*`、`https://*/*`：允许扩展访问普通网页，以支持跨站点的通用扫描能力。

### 数据保留

- 扩展设置保存在浏览器扩展本地存储中。
- 下载的图片保存在您配置的本地目录中。
- 当前项目不维护远程数据库，不保留您的网页内容或下载记录副本。

## English

`Wind Bulk Image Downloader` is currently designed as a local-first extension.

### What the extension does

- Reads information from the regular web pages you already opened in order to locate image resources.
- Stores extension settings such as minimum width, minimum height, root folder, and current-window scope.
- Creates download jobs through the browser downloads API and saves images to your local download directory.

### What the extension does not do

- No account or login is required.
- No page contents, image lists, cookies, browsing history, or download results are uploaded to project servers.
- No ads, analytics, third-party tracking, or remote telemetry are included.
- The extension does not attempt to bypass login requirements, paywalls, or other access controls.

### Permission usage

- `downloads`: create browser download jobs
- `storage`: store local extension preferences
- `tabs`: enumerate currently opened tabs
- `scripting`: read image-related information from pages you intentionally opened
- `http://*/*` and `https://*/*`: allow scanning regular web pages across sites
