const CACHE_NAME: string = 'HotDrop-cache';
let cacheURL: Array<string> = [
  '/',
  '/assets/css/noscript.css',
  '/assets/images/ic_launcher_round.png',
  '/p2p/events.js',
  '/p2p/index.js',
];

export class ServiceWorkerCache {
  public static run(): void {
    addEventListener('install', this.onInstalled);
    addEventListener('fetch', this.onFetched)
  }

  private static onInstalled = (event: any): void => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(cacheURL)
      })
    )
  };

  private static onFetched = (event: any): void => {
    event.respondWith(
      caches.match(event.request).then((matchResponse) => {
        return matchResponse || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse
          })
        })
      })
    )
  };

}
