import { FILES } from "../data/filesystem";

export function syncAudioSource(trackId, audio) {
  const track = FILES[trackId];
  if (!track?.src) return;

  if (audio.dataset.trackId === trackId) return;

  if (/^https?:\/\//i.test(track.src)) {
    audio.crossOrigin = "anonymous";
  } else {
    audio.removeAttribute("crossorigin");
  }

  audio.src = track.src;
  audio.dataset.trackId = trackId;
  audio.load();
}
