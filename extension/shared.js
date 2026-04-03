(function bootstrapShared(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.WindShared = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SETTINGS_VERSION = 4;

  const DEFAULT_OPTIONS = {
    minWidth: 1200,
    minHeight: 1200,
    rootFolder: 'wind_images',
    onlyCurrentWindow: false
  };

  const ALLOWED_IMAGE_EXTENSIONS = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.bmp',
    '.avif'
  ]);

  function parsePositiveInteger(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
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

  function normalizeOptions(rawOptions) {
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

  function getExtensionFromUrl(url) {
    try {
      const pathname = new URL(url).pathname;
      const match = pathname.match(/\.([a-zA-Z0-9]{2,5})$/);

      if (!match) {
        return '.jpg';
      }

      const extension = `.${match[1].toLowerCase()}`;
      return ALLOWED_IMAGE_EXTENSIONS.has(extension) ? extension : '.jpg';
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
    return `${rootFolder}/${folderName}/${String(index + 1).padStart(
      3,
      '0'
    )}_${baseName}_${sizePart}${extension}`;
  }

  return {
    SETTINGS_VERSION,
    DEFAULT_OPTIONS,
    parsePositiveInteger,
    sanitizeSegment,
    normalizeOptions,
    canScanTabUrl,
    getExtensionFromUrl,
    extractPageIdFromUrl,
    buildFolderName,
    buildDownloadFilename
  };
});
