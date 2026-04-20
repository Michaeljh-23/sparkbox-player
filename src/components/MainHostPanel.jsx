import { useEffect, useRef } from "react";
import FileView from "./FileView";

export default function MainHostPanel({
  mainView,
  position,
  onClose,
  onMinimize,
  onMove,
  onOpenFile,
}) {
  const dragStateRef = useRef(null);

  const handlePointerMove = (event) => {
    if (!dragStateRef.current) return;
    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;
    onMove({
      x: dragStateRef.current.originX + deltaX,
      y: dragStateRef.current.originY + deltaY,
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
      className="main-host-panel"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div
        className="main-host-dragbar"
        onPointerDown={(event) => {
          if (event.target.closest(".main-host-close, .main-host-minimize")) {
            return;
          }

          dragStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
          };
          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
        }}
      />
      <button
        className="main-host-minimize"
        type="button"
        aria-label="Minimize window"
        onClick={(event) => {
          event.stopPropagation();
          onMinimize();
        }}
      />
      <button
        className="main-host-close"
        type="button"
        aria-label="Close window"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      />
      <FileView
        file={mainView}
        parentFile={mainView}
        selectedChildId={
          mainView?.type === "folder" ? mainView.items?.[0] : null
        }
        onOpenFile={onOpenFile}
        currentTrackId={null}
        isPlaying={false}
        barLevels={[]}
      />
    </section>
  );
}
