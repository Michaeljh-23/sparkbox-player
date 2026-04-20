import { useEffect, useMemo, useRef, useState } from "react";
import Desktop from "./components/Desktop";
import BootScreen from "./components/BootScreen";
import LoginScreen from "./components/LoginScreen";
import { DESKTOP_LAYOUT, FILES, PASSWORD } from "./data/filesystem";
import { syncAudioSource } from "./utils/audio";
import { toggleFullscreen } from "./utils/fullscreen";
import { formatClock } from "./utils/formatting";
import { createWindow, ROOT_WINDOW_FILE_ID } from "./utils/windowing";

export default function App() {
  const [phase, setPhase] = useState("boot");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [battery, setBattery] = useState(87);
  const [clock, setClock] = useState(() => formatClock());
  const [selectedDesktopId, setSelectedDesktopId] = useState(null);
  const [mainViewId, setMainViewId] = useState(null);
  const [mainViewWindow, setMainViewWindow] = useState({
    minimized: false,
    x: 0,
    y: 0,
  });
  const [openWindows, setOpenWindows] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [barLevels, setBarLevels] = useState(() =>
    Array.from({ length: 36 }, () => 0.14),
  );
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const animationFrameRef = useRef(0);
  const playbackTransitionRef = useRef(false);
  const nextZRef = useRef(2);
  const offsetRef = useRef(0);

  useEffect(() => {
    if (phase !== "boot") return undefined;
    const timer = window.setTimeout(() => setPhase("login"), 2000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBattery((value) => (value <= 40 ? 92 : value - 1));
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleWindowClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  useEffect(() => {
    if (phase !== "desktop") return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      setActiveMenuId(null);

      setOpenWindows((windows) => {
        if (windows.length > 0) {
          let topWindow = windows[0];

          for (const windowItem of windows) {
            if (windowItem.zIndex >= topWindow.zIndex) {
              topWindow = windowItem;
            }
          }

          return windows.filter(
            (windowItem) => windowItem.windowId !== topWindow.windowId,
          );
        }

        if (mainViewId) {
          setMainViewId(null);
        }

        return windows;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, mainViewId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrackId) {
      audio.pause();
      delete audio.dataset.trackId;
      audio.removeAttribute("src");
      audio.load();
      setPlaybackPosition(0);
      setTrackDuration(0);
      return;
    }

    syncAudioSource(currentTrackId, audio);
  }, [currentTrackId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackId) return;

    if (isPlaying) {
      ensureAudioAnalysis().then(() => {
        audio.play().catch(() => {
          setIsPlaying(false);
          setPlaybackError(
            "Playback was blocked or the file could not be loaded.",
          );
        });
      });
      return;
    }

    audio.pause();
  }, [currentTrackId, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => {
      if (playbackTransitionRef.current) return;
      setIsPlaying(false);
    };
    const handlePlay = async () => {
      try {
        await ensureAudioAnalysis();
      } catch {
        // Ignore analysis setup failures so playback can continue.
        //ugh
      }
      setIsPlaying(true);
    };
    const handleTimeUpdate = () => {
      setPlaybackPosition(audio.currentTime || 0);
    };
    const handleDurationChange = () => {
      setTrackDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("durationchange", handleDurationChange);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("durationchange", handleDurationChange);
    };
  }, []);

  useEffect(() => {
    const updateBars = () => {
      const analyser = analyserRef.current;
      if (analyser && isPlaying) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        setBarLevels((levels) =>
          levels.map((previousLevel, index) => {
            const start = Math.floor((index / levels.length) * data.length);
            const end = Math.max(
              start + 1,
              Math.floor(((index + 1) / levels.length) * data.length),
            );
            let total = 0;

            for (let bucket = start; bucket < end; bucket += 1) {
              total += data[bucket];
            }

            const average = total / Math.max(1, end - start);
            const nextLevel = Math.max(0.06, average / 255);
            return previousLevel * 0.34 + nextLevel * 0.66;
          }),
        );
      } else {
        setBarLevels((levels) =>
          levels.map((_, index) => 0.12 + (index % 7) * 0.015),
        );
      }
      animationFrameRef.current = window.requestAnimationFrame(updateBars);
    };

    animationFrameRef.current = window.requestAnimationFrame(updateBars);
    return () => window.cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying]);

  const currentTrack = currentTrackId ? FILES[currentTrackId] : null;

  const ensureAudioAnalysis = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.72;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  const visibleDesktopItems = useMemo(
    () =>
      DESKTOP_LAYOUT.map((entry) => ({
        ...entry,
        file: FILES[entry.id],
      })),
    [],
  );

  const handleLogin = () => {
    if (password.trim().toLowerCase() === PASSWORD) {
      setMainViewId(null);
      setPhase("desktop");
      setLoginError(false);
      setPassword("");
      setSelectedDesktopId(ROOT_WINDOW_FILE_ID);
      return;
    }

    setLoginError(true);
  };

  const bringToFront = (windowId) => {
    const nextZ = nextZRef.current++;
    setOpenWindows((windows) =>
      windows.map((windowItem) =>
        windowItem.windowId === windowId
          ? { ...windowItem, zIndex: nextZ, minimized: false }
          : windowItem,
      ),
    );
  };

  const playTrack = async (trackId) => {
    const audio = audioRef.current;
    const track = FILES[trackId];
    if (!audio || !track?.src) return;

    try {
      const isSameTrack =
        currentTrackId === trackId && audio.dataset.trackId === trackId;

      playbackTransitionRef.current = true;
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      audio.preload = "auto";

      if (!isSameTrack) {
        syncAudioSource(trackId, audio);
      }

      audio.currentTime = 0;

      setCurrentTrackId(trackId);
      setIsPlaying(true);
      setPlaybackError("");
      setPlaybackPosition(0);

      await ensureAudioAnalysis();
      await audio.play();
      playbackTransitionRef.current = false;
    } catch {
      playbackTransitionRef.current = false;
      setIsPlaying(false);
      setPlaybackError("Playback was blocked or the file could not be loaded.");
    }
  };

  const restartTrack = async (trackId) => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      playbackTransitionRef.current = true;
      setCurrentTrackId(trackId);
      setPlaybackError("");
      syncAudioSource(trackId, audio);
      audio.currentTime = 0;
      setPlaybackPosition(0);
      await ensureAudioAnalysis();
      await audio.play();
      setIsPlaying(true);
      playbackTransitionRef.current = false;
    } catch {
      playbackTransitionRef.current = false;
      setIsPlaying(false);
      setPlaybackError("Playback was blocked or the file could not be loaded.");
    }
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaybackPosition(0);
    setIsPlaying(false);
  };

  const resumePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrackId) return;

    try {
      playbackTransitionRef.current = true;
      setPlaybackError("");
      await ensureAudioAnalysis();
      await audio.play();
      setIsPlaying(true);
      playbackTransitionRef.current = false;
    } catch {
      playbackTransitionRef.current = false;
      setIsPlaying(false);
      setPlaybackError("Playback was blocked or the file could not be loaded.");
    }
  };

  const openFile = (fileId) => {
    const file = FILES[fileId];
    if (!file) return;

    if (file.type === "folder") {
      setMainViewId(fileId);
      setMainViewWindow((current) => ({ ...current, minimized: false }));
      return;
    }

    if (file.type === "audio") {
      setOpenWindows((windows) => {
        const nonMediaWindows = windows.filter((item) => {
          const itemType = FILES[item.fileId]?.type;
          return itemType !== "audio" && itemType !== "video";
        });
        const existingAudioWindow = windows.find(
          (item) => item.fileId === fileId,
        );

        if (existingAudioWindow) {
          const nextZ = nextZRef.current++;
          return [
            ...nonMediaWindows,
            { ...existingAudioWindow, minimized: false, zIndex: nextZ },
          ];
        }

        return [...nonMediaWindows, createWindow(fileId, nextZRef, offsetRef)];
      });

      if (currentTrackId === fileId && isPlaying) {
        restartTrack(fileId);
        return;
      }

      playTrack(fileId);
      return;
    }

    if (file.type === "video") {
      stopPlayback();
      setCurrentTrackId(null);
      setPlaybackError("");
      setOpenWindows((windows) => {
        const nonMediaWindows = windows.filter((item) => {
          const itemType = FILES[item.fileId]?.type;
          return itemType !== "audio" && itemType !== "video";
        });

        return [...nonMediaWindows, createWindow(fileId, nextZRef, offsetRef)];
      });
      return;
    }

    setOpenWindows((windows) => {
      const existing = windows.find((item) => item.fileId === fileId);
      if (existing) {
        return windows.map((item) =>
          item.windowId === existing.windowId
            ? { ...item, zIndex: nextZRef.current++, minimized: false }
            : item,
        );
      }

      return [...windows, createWindow(fileId, nextZRef, offsetRef)];
    });
  };

  const closeWindow = (windowId) => {
    setOpenWindows((windows) =>
      windows.filter((item) => item.windowId !== windowId),
    );
  };

  const moveWindow = (windowId, position) => {
    setOpenWindows((windows) =>
      windows.map((item) =>
        item.windowId === windowId ? { ...item, ...position } : item,
      ),
    );
  };

  const updateWindow = (windowId, updates) => {
    setOpenWindows((windows) =>
      windows.map((item) =>
        item.windowId === windowId ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleTaskbarWindowToggle = (windowId) => {
    const targetWindow = openWindows.find((item) => item.windowId === windowId);
    if (!targetWindow) return;

    if (targetWindow.minimized) {
      bringToFront(windowId);
      return;
    }

    const topVisibleZ = openWindows.reduce((highest, item) => {
      if (item.minimized) return highest;
      return Math.max(highest, item.zIndex);
    }, 0);

    if (targetWindow.zIndex < topVisibleZ) {
      bringToFront(windowId);
      return;
    }

    updateWindow(windowId, { minimized: true });
  };

  const togglePlayback = () => {
    if (!currentTrackId) return;

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    resumePlayback();
  };

  const restartSystem = () => {
    stopPlayback();
    setCurrentTrackId(null);
    setOpenWindows([]);
    setSelectedDesktopId(null);
    setMainViewId(null);
    setMainViewWindow({ minimized: false, x: 0, y: 0 });
    setActiveMenuId(null);
    setLoginError(false);
    setPassword("");
    setPhase("boot");
  };

  const handleMenuAction = async (actionId) => {
    if (actionId === "open-root") {
      setMainViewId(ROOT_WINDOW_FILE_ID);
      setMainViewWindow((current) => ({ ...current, minimized: false }));
    }
    if (actionId === "open-selected" && selectedDesktopId) {
      openFile(selectedDesktopId);
    }
    if (actionId === "restart") {
      restartSystem();
    }
    if (actionId === "play-pause") {
      togglePlayback();
    }
    if (actionId === "stop") {
      stopPlayback();
    }
    if (actionId === "fullscreen") {
      await toggleFullscreen();
    }

    setActiveMenuId(null);
  };

  const handleSeek = (nextTime) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(nextTime)) return;
    audio.currentTime = nextTime;
    setPlaybackPosition(nextTime);
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" className="global-audio-player" />
      <div className="app-shell">
        {phase === "boot" && <BootScreen />}
        {phase === "login" && (
          <LoginScreen
            password={password}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            showError={loginError}
          />
        )}
        {phase === "desktop" && (
          <Desktop
            activeMenuId={activeMenuId}
            clock={clock}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            barLevels={barLevels}
            mainView={FILES[mainViewId]}
            mainViewWindow={mainViewWindow}
            openWindows={openWindows}
            playbackError={playbackError}
            playbackPosition={playbackPosition}
            selectedDesktopId={selectedDesktopId}
            trackDuration={trackDuration}
            visibleDesktopItems={visibleDesktopItems}
            onActivateMenu={setActiveMenuId}
            onBringToFront={bringToFront}
            onCloseWindow={closeWindow}
            onMenuAction={handleMenuAction}
            onMoveWindow={moveWindow}
            onOpenFile={openFile}
            onCloseMainView={() => setMainViewId(null)}
            onMinimizeMainView={() =>
              setMainViewWindow((current) => ({ ...current, minimized: true }))
            }
            onMoveMainView={(position) =>
              setMainViewWindow((current) => ({ ...current, ...position }))
            }
            onSelectDesktop={setSelectedDesktopId}
            onSeek={handleSeek}
            onTogglePlayback={togglePlayback}
            onToggleMainView={() =>
              setMainViewWindow((current) => ({
                ...current,
                minimized: !current.minimized,
              }))
            }
            onToggleWindow={handleTaskbarWindowToggle}
            onUpdateWindow={updateWindow}
          />
        )}
      </div>
    </>
  );
}
// ily :)
