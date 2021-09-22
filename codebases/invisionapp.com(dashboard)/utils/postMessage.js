export function postMessage (msg) {
  window.parent && window.parent.postMessage && window.parent.postMessage(msg, window.location.origin)
}
