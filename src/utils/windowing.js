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

  return {
    windowId: `${fileId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fileId,
    x: centered ? 74 : satellite.x,
    y: centered ? 72 : satellite.y,
    width: centered ? 930 : preset.width,
    height: centered ? 560 : preset.height,
    zIndex: nextZRef.current++,
    minimized: false,
    isRootWindow: centered,
    selectedChildId: file?.type === "folder" ? (file.items[0] ?? null) : null,
  };
}
