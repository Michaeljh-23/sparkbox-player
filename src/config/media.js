const RAW_VIDEO_BASE_URL = import.meta.env.VITE_VIDEO_BASE_URL?.trim() ?? "";
const RAW_TRACK_BASE_URL = import.meta.env.VITE_TRACK_BASE_URL?.trim() ?? "";

const VIDEO_BASE_URL = RAW_VIDEO_BASE_URL.replace(/\/+$/, "");
const TRACK_BASE_URL = RAW_TRACK_BASE_URL.replace(/\/+$/, "");

function normalizePath(path) {
  if (!path) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

function buildRemoteUrl(baseUrl, path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = normalizePath(path);
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export function videoUrl(remotePath, localPath = remotePath) {
  if (!remotePath) return remotePath;
  if (/^https?:\/\//i.test(remotePath)) return remotePath;

  const remoteNormalizedPath = normalizePath(remotePath);
  const localNormalizedPath = normalizePath(localPath);

  return VIDEO_BASE_URL
    ? `${VIDEO_BASE_URL}${remoteNormalizedPath}`
    : localNormalizedPath;
}

export function trackUrl(remotePath, localPath = remotePath) {
  return buildRemoteUrl(TRACK_BASE_URL, remotePath);
}

export function videoAsset(filename) {
  return buildRemoteUrl(VIDEO_BASE_URL, filename);
}

export function trackAsset(filename) {
  return buildRemoteUrl(TRACK_BASE_URL, filename);
}
