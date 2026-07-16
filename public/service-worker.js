// The placeholder in the cache name is replaced with a unique build id at
// production build time (see vite.config.js), so every deploy gets a fresh
// cache; the old one is deleted on activate and the app pulls new assets.
const CACHE_NAME = 'mood-tracker-__BUILD_ID__'
const SHELL_ASSETS = ['./', './index.html', './manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

// Cache-first for built assets, network fallback otherwise. Never cache
// non-GET or cross-origin (e.g. Supabase) requests.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (new URL(event.request.url).origin !== self.location.origin) return
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
            return response
          })
          .catch(() => cached),
    ),
  )
})
