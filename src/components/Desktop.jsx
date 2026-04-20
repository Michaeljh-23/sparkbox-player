import { FILES } from "../data/filesystem";
import BackgroundVisualizer from "./BackgroundVisualizer";
import DesktopIcon from "./DesktopIcon";
import MainHostPanel from "./MainHostPanel";
import MenuBar from "./MenuBar";
import Taskbar from "./Taskbar";
import WindowFrame from "./WindowFrame";

export default function Desktop({
  activeMenuId,
  clock,
  currentTrack,
  isPlaying,
  barLevels,
  mainView,
  mainViewWindow,
  openWindows,
  playbackError,
  playbackPosition,
  selectedDesktopId,
  trackDuration,
  visibleDesktopItems,
  onActivateMenu,
  onBringToFront,
  onCloseWindow,
  onMenuAction,
  onMoveWindow,
  onOpenFile,
  onCloseMainView,
  onMinimizeMainView,
  onMoveMainView,
  onSelectDesktop,
  onSeek,
  onTogglePlayback,
  onToggleMainView,
  onToggleWindow,
  onUpdateWindow,
}) {
  return (
    <div
      className="desktop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onSelectDesktop(null);
      }}
    >
      <MenuBar
        activeMenuId={activeMenuId}
        clock={clock}
        currentTrack={currentTrack}
        onActivateMenu={onActivateMenu}
        onMenuAction={onMenuAction}
      />

      <BackgroundVisualizer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        barLevels={barLevels}
      />

      {mainView && !mainViewWindow.minimized ? (
        <MainHostPanel
          mainView={mainView}
          position={mainViewWindow}
          onClose={onCloseMainView}
          onMinimize={onMinimizeMainView}
          onMove={onMoveMainView}
          onOpenFile={onOpenFile}
        />
      ) : null}

      <div className="desktop-icons">
        {visibleDesktopItems.map(({ id, file, x, y }) => (
          <DesktopIcon
            key={id}
            file={file}
            isSelected={selectedDesktopId === id}
            style={{ gridColumn: x + 1, gridRow: y + 1 }}
            onOpen={() => onOpenFile(id)}
            onSelect={() => onSelectDesktop(id)}
          />
        ))}
      </div>

      <div className="windows-layer">
        {openWindows.map((windowItem) =>
          windowItem.minimized ? null : (
            <WindowFrame
              key={windowItem.windowId}
              file={FILES[windowItem.fileId]}
              windowItem={windowItem}
              onBringToFront={() => onBringToFront(windowItem.windowId)}
              onClose={() => onCloseWindow(windowItem.windowId)}
              onMinimize={() =>
                onUpdateWindow(windowItem.windowId, { minimized: true })
              }
              onMove={(position) => onMoveWindow(windowItem.windowId, position)}
              onOpenFile={onOpenFile}
              currentTrackId={currentTrack?.id ?? null}
              isPlaying={isPlaying}
              barLevels={barLevels}
              onUpdateWindow={(updates) =>
                onUpdateWindow(windowItem.windowId, updates)
              }
            />
          ),
        )}
      </div>

      <Taskbar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        mainView={mainView}
        mainViewMinimized={mainViewWindow.minimized}
        openWindows={openWindows}
        playbackError={playbackError}
        playbackPosition={playbackPosition}
        trackDuration={trackDuration}
        onSeek={onSeek}
        onToggleMainView={onToggleMainView}
        onTogglePlayback={onTogglePlayback}
        onToggleWindow={onToggleWindow}
      />
    </div>
  );
}
