import { FILES } from "../data/filesystem";

export function syncAudioSource(trackId, audio) {
  const track = FILES[trackId];
  if (!track?.src) return;

  if (audio.dataset.trackId === trackId) return;

  audio.src = track.src;
  audio.dataset.trackId = trackId;
  audio.load();
}
