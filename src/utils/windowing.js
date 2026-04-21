import { FILES } from "../data/filesystem";
import { SATELLITE_DISH, WINDOW_PRESETS } from "../constants/ui";

export const ROOT_WINDOW_FILE_ID = "root";

export function createWindow(fileId, nextZRef, offsetRef, centered = false) {
  const file = FILES[fileId];
  const preset = WINDOW_PRESETS[file?.type] ?? WINDOW_PRESETS.text;
  const offset = offsetRef.current % 6;
  offsetRef.current += 1;
  const satellite = SATELLITE_DISH[offset] ?? {
    x: 180 + offset * 28,
    y: 120 + offset * 24,
  };
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : preset.width + 96;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : preset.height + 120;
  const unclampedX = centered ? 74 : satellite.x;
  const unclampedY = centered ? 72 : satellite.y;
  const maxX = Math.max(24, viewportWidth - preset.width - 24);
  const maxY = Math.max(76, viewportHeight - preset.height - 84);

  return {
    windowId: `${fileId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fileId,
    x: Math.min(maxX, Math.max(24, unclampedX)),
    y: Math.min(maxY, Math.max(76, unclampedY)),
    width: centered ? 930 : preset.width,
    height: centered ? 560 : preset.height,
    zIndex: nextZRef.current++,
    minimized: false,
    isRootWindow: centered,
    selectedChildId: file?.type === "folder" ? (file.items[0] ?? null) : null,
  };
}
