const keyObjects = []
let hasListeners = false

function callMethod(method, keyProperties) {
  keyObjects.forEach((obj) => {
    if (obj[method]) {
      obj[method](keyProperties)
    }
  })
}

function onKeyDown(e) {
  callMethod('onKeyDown', e)
}

function onKeyUp(e) {
  callMethod('onKeyUp', e)
}

function addListeners() {
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('keydown', onKeyDown)
}

function removeListeners() {
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('keydown', onKeyDown)
}

export function addKeyObject(obj) {
  if (keyObjects.indexOf(obj) === -1) {
    keyObjects.push(obj)
    addListeners()
  }
  if (keyObjects.length === 1 && !hasListeners) {
    hasListeners = true
  }
}

export function removeKeyObject(obj) {
  const index = keyObjects.indexOf(obj)
  if (index > -1) {
    keyObjects.splice(index, 1)
  }
  if (keyObjects.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

