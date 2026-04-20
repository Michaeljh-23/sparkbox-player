import { videoUrl } from "../config/media";

const VIDEO_SAMPLES = {
  sparkboxLoop1: videoUrl("/Spx-1-ez.mp4", "/media/video/Spx-1-ez.mp4"),
  sparkboxLoop2: videoUrl("/Spx-2-ez.mp4", "/media/video/Spx-2-ez.mp4"),
  sparkboxLoop3: videoUrl("/Spx-3-ez.mp4", "/media/video/Spx-3-ez.mp4"),
  sparkboxLoop4: videoUrl("/Spx-4-ez.mp4", "/media/video/Spx-4-ez.mp4"),
  sparkboxLoop5: videoUrl("/Spx-5-ez.mp4", "/media/video/Spx-5-ez.mp4"),
  sparkboxLoop6: videoUrl("/Spx-6-ez.mp4", "/media/video/Spx-6-ez.mp4"),
  sparkboxLoop7: videoUrl("/Spx-7-ez.mp4", "/media/video/Spx-7-ez.mp4"),
  sparkboxLoop8: videoUrl("/Spx-8-ez.mp4", "/media/video/Spx-8-ez.mp4"),
  upstairsTrio: videoUrl(
    "/Upstaris@trio.mp4",
    "/media/imports/unknown-album/Unknown Album/Upstaris@trio.mp4",
  ),
  sunset: videoUrl(
    "/SunSet2021(4x5).mp4",
    "/media/imports/unknown-album/Unknown Album/SunSet2021(4x5).mp4",
  ),
  trioPromo:
    videoUrl(
      "/TRIO5.15.21Promo4x5.mp4",
      "/media/imports/unknown-album/Unknown Album/TRIO5.15.21Promo4x5.mp4",
    ),
};

export const PASSWORD = "sparkbox";
export const ROOT_ID = "root";

export const DESKTOP_LAYOUT = [
  { id: "sparkbox-mixes", x: 0, y: 0 },
  { id: "sparkbox-spin-tactics", x: 1, y: 0 },
  { id: "about-sparkbox", x: 0, y: 1 },
  { id: "bookings", x: 0, y: 2 },
];

export const FILES = {
  root: folder("root", "DJ SPARKBOX", [
    "sparkbox-mixes",
    "sparkbox-spin-tactics",
    "visual-assets",
    "about-sparkbox",
    "bookings",
    "sparkbox-avatar",
  ]),
  "sparkbox-mixes": folder(
    "sparkbox-mixes",
    "SPARKBOX MIXES",
    [
      "march-on-mars",
      "ignite",
      "shaft-got-money",
      "dont-go-motley-crew",
      "hurricane-space-rave",
      "love-late-at-night",
      "dakiti-remix",
      "kiss-me-en-mexico",
      "madsterpiece",
      "its-only-you",
      "headbop",
    ],
    {
      iconSrc: "/media/logos/sparkbox-logo-black.png",
    },
  ),
  "sparkbox-spin-tactics": folder(
    "sparkbox-spin-tactics",
    "SPARKBOX SPIN TACTICS",
    ["full-hustle", "full-newlvl", "full-rake", "full-throw-some-ds"],
    {
      iconSrc: "/media/logos/sparkbox-logo-black.png",
      summary: "Long-form Sparkbox performance clips with live sound.",
    },
  ),
  "visual-assets": folder(
    "visual-assets",
    "VISUAL ASSETS",
    ["sparkbox-logo", "sparkbox-headshot", "super-sparkbox-bros"],
    {
      iconSrc: "/media/images/super-sparkbox-bros.png",
    },
  ),
  "about-sparkbox": textFile(
    "about-sparkbox",
    "about.txt",
    "Paul Schmidt, aka DJ Sparkbox, not only dominates Charleston's club scene but also dazzles at private events and weddings. His distinctive style blends genres effortlessly, creating unforgettable experiences for every occasion. Renowned for his creativity and personalized touch, Sparkbox transforms events into vibrant celebrations, leaving guests craving more.",
    {
      summary: "About text for the DJ Sparkbox host.",
      socialLinks: [
        {
          id: "instagram",
          label: "Instagram",
          href: "https://www.instagram.com/djsparkbox/",
        },
        {
          id: "facebook",
          label: "Facebook",
          href: "https://www.facebook.com/SparkboxMusic/",
        },
        {
          id: "tiktok",
          label: "TikTok",
          href: "https://www.tiktok.com/@djsparkbox",
        },
        {
          id: "soundcloud",
          label: "SoundCloud",
          href: "https://soundcloud.com/djsparkbox/sparkbox-ignite",
        },
      ],
    },
  ),
  bookings: textFile("bookings", "bookings.txt", "get booking info from paul", {
    summary: "Booking and contact placeholder copy.",
  }),
  "sparkbox-avatar": imageFile(
    "sparkbox-avatar",
    "sparkbox-character.jpg",
    "/media/images/sparkbox-character.jpg",
    "Pixel Sparkbox avatar ready for promo use.",
  ),
  "sparkbox-logo": imageFile(
    "sparkbox-logo",
    "sparkbox-logo-black.png",
    "/media/logos/sparkbox-logo-black.png",
    "Primary Sparkbox logo asset.",
  ),
  "sparkbox-headshot": imageFile(
    "sparkbox-headshot",
    "sparkbox-headshot.jpg",
    "/media/images/sparkbox-headshot.jpg",
    "Portrait image for promo and press use.",
  ),
  "super-sparkbox-bros": imageFile(
    "super-sparkbox-bros",
    "super-sparkbox-bros.png",
    "/media/images/super-sparkbox-bros.png",
    "Stylized character art for the project.",
  ),
  "full-hustle": videoFile(
    "full-hustle",
    "hustle.mp4",
    videoUrl("/full-hustle.mp4", "/media/video/full-hustle.mp4"),
    "Long-form Sparkbox visual with full audio.",
  ),
  "full-newlvl": videoFile(
    "full-newlvl",
    "new-lvl.mp4",
    videoUrl("/full-newlvl.mp4", "/media/video/full-newlvl.mp4"),
    "Long-form Sparkbox visual with full audio.",
  ),
  "full-rake": videoFile(
    "full-rake",
    "rake.mp4",
    videoUrl("/full-rake.mp4", "/media/video/full-rake.mp4"),
    "Long-form Sparkbox visual with full audio.",
  ),
  "full-throw-some-ds": videoFile(
    "full-throw-some-ds",
    "throw-some-d's.mp4",
    videoUrl("/full-throw-some-d's.mp4", "/media/video/full-throw-some-d's.mp4"),
    "Long-form Sparkbox visual with full audio.",
  ),
  "march-on-mars": audioFile(
    "march-on-mars",
    "March on Mars",
    "/media/tracks/march-on-mars-fixed.mp3",
    "Cosmic Sparkbox opener.",
  ),
  ignite: audioFile(
    "ignite",
    "IGNITE",
    "/media/tracks/ignite.mp3",
    "High-energy Sparkbox original.",
  ),
  "shaft-got-money": audioFile(
    "shaft-got-money",
    "Shaft Got Money",
    "/media/tracks/shaft-got-money.mp3",
    "Funk-forward flip built to move.",
  ),
  "dont-go-motley-crew": audioFile(
    "dont-go-motley-crew",
    "Don't Go Motley Crew",
    "/media/tracks/dont-go-motley-crew.mp3",
    "Rock-dance crossover edit.",
  ),
  "hurricane-space-rave": audioFile(
    "hurricane-space-rave",
    "Hurricane X Space Rave",
    "/media/tracks/hurricane-x-space-rave.mp3",
    "Big-room collision with rave overtones.",
  ),
  "love-late-at-night": audioFile(
    "love-late-at-night",
    "Love Late at Night",
    "/media/tracks/love-late-at-night.mp3",
    "Wordplay edit with after-hours warmth.",
  ),
  "dakiti-remix": audioFile(
    "dakiti-remix",
    "Dakiti",
    "/media/tracks/dakiti-remix.mp3",
    "Melodic remix with sleek low-end.",
  ),
  "kiss-me-en-mexico": audioFile(
    "kiss-me-en-mexico",
    "Kiss Me En Mexico",
    "/media/tracks/kiss-me-en-mexico.mp3",
    "Sunset-ready edit with romance and bounce.",
  ),
  madsterpiece: audioFile(
    "madsterpiece",
    "MadsterPiece",
    "/media/tracks/madsterpiece.mp3",
    "Peak-hour Sparkbox edit with big-room momentum.",
  ),
  "its-only-you": audioFile(
    "its-only-you",
    "It's Only You",
    "/media/tracks/its-only-you.mp3",
    "Smooth melodic Sparkbox original.",
  ),
  headbop: audioFile(
    "headbop",
    "HeadBop",
    "/media/tracks/headbop.wav",
    "Percussive club tool with attitude.",
  ),
};

hydrateParents();

function folder(id, name, items, extra = {}) {
  return {
    id,
    type: "folder",
    name,
    items,
    summary: `${name} contains ${items.length} items.`,
    ...extra,
  };
}

function textFile(id, name, content, extra = {}) {
  return {
    id,
    type: "text",
    name,
    content,
    ...extra,
  };
}

function imageFile(id, name, src, caption) {
  return {
    id,
    type: "image",
    name,
    src,
    caption,
    summary: caption,
  };
}

function videoFile(id, name, src, caption) {
  return {
    id,
    type: "video",
    name,
    src,
    caption,
    summary: caption,
  };
}

function audioFile(id, name, src, note) {
  return {
    id,
    type: "audio",
    name,
    src,
    note,
    summary: note,
    backgroundVideo: getTrackVideo(id),
    visualTheme: getVisualTheme(id),
  };
}

function hydrateParents() {
  Object.values(FILES).forEach((file) => {
    if (file.type !== "folder") return;
    file.items.forEach((childId) => {
      if (FILES[childId]) {
        FILES[childId].parentId = file.id;
      }
    });
  });
}

function getVisualTheme(id) {
  const themes = {
    "march-on-mars": {
      accent: "#ff6a3d",
      glow: "rgba(255, 106, 61, 0.32)",
      hue: 10,
    },
    "bess-friend": {
      accent: "#78e0ff",
      glow: "rgba(120, 224, 255, 0.3)",
      hue: 186,
    },
    ignite: { accent: "#ffd257", glow: "rgba(255, 210, 87, 0.3)", hue: 42 },
    "shaft-got-money": {
      accent: "#ff9ac2",
      glow: "rgba(255, 154, 194, 0.28)",
      hue: 334,
    },
    "time-today": {
      accent: "#7cf0c8",
      glow: "rgba(124, 240, 200, 0.28)",
      hue: 162,
    },
    "dont-go-motley-crew": {
      accent: "#ff7e7e",
      glow: "rgba(255, 126, 126, 0.28)",
      hue: 4,
    },
    "hurricane-space-rave": {
      accent: "#b39dff",
      glow: "rgba(179, 157, 255, 0.32)",
      hue: 250,
    },
    "love-late-at-night": {
      accent: "#ffbf7a",
      glow: "rgba(255, 191, 122, 0.28)",
      hue: 28,
    },
    "dakiti-remix": {
      accent: "#70c7ff",
      glow: "rgba(112, 199, 255, 0.3)",
      hue: 204,
    },
    "kiss-me-en-mexico": {
      accent: "#ff9f68",
      glow: "rgba(255, 159, 104, 0.3)",
      hue: 24,
    },
    madsterpiece: {
      accent: "#ff7bb8",
      glow: "rgba(255, 123, 184, 0.3)",
      hue: 328,
    },
    "its-only-you": {
      accent: "#f46dff",
      glow: "rgba(244, 109, 255, 0.28)",
      hue: 292,
    },
    headbop: { accent: "#8cf0a8", glow: "rgba(140, 240, 168, 0.28)", hue: 120 },
  };

  return (
    themes[id] ?? {
      accent: "#ff8b5e",
      glow: "rgba(255, 139, 94, 0.28)",
      hue: 16,
    }
  );
}

function getTrackVideo(id) {
  const mapping = {
    "march-on-mars": VIDEO_SAMPLES.sparkboxLoop1,
    "bess-friend": VIDEO_SAMPLES.sparkboxLoop2,
    ignite: VIDEO_SAMPLES.sparkboxLoop3,
    "shaft-got-money": VIDEO_SAMPLES.sparkboxLoop4,
    "time-today": VIDEO_SAMPLES.sparkboxLoop5,
    "dont-go-motley-crew": VIDEO_SAMPLES.sparkboxLoop6,
    "hurricane-space-rave": VIDEO_SAMPLES.sparkboxLoop7,
    "love-late-at-night": VIDEO_SAMPLES.sparkboxLoop8,
    "dakiti-remix": VIDEO_SAMPLES.sparkboxLoop2,
    "kiss-me-en-mexico": VIDEO_SAMPLES.sparkboxLoop3,
    madsterpiece: VIDEO_SAMPLES.sparkboxLoop4,
    "its-only-you": VIDEO_SAMPLES.sparkboxLoop5,
    headbop: VIDEO_SAMPLES.sparkboxLoop6,
  };

  return mapping[id] ?? VIDEO_SAMPLES.sunset;
}
