// Minimal service worker: makes the app installable without caching
// authenticated pages or API responses (data must always be fresh).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
