const RAW_VIDEO_BASE_URL = import.meta.env.VITE_VIDEO_BASE_URL?.trim() ?? "";

const VIDEO_BASE_URL = RAW_VIDEO_BASE_URL.replace(/\/+$/, "");

export function videoUrl(remotePath, localPath = remotePath) {
  if (!remotePath) return remotePath;
  if (/^https?:\/\//i.test(remotePath)) return remotePath;

  const remoteNormalizedPath = remotePath.startsWith("/")
    ? remotePath
    : `/${remotePath}`;
  const localNormalizedPath = localPath.startsWith("/")
    ? localPath
    : `/${localPath}`;

  return VIDEO_BASE_URL
    ? `${VIDEO_BASE_URL}${remoteNormalizedPath}`
    : localNormalizedPath;
}
