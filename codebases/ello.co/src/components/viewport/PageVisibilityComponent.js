const observers = []
let hasListeners = false

function callMethod(method) {
  observers.forEach((observer) => {
    if (observer[method]) {
      observer[method]()
    }
  })
}

function onBeforeUnload() {
  callMethod('onBeforeUnload')
}

function onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    callMethod('onPageVisibilityHidden')
  } else if (document.visibilityState === 'visible') {
    callMethod('onPageVisibilityVisible')
  }
}

function addListeners() {
  window.addEventListener('beforeunload', onBeforeUnload)
  if (document.visibilityState !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
}

function removeListeners() {
  window.removeEventListener('beforeunload', onBeforeUnload)
  document.removeEventListener('visibilitychange', onVisibilityChange)
}

export function addPageVisibilityObserver(observer) {
  if (observers.indexOf(observer) === -1) {
    observers.push(observer)
    addListeners()
  }
  if (observers.length === 1 && !hasListeners) {
    hasListeners = true
  }
}

export function removePageVisibilityObserver(observer) {
  const index = observers.indexOf(observer)
  if (index > -1) {
    observers.splice(index, 1)
  }
  if (observers.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

