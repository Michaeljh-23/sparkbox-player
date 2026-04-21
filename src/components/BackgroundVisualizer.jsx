import { useEffect, useRef, useState } from "react";
import { FALLBACK_BACKGROUND_VIDEO } from "../constants/ui";

export default function BackgroundVisualizer({
  currentTrack,
  isPlaying,
  barLevels,
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const hasTrackVideo = Boolean(currentTrack?.backgroundVideo);
  const theme = currentTrack?.visualTheme ?? {
    accent: "#f6ddb0",
    glow: "rgba(246, 221, 176, 0.28)",
    hue: 24,
  };
  const videoSrc = hasTrackVideo
    ? currentTrack.backgroundVideo
    : FALLBACK_BACKGROUND_VIDEO;

  useEffect(() => {
    setVideoFailed(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  }, [videoSrc]);

  return (
    <div
      className={`visualizer-backdrop ${isPlaying ? "is-live" : ""}`}
      aria-hidden="true"
      style={{
        "--visual-accent": theme.accent,
        "--visual-glow": theme.glow,
        "--visual-hue": `${theme.hue}deg`,
      }}
    >
      {!videoFailed && (
        <video
          key={videoSrc}
          ref={videoRef}
          className="visualizer-video"
          src={videoSrc}
          autoPlay
          loop
          muted
          defaultMuted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      )}
      <div className="visualizer-gradient" />
      <div className="visualizer-orb visualizer-orb-a" />
      <div className="visualizer-orb visualizer-orb-b" />
      <div
        className={`visualizer-video-frame ${hasTrackVideo ? "has-track-video" : ""}`}
      >
        <div className="visualizer-overlay">
          <p className="visualizer-kicker">
            {currentTrack ? currentTrack.name : "Alternate Earth feed"}
          </p>
          <div className="visualizer-bars">
            {barLevels.map((level, index) => (
              <span
                key={index}
                style={{
                  height: `${22 + Math.round(level * 128)}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
