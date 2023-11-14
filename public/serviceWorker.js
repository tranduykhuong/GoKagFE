const CACHE_NAME = "gokag-cache";

// Danh sách các tài nguyên cần lưu vào cache
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/main.js",
  "/images/logo.png",
];

// Sự kiện cài đặt Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
});

// Sự kiện kích hoạt Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Sự kiện lấy dữ liệu từ cache hoặc mạng
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Sự kiện xử lý thông báo push
self.addEventListener("push", (event) => {
  const pushData = event.data.json();
  console.log(pushData);

  const alertMessage = pushData.alert;
  const iconMessage = pushData.icon;
  const urlMessage = "http://localhost:3000/datasets/" + pushData.custom.a.slug;

  const options = {
    body: alertMessage,
    icon: iconMessage,
    data: {
      url: urlMessage,
    },
  };

  event.waitUntil(
    self.registration.showNotification("GoKag Notification", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.url;

  event.waitUntil(clients.openWindow(url));
});
