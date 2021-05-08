// This is the "Offline copy of assets" service worker

const CACHE = "astrobear_cache_v1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);


// /**
//  * キャッシュコントロール
//  * CACHE_STORAGE_NAME: キャッシュ名
//  *     バージョンアップごとにカウントアップ（再キャッシュ用）
//  * files_to_cache: 対象ファイルリスト
//  *     ここにないとキャッシュされない
//  *     パス「../enchant_astrobear」にて
//  *     以下のコマンドを実行する
//  *     $ find . -type f | grep "enchant_astrobear" | grep -v ".git" | sed 's/^\.//'
//  */
// const CACHE_STORAGE_NAME = 'v1';
// const files_to_cache = `
// /enchant_astrobear/assets/AstroBear_promote180x120.png
// /enchant_astrobear/assets/AstroBear_Screenshot1.png
// /enchant_astrobear/assets/AstroBear_Screenshot2.png
// /enchant_astrobear/assets/AstroBear_Screenshot3.png
// /enchant_astrobear/assets/icon-128.png
// /enchant_astrobear/assets/icon-512.png
// /enchant_astrobear/assets/icon-60.png
// /enchant_astrobear/enchant.js
// /enchant_astrobear/fonts/FB.eot
// /enchant_astrobear/fonts/fb.svg
// /enchant_astrobear/fonts/FB.ttf
// /enchant_astrobear/fonts/FB.woff
// /enchant_astrobear/img/back.png
// /enchant_astrobear/img/bear.png
// /enchant_astrobear/img/bg_earth.jpg
// /enchant_astrobear/img/bg_galaxy.jpg
// /enchant_astrobear/img/bg_mandara.jpg
// /enchant_astrobear/img/bg_star.jpg
// /enchant_astrobear/img/bg_sunrise.jpg
// /enchant_astrobear/img/bg_test.jpg
// /enchant_astrobear/img/clear.png
// /enchant_astrobear/img/help.png
// /enchant_astrobear/img/install.png
// /enchant_astrobear/img/play.png
// /enchant_astrobear/img/replay.png
// /enchant_astrobear/img/share.png
// /enchant_astrobear/img/smaho2.png
// /enchant_astrobear/img/smaho3.png
// /enchant_astrobear/img/space0.png
// /enchant_astrobear/img/space1.png
// /enchant_astrobear/img/space2.png
// /enchant_astrobear/img/space3.png
// /enchant_astrobear/img/start.png
// /enchant_astrobear/img/title.png
// /enchant_astrobear/img/titleimg.png
// /enchant_astrobear/index.html
// /enchant_astrobear/install.js
// /enchant_astrobear/LICENSE
// /enchant_astrobear/main.js
// /enchant_astrobear/manifest.webapp
// /enchant_astrobear/manifest.webmanifest
// /enchant_astrobear/promote/AstroBear_promote180x120.png
// /enchant_astrobear/promote/AstroBear_Screenshot1.png
// /enchant_astrobear/promote/AstroBear_Screenshot2.png
// /enchant_astrobear/promote/AstroBear_Screenshot3.png
// /enchant_astrobear/promote/icon-192x192.png
// /enchant_astrobear/promote/icon-256x256.png
// /enchant_astrobear/promote/icon-384x384.png
// /enchant_astrobear/promote/icon-512x512.png
// /enchant_astrobear/promote/ISS_Bear512.png
// /enchant_astrobear/pwa.html
// /enchant_astrobear/pwabuilder-sw.js
// /enchant_astrobear/README.md
// /enchant_astrobear/ReleaseNote.txt
// /enchant_astrobear/RootableIntersectSprite.js
// /enchant_astrobear/se/crash24.mp3
// /enchant_astrobear/se/crash24.ogg
// /enchant_astrobear/se/crash24.wav
// /enchant_astrobear/se/fall01.mp3
// /enchant_astrobear/se/fall01.ogg
// /enchant_astrobear/se/fall01.wav
// /enchant_astrobear/se/noise09.mp3
// /enchant_astrobear/se/noise09.ogg
// /enchant_astrobear/se/noise09.wav
// /enchant_astrobear/se/power38.mp3
// /enchant_astrobear/se/power38.ogg
// /enchant_astrobear/se/power38.wav
// `.split("\n")
// .map(function(line){
//   return line.replace(/^\s+|\s+$/g, "");
// })
// .filter(function(line){
//   return !!line;
// });



// // This is the "Offline page" service worker

// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// // const CACHE = "pwabuilder-page";

// // TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
// // const offlineFallbackPage = "ToDo-replace-this-name.html";

// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });

// self.addEventListener('install', async (event) => {
//   event.waitUntil(
//     caches.open(CACHE_STORAGE_NAME)
//     .then((cache) => cache.addAll(files_to_cache))
//     // .then((cache) => cache.add(offlineFallbackPage))

//   );
// });

// if (workbox.navigationPreload.isSupported()) {
//   workbox.navigationPreload.enable();
// }

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith((async () => {
//       try {
//         const preloadResp = await event.preloadResponse;

//         if (preloadResp) {
//           return preloadResp;
//         }

//         const networkResp = await fetch(event.request);
//         return networkResp;
//       } catch (error) {

//         const cache = await caches.open(CACHE_STORAGE_NAME);
//         const cachedResp = await cache.match(files_to_cache);
//         return cachedResp;
//       }
//     })());
//   }
// });
