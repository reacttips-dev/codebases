import React from "react"

export default function useMatchMedia(media) {
  const normalizedMedia = media.replace(`@media `, ``)

  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.matchMedia(normalizedMedia).matches
  })

  React.useEffect(() => {
    const listener = e => {
      setMatches(e.matches)
    }

    const mediaQueryList = window.matchMedia(normalizedMedia)

    mediaQueryList.addListener(listener)

    return () => {
      mediaQueryList.removeListener(listener)
    }
  }, [media])

  return matches
}
