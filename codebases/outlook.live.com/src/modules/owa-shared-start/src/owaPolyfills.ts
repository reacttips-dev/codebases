try {
    // React is using performance.now. It checks that performance
    // exists but not performance.now. So we are going to polyfill it
    if ('performance' in window == true && typeof window.performance.now != 'function') {
        var nowOffset = Date.now();
        window.performance.now = () => Date.now() - nowOffset;
    }
} catch (e) {
    if (e && window && typeof window.onerror == 'function') {
        window.onerror('Polyfill error', undefined, undefined, undefined, e);
    }
}
