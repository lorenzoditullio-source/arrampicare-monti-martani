const CACHE_NAME = 'martani-climbing-v1';

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./edit.html",
  "./manifest.json",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "./images/image1.jpg",
  "./images/image10.jpg",
  "./images/image11.png",
  "./images/image12.jpg",
  "./images/image13.jpg",
  "./images/image14.jpg",
  "./images/image15.jpg",
  "./images/image16.png",
  "./images/image17.jpg",
  "./images/image18.jpg",
  "./images/image19.png",
  "./images/image2.jpg",
  "./images/image20.jpg",
  "./images/image21.jpg",
  "./images/image22.png",
  "./images/image23.jpg",
  "./images/image24.jpg",
  "./images/image25.jpg",
  "./images/image26.jpg",
  "./images/image27.png",
  "./images/image28.png",
  "./images/image3.jpg",
  "./images/image4.jpg",
  "./images/image5.jpg",
  "./images/image6.jpg",
  "./images/image7.jpg",
  "./images/image8.jpg",
  "./images/image9.jpg"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Precache fallito per:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
