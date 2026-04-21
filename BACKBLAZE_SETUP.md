# Backblaze Media Setup

This project is prepared to pull videos and tracks from Backblaze.

Use public Backblaze bucket/CDN URLs and set:

`VITE_VIDEO_BASE_URL`
`VITE_TRACK_BASE_URL`

Example local `.env`:

```env
VITE_VIDEO_BASE_URL=https://f005.backblazeb2.com/file/sparkbox-media/videos
VITE_TRACK_BASE_URL=https://f005.backblazeb2.com/file/sparkbox-media/tracks
```

How it works:

- MP4/video paths use `VITE_VIDEO_BASE_URL`
- audio track paths use `VITE_TRACK_BASE_URL`
- images and logos still load locally
- if `VITE_VIDEO_BASE_URL` is blank, videos still load from local `/media/video/...`
- if `VITE_TRACK_BASE_URL` is blank, tracks are expected at root-relative remote paths like `/ignite.mp3`

Important:

- do not put a Backblaze application key in Vite env vars
- Vite env vars are shipped to the browser
- if you need private media later, use a backend/edge function to create signed URLs
