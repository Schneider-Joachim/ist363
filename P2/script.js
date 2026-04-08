// ── Element refs ──────────────────────────────────────────────
const apodContainer = document.getElementById("apod-container");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const imageResults = document.getElementById("imageResults");
const wikiResults = document.getElementById("wikiResults");
const topicBtns = document.querySelectorAll(".topic-btn");

// ── NASA API key ───────────────────────────────────────────────
const NASA_API_KEY = "nFRxLotPbsEI2xeJ1hz819xnqt4ROSVTSzLP0koZ";

// ── Star field ─────────────────────────────────────────────────
function generateStars() {
  const field = document.getElementById("starField");
  const count = 160;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2.5 + 0.5;
    // ~30% of stars get a purple tint
    const isPurple = Math.random() < 0.3;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --d: ${(Math.random() * 4 + 2).toFixed(1)}s;
      --delay: -${(Math.random() * 6).toFixed(1)}s;
      --bright: ${(Math.random() * 0.5 + 0.4).toFixed(2)};
      background: ${isPurple ? "#c4b5fd" : "white"};
    `;
    field.appendChild(star);
  }
}

// ── API 1: NASA APOD ───────────────────────────────────────────
// The DEMO_KEY sometimes returns 500 for "today".
// If it fails, we retry with a known-good date as a fallback.
async function loadAPOD() {
  apodContainer.innerHTML = `
    <div class="loader"><div class="spinner"></div><p>Contacting NASA…</p></div>
  `;

  // Try today first; if 500, fall back to a specific date
  const urls = [
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=2024-04-08`,
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=2024-01-01`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        // 500 from NASA = server-side / rate-limit issue — try next URL
        continue;
      }

      const data = await response.json();
      renderAPOD(data);
      return; // success — stop loop
    } catch (err) {
      // Network error on this attempt — keep trying
      continue;
    }
  }

  // All attempts failed
  apodContainer.innerHTML = `
    <div class="error">
      ⚠️ NASA APOD is temporarily unavailable (DEMO_KEY rate limit).<br>
      <a href="https://api.nasa.gov/" target="_blank" style="color:#63b3ed">
        Get a free personal API key
      </a> and replace <code>DEMO_KEY</code> in script.js to fix this.
    </div>
  `;
}

function renderAPOD(data) {
  const mediaHTML =
    data.media_type === "image"
      ? `<img src="${data.url}" alt="${data.title}">`
      : `<p>Today's APOD is a video. 
           <a href="${data.url}" target="_blank" style="color:#63b3ed">Watch here</a>
         </p>`;

  apodContainer.innerHTML = `
    <h3>${data.title}</h3>
    <p class="apod-date">📅 ${data.date}</p>
    ${mediaHTML}
    <p class="apod-explanation">${data.explanation}</p>
  `;
}

// ── API 1 (continued): NASA Image Search ──────────────────────
async function searchNASAImages(query) {
  imageResults.innerHTML = `
    <div class="loader"><div class="spinner"></div><p>Searching NASA library…</p></div>
  `;

  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`,
    );

    if (!response.ok) {
      throw new Error(`NASA Images API returned ${response.status}`);
    }

    const data = await response.json();
    const items = data.collection.items.slice(0, 6);

    if (items.length === 0) {
      imageResults.innerHTML = `<p class="hint">No images found for "${query}".</p>`;
      return;
    }

    imageResults.innerHTML = `
      <div class="image-grid">
        ${items
          .map((item) => {
            const title = item.data[0]?.title || "Untitled";
            const description =
              item.data[0]?.description || "No description available.";
            const imgSrc = item.links?.[0]?.href || "";
            return `
            <div class="card">
              ${imgSrc ? `<img src="${imgSrc}" alt="${title}" loading="lazy">` : ""}
              <div class="card-body">
                <h3>${title}</h3>
                <p>${description.substring(0, 130)}…</p>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  } catch (error) {
    imageResults.innerHTML = `<div class="error">⚠️ ${error.message}</div>`;
  }
}

// ── API 2: Wikipedia REST API ──────────────────────────────────
// Endpoint: https://en.wikipedia.org/api/rest_v1/page/summary/{title}
// No API key required. Returns title, extract, thumbnail, content_urls.
async function loadWikipedia(topic) {
  wikiResults.innerHTML = `
    <div class="loader"><div class="spinner"></div><p>Loading Wikipedia article…</p></div>
  `;

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
    );

    if (!response.ok) {
      throw new Error(`Wikipedia API returned ${response.status}`);
    }

    const data = await response.json();
    renderWikipedia(data);
  } catch (error) {
    wikiResults.innerHTML = `<div class="error">⚠️ ${error.message}</div>`;
  }
}

function renderWikipedia(data) {
  const thumbHTML = data.thumbnail?.source
    ? `<img src="${data.thumbnail.source}" alt="${data.title}"
            style="float:right;max-width:180px;border-radius:8px;margin:0 0 12px 20px;border:1px solid rgba(99,179,237,0.15)">`
    : "";

  wikiResults.innerHTML = `
    <div class="wiki-card">
      <h3>${data.title}</h3>
      ${thumbHTML}
      <p>${data.extract}</p>
      <a href="${data.content_urls.desktop.page}" target="_blank">
        Read full article on Wikipedia →
      </a>
    </div>
  `;
}

// ── Event listeners ────────────────────────────────────────────
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) searchNASAImages(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) searchNASAImages(query);
  }
});

topicBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    topicBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadWikipedia(btn.dataset.topic);
  });
});

// ── Init ───────────────────────────────────────────────────────
generateStars();
loadAPOD();
searchNASAImages("galaxy");
loadWikipedia("Universe");
