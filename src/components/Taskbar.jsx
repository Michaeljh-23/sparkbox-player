import { FILES } from "../data/filesystem";

export default function Taskbar({
  currentTrack,
  isPlaying,
  mainView,
  mainViewMinimized,
  openWindows,
  playbackPosition,
  trackDuration,
  onSeek,
  onToggleMainView,
  onTogglePlayback,
  onToggleWindow,
}) {
  const maxDuration = trackDuration > 0 ? trackDuration : 0;
  const safePosition = Math.min(
    playbackPosition,
    maxDuration || playbackPosition,
  );

  return (
    <footer className="taskbar">
      <div className="taskbar-left">
        <div>
          <span className="now-playing-label">Now playing </span>
          <strong>{currentTrack ? currentTrack.name : "Silence"}</strong>
        </div>
        <button
          className="transport-pill"
          type="button"
          onClick={onTogglePlayback}
          disabled={!currentTrack}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      {currentTrack ? (
        <div className="taskbar-progress">
          <span className="taskbar-time">{formatTime(safePosition)}</span>
          <input
            className="taskbar-scrubber"
            type="range"
            min="0"
            max={maxDuration || 1}
            step="0.1"
            value={safePosition}
            disabled={!maxDuration}
            onChange={(event) => onSeek(Number(event.target.value))}
            style={{
              "--progress":
                maxDuration > 0 ? `${(safePosition / maxDuration) * 100}%` : "0%",
            }}
          />
          <span className="taskbar-time">{formatTime(maxDuration)}</span>
        </div>
      ) : null}
      <div className="task-list">
        {mainView ? (
          <button
            className={`task-chip ${mainViewMinimized ? "is-minimized" : ""}`}
            type="button"
            onClick={onToggleMainView}
          >
            {mainView.name}
          </button>
        ) : null}
        {openWindows.map((windowItem) => (
          <button
            key={windowItem.windowId}
            className={`task-chip ${windowItem.minimized ? "is-minimized" : ""}`}
            type="button"
            onClick={() => onToggleWindow(windowItem.windowId)}
          >
            {FILES[windowItem.fileId].name}
          </button>
        ))}
      </div>
    </footer>
  );
}

function formatTime(value) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
