import { hasSidebarEnabled } from './appShell'

const STORAGE_KEY = 'sidebar-initial-state'

// Determine if user is new to the sidebar from
// non-sidebar views.
export function setInitialSidebarState () {
  const value = hasSidebarEnabled()

  try {
    const initialValue = window.localStorage.getItem(STORAGE_KEY)
    if (!initialValue) {
      window.localStorage.setItem(STORAGE_KEY, value + '')
    }
  } catch (e) {}
}

export function isClassicUser () {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value) {
      return value !== 'true'
    } else {
      return false
    }
  } catch (e) {
    // Returning false since we don't want
    // to accidentally show ftux when it's
    // not needed
    return false
  }
}
