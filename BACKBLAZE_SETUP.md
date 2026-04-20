# Backblaze Video Setup

This project is prepared to pull only videos from Backblaze.

Use a public Backblaze bucket or CDN URL and set:

`VITE_VIDEO_BASE_URL`

Example local `.env`:

```env
VITE_VIDEO_BASE_URL=https://f005.backblazeb2.com/file/your-public-video-bucket
```

How it works:

- MP4/video paths use `VITE_VIDEO_BASE_URL`
- audio, images, and logos still load locally
- if `VITE_VIDEO_BASE_URL` is blank, videos still load from local `/media/video/...`

Important:

- do not put a Backblaze application key in Vite env vars
- Vite env vars are shipped to the browser
- if you need private media later, use a backend/edge function to create signed URLs
