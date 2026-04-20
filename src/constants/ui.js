export const FALLBACK_BACKGROUND_VIDEO =
  "https://samplelib.com/mp4/sample-5s-360p.mp4";

export const WINDOW_PRESETS = {
  folder: { width: 760, height: 500 },
  text: { width: 520, height: 380 },
  image: { width: 460, height: 430 },
  video: { width: 760, height: 520 },
  audio: { width: 420, height: 300 },
};

export const SATELLITE_DISH = [
  { x: 742, y: 118 },
  { x: 694, y: 164 },
  { x: 658, y: 212 },
  { x: 126, y: 168 },
  { x: 170, y: 226 },
  { x: 612, y: 110 },
];

export const MENU_CONFIG = [
  {
    id: "file",
    label: "File",
    items: [
      { id: "open-root", label: "Open main window" },
      { id: "open-selected", label: "Open selected" },
      { id: "fullscreen", label: "Toggle fullscreen" },
      { id: "restart", label: "Logout" },
    ],
  },
  {
    id: "media",
    label: "Media",
    items: [
      { id: "play-pause", label: "Play or pause" },
      { id: "stop", label: "Stop" },
    ],
  },
];
