// src/utils.ts
import { BANNED_KEYWORDS, BANNED_IMAGE_URLS, LATEST_PATCHES } from './constants';

export function censorText(text: string | null | undefined): string {
    if (!text) return '';
    const regex = new RegExp(BANNED_KEYWORDS.join('|'), 'gi');
    return text.replace(regex, 'РКН не одобряет');
}

export function moderateHtmlString(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');

    images.forEach(img => {
        if (img.src && BANNED_IMAGE_URLS.includes(img.src)) {
            const domain = new URL(img.src).hostname;
            const placeholder = doc.createElement('div');
            placeholder.className = 'moderated-image-placeholder';
            placeholder.innerHTML = `<p>Изображение с ${domain} заблокировано по требованию РКН</p>`;
            img.parentNode?.replaceChild(placeholder, img);
        }
    });
    return doc.body.innerHTML;
}

export function groupGameVersions(versions: string[], options: { useXNotation?: boolean } = {}): string[] {
  const { useXNotation = false } = options;
  if (!versions || versions.length === 0) return [];
  const stableVersions = versions
    .filter((v: string) => /^\d+\.\d+(\.\d+)?$/.test(v))
    .sort((a: string, b: string) => b.localeCompare(a, undefined, { numeric: true }));
  const groups: { [prefix: string]: number[] } = {};
  for (const version of stableVersions) {
    const parts = version.split('.');
    const prefix = `${parts[0]}.${parts[1]}`;
    const patch = parts.length > 2 ? parseInt(parts[2], 10) : 0;
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(patch);
  }
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .flatMap(prefix => {
      const patches: number[] = [...new Set(groups[prefix])].sort((a, b) => a - b);
      if (patches.length === 0) return [];
      const latestKnownPatch = LATEST_PATCHES[prefix];
      const ranges: string[] = [];
      let start = patches[0];
      for (let i = 1; i <= patches.length; i++) {
        if (i === patches.length || patches[i] > patches[i-1] + 1) {
          const end = patches[i-1];
          const isFullRange = useXNotation && start === 0 && latestKnownPatch !== undefined && end >= latestKnownPatch;
          if (isFullRange) {
            ranges.push(`${prefix}.x`);
          } else {
            const startLabel = (start === 0) ? prefix : `${prefix}.${start}`;
            const endLabel = `${prefix}.${end}`;
            if (startLabel === endLabel) {
              ranges.push(startLabel);
            } else {
              ranges.push(`${startLabel} - ${endLabel}`);
            }
          }
          if (i < patches.length) {
            start = patches[i];
          }
        }
      }
      return ranges;
    });
}

export const formatNumber = (num: number): string => {
  if (!num) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toString();
};

export const timeAgo = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? 's' : ''} ago`;
  return `${Math.floor(seconds)} second${Math.floor(seconds) !== 1 ? 's' : ''} ago`;
};
