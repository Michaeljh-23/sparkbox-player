export function labelFileType(type) {
  const labels = {
    folder: "folder",
    text: "text",
    image: "visual",
    video: "video",
    audio: "audio",
    game: "game",
  };

  return labels[type] ?? type;
}
