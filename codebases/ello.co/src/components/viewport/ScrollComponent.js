let hasWindowListener = false
let lastScrollDirection = null
let lastScrollY = null
let ticking = false
const scrollObjects = []
const scrollTargetObjects = []

// SHARED METHODS
// -------------------------------------

function callMethod(component, method, scrollProperties) {
  if (component[method]) {
    component[method](scrollProperties)
  }
}

function getScrollDirection(scrollY) {
  if (Math.abs(lastScrollY - scrollY) >= 20) {
    return (scrollY > lastScrollY) ? 'down' : 'up'
  }
  return lastScrollDirection
}

// This is handy, but we're not using it anywhere at the moment
function getScrollPercent(bottom, top, val) {
  let bottomRange = bottom
  let topRange = top
  let valueInRange = val
  topRange += -bottomRange
  valueInRange += -bottomRange
  bottomRange += -bottomRange
  return Math.round(((valueInRange / (topRange - bottomRange)) * 100))
}

function getScrollAction(scrollProperties) {
  const { scrollY, scrollBottom, scrollDirection } = scrollProperties
  if (scrollY === 0) {
    return 'onScrollTop'
  } else if (Math.abs(scrollY - scrollBottom) < 20) {
    return 'onScrollBottom'
  } else if (scrollY < 0) {
    return 'onScrollPull'
  } else if (scrollY > scrollBottom) {
    return 'onScrollPush'
  } else if (scrollDirection !== lastScrollDirection) {
    return 'onScrollDirectionChange'
  }
  return null
}

// SCROLLING THE WINDOW
// -------------------------------------

function getScrollY() {
  return Math.ceil(window.pageYOffset)
}

function getScrollHeight() {
  return Math.max(document.body.scrollHeight, document.body.offsetHeight)
}

function getScrollBottom(scrollHeight) {
  return Math.round(scrollHeight - window.innerHeight)
}

function getScrollProperties() {
  const scrollY = getScrollY()
  const scrollHeight = getScrollHeight()
  const scrollBottom = getScrollBottom(scrollHeight)
  return {
    scrollY,
    scrollHeight,
    scrollBottom,
    scrollPercent: getScrollPercent(0, scrollBottom, scrollY),
    scrollDirection: getScrollDirection(scrollY),
  }
}

function scrolled() {
  const scrollProperties = getScrollProperties()
  const scrollAction = getScrollAction(scrollProperties)
  scrollObjects.forEach((obj) => {
    callMethod(obj, 'onScroll', scrollProperties)
    if (scrollAction) {
      callMethod(obj, scrollAction, scrollProperties)
    }
    lastScrollY = scrollProperties.scrollY
    lastScrollDirection = scrollProperties.scrollDirection
  })
}

function windowWasScrolled() {
  if (!ticking) {
    requestAnimationFrame(() => {
      scrolled()
      ticking = false
    })
    ticking = true
  }
}

export function addScrollObject(obj) {
  if (scrollObjects.indexOf(obj) === -1) {
    scrollObjects.push(obj)
  }
  if (scrollObjects.length === 1 && !hasWindowListener) {
    hasWindowListener = true
    window.addEventListener('scroll', windowWasScrolled)
  }
}

export function removeScrollObject(obj) {
  const index = scrollObjects.indexOf(obj)
  if (index > -1) {
    scrollObjects.splice(index, 1)
  }
  if (scrollObjects.length === 0) {
    hasWindowListener = false
    window.removeEventListener('scroll', windowWasScrolled)
  }
}

// SCROLLING AN ELEMENT
// -------------------------------------

function getTargetScrollX(el) {
  return Math.ceil(el.scrollLeft)
}

function getTargetScrollY(el) {
  return Math.ceil(el.scrollTop)
}

function getTargetScrollHeight(el) {
  return Math.max(el.scrollHeight, el.offsetHeight)
}

function getTargetScrollBottom(scrollHeight, el) {
  return Math.round(scrollHeight - el.offsetHeight)
}

function getTargetScrollProperties(el) {
  const scrollX = getTargetScrollX(el)
  const scrollY = getTargetScrollY(el)
  const scrollHeight = getTargetScrollHeight(el)
  const scrollBottom = getTargetScrollBottom(scrollHeight, el)
  return {
    scrollX,
    scrollY,
    scrollHeight,
    scrollBottom,
    scrollPercent: getScrollPercent(0, scrollBottom, scrollY),
  }
}

function targetScrolled(e) {
  const obj = scrollTargetObjects.find(o => e.target === o.element)
  if (!obj) { return }
  const scrollProperties = getTargetScrollProperties(obj.element)
  const scrollAction = getScrollAction(scrollProperties)
  callMethod(obj.component, 'onScrollTarget', scrollProperties)
  if (scrollAction) {
    callMethod(obj.component, `${scrollAction}Target`, scrollProperties)
  }
  if (obj.timeoutId) {
    clearTimeout(obj.timeoutId)
    obj.timeoutId = null
  }
  const checkForScrollComplete = () => {
    if (scrollProperties.scrollX === getTargetScrollX(obj.element)) {
      clearTimeout(obj.timeoutId)
      obj.timeoutId = null
      callMethod(obj.component, 'onScrollCompleteTarget', scrollProperties)
    }
  }
  obj.timeoutId = setTimeout(checkForScrollComplete, 50)
}

function targetWasScrolled(e) {
  if (!ticking) {
    requestAnimationFrame(() => {
      targetScrolled(e)
      ticking = false
    })
    ticking = true
  }
}

export function addScrollTarget(obj) {
  if (scrollTargetObjects.indexOf(obj) === -1) {
    scrollTargetObjects.push(obj)
    obj.element.addEventListener('scroll', targetWasScrolled)
  }
}

export function removeScrollTarget(obj) {
  const index = scrollTargetObjects.indexOf(obj)
  if (index > -1) {
    scrollTargetObjects.splice(index, 1)
    obj.element.removeEventListener('scroll', targetWasScrolled)
  }
}

