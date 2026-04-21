import { MENU_CONFIG } from "../constants/ui";

export default function MenuBar({
  activeMenuId,
  allowHiddenFiles,
  clock,
  currentTrack,
  showHiddenFiles,
  volume,
  onVolumeChange,
  onActivateMenu,
  onMenuAction,
}) {
  return (
    <header className="menu-bar">
      <div className="menu-root">
        {MENU_CONFIG.map((menu) => (
          <div
            key={menu.id}
            className="menu-cluster"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={`menu-trigger ${activeMenuId === menu.id ? "is-active" : ""}`}
              type="button"
              onClick={() =>
                onActivateMenu((current) =>
                  current === menu.id ? null : menu.id,
                )
              }
            >
              {menu.label}
            </button>
            {activeMenuId === menu.id && (
              <div className="menu-dropdown">
                {menu.items
                  .filter(
                    (item) => item.id !== "toggle-hidden" || allowHiddenFiles,
                  )
                  .map((item) => (
                  <button
                    key={item.id}
                    className="menu-dropdown-item"
                    type="button"
                    onClick={() => onMenuAction(item.id)}
                  >
                    {item.id === "toggle-hidden"
                      ? showHiddenFiles
                        ? "Hide hidden files"
                        : "Show hidden files"
                      : item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="menu-brand-mark" aria-hidden="true">
        <img src="/media/logos/spx-logo-white.png" alt="" />
      </div>
      <div className="status-group">
        <span>{currentTrack ? currentTrack.name : ""}</span>
        <div className="nav-volume">
          <span className="nav-volume-label">Vol</span>
          <input
            className="nav-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            style={{ "--progress": `${volume * 100}%` }}
            aria-label="Volume"
          />
        </div>
        <span>{clock}</span>
      </div>
    </header>
  );
}
