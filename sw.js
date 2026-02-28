// ===============================
// 🚀 SMART SERVICE WORKER
// ===============================

// 🔥 שנה מספר גרסה בכל עדכון
const CACHE_VERSION = "v2.0.0";
const CACHE_NAME = `austria-trip-${CACHE_VERSION}`;

// קבצים לקאש
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// ===============================
// 📦 INSTALL
// ===============================
self.addEventListener("install", (event) => {
  console.log("SW installing:", CACHE_NAME);

  self.skipWaiting(); // 🔥 מפעיל מיד

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// ===============================
// 🧹 ACTIVATE — ניקוי cache ישן
// ===============================
self.addEventListener("activate", (event) => {
  console.log("SW activating");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // 🔥 משתלט מיד
});

// ===============================
// 🌐 FETCH — network first (עדכני)
// ===============================
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // שמור עותק בקאש
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
