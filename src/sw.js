import { precacheAndRoute } from 'workbox-precaching';

const cacheName = 'cache-v1';
//const dynamicCacheName = 'dynamic-v1';
const resourcesToCache = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
  "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.8/themes/default/style.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.8/jstree.min.js",
  "https://cdn.jsdelivr.net/npm/uuid@latest/dist/umd/uuidv4.min.js",
  "https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js",
  "https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.js",
  "https://cdn.jsdelivr.net/npm/@lumino/algorithm@1.6.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/collections@1.6.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/properties@1.5.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/messaging@1.7.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/signaling@1.7.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/disposable@1.7.0/dist/index.min.js",    
  "https://cdn.jsdelivr.net/npm/@lumino/domutils@1.5.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/coreutils@1.8.0/dist/index.min.js",    
  "https://cdn.jsdelivr.net/npm/@lumino/keyboard@1.5.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/commands@1.15.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/dragdrop@1.10.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/virtualdom@1.11.0/dist/index.min.js",
  "https://cdn.jsdelivr.net/npm/@lumino/widgets@1.23.0/dist/index.min.js",
  '/assets/vn-icon-152.png',
  '/assets/default-datatree.json',
  "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.8/themes/default/throbber.gif",
  "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.8/themes/default/32px.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/webfonts/fa-solid-900.woff2",

//  '/assets/favicon.ico'
];

precacheAndRoute(self.__WB_MANIFEST);

// // cache size limit function
// const limitCacheSize = (name, size) => {
//   caches.open(name).then(cache => {
//     cache.keys().then(keys => {
//       if(keys.length > size){
//         cache.delete(keys[0]).then(limitCacheSize(name, size));
//       }
//     });
//   });
// };


// self.addEventListener('install', evt => {
//   console.log("sw.js «install» event.");
//   evt.waitUntil(
//     caches.open(cacheName)
//       .then(cache => {
//         cache.addAll(resourcesToCache);
//         //return cache.addAll(resourcesToCache);
//       })
//   );
// });

self.addEventListener('install', evt => {
  console.log("sw.js «install» event.");
  evt.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        cache.addAll(resourcesToCache);
        //return cache.addAll(resourcesToCache);
      })
  );
});


// self.addEventListener('activate', evt => {
//   console.log("sw.js «activate» event.");
//   evt.waitUntil(
//     // PWA Tutorial for Beginners #18 - Dynamic Caching
//     caches.keys().then(keys => {
//       //console.log("caches.keys", keys);
//       return Promise.all(keys
//         .filter(key => key !== cacheName) //&& key !== dynamicCacheName
//         .map(key => caches.delete(key))
//       );
//     })
//   );

// });



// self.addEventListener('fetch', evt => {
//   //console.log("sw.js «fetch» event:", evt);
//   evt.respondWith(
//     caches.match(evt.request).then(cacheRes => {
//       return cacheRes || fetch(evt.request)
//       // return cacheRes || fetch(evt.request).then(fetchRes => {
//       //   return caches.open(dynamicCacheName).then(cache => {
//       //     cache.put(evt.request.url, fetchRes.clone());
//       //     // check cached items size
//       //     limitCacheSize(dynamicCacheName, 15);
//       //     return fetchRes;
//       //   })
//       // });
//     }).catch((err) => {
//       console.log("'fetch': ERROR ", err);
//       // if(evt.request.url.indexOf('.html') > -1){
//       //   return caches.match('/fallback.html');
//       // } 
//     })
//   );
// });

self.addEventListener('fetch', evt => {
  //console.log("sw.js «fetch» event:", evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      //console.log("caches.match(evt.request) cacheRes.url=", cacheRes.url);
      //return cacheRes || fetch(evt.request)
      if (cacheRes) {console.log("caches.match cacheRes.url", cacheRes.url);}
      else {console.log("caches.match «fetch(evt.request)»: ", evt.request);}
      return cacheRes || fetch(evt.request)   //.then(fetchRes => {
        //console.log(`sw.js «fetch»: ${evt.request}`)
        //return fetchRes;
      //});
    }).catch((err) => {
      console.log("«fetch»: ERROR ", err);
    })
  );
});
