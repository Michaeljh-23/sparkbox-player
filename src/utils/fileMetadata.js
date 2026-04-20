export function labelFileType(type) {
  const labels = {
    folder: "folder",
    text: "text",
    image: "visual",
    video: "video",
    audio: "audio",
  };

  return labels[type] ?? type;
}
