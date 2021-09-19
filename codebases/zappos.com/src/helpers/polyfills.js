export async function loadPolyfills() {
  // only penalize IE11 / old safari for being behind the times
  if (typeof window.IntersectionObserver === 'undefined') {
    await import('intersection-observer');
  }
}
