# Justin Lyric — Creative Hub

A responsive landing page built with HTML, Tailwind CSS, and vanilla JavaScript. No installation or build process is required.

## Project structure

```text
/
├── index.html
├── config.js
├── style.css
├── app.js
├── README.md
└── assets/
    ├── logo.svg
    ├── backdrop.svg
    └── paper.svg
```

## Getting started

1. Keep the files together using the structure above.
2. Open `index.html` in your browser.
3. Edit `config.js` to customize your content.
4. Upload the files to a static web host when ready.

An internet connection is required for CDN dependencies and externally hosted media. HTTPS hosting is recommended for clipboard sharing.

## Features

- Responsive profile column capped at 480px.
- Independent full-page and profile-column background images.
- Round profile logo, name, description, and social icons.
- Link cards with icons or thumbnail images.
- Single audio player with play, pause, seeking, and volume.
- Playlist with track selection, seeking, volume, and automatic advancement.
- Video player with description and destination link.
- Image gallery with an expandable lightbox.
- Footer with logo, description, and social links.
- Configurable QR code fixed to the bottom-right corner.
- Share button using native sharing or clipboard copying.

Starting an audio player pauses other audio and video playback. Starting the video pauses all audio players. The playlist loops back to its first track after the last track finishes.

## Customize your content

Edit `config.js`. Keep JavaScript strings quoted and separate object properties with commas.

### Profile

```javascript
name: "Justin Lyric",
tagline: "Music. Art. A little outside the lines.",
bio: "Your short description.",
logo: "assets/logo.svg",
accent: "#2563eb",
```

The accent controls buttons, headings, sliders, and other themed elements.

Additional background, border, and text colors are defined in `style.css`.

SVG assets contain their own colors. Editing the accent does not recolor the logo or background SVGs.

### Background images

```javascript
background: "assets/backdrop.svg",
profileBackground: "assets/paper.svg",
```

- `background` spans the entire page.
- `profileBackground` appears inside the narrow profile column.

Use relative file paths or HTTPS image URLs. To use only the CSS background colors, set either value to an empty string.

### Social links

```javascript
socials: [
  {
    name: "Instagram",
    icon: "instagram",
    url: "https://instagram.com/your-account"
  },
  {
    name: "Email",
    icon: "mail",
    url: "mailto:you@example.com"
  }
],
```

Social links appear beneath the profile and in the footer.

The first `mailto:` social link also supplies the contact section's email destination.

Icons use Lucide icon names. The Spotify entry uses a generic music icon.

### Standard link cards

```javascript
links: [
  {
    eyebrow: "MY BUSINESS",
    title: "Visit the studio",
    description: "A short description.",
    icon: "external-link",
    url: "https://example.com",
    thumbnail: "assets/studio.jpg"
  }
],
```

The thumbnail is optional. When present, it replaces the icon.

Add or remove objects to change the number of link cards.

### Single audio player

```javascript
single: {
  title: "Your song title",
  artist: "Artist or description",
  src: "assets/audio/your-song.mp3"
},
```

Use a direct audio file URL, not a streaming-service page.

Set `single` to `null` to hide this module.

### Playlist

```javascript
playlist: [
  {
    title: "First song",
    artist: "Artist name",
    src: "assets/audio/first-song.mp3"
  },
  {
    title: "Second song",
    artist: "Artist name",
    src: "assets/audio/second-song.mp3"
  }
],
```

Add one object per track. Set the playlist to an empty array to hide it:

```javascript
playlist: [],
```

Change the playlist section's heading in `index.html`.

### Video

```javascript
video: {
  title: "Your video title",
  description: "A short description.",
  src: "assets/video/your-video.mp4",
  poster: "assets/video-poster.jpg",
  url: "https://example.com/video"
},
```

- `src` is a direct browser-compatible video file URL.
- `poster` is the image shown before playback.
- `url` is the destination for the arrow link.

The included player does not embed YouTube or Vimeo page URLs.

### Image gallery

```javascript
gallery: {
  title: "Through my lens",
  description: "A short gallery description.",
  url: "https://example.com/gallery",
  images: [
    "assets/gallery/photo-1.jpg",
    "assets/gallery/photo-2.jpg",
    "assets/gallery/photo-3.jpg"
  ]
},
```

The default layout is designed for three images. Clicking an image opens a lightbox. Close it with the close button, Escape key, or backdrop.

### Footer

```javascript
footer: "A few different passions. One creative spirit.",
```

The footer reuses the profile logo and social links. Its year updates automatically.

### QR code

```javascript
qr: {
  enabled: true,
  url: "https://your-public-site.com",
  label: "Take the good stuff with you"
}
```

Set `enabled` to `false` to hide the QR panel.

An empty URL uses the current page address. For a local preview, configure the intended public URL explicitly.

The QR code is generated in the browser. Its destination is not sent to a QR-generation service.

The panel collapses to a compact badge on smaller screens.

## Page actions

- The top-left grid button jumps to the content modules.
- The top-right share button uses native sharing when available.
- If native sharing is unavailable, the page attempts to copy its URL.

Clipboard support may be limited when opening the page directly from your filesystem.

## Theme

The supplied `config.js` and `style.css` use a blue theme.

Main CSS variables:

```css
:root {
  --accent: #2563eb;
  --ink: #1e293b;
  --muted: #64748b;
  --line: #dbe4f0;
  --page: #e8eff8;
  --paper: #f8faff;
  --card: #ffffff;
  --soft: #e8f0ff;
}
```

The original SVG assets use olive colors. Recolor or replace those files for a complete blue appearance.

## Dependencies

The page loads these resources externally:

- Tailwind CSS Play CDN
- Lucide icons
- QRCode.js
- Google Fonts: DM Sans and Space Grotesk

There is no npm installation or compilation step. For an offline version, download and locally reference the dependencies, fonts, and media.

## Demonstration content

Replace the sample content before launching:

- Example business URLs and email address.
- Generic social-platform destinations.
- SoundHelix sample recordings.
- MDN CC0 flower video.
- Unsplash gallery images and video poster.
- Placeholder JL logo and SVG backgrounds.

Use media you own or have permission to publish.

## Deployment

Upload these files and folders to your web host:

```text
index.html
config.js
style.css
app.js
assets/
```

Preserve relative paths and filename capitalization.

If the project includes `.openai/hosting.json`, that file contains its Sites hosting configuration. It is not required by other static hosts.

## Troubleshooting

### Profile or modules are empty

Confirm `config.js` loads before `app.js`:

```html
<script src="config.js"></script>
<script src="app.js"></script>
```

Check the browser console for syntax errors or missing files.

### Styles are missing

Confirm `style.css` is next to `index.html`. Check your internet connection for Tailwind and Google Fonts.

### Icons or QR code are missing

Check that the external Lucide and QRCode.js scripts loaded successfully.

### Audio or video will not play

Use a direct media file URL. Confirm the file exists, its format is supported, and its host permits browser playback.

### Backgrounds or logo still look olive

Those colors are embedded in the SVG assets. Recolor or replace the SVG files.

### Changes do not appear

Refresh the page and clear the browser cache if necessary.