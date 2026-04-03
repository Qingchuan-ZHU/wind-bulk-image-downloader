const SETTINGS_VERSION = 4;
const progressPorts = new Set();
const ERROR_CODES = {
  PAGE_IMAGE_READ_FAILED: 'WIND_PAGE_IMAGE_READ_FAILED'
};

const DEFAULT_OPTIONS = {
  minWidth: 1200,
  minHeight: 1200,
  rootFolder: 'wind_images',
  onlyCurrentWindow: false
};
const PAGE_PROCESS_CONCURRENCY = 3;
const DOWNLOAD_ENQUEUE_CONCURRENCY = 8;
const SIZE_PROBE_CONCURRENCY = 12;

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get();
  const next = {
    ...DEFAULT_OPTIONS,
    ...current
  };

  if (!current.rootFolder || current.rootFolder === 'hentaiclub_images') {
    next.rootFolder = DEFAULT_OPTIONS.rootFolder;
  }

  if ((current.settingsVersion ?? 0) < SETTINGS_VERSION) {
    if (current.minHeight === undefined || current.minHeight === null || current.minHeight === '') {
      next.minHeight = DEFAULT_OPTIONS.minHeight;
    }
    next.settingsVersion = SETTINGS_VERSION;
  }

  await chrome.storage.local.set(next);
  await chrome.storage.local.remove('maxHeight');
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'download-progress') {
    return;
  }

  progressPorts.add(port);
  port.onDisconnect.addListener(() => {
    progressPorts.delete(port);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'start-download') {
    return false;
  }

  handleDownloadRequest(message.options, message.requestId)
    .then((result) => sendResponse({ ok: true, ...result }))
    .catch((error) =>
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      })
    );

  return true;
});

function emitProgressUpdate(update) {
  for (const port of progressPorts) {
    try {
      port.postMessage({
        type: 'download-progress',
        ...update
      });
    } catch {
      progressPorts.delete(port);
    }
  }
}

function buildProgressState({
  requestId,
  stage,
  scannedTabs,
  totalTabs,
  identifiedPages,
  completedPages,
  failedPages,
  downloadedCount,
  currentPage = '',
  currentPageMatchedCount = null,
  currentPageDownloadedCount = null,
  currentStepKey = '',
  currentStepValues = {}
}) {
  return {
    requestId,
    stage,
    scannedTabs,
    totalTabs,
    identifiedPages,
    completedPages,
    failedPages,
    downloadedCount,
    currentPage,
    currentPageMatchedCount,
    currentPageDownloadedCount,
    currentStepKey,
    currentStepValues
  };
}

async function runWithConcurrencyLimit(items, maxConcurrency, worker) {
  if (!items.length) {
    return;
  }

  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(maxConcurrency, items.length));

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (true) {
        const currentIndex = nextIndex;
        nextIndex += 1;

        if (currentIndex >= items.length) {
          return;
        }

        await worker(items[currentIndex], currentIndex);
      }
    })
  );
}

async function handleDownloadRequest(rawOptions, requestId) {
  const options = normalizeOptions(rawOptions);
  const query = {};

  if (options.onlyCurrentWindow) {
    query.currentWindow = true;
  }

  const tabs = await chrome.tabs.query(query);
  const targetTabs = tabs.filter((tab) => Number.isInteger(tab.id) && canScanTabUrl(tab.url));
  const pages = new Array(targetTabs.length);
  let startedPages = 0;
  let identifiedPages = 0;
  let completedPages = 0;
  let failedPages = 0;
  let downloadedCount = 0;

  emitProgressUpdate(
    buildProgressState({
      requestId,
      stage: targetTabs.length ? 'preparing' : 'completed',
      scannedTabs: tabs.length,
      totalTabs: targetTabs.length,
      identifiedPages,
      completedPages,
      failedPages,
      downloadedCount,
      currentStepKey: targetTabs.length ? 'filteredTabsReady' : 'noScannableTabs'
    })
  );

  await runWithConcurrencyLimit(targetTabs, PAGE_PROCESS_CONCURRENCY, async (tab, tabIndex) => {
    const fallbackFolderName = buildFolderName(
      extractPageIdFromUrl(tab.url),
      tab.title || 'unknown_page'
    );
    startedPages += 1;

    emitProgressUpdate(
      buildProgressState({
        requestId,
        stage: 'identifying',
        scannedTabs: tabs.length,
        totalTabs: targetTabs.length,
        identifiedPages,
        completedPages,
        failedPages,
        downloadedCount,
        currentPage: fallbackFolderName,
        currentStepKey: 'identifyingPage',
        currentStepValues: {
          current: startedPages,
          total: targetTabs.length,
          page: fallbackFolderName
        }
      })
    );

    try {
      const pageData = await collectPageImages(tab.id, options.minWidth, options.minHeight);
      const folderName = buildFolderName(pageData.pageId, pageData.pageTitle);
      const pageResult = {
        folderName,
        matchedCount: pageData.images.length,
        downloadedCount: 0,
        errors: []
      };
      identifiedPages += 1;

      emitProgressUpdate(
        buildProgressState({
          requestId,
          stage: 'downloading',
          scannedTabs: tabs.length,
          totalTabs: targetTabs.length,
          identifiedPages,
          completedPages,
          failedPages,
          downloadedCount,
          currentPage: folderName,
          currentPageMatchedCount: pageData.images.length,
          currentPageDownloadedCount: pageResult.downloadedCount,
          currentStepKey: 'identifiedPageDownloading',
          currentStepValues: {
            identified: identifiedPages,
            total: targetTabs.length,
            page: folderName
          }
        })
      );

      await runWithConcurrencyLimit(
        pageData.images,
        DOWNLOAD_ENQUEUE_CONCURRENCY,
        async (image, index) => {
          const filename = buildDownloadFilename(options.rootFolder, folderName, image, index);

          try {
            await chrome.downloads.download({
              url: image.url,
              filename,
              conflictAction: 'uniquify',
              saveAs: false
            });
            pageResult.downloadedCount += 1;
            downloadedCount += 1;
          } catch (error) {
            pageResult.errors.push(
              `${image.url} -> ${error instanceof Error ? error.message : String(error)}`
            );
          }

          emitProgressUpdate(
            buildProgressState({
              requestId,
              stage: 'downloading',
              scannedTabs: tabs.length,
              totalTabs: targetTabs.length,
              identifiedPages,
              completedPages,
              failedPages,
              downloadedCount,
              currentPage: folderName,
              currentPageMatchedCount: pageData.images.length,
              currentPageDownloadedCount: pageResult.downloadedCount,
              currentStepKey: 'downloadingPage',
              currentStepValues: {
                page: folderName,
                downloaded: pageResult.downloadedCount,
                matched: pageData.images.length
              }
            })
          );
        }
      );

      pages[tabIndex] = pageResult;
      completedPages += 1;

      emitProgressUpdate(
        buildProgressState({
          requestId,
          stage: 'downloading',
          scannedTabs: tabs.length,
          totalTabs: targetTabs.length,
          identifiedPages,
          completedPages,
          failedPages,
          downloadedCount,
          currentPage: folderName,
          currentPageMatchedCount: pageData.images.length,
          currentPageDownloadedCount: pageResult.downloadedCount,
          currentStepKey: 'completedPage',
          currentStepValues: {
            completed: completedPages,
            total: targetTabs.length,
            page: folderName
          }
        })
      );
    } catch (error) {
      identifiedPages += 1;
      failedPages += 1;
      pages[tabIndex] = {
        folderName: fallbackFolderName,
        matchedCount: 0,
        downloadedCount: 0,
        errors: [error instanceof Error ? error.message : String(error)]
      };

      emitProgressUpdate(
        buildProgressState({
          requestId,
          stage: 'identifying',
          scannedTabs: tabs.length,
          totalTabs: targetTabs.length,
          identifiedPages,
          completedPages,
          failedPages,
          downloadedCount,
          currentPage: fallbackFolderName,
          currentStepKey: 'identifyFailed',
          currentStepValues: {
            page: fallbackFolderName
          }
        })
      );
    }
  });

  emitProgressUpdate(
    buildProgressState({
      requestId,
      stage: 'completed',
      scannedTabs: tabs.length,
      totalTabs: targetTabs.length,
      identifiedPages,
      completedPages,
      failedPages,
      downloadedCount,
      currentStepKey: 'allCompleted'
    })
  );

  return {
    scannedTabs: tabs.length,
    totalTabs: targetTabs.length,
    identifiedPages,
    completedPages,
    failedPages,
    downloadedCount,
    pages
  };
}

async function collectPageImages(tabId, minWidth, minHeight) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: collectImagesInPage,
    args: [minWidth, minHeight, SIZE_PROBE_CONCURRENCY]
  });

  const result = results?.[0]?.result;
  if (!result) {
    throw new Error(ERROR_CODES.PAGE_IMAGE_READ_FAILED);
  }

  return result;
}

function normalizeOptions(rawOptions) {
  const parsePositiveInteger = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  };

  const minWidth = parsePositiveInteger(rawOptions?.minWidth);
  const minHeight = parsePositiveInteger(rawOptions?.minHeight);
  const rootFolder = sanitizeSegment(rawOptions?.rootFolder || DEFAULT_OPTIONS.rootFolder, 60);

  return {
    minWidth: minWidth ?? DEFAULT_OPTIONS.minWidth,
    minHeight,
    rootFolder: rootFolder || DEFAULT_OPTIONS.rootFolder,
    onlyCurrentWindow: Boolean(rawOptions?.onlyCurrentWindow)
  };
}

function canScanTabUrl(url) {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function buildFolderName(pageId, pageTitle) {
  const safePageId = sanitizeSegment(pageId || 'page', 30);
  const safeTitle = sanitizeSegment(pageTitle || 'untitled', 70);
  return `${safePageId}_${safeTitle}`.replace(/^_+|_+$/g, '') || 'page';
}

function buildDownloadFilename(rootFolder, folderName, image, index) {
  const extension = getExtensionFromUrl(image.url);
  const baseName =
    sanitizeSegment(image.alt || image.title || '', 50) ||
    `image_${String(index + 1).padStart(3, '0')}`;
  const sizePart = `${image.width}x${image.height}`;
  return `${rootFolder}/${folderName}/${String(index + 1).padStart(3, '0')}_${baseName}_${sizePart}${extension}`;
}

function getExtensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]{2,5})$/);
    if (!match) {
      return '.jpg';
    }

    const extension = `.${match[1].toLowerCase()}`;
    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.avif']);
    return allowed.has(extension) ? extension : '.jpg';
  } catch {
    return '.jpg';
  }
}

function extractPageIdFromUrl(url) {
  if (!url) {
    return 'page';
  }

  try {
    return (
      new URL(url).pathname
        .split('/')
        .filter(Boolean)
        .pop()
        ?.replace(/\.html$/i, '') || 'page'
    );
  } catch {
    return 'page';
  }
}

function sanitizeSegment(value, maxLength = 80) {
  return String(value ?? '')
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if ('<>:"/\\|?*'.includes(char) || code <= 31) {
        return '_';
      }

      return char;
    })
    .join('')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^\.+/, '')
    .slice(0, maxLength)
    .replace(/^_+|_+$/g, '');
}

async function collectImagesInPage(minWidth, minHeight, sizeProbeConcurrency) {
  const normalizeText = (value) =>
    String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim();
  const buildPageId = () => {
    const safeHostname = location.hostname.replace(/\./g, '_').replace(/[^a-zA-Z0-9_-]/g, '_');
    const lastPathSegment =
      location.pathname
        .split('/')
        .filter(Boolean)
        .pop()
        ?.replace(/\.[a-zA-Z0-9]+$/i, '')
        ?.replace(/[^a-zA-Z0-9_-]/g, '_') || '';

    return [safeHostname, lastPathSegment].filter(Boolean).join('_') || 'page';
  };
  const candidateAttributes = [
    'src',
    'data-src',
    'data-original',
    'data-lazy-src',
    'data-lsrc',
    'data-echo',
    'data-lazyload',
    'data-image',
    'data-imageurl',
    'data-bg',
    'data-background',
    'data-background-image'
  ];
  const sizeCache = new Map();
  const matchesSizeFilters = (width, height) => {
    if (width < minWidth) {
      return false;
    }

    if (minHeight !== null && height < minHeight) {
      return false;
    }

    return true;
  };
  const shouldProbeSize = (width, height, allowProbe) => {
    if (!allowProbe) {
      return false;
    }

    if (width <= 0 || height <= 0) {
      return true;
    }

    if (width < minWidth) {
      return true;
    }

    if (minHeight !== null && height < minHeight) {
      return true;
    }

    return false;
  };
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  const waitForReady = async () => {
    if (document.readyState === 'complete') {
      return;
    }

    await Promise.race([
      new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
      sleep(1500)
    ]);
  };
  const processWithConcurrencyLimit = async (items, maxConcurrency, worker) => {
    if (!items.length) {
      return;
    }

    let nextIndex = 0;
    const workerCount = Math.max(1, Math.min(maxConcurrency, items.length));

    await Promise.all(
      Array.from({ length: workerCount }, async () => {
        while (true) {
          const currentIndex = nextIndex;
          nextIndex += 1;

          if (currentIndex >= items.length) {
            return;
          }

          await worker(items[currentIndex], currentIndex);
        }
      })
    );
  };
  const toAbsoluteHttpUrl = (rawUrl) => {
    if (!rawUrl) {
      return '';
    }

    try {
      const absoluteUrl = new URL(String(rawUrl).trim(), location.href).href;
      return absoluteUrl.startsWith('http://') || absoluteUrl.startsWith('https://')
        ? absoluteUrl
        : '';
    } catch {
      return '';
    }
  };
  const looksLikeImageUrl = (rawUrl) => {
    const absoluteUrl = toAbsoluteHttpUrl(rawUrl);
    if (!absoluteUrl) {
      return false;
    }

    try {
      return /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:$|[?#])/i.test(new URL(absoluteUrl).pathname);
    } catch {
      return false;
    }
  };
  const extractUrlsFromSrcset = (srcset) =>
    String(srcset ?? '')
      .split(',')
      .map((entry) => entry.trim().split(/\s+/)[0])
      .filter(Boolean);
  const extractCssUrls = (value) =>
    Array.from(String(value ?? '').matchAll(/url\((['"]?)(.*?)\1\)/gi), (match) => match[2]).filter(
      Boolean
    );
  const collectElementCandidateUrls = (element) => {
    const rawUrls = new Set();

    for (const attributeName of candidateAttributes) {
      const attributeValue = element.getAttribute?.(attributeName);
      if (attributeValue) {
        rawUrls.add(attributeValue);
      }
    }

    const srcsetValue =
      element.getAttribute?.('srcset') || element.getAttribute?.('data-srcset') || element.srcset;
    for (const srcsetUrl of extractUrlsFromSrcset(srcsetValue)) {
      rawUrls.add(srcsetUrl);
    }

    const currentSrc = element.currentSrc || element.src;
    if (currentSrc) {
      rawUrls.add(currentSrc);
    }

    const inlineStyleUrls = extractCssUrls(
      element.getAttribute?.('style') || element.style?.backgroundImage || ''
    );
    for (const styleUrl of inlineStyleUrls) {
      rawUrls.add(styleUrl);
    }

    if (element.tagName === 'IMG') {
      const anchor = element.closest('a[href]');
      if (anchor?.href && looksLikeImageUrl(anchor.href)) {
        rawUrls.add(anchor.href);
      }
    }

    return Array.from(rawUrls)
      .map((rawUrl) => toAbsoluteHttpUrl(rawUrl))
      .filter(Boolean);
  };
  const probeImageSize = (url) => {
    if (sizeCache.has(url)) {
      return sizeCache.get(url);
    }

    const task = new Promise((resolve) => {
      const tempImage = new Image();

      tempImage.onload = () => {
        resolve({
          width: Number(tempImage.naturalWidth || 0),
          height: Number(tempImage.naturalHeight || 0)
        });
      };
      tempImage.onerror = () => resolve({ width: 0, height: 0 });
      tempImage.src = url;
    });

    sizeCache.set(url, task);
    return task;
  };

  const uniqueImages = new Map();
  const registerCandidate = async ({
    rawUrl,
    width = 0,
    height = 0,
    alt = '',
    title = '',
    allowProbe = true
  }) => {
    const absoluteUrl = toAbsoluteHttpUrl(rawUrl);
    if (!absoluteUrl) {
      return;
    }

    let resolvedWidth = Number(width || 0);
    let resolvedHeight = Number(height || 0);

    if (shouldProbeSize(resolvedWidth, resolvedHeight, allowProbe)) {
      const probedSize = await probeImageSize(absoluteUrl);
      resolvedWidth = Math.max(resolvedWidth, probedSize.width);
      resolvedHeight = Math.max(resolvedHeight, probedSize.height);
    }

    if (!matchesSizeFilters(resolvedWidth, resolvedHeight)) {
      return;
    }

    const previous = uniqueImages.get(absoluteUrl);
    if (previous && previous.width * previous.height >= resolvedWidth * resolvedHeight) {
      return;
    }

    uniqueImages.set(absoluteUrl, {
      url: absoluteUrl,
      width: resolvedWidth,
      height: resolvedHeight,
      alt: normalizeText(alt),
      title: normalizeText(title)
    });
  };

  await waitForReady();

  const waitForImages = Array.from(document.images, (image) => {
    if (image.complete) {
      return Promise.resolve();
    }

    return image.decode().catch(() => undefined);
  });

  await Promise.all(waitForImages);
  await sleep(300);

  const imageCandidates = [];
  for (const image of Array.from(document.images)) {
    const width = Number(image.naturalWidth || image.width || image.clientWidth || 0);
    const height = Number(image.naturalHeight || image.height || image.clientHeight || 0);
    const candidates = collectElementCandidateUrls(image);

    for (const candidateUrl of candidates) {
      imageCandidates.push({
        rawUrl: candidateUrl,
        width,
        height,
        alt: image.alt,
        title: image.title
      });
    }
  }
  await processWithConcurrencyLimit(imageCandidates, sizeProbeConcurrency, (candidate) =>
    registerCandidate(candidate)
  );

  const extraNodes = document.querySelectorAll(
    "[data-src], [data-original], [data-lazy-src], [data-lsrc], [data-echo], [data-lazyload], [data-image], [data-imageurl], [data-bg], [data-background], [data-background-image], [style*='background']"
  );

  const extraNodeCandidates = [];
  for (const element of Array.from(extraNodes)) {
    if (element.tagName === 'IMG') {
      continue;
    }

    const candidates = collectElementCandidateUrls(element).filter(
      (candidateUrl) => looksLikeImageUrl(candidateUrl) || element.hasAttribute('style')
    );

    const width = Number(element.clientWidth || 0);
    const height = Number(element.clientHeight || 0);
    const alt =
      element.getAttribute('aria-label') ||
      element.getAttribute('data-title') ||
      element.getAttribute('title') ||
      '';

    for (const candidateUrl of candidates) {
      extraNodeCandidates.push({
        rawUrl: candidateUrl,
        width,
        height,
        alt,
        title: element.getAttribute('title') || ''
      });
    }
  }
  await processWithConcurrencyLimit(extraNodeCandidates, sizeProbeConcurrency, (candidate) =>
    registerCandidate(candidate)
  );

  const pageId = buildPageId();

  return {
    pageId,
    pageTitle: normalizeText(document.title) || pageId,
    images: Array.from(uniqueImages.values())
  };
}
