import { MENU_CONFIG } from "../constants/ui";

export default function MenuBar({
  activeMenuId,
  clock,
  currentTrack,
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
                {menu.items.map((item) => (
                  <button
                    key={item.id}
                    className="menu-dropdown-item"
                    type="button"
                    onClick={() => onMenuAction(item.id)}
                  >
                    {item.label}
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
        <span>{currentTrack ? currentTrack.name : "No file playing"}</span>
        <span>{clock}</span>
      </div>
    </header>
  );
}
