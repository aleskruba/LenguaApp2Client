// Inside your service worker file (e.g., service-worker.js)
self.addEventListener('activate', (event) => {
    event.waitUntil(
      Promise.all([
        self.clients.claim(), // Claim all open clients
        // Additional cleanup or migration tasks if needed
      ])
    );
  });
  