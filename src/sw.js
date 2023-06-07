/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
// Use a CACHE_NAME for cache versioning
const CACHE_NAME = 'ridley-card-matcher@process.env.npm_package_version';

const files = [
  './',
  './js/main.js',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
];

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', (e) => {
  // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(files).then(() => {
      self.skipWaiting();
    })),
  );
});

self.addEventListener('activate', (e) => {
  // delete any caches that aren't in expectedCaches
  e.waitUntil(
    caches.keys().then((keys) => {
      Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME].includes(key)) {
            return caches.delete(key);
          }
        }),
      );
    }).then(() => {
      // handle fetches
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchedResponse = fetch(event.request.clone()).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          },
        );

        return cachedResponse || fetchedResponse;
      }),
  );
});
