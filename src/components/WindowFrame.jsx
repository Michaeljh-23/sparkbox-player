import { useEffect, useRef } from "react";
import FileView from "./FileView";

export default function WindowFrame({
  file,
  windowItem,
  onBringToFront,
  onClose,
  onMinimize,
  onMove,
  onOpenFile,
  currentTrackId,
  isPlaying,
  barLevels,
  onUpdateWindow,
}) {
  const dragStateRef = useRef(null);
  const theme = file.visualTheme ?? {
    accent: "#f6ddb0",
    glow: "rgba(246, 221, 176, 0.16)",
  };

  const handlePointerMove = (event) => {
    if (!dragStateRef.current) return;
    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;
    onMove({
      x: Math.max(24, dragStateRef.current.originX + deltaX),
      y: Math.max(76, dragStateRef.current.originY + deltaY),
    });
  };

  const handlePointerUp = () => {
    dragStateRef.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <section
      className={`window-frame ${windowItem.isRootWindow ? "is-root-window" : "is-satellite-window"}`}
      style={{
        width: windowItem.width,
        height: windowItem.height,
        transform: `translate(${windowItem.x}px, ${windowItem.y}px)`,
        zIndex: windowItem.zIndex,
        "--window-accent": theme.accent,
        "--window-glow": theme.glow,
      }}
      onMouseDown={onBringToFront}
    >
      <div
        className="window-titlebar"
        onPointerDown={(event) => {
          if (windowItem.isRootWindow) return;
          if (event.target.closest(".window-action")) return;
          onBringToFront();
          dragStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: windowItem.x,
            originY: windowItem.y,
          };
          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
        }}
      >
        <span className="window-title">{file.name}</span>
        <div className="window-actions">
          {!windowItem.isRootWindow && (
            <button
              className="window-action is-minimize"
              type="button"
              aria-label="Minimize window"
              onClick={onMinimize}
            />
          )}
          <button
            className="window-action is-close"
            type="button"
            aria-label="Close window"
            onClick={onClose}
          />
        </div>
      </div>
      <div className="window-body">
        <FileView
          file={file}
          parentFile={file}
          selectedChildId={windowItem.selectedChildId}
          onOpenFile={onOpenFile}
          onSelectChild={(childId) =>
            onUpdateWindow({ selectedChildId: childId })
          }
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          barLevels={barLevels}
        />
      </div>
    </section>
  );
}
