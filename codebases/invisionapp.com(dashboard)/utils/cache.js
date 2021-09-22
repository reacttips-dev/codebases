import { storeRef } from '../store/store'

function getStorage () {
  const appShell = window.inGlobalContext && window.inGlobalContext.appShell

  if (appShell) {
    const appContext = appShell.getFeatureContext('home')
    return appContext.storage
  }

  return null
}

export function getItem (key, defaultValue) {
  try {
    const storage = getStorage()
    if (storage) {
      const value = storage.getItem(key)

      if (value) {
        return JSON.parse(value)
      }
    }
    return defaultValue
  } catch (e) {
    console.warn('Unable to retrieve item from storage')
    return defaultValue
  }
}

export function setItem (key, value) {
  if (storeRef && storeRef.current && storeRef.current.getState().config.cacheReducers) {
    try {
      const storage = getStorage()
      if (storage) {
        storage.setItem(key, JSON.stringify(value))
      }
    } catch (e) {
      console.warn('Unable to set item in storage')
    }
  }
}
