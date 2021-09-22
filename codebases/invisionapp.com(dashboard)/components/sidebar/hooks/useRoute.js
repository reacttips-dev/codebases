import React, { useEffect, useState, createContext, useContext } from 'react'

const originalPushState = window.history.pushState
const originalReplaceState = window.history.replaceState

const url = new URL(window.location.href)
export const RouteContext = createContext(url)

export const RouteProvider = ({ children }) => {
  const [href, setHref] = useState(window.location.href)

  function handlePopState (event) {
    setHref(window.location.href)
  }

  useEffect(() => {
    window.addEventListener('popstate', handlePopState)

    // Monkeypatch pushState and replaceState
    window.history.pushState = (...args) => {
      setHref(args[args.length - 1])
      originalPushState.call(window.history, ...args)
    }

    window.history.replaceState = (...args) => {
      setHref(args[args.length - 1])
      originalReplaceState.call(window.history, ...args)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  const url = new URL(href, window.location.origin)

  return <RouteContext.Provider value={url}>{children}</RouteContext.Provider>
}

export const useRoute = () => useContext(RouteContext)
