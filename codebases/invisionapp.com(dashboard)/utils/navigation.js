import { routeActions } from 'redux-simple-router'
import { mapPathname } from './mapPaths'
import { storeRef } from '../store/store'

export function navigate (href, options = {}) {
  // With cloud-ui, programatic routing needs special care
  // This method handles if it's app-to-app, app-to-other-app, or an intentional page-refresh

  const pathname = mapPathname(href)
  if (pathname === 'unknown-path-type') {
    // App-to-app navigation with cloud-ui
    window.inGlobalContext.appShell.navigate(href)
  } else {
    // Same-app navigation with cloud-ui
    storeRef.current.dispatch(options.replace ? routeActions.replace(href) : routeActions.push(href))
  }
}
