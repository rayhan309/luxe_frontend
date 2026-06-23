const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const IMAGEKIT_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

export function getApiOrigin(): string {
  return API_BASE_URL.replace(/\/api\/v1\/?$/, '');
}

export function isImageKitUrl(url: string): boolean {
  if (!url) return false;
  if (IMAGEKIT_ENDPOINT && url.startsWith(IMAGEKIT_ENDPOINT)) return true;
  return url.includes('ik.imagekit.io');
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const origin = getApiOrigin();
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
}
