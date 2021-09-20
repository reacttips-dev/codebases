import { useState, useEffect, useRef } from 'react'

export function useIsElementVisible<T extends Element>(
  intersectionRatioThreshold: number,
): [boolean, React.MutableRefObject<T | null>] {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (typeof window.IntersectionObserver === 'undefined') return
    const target = ref.current

    const visibilityChanged: IntersectionObserverCallback = function (entries) {
      entries.forEach((entry) => setIsVisible(entry.isIntersecting))
    }

    const observer = new IntersectionObserver(visibilityChanged, {
      threshold: intersectionRatioThreshold,
    })
    observer.observe(target)
    return () => observer.unobserve(target)
  })
  return [isVisible, ref]
}
