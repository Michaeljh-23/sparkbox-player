export default function DesktopIcon({
  file,
  isSelected,
  style,
  onOpen,
  onSelect,
}) {
  const supportsSingleTapOpen =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;

  return (
    <button
      className={`desktop-icon ${isSelected ? "is-selected" : ""}`}
      type="button"
      style={style}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
        if (supportsSingleTapOpen) {
          onOpen();
        }
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
    >
      <span className={`icon-art icon-${file.type}`} aria-hidden="true" />
      <span className="icon-label">{file.name}</span>
    </button>
  );
}
