const test = require('node:test');
const assert = require('node:assert/strict');

const {
  DEFAULT_OPTIONS,
  normalizeOptions,
  sanitizeSegment,
  getExtensionFromUrl,
  extractPageIdFromUrl,
  buildFolderName,
  buildDownloadFilename
} = require('../extension/shared.js');

test('normalizeOptions falls back to defaults for invalid values', () => {
  const options = normalizeOptions({
    minWidth: 'abc',
    minHeight: '',
    rootFolder: '  ',
    onlyCurrentWindow: 0
  });

  assert.deepEqual(options, {
    minWidth: DEFAULT_OPTIONS.minWidth,
    minHeight: null,
    rootFolder: DEFAULT_OPTIONS.rootFolder,
    onlyCurrentWindow: false
  });
});

test('normalizeOptions accepts valid positive integers and sanitizes root folder', () => {
  const options = normalizeOptions({
    minWidth: '1600',
    minHeight: '900',
    rootFolder: ' wind:images/demo ',
    onlyCurrentWindow: 1
  });

  assert.equal(options.minWidth, 1600);
  assert.equal(options.minHeight, 900);
  assert.equal(options.rootFolder, 'wind_images_demo');
  assert.equal(options.onlyCurrentWindow, true);
});

test('sanitizeSegment strips invalid characters and collapses separators', () => {
  assert.equal(sanitizeSegment('  a<>:"/\\\\|?*b  '), 'a_b');
  assert.equal(sanitizeSegment('...hello___world...'), 'hello_world...');
  assert.equal(sanitizeSegment('', 10), '');
});

test('getExtensionFromUrl detects supported image extensions', () => {
  assert.equal(getExtensionFromUrl('https://example.com/demo.PNG?x=1'), '.png');
  assert.equal(getExtensionFromUrl('https://example.com/demo.jpeg#hash'), '.jpeg');
  assert.equal(getExtensionFromUrl('https://example.com/demo.txt'), '.jpg');
  assert.equal(getExtensionFromUrl('not-a-url'), '.jpg');
});

test('extractPageIdFromUrl returns the last path segment without html suffix', () => {
  assert.equal(extractPageIdFromUrl('https://example.com/path/to/gallery.html'), 'gallery');
  assert.equal(extractPageIdFromUrl('https://example.com/path/to/'), 'to');
  assert.equal(extractPageIdFromUrl('bad-url'), 'page');
});

test('buildFolderName and buildDownloadFilename remain stable', () => {
  const folderName = buildFolderName('site/page', 'Hello World');
  const filename = buildDownloadFilename(
    'wind_images',
    folderName,
    {
      url: 'https://example.com/images/demo.avif',
      alt: 'cover image',
      title: '',
      width: 1920,
      height: 1080
    },
    0
  );

  assert.equal(folderName, 'site_page_Hello_World');
  assert.equal(filename, 'wind_images/site_page_Hello_World/001_cover_image_1920x1080.avif');
});
