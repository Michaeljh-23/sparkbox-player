import { useEffect, useState } from "react";
import { FILES } from "../data/filesystem";
import { labelFileType } from "../utils/fileMetadata";

export default function FolderView({
  file,
  parentFile,
  selectedChildId,
  onOpenFile,
  onSelectChild,
}) {
  const supportsSingleTapOpen =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;
  const items = file.items.map((itemId) => FILES[itemId]).filter(Boolean);
  const firstItemId = items[0]?.id ?? null;
  const [localSelectedChildId, setLocalSelectedChildId] = useState(
    selectedChildId ?? firstItemId,
  );

  useEffect(() => {
    setLocalSelectedChildId((current) => {
      if (selectedChildId) return selectedChildId;
      if (!current) return firstItemId;
      if (items.some((item) => item.id === current)) return current;
      return firstItemId;
    });
  }, [file.id, firstItemId, selectedChildId]);

  const effectiveSelectedChildId = onSelectChild
    ? selectedChildId
    : localSelectedChildId;
  const selectedChild =
    items.find((item) => item.id === effectiveSelectedChildId) ?? items[0];
  const audioCount = items.filter((item) => item.type === "audio").length;
  const mediaSectionButtons =
    file.id === "sparkbox-mixes" || file.id === "sparkbox-spin-tactics"
      ? [
          { id: "sparkbox-mixes", label: "Mixes" },
          { id: "sparkbox-spin-tactics", label: "Spin Tactics" },
        ]
      : [];

  const handleSelectChild = (childId) => {
    setLocalSelectedChildId(childId);
    onSelectChild?.(childId);
  };

  return (
    <div className="explorer-shell">
      <div className="host-banner">
        <div className="host-brand-row">
          <img
            className="host-brand-asset"
            src="/media/images/super-sparkbox-bros.png"
            alt="DJ Sparkbox"
          />
          <h1>{file.name}</h1>
        </div>
      </div>
      <div className="explorer-toolbar">
        <div className="explorer-toolbar-copy">
          <strong>{parentFile.name}</strong>
          <span>
            {audioCount > 0
              ? `${audioCount} tracks loaded`
              : `${items.length} files loaded`}
          </span>
        </div>
      </div>
      <div className="explorer-main">
        <aside className="explorer-sidebar">
          {mediaSectionButtons.length > 0 ? (
            mediaSectionButtons.map((button) => (
              <button
                key={button.id}
                type="button"
                className={`sidebar-item sidebar-item-section ${file.id === button.id ? "is-active" : ""}`}
                onClick={() => onOpenFile(button.id)}
              >
                {button.label}
              </button>
            ))
          ) : (
            <button type="button" className="sidebar-item is-active">
              Library
            </button>
          )}
          <div className="sidebar-monitor">
            <span className="monitor-line" />
            <span className="monitor-line short" />
            <span className="monitor-line" />
          </div>
        </aside>
        <div className="explorer-list">
          <div className="explorer-columns">
            <span>File</span>
            <span>Type</span>
            <span>Flag</span>
          </div>
          <div className="explorer-rows">
            {items.map((child) => (
              <button
                key={child.id}
                className={`explorer-row ${selectedChild?.id === child.id ? "is-selected" : ""}`}
                type="button"
                onClick={() => {
                  handleSelectChild(child.id);
                  if (supportsSingleTapOpen) {
                    onOpenFile(child.id);
                  }
                }}
                onDoubleClick={() => onOpenFile(child.id)}
              >
                <span className="explorer-file-name">
                  <span
                    className={`icon-art icon-${child.type} is-compact`}
                    aria-hidden="true"
                  />
                  <span>{child.name}</span>
                </span>
                <span>{labelFileType(child.type)}</span>
                <span>
                  {child.type === "audio"
                    ? "ready"
                    : child.type === "video"
                      ? "play"
                      : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="explorer-preview">
        {selectedChild ? (
          <>
            <p className="preview-kicker">Preview</p>
            <h3>{selectedChild.name}</h3>
            <p>
              {selectedChild.note ||
                selectedChild.caption ||
                selectedChild.summary}
            </p>
            <div className="preview-meta">
              <span>{labelFileType(selectedChild.type)}</span>
            </div>
          </>
        ) : (
          <p className="preview-kicker">No item selected</p>
        )}
      </div>
    </div>
  );
}
