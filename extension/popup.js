const SETTINGS_VERSION = 4;
const SUPPORTED_LANGUAGES = ['zh-CN', 'en'];
const ERROR_CODES = {
  PAGE_IMAGE_READ_FAILED: 'WIND_PAGE_IMAGE_READ_FAILED'
};

const DEFAULT_OPTIONS = {
  minWidth: 1200,
  minHeight: 1200,
  rootFolder: 'wind_images',
  onlyCurrentWindow: false,
  uiLanguage: detectPreferredLanguage()
};

const COPY = {
  'zh-CN': {
    pageTitle: 'Wind 图片批量下载器',
    heroTitle: 'Wind 图片批量下载器',
    heroHint: '扫描当前已打开网页中的图片，并按页面分文件夹保存。',
    languageLabel: 'Language / 语言',
    languageOptionZh: '中文 / Chinese',
    languageOptionEn: 'English / 英文',
    settingsTitle: '下载设置',
    minWidthLabel: '最小宽度（px）',
    minHeightLabel: '最小高度（px）',
    minHeightPlaceholder: '留空表示不限制',
    rootFolderLabel: '下载根目录',
    rootFolderHelp: '默认保存到浏览器下载目录下的 `wind_images` 子目录。',
    onlyCurrentWindowLabel: '仅扫描当前浏览器窗口',
    saveButton: '保存设置',
    startButton: '开始下载',
    statusTitle: '运行状态',
    statusTag: '实时输出',
    scopeTitle: '扫描说明',
    scopeTag: '当前模式',
    scopeTip1: '扫描全部已打开的普通网页（HTTP / HTTPS）。',
    scopeTip2: '跳过浏览器内部页、扩展页和无权限页面。',
    scopeTip3: '最小宽度默认 `1200`，最小高度默认 `1200`，清空最小高度可关闭高度限制。',
    scopeTip4: '下载结果会按页面归档，便于后续整理和二次处理。',
    statusIdle: '等待开始。',
    minWidthValidation: '最小宽度必须是大于 0 的整数。',
    minHeightValidation: '最小高度如填写，必须是大于 0 的整数。',
    rootFolderValidation: '下载根目录不能为空。',
    settingsSaved: '已保存全部设置。',
    saveFailed: '保存失败：',
    executionFailed: '执行失败：',
    startLoading: '正在读取已打开标签页，请稍候……',
    unknownError: '未知错误',
    pageReadFailed: '无法读取页面图片信息。',
    stagePreparing: '准备中',
    stageIdentifying: '识别网页中',
    stageDownloading: '下载图片中',
    stageCompleted: '已完成',
    stageWorking: '处理中',
    progressCurrentStage: '当前阶段：{value}',
    progressScannedTabs: '已扫描标签页：{value}',
    progressReadablePages: '可读取网页：{value}',
    progressIdentifiedPages: '已识别网页：{current}/{total}',
    progressCompletedPages: '已完成网页图片下载：{current}/{total}',
    progressCreatedDownloads: '已创建下载：{value}',
    progressFailedPages: '识别失败网页：{value}',
    progressCurrentPage: '当前网页：{value}',
    progressCurrentPageImages: '当前网页图片：{downloaded}/{matched}',
    filteredTabsReady: '已完成标签页筛选，准备逐页识别图片。',
    noScannableTabs: '未找到可扫描的已打开网页。',
    identifyingPage: '正在识别网页 {current}/{total}：{page}',
    identifiedPageDownloading: '已识别网页 {identified}/{total}，正在下载 {page} 的图片。',
    downloadingPage: '正在下载 {page}：{downloaded}/{matched}',
    completedPage: '已完成网页图片下载 {completed}/{total}：{page}',
    identifyFailed: '网页识别失败：{page}',
    allCompleted: '全部网页处理完成。',
    noTabsFoundSummary: '未找到可扫描的已打开网页。请先打开至少一个普通网页标签页。',
    summaryScannedTabs: '已扫描标签页：{value}',
    summaryReadablePages: '可读取网页：{value}',
    summaryIdentifiedPages: '已识别网页：{current}/{total}',
    summaryCompletedPages: '已完成网页图片下载：{current}/{total}',
    summaryFailedPages: '识别失败网页：{value}',
    summaryCreatedDownloads: '成功创建下载：{value}',
    summaryPartialFailure: '（部分失败）',
    summaryOmittedErrors: '其余 {count} 条错误已省略'
  },
  en: {
    pageTitle: 'Wind Bulk Image Downloader',
    heroTitle: 'Wind Bulk Image Downloader',
    heroHint: 'Scan opened tabs and save matched images into page-based folders.',
    languageLabel: 'Language / 语言',
    languageOptionZh: '中文 / Chinese',
    languageOptionEn: 'English / 英文',
    settingsTitle: 'Download Settings',
    minWidthLabel: 'Minimum Width (px)',
    minHeightLabel: 'Minimum Height (px)',
    minHeightPlaceholder: 'Leave empty for no limit',
    rootFolderLabel: 'Download Root Folder',
    rootFolderHelp:
      'Saved to the `wind_images` folder inside your browser download directory by default.',
    onlyCurrentWindowLabel: 'Scan current browser window only',
    saveButton: 'Save Settings',
    startButton: 'Start Download',
    statusTitle: 'Status',
    statusTag: 'Live Output',
    scopeTitle: 'Scan Scope',
    scopeTag: 'Current Mode',
    scopeTip1: 'Scan all opened regular web pages (HTTP / HTTPS).',
    scopeTip2: 'Skip browser internal pages, extension pages, and pages without permission.',
    scopeTip3:
      'Default filters are min width `1200` and min height `1200`. Clear min height to disable the height limit.',
    scopeTip4: 'Downloads are grouped by page folder for easier review and follow-up processing.',
    statusIdle: 'Ready.',
    minWidthValidation: 'Minimum width must be an integer greater than 0.',
    minHeightValidation: 'If provided, minimum height must be an integer greater than 0.',
    rootFolderValidation: 'Download root folder cannot be empty.',
    settingsSaved: 'All settings have been saved.',
    saveFailed: 'Save failed:',
    executionFailed: 'Request failed:',
    startLoading: 'Reading opened tabs, please wait...',
    unknownError: 'Unknown error',
    pageReadFailed: 'Unable to read image information from the page.',
    stagePreparing: 'Preparing',
    stageIdentifying: 'Identifying pages',
    stageDownloading: 'Downloading images',
    stageCompleted: 'Completed',
    stageWorking: 'Working',
    progressCurrentStage: 'Stage: {value}',
    progressScannedTabs: 'Scanned tabs: {value}',
    progressReadablePages: 'Readable pages: {value}',
    progressIdentifiedPages: 'Identified pages: {current}/{total}',
    progressCompletedPages: 'Downloaded page folders: {current}/{total}',
    progressCreatedDownloads: 'Downloads created: {value}',
    progressFailedPages: 'Failed pages: {value}',
    progressCurrentPage: 'Current page: {value}',
    progressCurrentPageImages: 'Current page images: {downloaded}/{matched}',
    filteredTabsReady: 'Finished filtering tabs. Preparing page-by-page image detection.',
    noScannableTabs: 'No opened web pages available for scanning.',
    identifyingPage: 'Identifying page {current}/{total}: {page}',
    identifiedPageDownloading:
      'Page {identified}/{total} identified. Downloading images from {page}.',
    downloadingPage: 'Downloading {page}: {downloaded}/{matched}',
    completedPage: 'Finished page {completed}/{total}: {page}',
    identifyFailed: 'Failed to identify page: {page}',
    allCompleted: 'All pages have been processed.',
    noTabsFoundSummary: 'No opened web pages found. Open at least one regular web page tab first.',
    summaryScannedTabs: 'Scanned tabs: {value}',
    summaryReadablePages: 'Readable pages: {value}',
    summaryIdentifiedPages: 'Identified pages: {current}/{total}',
    summaryCompletedPages: 'Downloaded page folders: {current}/{total}',
    summaryFailedPages: 'Failed pages: {value}',
    summaryCreatedDownloads: 'Downloads created successfully: {value}',
    summaryPartialFailure: '(partial failures)',
    summaryOmittedErrors: '{count} more errors omitted'
  }
};

const form = document.getElementById('download-form');
const minWidthInput = document.getElementById('min-width');
const minHeightInput = document.getElementById('min-height');
const rootFolderInput = document.getElementById('root-folder');
const onlyCurrentWindowInput = document.getElementById('only-current-window');
const uiLanguageSelect = document.getElementById('ui-language');
const statusOutput = document.getElementById('status-output');
const saveButton = document.getElementById('save-button');
const startButton = document.getElementById('start-button');
const progressPort = chrome.runtime.connect({ name: 'download-progress' });

let activeRequestId = null;
let currentLanguage = DEFAULT_OPTIONS.uiLanguage;
let statusState = { kind: 'idle' };

initialize();

uiLanguageSelect.addEventListener('change', async () => {
  currentLanguage = normalizeLanguage(uiLanguageSelect.value);
  uiLanguageSelect.value = currentLanguage;
  await chrome.storage.local.set({ uiLanguage: currentLanguage });
  applyTranslations();
  renderStatus();
});

progressPort.onMessage.addListener((message) => {
  if (message?.type !== 'download-progress' || message.requestId !== activeRequestId) {
    return;
  }

  setStatusState({ kind: 'progress', progress: message });
});

async function initialize() {
  const stored = await chrome.storage.local.get({ ...DEFAULT_OPTIONS, settingsVersion: 0 });
  const next = { ...stored };
  let shouldPersist = false;

  if (stored.rootFolder === 'hentaiclub_images') {
    next.rootFolder = DEFAULT_OPTIONS.rootFolder;
    shouldPersist = true;
  }

  if ((stored.settingsVersion ?? 0) < SETTINGS_VERSION) {
    if (stored.minHeight === undefined || stored.minHeight === null || stored.minHeight === '') {
      next.minHeight = DEFAULT_OPTIONS.minHeight;
    }
    next.settingsVersion = SETTINGS_VERSION;
    shouldPersist = true;
  }

  next.uiLanguage = normalizeLanguage(stored.uiLanguage || DEFAULT_OPTIONS.uiLanguage);
  if (next.uiLanguage !== stored.uiLanguage) {
    shouldPersist = true;
  }

  if (shouldPersist) {
    await chrome.storage.local.set(next);
    await chrome.storage.local.remove('maxHeight');
  }

  currentLanguage = next.uiLanguage;
  uiLanguageSelect.value = currentLanguage;
  minWidthInput.value = next.minWidth;
  minHeightInput.value = next.minHeight ?? '';
  rootFolderInput.value = next.rootFolder;
  onlyCurrentWindowInput.checked = Boolean(next.onlyCurrentWindow);
  applyTranslations();
  setStatusState({ kind: 'idle' });
}

function detectPreferredLanguage() {
  const browserLanguage =
    chrome.i18n?.getUILanguage?.() || navigator.language || navigator.languages?.[0] || 'en';
  return String(browserLanguage).toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

function normalizeLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_OPTIONS.uiLanguage;
}

function t(key, params = {}) {
  const dictionary = COPY[currentLanguage] || COPY.en;
  const template = dictionary[key] ?? COPY.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_match, token) => String(params[token] ?? ''));
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = t('pageTitle');

  for (const element of document.querySelectorAll('[data-i18n]')) {
    element.textContent = t(element.dataset.i18n);
  }

  for (const element of document.querySelectorAll('[data-i18n-placeholder]')) {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  }
}

function readAndValidateOptions() {
  const parseOptionalPositiveInteger = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number.parseInt(trimmed, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : Number.NaN;
  };

  const parsedMinWidth = Number.parseInt(minWidthInput.value, 10);
  const parsedMinHeight = parseOptionalPositiveInteger(minHeightInput.value);

  const options = {
    minWidth: parsedMinWidth,
    minHeight: Number.isNaN(parsedMinHeight)
      ? minHeightInput.value.trim()
      : (parsedMinHeight ?? ''),
    rootFolder: rootFolderInput.value.trim(),
    onlyCurrentWindow: onlyCurrentWindowInput.checked
  };

  if (!Number.isInteger(options.minWidth) || options.minWidth <= 0) {
    setStatusState({ kind: 'message', messageKey: 'minWidthValidation' });
    return null;
  }

  if (Number.isNaN(parsedMinHeight)) {
    setStatusState({ kind: 'message', messageKey: 'minHeightValidation' });
    return null;
  }

  if (!options.rootFolder) {
    setStatusState({ kind: 'message', messageKey: 'rootFolderValidation' });
    return null;
  }

  return options;
}

async function persistOptions(options) {
  await chrome.storage.local.set({
    ...options,
    uiLanguage: currentLanguage,
    settingsVersion: SETTINGS_VERSION
  });
  await chrome.storage.local.remove('maxHeight');
}

function createRequestId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `download-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setStatusState(nextState) {
  statusState = nextState;
  renderStatus();
}

function renderStatus() {
  switch (statusState.kind) {
    case 'progress':
      statusOutput.textContent = formatProgress(statusState.progress);
      break;
    case 'summary':
      statusOutput.textContent = formatSummary(statusState.result);
      break;
    case 'error':
      statusOutput.textContent = [t(statusState.messageKey), statusState.detail]
        .filter(Boolean)
        .join('\n');
      break;
    case 'message':
      statusOutput.textContent = t(statusState.messageKey, statusState.params);
      break;
    case 'idle':
    default:
      statusOutput.textContent = t('statusIdle');
      break;
  }
}

function localizeRuntimeError(error) {
  if (!error) {
    return t('unknownError');
  }

  if (String(error) === ERROR_CODES.PAGE_IMAGE_READ_FAILED) {
    return t('pageReadFailed');
  }

  return String(error);
}

saveButton.addEventListener('click', async () => {
  const options = readAndValidateOptions();
  if (!options) {
    return;
  }

  saveButton.disabled = true;

  try {
    await persistOptions(options);
    setStatusState({ kind: 'message', messageKey: 'settingsSaved' });
  } catch (error) {
    setStatusState({
      kind: 'error',
      messageKey: 'saveFailed',
      detail: localizeRuntimeError(error instanceof Error ? error.message : String(error))
    });
  } finally {
    saveButton.disabled = false;
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const options = readAndValidateOptions();
  if (!options) {
    return;
  }

  saveButton.disabled = true;
  startButton.disabled = true;
  const requestId = createRequestId();
  activeRequestId = requestId;
  setStatusState({ kind: 'message', messageKey: 'startLoading' });

  try {
    await persistOptions(options);
    const response = await chrome.runtime.sendMessage({
      type: 'start-download',
      requestId,
      options
    });

    if (!response?.ok) {
      activeRequestId = null;
      setStatusState({
        kind: 'error',
        messageKey: 'executionFailed',
        detail: localizeRuntimeError(response?.error)
      });
      return;
    }

    activeRequestId = null;
    setStatusState({ kind: 'summary', result: response });
  } catch (error) {
    activeRequestId = null;
    setStatusState({
      kind: 'error',
      messageKey: 'executionFailed',
      detail: localizeRuntimeError(error instanceof Error ? error.message : String(error))
    });
  } finally {
    saveButton.disabled = false;
    startButton.disabled = false;
  }
});

function translateStage(stage) {
  switch (stage) {
    case 'preparing':
      return t('stagePreparing');
    case 'identifying':
      return t('stageIdentifying');
    case 'downloading':
      return t('stageDownloading');
    case 'completed':
      return t('stageCompleted');
    default:
      return t('stageWorking');
  }
}

function formatStep(progress) {
  if (progress.currentStepKey) {
    return t(progress.currentStepKey, progress.currentStepValues || {});
  }

  return progress.currentStep || '';
}

function formatProgress(progress) {
  const totalTabs = progress.totalTabs ?? 0;
  const lines = [
    t('progressCurrentStage', { value: translateStage(progress.stage) }),
    t('progressScannedTabs', { value: progress.scannedTabs ?? totalTabs }),
    t('progressReadablePages', { value: totalTabs }),
    t('progressIdentifiedPages', {
      current: progress.identifiedPages ?? 0,
      total: totalTabs
    }),
    t('progressCompletedPages', {
      current: progress.completedPages ?? 0,
      total: totalTabs
    }),
    t('progressCreatedDownloads', { value: progress.downloadedCount ?? 0 })
  ];

  if (progress.failedPages) {
    lines.push(t('progressFailedPages', { value: progress.failedPages }));
  }

  if (progress.currentPage) {
    lines.push(t('progressCurrentPage', { value: progress.currentPage }));
  }

  if (progress.currentPageMatchedCount !== null && progress.currentPageDownloadedCount !== null) {
    lines.push(
      t('progressCurrentPageImages', {
        downloaded: progress.currentPageDownloadedCount,
        matched: progress.currentPageMatchedCount
      })
    );
  }

  const currentStep = formatStep(progress);
  if (currentStep) {
    lines.push('', currentStep);
  }

  return lines.join('\n');
}

function formatSummary(result) {
  if (!result.totalTabs) {
    return t('noTabsFoundSummary');
  }

  const lines = [
    t('summaryScannedTabs', { value: result.scannedTabs ?? result.totalTabs }),
    t('summaryReadablePages', { value: result.totalTabs }),
    t('summaryIdentifiedPages', {
      current: result.identifiedPages ?? result.totalTabs,
      total: result.totalTabs
    }),
    t('summaryCompletedPages', {
      current: result.completedPages ?? result.totalTabs,
      total: result.totalTabs
    }),
    t('summaryFailedPages', { value: result.failedPages ?? 0 }),
    t('summaryCreatedDownloads', { value: result.downloadedCount }),
    ''
  ];

  for (const page of result.pages) {
    const firstLine = `- ${page.folderName}: ${page.downloadedCount}/${page.matchedCount}`;
    if (!page.errors.length) {
      lines.push(firstLine);
      continue;
    }

    lines.push(`${firstLine} ${t('summaryPartialFailure')}`.trim());
    for (const error of page.errors.slice(0, 3)) {
      lines.push(`  * ${localizeRuntimeError(error)}`);
    }
    if (page.errors.length > 3) {
      lines.push(`  * ${t('summaryOmittedErrors', { count: page.errors.length - 3 })}`);
    }
  }

  return lines.join('\n');
}
