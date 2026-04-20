import FolderView from "./FolderView";

export default function FileView({
  file,
  parentFile,
  onOpenFile,
  selectedChildId,
  onSelectChild,
  currentTrackId,
  isPlaying,
  barLevels,
}) {
  if (file.type === "folder") {
    return (
      <FolderView
        file={file}
        parentFile={parentFile}
        selectedChildId={selectedChildId}
        onOpenFile={onOpenFile}
        onSelectChild={onSelectChild}
      />
    );
  }

  if (file.type === "text") {
    return file.socialLinks?.length ? (
      <AboutCard file={file} />
    ) : (
      <pre className="text-file">{file.content}</pre>
    );
  }

  if (file.type === "image") {
    return (
      <div className="gif-panel">
        <div className="image-stage">
          <img className="image-stage-asset" src={file.src} alt={file.name} />
        </div>
        <p>{file.caption}</p>
      </div>
    );
  }

  if (file.type === "video") {
    return (
      <div className="video-panel">
        <div className="video-stage">
          <video
            className="video-stage-asset"
            src={file.src}
            controls
            autoPlay
            playsInline
          />
        </div>
        <p>{file.caption}</p>
      </div>
    );
  }

  if (file.type === "audio") {
    const isCurrentTrack = currentTrackId === file.id;

    return (
      <div className="audio-card">
        <p className="audio-label">
          {isCurrentTrack ? "TRACK LOADED" : "AUDIO FILE READY"}
        </p>
        <h2>{file.name}</h2>
        <p>{file.note}</p>
        <div className="track-wave" aria-hidden="true">
          {(barLevels.length
            ? barLevels.slice(0, 24)
            : Array.from({ length: 24 }, () => 0.12)
          ).map((level, index) => (
            <span
              key={index}
              className={isCurrentTrack && isPlaying ? "is-live" : ""}
              style={{
                animationDelay: `${index * 0.04}s`,
                height: `${20 + Math.round(level * 84)}px`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function AboutCard({ file }) {
  const paragraphs = file.content.split("\n\n").filter(Boolean);

  return (
    <div className="about-card">
      <p className="audio-label">About</p>
      <h2>DJ Sparkbox</h2>
      <div className="about-copy">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="social-strip" aria-label="DJ Sparkbox socials">
        {file.socialLinks.map((link) => (
          <a
            key={link.id}
            className={`social-link social-link-${link.id}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
          >
            <SocialIcon type={link.id} />
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ type }) {
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.2" cy="6.9" r="1.1" className="social-dot" />
      </svg>
    );
  }

  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.7 20v-6.2h2.5l.4-2.8h-2.9V9.2c0-.8.3-1.4 1.5-1.4h1.6V5.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.3-3.8 3.9V11H8.4v2.8h2.4V20z" />
      </svg>
    );
  }

  if (type === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.6 4.5c.4 1.5 1.4 2.7 2.9 3.4v2.6c-1-.1-2-.5-2.9-1.1v5.2c0 2.6-1.8 4.7-4.7 4.7-2.4 0-4.4-1.8-4.4-4.2 0-2.7 2.1-4.5 4.8-4.5.2 0 .4 0 .6.1v2.6c-.2-.1-.4-.1-.6-.1-1.2 0-2.1.8-2.1 1.9 0 1 .8 1.9 1.9 1.9 1.3 0 1.8-1 1.8-2V4.5z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 14.4h2.2a3.2 3.2 0 0 0 6.3.6h4.4a2.1 2.1 0 1 0 0-4.2h-.3a5.2 5.2 0 0 0-9.6-1.9A4.1 4.1 0 0 0 5 14.4z" />
      <path d="M4.4 16.8h10.8" />
      <path d="M4.4 19h14.8" />
    </svg>
  );
}
