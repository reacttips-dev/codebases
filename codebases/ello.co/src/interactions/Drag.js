const dragObjects = []
const dragThreshold = 5
let dragX = 0
let dragY = 0
let dragged = false
let hasListeners = false
let isDragging = false
let lastDragX = 0
let lastDragY = 0
let lastX = -1
let lastY = -1
let target = null
let totalDrag = 0
let totalDragX = 0
let totalDragY = 0

function reset() {
  dragX = 0
  dragY = 0
  dragged = false
  isDragging = false
  lastDragX = 0
  lastDragY = 0
  lastX = -1
  lastY = -1
  target = null
  totalDrag = 0
  totalDragX = 0
  totalDragY = 0
}

export type DragProps = {
  dragX: number,
  dragY: number,
  dragged: boolean,
  lastDragX: number,
  lastDragY: number,
  lastX: number,
  lastY: number,
  target: Element,
  totalDrag: number,
  totalDragX: number,
  totalDragY: number,
}

function callMethod(method) {
  const props = {
    dragX,
    dragY,
    dragged,
    lastDragX,
    lastDragY,
    lastX,
    lastY,
    target,
    totalDrag,
    totalDragX,
    totalDragY,
  }
  dragObjects.forEach((obj) => {
    if (obj.component[method] && target.dataset.dragId === obj.dragId) {
      obj.component[method](props)
    }
  })
}

function dragMove(x, y) {
  lastDragX = dragX
  lastDragY = dragY
  dragX += x - lastX
  dragY += y - lastY
  totalDragX += Math.abs(x - lastX)
  totalDragY += Math.abs(y - lastY)
  lastX = x
  lastY = y
  totalDrag = totalDragX + totalDragY
  dragged = (totalDrag > dragThreshold)
  callMethod('onDragMove')
}

function mouseMove(e) {
  if (!isDragging) return
  dragMove(e.clientX, e.clientY)
}

function touchMove(e) {
  if (!isDragging) return
  dragMove(e.touches[0].clientX, e.touches[0].clientY)
}

function dragEnd() {
  if (!isDragging) return
  callMethod('onDragEnd')
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('touchmove', touchMove)
  document.removeEventListener('mouseup', dragEnd)
  document.removeEventListener('touchend', dragEnd)
  // this gives us enough time to respond on the frame
  // of the mouse/touch event to know if we dragged when it fired.
  requestAnimationFrame(() => {
    reset()
  })
}

function dragStart(x, y, t) {
  reset()
  target = t
  lastX = x
  lastY = y
  isDragging = true
  callMethod('onDragStart')
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('touchmove', touchMove)
  document.addEventListener('mouseup', dragEnd)
  document.addEventListener('touchend', dragEnd)
}

function mouseDown(e) {
  // return if not the drag handler || fix android exception
  if ((e.target && typeof e.target.className === 'string' &&
       e.target.className.indexOf('DragHandler') === -1) ||
      !e.target.classList) { return }
  dragStart(e.clientX, e.clientY, e.target)
}

function touchStart(e) {
  // return if not the drag handler || fix android exception
  if (e.target.className.indexOf('DragHandler') === -1 ||
      !e.target.classList) return
  dragStart(e.touches[0].clientX, e.touches[0].clientY)
}

function addListeners() {
  document.addEventListener('mousedown', mouseDown)
  document.addEventListener('touchstart', touchStart)
}

function removeListeners() {
  document.removeEventListener('mousedown', mouseDown)
  document.removeEventListener('touchstart', touchStart)
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('touchmove', touchMove)
  document.removeEventListener('mouseup', dragEnd)
  document.removeEventListener('touchend', dragEnd)
}

export function addDragObject(obj) {
  if (dragObjects.indexOf(obj) === -1) {
    dragObjects.push(obj)
  }
  if (dragObjects.length === 1 && !hasListeners) {
    hasListeners = true
    addListeners()
  }
}

export function removeDragObject(obj) {
  const index = dragObjects.indexOf(obj)
  if (index > -1) {
    dragObjects.splice(index, 1)
  }
  if (dragObjects.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

