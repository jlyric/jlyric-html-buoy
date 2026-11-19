"use strict";

(() => {
  const config = window.SITE_CONFIG;

  if (!config) {
    console.error("SITE_CONFIG is missing. Load config.js before app.js.");
    return;
  }

  const $ = (id) => document.getElementById(id);

  const escapeHTML = (value = "") =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        })[character]
    );

// Simple Icons brand names.
// Add more entries using the icon's Simple Icons slug.
const brandIcons = new Set([
  "instagram",
  "youtube",
  "spotify",
  "facebook",
  "tiktok",
  "soundcloud",
  "bandcamp",
  "applemusic",
  "github",
  "yubico",
  "appstore"
  
]);

// Compatibility with the previous Spotify placeholder.
const iconAliases = {
  "music-2": "spotify"
};

// Inline controls replace Lucide's general-purpose icons.
const controlIcons = {
  play: '<path d="m9 5 11 7-11 7Z"/>',

  pause: `
    <path d="M8 5v14M16 5v14"/>
  `,

  mail: `
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="m3 7 9 6 9-6"/>
  `,

  "layout-grid": `
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  `,

  "share-2": `
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <path d="m9 10.5 6-4M9 13.5l6 4"/>
  `,

  "arrow-up-right": `
    <path d="M6 18 18 6M6 6h12v12"/>
  `,

  "external-link": `
    <path d="M14 3h7v7M10 14 21 3"/>
    <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>
  `,

  link: `
    <path d="m10 13 4-4"/>
    <path d="m8 16-1 1a4.2 4.2 0 0 1-6-6l4-4a4.2 4.2 0 0 1 6 0"/>
    <path d="m16 8 1-1a4.2 4.2 0 0 1 6 6l-4 4a4.2 4.2 0 0 1-6 0"
      transform="translate(-1 -1)"/>
  `,

  headphones: `
    <path d="M3 14v-3a9 9 0 0 1 18 0v3"/>
    <rect x="3" y="12" width="4" height="9" rx="2"/>
    <rect x="17" y="12" width="4" height="9" rx="2"/>
  `,

  "disc-3": `
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M7 12a5 5 0 0 1 5-5M17 12a5 5 0 0 1-5 5"/>
  `,

  "hard-hat": `
    <path d="M4 16v-3a8 8 0 0 1 16 0v3"/>
    <path d="M10 4v8M14 4v8"/>
    <rect x="2" y="16" width="20" height="4" rx="1"/>
  `,

  "audio-lines": `
    <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>
  `,

  "list-music": `
    <path d="M3 5h11M3 10h11M3 15h6M18 4v13"/>
    <path d="m18 4 4-1v5l-4 1"/>
    <ellipse cx="15" cy="18" rx="3" ry="2"/>
  `,

  "volume-2": `
    <path d="m11 5-6 4H2v6h3l6 4Z"/>
    <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>
  `,

  eye: `
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/>
    <circle cx="12" cy="12" r="3"/>
  `
};

function icon(name = "link") {
  const resolvedName = iconAliases[name] || name;

  if (brandIcons.has(resolvedName)) {
    // CSS masks let the logo inherit text and hover colors.
    const url =
      `https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/` +
      `${resolvedName}.svg`;

    return `
      <span
        class="brand-icon"
        aria-hidden="true"
        style="
          -webkit-mask-image: url('${url}');
          mask-image: url('${url}');
        "
      ></span>
    `;
  }

  const paths = controlIcons[resolvedName] || controlIcons.link;

  return `
    <svg
      class="ui-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      ${paths}
    </svg>
  `;
}

function refreshIcons() {
  document.querySelectorAll("[data-icon]").forEach((placeholder) => {
    const name = placeholder.getAttribute("data-icon");
    const template = document.createElement("template");

    template.innerHTML = icon(name).trim();

    const replacement = template.content.firstElementChild;

    if (!replacement) return;

    // Preserve sizing classes such as volume-icon.
    placeholder.classList.forEach((className) => {
      replacement.classList.add(className);
    });

    placeholder.replaceWith(replacement);
  });
}

  function safeURL(value) {
    if (!value) return "#";

    try {
      const url = new URL(value, window.location.href);
      const protocols = ["http:", "https:", "mailto:", "file:"];

      return protocols.includes(url.protocol) ? url.href : "#";
    } catch {
      return "#";
    }
  }

  function setText(id, value) {
    const element = $(id);

    if (element) {
      element.textContent = value ?? "";
    }
  }

  function setBackground(element, value) {
    if (!element || !value) return;

    const url = safeURL(value);

    if (url !== "#") {
      element.style.backgroundImage = `url(${JSON.stringify(url)})`;
    }
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remaining = String(Math.floor(seconds % 60)).padStart(2, "0");

    return `${minutes}:${remaining}`;
  }

  // --------------------------------------------------
  // Profile and theme
  // --------------------------------------------------

  if (
    typeof config.accent === "string" &&
    window.CSS?.supports("color", config.accent)
  ) {
    document.documentElement.style.setProperty("--accent", config.accent);
  }

  setBackground(document.body, config.background);
  setBackground(
    document.querySelector(".profile"),
    config.profileBackground
  );

  setText("name", config.name);
  setText("tagline", config.tagline);
  setText("bio", config.bio);

  document.title = `${config.name || "Creative hub"} — All the good stuff`;

  ["avatar", "footer-logo"].forEach((id) => {
    const image = $(id);

    if (image && config.logo) {
      image.src = safeURL(config.logo);
      image.alt = `${config.name || "Profile"} logo`;
    }
  });

  setText("footer-description", config.footer);
  setText("footer-name", config.name.toUpperCase());
  setText("year", new Date().getFullYear());

  // --------------------------------------------------
  // Social links
  // --------------------------------------------------

   const socials = Array.isArray(config.socials) ? config.socials : [];

  const socialMarkup = socials
    .map(
      (social) => `
        <a
          href="${escapeHTML(safeURL(social.url))}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeHTML(social.name)}"
        >
          ${icon(social.icon || "link")}
        </a>
      `
    )
    .join("");

  ["socials", "footer-socials"].forEach((id) => {
    if ($(id)) {
      $(id).innerHTML = socialMarkup;
    }
  });

  const email = socials.find((social) =>
    String(social.url).startsWith("mailto:")
  );

  if (email && $("contact")) {
    $("contact").href = safeURL(email.url);
  }


  // --------------------------------------------------
  // Standard link cards
  // --------------------------------------------------

  const links = Array.isArray(config.links) ? config.links : [];

  if ($("links")) {
    $("links").innerHTML = links
      .map((link) => {
        const thumbnail = link.thumbnail
          ? `
            <img
              src="${escapeHTML(safeURL(link.thumbnail))}"
              alt=""
              loading="lazy"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 9px;
              "
            >
          `
          : icon(link.icon || "link");

        return `
          <a
            class="card link-card"
            href="${escapeHTML(safeURL(link.url))}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="cover">${thumbnail}</span>

            <div class="link-copy">
              <div class="eyebrow">
                ${escapeHTML(link.eyebrow)}
              </div>
              <h2>${escapeHTML(link.title)}</h2>
              <p>${escapeHTML(link.description)}</p>
            </div>

            <span class="arrow" aria-hidden="true">
              ${icon("arrow-up-right")}
            </span>
          </a>
        `;
      })
      .join("");
  }

  // --------------------------------------------------
  // Shared audio player
  // --------------------------------------------------

  const audioPlayers = [];
  const video = $("video");

  function pauseOtherMedia(activeAudio) {
    audioPlayers.forEach((audio) => {
      if (audio !== activeAudio) {
        audio.pause();
      }
    });

    video?.pause();
  }

  function createAudioPlayer(container, options = {}) {
    if (!container) return null;

    const audio = new Audio();
    audio.preload = "none";
    audio.volume = 0.7;

    if (options.src) {
      audio.src = safeURL(options.src);
    }

    audioPlayers.push(audio);

    container.innerHTML = `
      <div class="player-controls">
        <button
          class="play-button"
          type="button"
          aria-label="Play"
        >
          ${icon("play")}
        </button>

        <span class="time elapsed">0:00</span>

        <input
          class="seek"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value="0"
          aria-label="Playback position"
          aria-valuetext="0:00"
        >

        <span class="time duration">0:00</span>

        <span aria-hidden="true" style="display: flex;">
          <i
            data-icon="volume-2"
            class="volume-icon"
          ></i>
        </span>

        <input
          class="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value="0.7"
          aria-label="Volume"
        >
      </div>

      <p class="audio-error" role="status"></p>
    `;

    const playButton = container.querySelector(".play-button");
    const seek = container.querySelector(".seek");
    const volume = container.querySelector(".volume");
    const elapsed = container.querySelector(".elapsed");
    const duration = container.querySelector(".duration");
    const error = container.querySelector(".audio-error");

    function updateButton() {
      playButton.innerHTML = icon(audio.paused ? "play" : "pause");
      playButton.setAttribute(
        "aria-label",
        audio.paused ? "Play" : "Pause"
      );

      refreshIcons();
    }

    function updateProgress() {
      elapsed.textContent = formatTime(audio.currentTime);

      const hasDuration =
        Number.isFinite(audio.duration) && audio.duration > 0;

      duration.textContent = formatTime(audio.duration);

      seek.value = hasDuration
        ? (audio.currentTime / audio.duration) * 100
        : 0;

      seek.setAttribute(
        "aria-valuetext",
        `${formatTime(audio.currentTime)} of ${formatTime(audio.duration)}`
      );
    }

    async function play() {
      error.textContent = "";
      pauseOtherMedia(audio);

      try {
        await audio.play();
      } catch (playError) {
        if (playError.name !== "AbortError") {
          error.textContent =
            "Audio unavailable. Please check the configured file URL.";
        }
      }
    }

    function setSource(src) {
      audio.pause();
      error.textContent = "";

      if (src) {
        audio.src = safeURL(src);
        audio.load();
      } else {
        audio.removeAttribute("src");
        audio.load();
      }

      elapsed.textContent = "0:00";
      duration.textContent = "0:00";
      seek.value = 0;
      seek.setAttribute("aria-valuetext", "0:00");

      updateButton();
    }

    playButton.addEventListener("click", () => {
      if (audio.paused) {
        void play();
      } else {
        audio.pause();
      }
    });

    seek.addEventListener("input", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
          (Number(seek.value) / 100) * audio.duration;

        updateProgress();
      }
    });

    volume.addEventListener("input", () => {
      audio.volume = Number(volume.value);
    });

    audio.addEventListener("play", () => {
      updateButton();
      options.onStateChange?.(audio);
    });

    audio.addEventListener("pause", () => {
      updateButton();
      options.onStateChange?.(audio);
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("durationchange", updateProgress);

    audio.addEventListener("error", () => {
      error.textContent =
        "Audio unavailable. Please check the configured file URL.";
    });

    audio.addEventListener("ended", () => {
      updateButton();
      options.onStateChange?.(audio);
      options.onEnded?.();
    });

    return {
      audio,
      play,
      setSource
    };
  }

  // --------------------------------------------------
  // Single audio module
  // --------------------------------------------------

  const singleContainer = $("single");

  if (singleContainer && config.single) {
    singleContainer.innerHTML = `
      <div class="audio-top">
        <span class="cover">
          <img src="https://yeayeah.b-cdn.net/buoy/assets/we-ride-album-cover.png" width="49" height="49" style="width: 100%; height: 100% !important;"/>
        </span>

        <div>
          <div class="eyebrow">NEW MUSIC</div>
          <h2>${escapeHTML(config.single.title)}</h2>
          <p>${escapeHTML(config.single.artist)}</p>
        </div>
      </div>

      <div id="single-controls"></div>
    `;

    createAudioPlayer($("single-controls"), {
      src: config.single.src
    });
  } else if (singleContainer) {
    singleContainer.hidden = true;
  }

  // --------------------------------------------------
  // Playlist
  // --------------------------------------------------

  const tracks = Array.isArray(config.playlist)
    ? config.playlist
    : [];

  const tracksContainer = $("tracks");
  const playlistControls = $("playlist-controls");

  let currentTrack = 0;
  let playlistPlayer = null;

  function updateTrackButtons() {
    if (!tracksContainer) return;

    const isPlaying =
      playlistPlayer && !playlistPlayer.audio.paused;

    tracksContainer.querySelectorAll(".track").forEach((button, index) => {
      const isCurrent = index === currentTrack;
      const trackIsPlaying = isCurrent && isPlaying;

      button.classList.toggle("active", isCurrent);

      if (isCurrent) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }

      button.setAttribute(
        "aria-label",
        `${trackIsPlaying ? "Pause" : "Play"} ${tracks[index].title}`
      );

      const stateIcon = button.querySelector(".track-state");

      if (stateIcon) {
        stateIcon.innerHTML = icon(
          trackIsPlaying ? "pause" : "play"
        );
      }
    });

    refreshIcons();
  }

  async function selectTrack(index, shouldPlay = true) {
    if (!playlistPlayer || !tracks[index]) return;

    currentTrack = index;
    playlistPlayer.setSource(tracks[index].src);
    updateTrackButtons();

    if (shouldPlay) {
      await playlistPlayer.play();
    }
  }

  if (tracksContainer && playlistControls && tracks.length) {
    tracksContainer.innerHTML = tracks
      .map(
        (track, index) => `
          <button
            class="track ${index === 0 ? "active" : ""}"
            type="button"
            data-track="${index}"
            aria-label="Play ${escapeHTML(track.title)}"
          >
            <span class="track-number">
              ${String(index + 1).padStart(2, "0")}
            </span>

            <span>
              <strong>${escapeHTML(track.title)}</strong>
              <small>${escapeHTML(track.artist)}</small>
            </span>

            <span
              class="track-state"
              aria-hidden="true"
              style="display: flex; margin-left: auto;"
            >
              ${icon("play")}
            </span>
          </button>
        `
      )
      .join("");

    playlistPlayer = createAudioPlayer(playlistControls, {
      src: tracks[0].src,

      onStateChange: updateTrackButtons,

      onEnded: () => {
        const nextIndex = (currentTrack + 1) % tracks.length;
        void selectTrack(nextIndex, true);
      }
    });

    tracksContainer.querySelectorAll(".track").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.track);

        if (index === currentTrack) {
          if (playlistPlayer.audio.paused) {
            void playlistPlayer.play();
          } else {
            playlistPlayer.audio.pause();
          }
        } else {
          void selectTrack(index, true);
        }
      });
    });

    updateTrackButtons();
  } else {
    const playlistSection = document.querySelector(".playlist");

    if (playlistSection) {
      playlistSection.hidden = true;
    }
  }

  // --------------------------------------------------
  // Video module
  // --------------------------------------------------

  if (video && config.video) {
    if (config.video.src) {
      video.src = safeURL(config.video.src);
    }

    if (config.video.poster) {
      video.poster = safeURL(config.video.poster);
    }

    video.setAttribute(
      "aria-label",
      config.video.title || "Featured video"
    );

    video.addEventListener("play", () => {
      audioPlayers.forEach((audio) => audio.pause());
    });

    setText("video-title", config.video.title);
    setText("video-description", config.video.description);

    if ($("video-link")) {
      $("video-link").href = safeURL(config.video.url);
    }
  }

  // --------------------------------------------------
  // Gallery and lightbox
  // --------------------------------------------------

  const gallery = $("gallery");
  const lightbox = $("lightbox");
  const closeLightbox = $("close-lightbox");

  let lastGalleryButton = null;

  if (config.gallery) {
    setText("gallery-title", config.gallery.title);
    setText("gallery-description", config.gallery.description);

    if ($("gallery-link")) {
      $("gallery-link").href = safeURL(config.gallery.url);
    }

    const images = Array.isArray(config.gallery.images)
      ? config.gallery.images
      : [];

    if (gallery) {
      gallery.innerHTML = images
        .map(
          (src, index) => `
            <button
              type="button"
              aria-label="Enlarge gallery image ${index + 1}"
            >
              <img
                src="${escapeHTML(safeURL(src))}"
                alt="Gallery artwork ${index + 1}"
                loading="lazy"
              >
            </button>
          `
        )
        .join("");

      gallery.querySelectorAll("button").forEach((button, index) => {
        button.addEventListener("click", () => {
          if (!lightbox) return;

          const image = lightbox.querySelector("img");

          if (!image) return;

          lastGalleryButton = button;
          image.src = safeURL(images[index]);
          image.alt = `Expanded gallery artwork ${index + 1}`;

          if (!lightbox.open) {
            lightbox.showModal();
          }
        });
      });
    }
  }

  closeLightbox?.addEventListener("click", () => {
    lightbox?.close();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  lightbox?.addEventListener("close", () => {
    lastGalleryButton?.focus();
  });

  // --------------------------------------------------
  // Sharing and toast notifications
  // --------------------------------------------------

  let toastTimer;

  function showToast(message) {
    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("visible");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("visible");
    }, 3000);
  }

  $("share")?.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Link copied. Share the good stuff.");
        return;
      }

      showToast("Copy the page address from your browser to share.");
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast("Copy the page address from your browser to share.");
      }
    }
  });

  // --------------------------------------------------
  // QR code
  // --------------------------------------------------

  const qrPanel = $("qr-panel");
  const qrContainer = $("qrcode");

  if (config.qr?.enabled && qrPanel && qrContainer) {
    setText("qr-label", config.qr.label);

    if (typeof window.QRCode === "function") {
      try {
        const accent = getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim();

        new window.QRCode(qrContainer, {
          text: config.qr.url || window.location.href,
          width: 70,
          height: 70,
          colorDark: accent || "#2563eb",
          colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.M
        });
      } catch (error) {
        qrPanel.hidden = true;
        console.warn("QR code could not be generated.", error);
      }
    } else {
      qrPanel.hidden = true;
    }
  } else if (qrPanel) {
    qrPanel.hidden = true;
  }

  refreshIcons();
})();