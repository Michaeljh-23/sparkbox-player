import { FILES } from "../data/filesystem";
import BackgroundVisualizer from "./BackgroundVisualizer";
import DesktopIcon from "./DesktopIcon";
import MainHostPanel from "./MainHostPanel";
import MenuBar from "./MenuBar";
import Taskbar from "./Taskbar";
import WindowFrame from "./WindowFrame";

export default function Desktop({
  activeMenuId,
  allowHiddenFiles,
  clock,
  currentTrack,
  showHiddenFiles,
  volume,
  isPlaying,
  barLevels,
  mainView,
  mainViewWindow,
  openWindows,
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
  onMoveDesktopItem,
  onSelectDesktop,
  onSeek,
  onVolumeChange,
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
        allowHiddenFiles={allowHiddenFiles}
        clock={clock}
        currentTrack={currentTrack}
        showHiddenFiles={showHiddenFiles}
        volume={volume}
        onVolumeChange={onVolumeChange}
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
          volume={volume}
          onClose={onCloseMainView}
          onMinimize={onMinimizeMainView}
          onMove={onMoveMainView}
          onOpenFile={onOpenFile}
        />
      ) : null}

      <div className="desktop-icons">
        {visibleDesktopItems.map(({ id, file, position }) => (
          <DesktopIcon
            key={id}
            fileId={id}
            file={file}
            isSelected={selectedDesktopId === id}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            onMove={(nextPosition) => onMoveDesktopItem(id, nextPosition)}
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
              volume={volume}
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
