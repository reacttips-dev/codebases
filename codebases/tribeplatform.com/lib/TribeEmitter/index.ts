import EventEmitter from 'eventemitter3'

export enum TribeEmitterEvent {
  PAGE_VIEW = 'pageView',
}

declare global {
  interface Window {
    prevPage?: string
  }
}

const eventEmitter = new EventEmitter()

const TribeEmitter = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
  clearListeners: (eventName?: string) =>
    eventEmitter.removeAllListeners(eventName || TribeEmitterEvent.PAGE_VIEW),
}

Object.freeze(TribeEmitter)

export default TribeEmitter
