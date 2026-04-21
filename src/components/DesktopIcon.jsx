import { useEffect, useRef } from "react";

export default function DesktopIcon({
  fileId,
  file,
  isSelected,
  style,
  onMove,
  onOpen,
  onSelect,
}) {
  const supportsSingleTapOpen =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;
  const supportsDesktopDragging = !supportsSingleTapOpen;
  const dragStateRef = useRef(null);
  const suppressClickRef = useRef(false);

  const handlePointerMove = (event) => {
    if (!dragStateRef.current) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      suppressClickRef.current = true;
    }

    onMove({
      x: dragStateRef.current.originX + deltaX,
      y: dragStateRef.current.originY + deltaY,
    });
  };

  const handlePointerUp = () => {
    dragStateRef.current = null;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <button
      className={`desktop-icon ${isSelected ? "is-selected" : ""}`}
      type="button"
      style={style}
      onPointerDown={(event) => {
        if (!supportsDesktopDragging) return;
        if (event.button !== 0) return;

        dragStateRef.current = {
          id: fileId,
          startX: event.clientX,
          startY: event.clientY,
          originX: Number.parseFloat(style.left) || 0,
          originY: Number.parseFloat(style.top) || 0,
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (suppressClickRef.current) return;
        onSelect();
        if (supportsSingleTapOpen) {
          onOpen();
        }
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (suppressClickRef.current) return;
        onOpen();
      }}
    >
      {file.iconSrc ? (
        <span className="icon-art icon-art-custom" aria-hidden="true">
          <img src={file.iconSrc} alt="" />
        </span>
      ) : (
        <span className={`icon-art icon-${file.type}`} aria-hidden="true" />
      )}
      <span className="icon-label">{file.name}</span>
    </button>
  );
}
