// Check that service workers are registered
const initServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/client/sw.js", { scope: "/" });
        });

        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault(); // Prevents immediate prompt display
            (e as any).prompt();
        });

    }
};

export const unregisterServiceWorker = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (const registration of registrations) {
                registration.unregister();
            }
        });
    }
    clearCache();
};

const clearCache = () => {
    const cacheAvailable = "caches" in self;

    if (cacheAvailable) {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    return true;
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                }),
            );
        });
    }
};

export default initServiceWorker;
