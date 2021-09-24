import { cloneDeep } from 'lodash'

import { Get, Set, Tribe } from 'lib/dom/@types/window'
import TribeEmitter from 'lib/TribeEmitter'

declare global {
  interface Window {
    Tribe: {
      get: Get
      set: Set
      on: (event: string, callback: (...args: any) => void) => void
      off: (event: string, callback: (...args: any) => void) => void
    }
  }
}

const isClient = typeof window !== 'undefined'

export const initializeTribeWindow = () => {
  if (isClient && !window.Tribe) {
    // Create an immutable Tribe object in window
    Object.defineProperty(window, 'Tribe', {
      value: (() => {
        const tribeWindow: Tribe = {
          themeSettings: null,
        }

        // Return a deep copy of tribeWindow, so it cannot be mutated
        const get: Get = () => cloneDeep(tribeWindow)

        const set: Set = (key, value) => {
          // Update tribeWindow only if given key already exists
          if (key in tribeWindow) {
            tribeWindow[key] = value
          }
        }

        // Public API of Tribe object consists of getter and setter
        return {
          get,
          set,
          on: TribeEmitter.on,
          off: TribeEmitter.off,
        }
      })(),
      writable: false,
    })
  }
}

export const setGlobalTribeSettings: Set = (key, value) => {
  if (isClient) {
    window.Tribe.set(key, value)
  }
}

export const getGlobalTribeSettings = (
  key?: keyof Tribe,
): Tribe | Tribe[keyof Tribe] => {
  if (isClient && window.Tribe) {
    return key ? window.Tribe.get()[key] : window.Tribe.get()
  }

  return null
}
