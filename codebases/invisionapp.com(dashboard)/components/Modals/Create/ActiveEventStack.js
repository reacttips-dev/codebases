import { OrderedMap, Map } from 'immutable'
import uniqueId from 'lodash/uniqueId'

// IMPORTANT:
// This file is a straight port from https://www.npmjs.com/package/active-event-stack
// which hasn't been updated in years and has a security issue due to the version of loadash it used when last shipped

const uniqueEventId = uniqueId.bind(null, 'active_event_')

// avoid setting global state before home as a feature is mounted
// also handle invoking handlers when running in contexts outside of CAFE 2.0
const appShell = window.inGlobalContext && window.inGlobalContext.appShell
const featureContext = appShell && appShell.getFeatureContext('home')
const whenMounted = appShell ? appShell.getFeatureContext('home').on.bind(featureContext, 'before:mount') : (cb) => { cb() }
const whenUnmounted = appShell ? appShell.getFeatureContext('home').on.bind(featureContext, 'before:unmount') : () => {}

let clickHandler = onEvent.bind(null, 'click')
let keydownHandler = onEvent.bind(null, 'keydown')
let keyupHandler = onEvent.bind(null, 'keyup')

whenMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', clickHandler, true)
    document.addEventListener('keydown', keydownHandler)
    document.addEventListener('keyup', keyupHandler)
  }
})

whenUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', clickHandler, true)
    document.removeEventListener('keydown', keydownHandler)
    document.removeEventListener('keyup', keyupHandler)
  }
})

let listenables = OrderedMap()

function onEvent (type, event) {
  const listenable = listenables.last()
  if (listenable) {
    let handler = listenable.get(type)
    if (typeof handler === 'function') {
      handler(event)
    }
  }
}

const EventStack = {
  addListenable (listenArray) {
    /* ex: [['click', clickHandler], ['keydown', keydownHandler]] */
    const id = uniqueEventId()
    const listenable = Map(listenArray)
    listenables = listenables.set(id, listenable)
    return id
  },
  removeListenable (id) {
    listenables = listenables.delete(id)
  }
}

export default EventStack
