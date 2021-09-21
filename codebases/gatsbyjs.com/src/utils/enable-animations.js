const getAnimationsEnabled = () => {
  // Don't check during SSR
  if (typeof window === `undefined`) {
    return true
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  )

  return prefersReducedMotion.matches
}

export default getAnimationsEnabled
