import debounce from 'lodash/debounce'

const resizeObjects = []
let ticking = false
let hasListeners = false
let memoizedProbe

function callMethod(method, resizeProperties) {
  resizeObjects.forEach((obj) => {
    if (obj[method]) {
      obj[method](resizeProperties)
    }
  })
}

function getProbeElement() {
  if (typeof memoizedProbe !== 'undefined') { return memoizedProbe }
  memoizedProbe = document.getElementById('root')
  return memoizedProbe
}

function getProbeProperties() {
  const probeElement = getProbeElement()
  const styles = window.getComputedStyle(probeElement, ':after')
  // htc one returns 'auto' for the z-index
  let zIndex = styles.getPropertyValue('z-index')
  if (isNaN(zIndex)) { zIndex = 2 }
  const columnCount = parseInt(zIndex, 10)
  return { columnCount }
}


function getResizeProperties() {
  const probe = getProbeProperties()
  return {
    columnCount: probe.columnCount,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }
}

function resized() {
  const resizeProperties = getResizeProperties()
  callMethod('onResize', resizeProperties)
}

function windowWasResized() {
  if (!ticking) {
    requestAnimationFrame(() => {
      resized()
      ticking = false
    })
    ticking = true
  }
}

const resizeFunc = debounce(windowWasResized, 100)

export function addResizeObject(obj) {
  if (resizeObjects.indexOf(obj) === -1) {
    resizeObjects.push(obj)
    windowWasResized()
  }
  if (resizeObjects.length === 1 && !hasListeners) {
    hasListeners = true
    window.addEventListener('resize', resizeFunc)
  }
}

export function removeResizeObject(obj) {
  const index = resizeObjects.indexOf(obj)
  if (index > -1) {
    resizeObjects.splice(index, 1)
  }
  if (resizeObjects.length === 0) {
    hasListeners = false
    window.removeEventListener('resize', resizeFunc)
  }
}

resized()

