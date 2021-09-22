import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from 'react'
import { TABLET } from '../constants'

type ScrollDirection = 'up' | 'down'
const SCROLL_UP: ScrollDirection = 'up'
const SCROLL_DOWN: ScrollDirection = 'down'

type ContextProps = {
  scrollDirection: ScrollDirection
  shouldExpandGlobalNav: boolean
  isStuck: boolean
  setIsStuck: (stuck: boolean) => void
  isNavStuck: boolean
  setIsNavStuck: (stuck: boolean) => void
  isNavButtonSmaller: boolean
  setIsNavButtonSmaller: (stuck: boolean) => void
  isTableHeaderStuck: boolean
  setIsTableHeaderStuck: (stuck: boolean) => void
  hasStickyNavBar: boolean
  setHasStickyNavBar: (stuck: boolean) => void
  hasStickyTableHeader: boolean
  setHasStickyTableHeader: (stuck: boolean) => void
  setShouldForceGlobalNavOpen: (stuck: boolean) => void
  headerHeight: number
  setHeaderHeight: (cb: (n: number) => number) => void
  headerLeftOffset: number
  setHeaderLeftOffset: (cb: (n: number) => number) => void
  setShouldForceExpandedGlobalNav: (boolean: boolean) => void
}

export const GlobalHeaderContext = createContext<ContextProps>({
  scrollDirection: SCROLL_DOWN,
  shouldExpandGlobalNav: false,
  isStuck: false,
  setIsStuck: () => {},
  isNavStuck: false,
  setIsNavStuck: () => {},
  isNavButtonSmaller: false,
  setIsNavButtonSmaller: () => {},
  isTableHeaderStuck: false,
  setIsTableHeaderStuck: () => {},
  hasStickyNavBar: false,
  setHasStickyNavBar: () => {},
  hasStickyTableHeader: false,
  setHasStickyTableHeader: () => {},
  setShouldForceGlobalNavOpen: () => {},
  headerHeight: 67,
  setHeaderHeight: () => {},
  headerLeftOffset: 0,
  setHeaderLeftOffset: () => {},
  setShouldForceExpandedGlobalNav: () => {},
})

interface GlobalHeaderContextProps {
  children?: ReactNode
}

const GlobalHeaderProvider = ({ children }: GlobalHeaderContextProps) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    SCROLL_DOWN
  )
  const [isStuck, setIsStuck] = useState(false)
  const [isNavStuck, setIsNavStuck] = useState(false)
  const [isNavButtonSmaller, setIsNavButtonSmaller] = useState(false)
  const [isTableHeaderStuck, setIsTableHeaderStuck] = useState(false)
  const [hasStickyNavBar, setHasStickyNavBar] = useState(false)
  const [hasStickyTableHeader, setHasStickyTableHeader] = useState(false)
  const [shouldForceGlobalNavOpen, setShouldForceGlobalNavOpen] = useState(
    false
  )
  const [isMobile, setIsMobile] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(67)
  const [headerLeftOffset, setHeaderLeftOffset] = useState(0)
  const [
    shouldForceExpandedGlobalNav,
    setShouldForceExpandedGlobalNav,
  ] = useState(false)

  useEffect(() => {
    const threshold = 28
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updateScrollDir = () => {
      if (isMobile) {
        // No need for this check on mobile
        return
      }

      if (shouldForceGlobalNavOpen) {
        // Disable checking scroll direction when the global nav is being interacted with
        // And reset it so that the user has to continue their scroll to close the nav again
        setScrollDirection(SCROLL_UP)
        return
      }

      const scrollY = window.pageYOffset

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // We haven't exceeded the threshold
        ticking = false
        return
      }

      setScrollDirection(scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP)
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [shouldForceGlobalNavOpen, isMobile])

  const onResize = useCallback(() => {
    const newIsMobile = window.innerWidth < TABLET
    if (newIsMobile !== isMobile) {
      setIsMobile(newIsMobile)
    }
  }, [isMobile])

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  // Determine if the global nav should be open or not
  // It is open when the navigation is stuck and the user is scrolling up
  // Or when forceGlobalNavOpen is on (this is toggled on when a user is interacting with the global nav, when a global nav menu is open)
  // Or when there are less than 2 other sticky menus
  const expandGlobalNavIfScrollingUp =
    (!hasStickyNavBar || isStuck) && scrollDirection === SCROLL_UP
  const lessThan2MenusExist = !hasStickyNavBar || !hasStickyTableHeader
  const shouldExpandGlobalNav =
    lessThan2MenusExist ||
    isMobile ||
    shouldForceGlobalNavOpen ||
    expandGlobalNavIfScrollingUp ||
    shouldForceExpandedGlobalNav

  return (
    <GlobalHeaderContext.Provider
      value={{
        scrollDirection,
        shouldExpandGlobalNav,
        isStuck,
        setIsStuck,
        isNavStuck,
        setIsNavStuck,
        isNavButtonSmaller,
        setIsNavButtonSmaller,
        isTableHeaderStuck,
        setIsTableHeaderStuck,
        hasStickyNavBar,
        setHasStickyNavBar,
        hasStickyTableHeader,
        setHasStickyTableHeader,
        setShouldForceGlobalNavOpen,
        headerHeight,
        setHeaderHeight,
        headerLeftOffset,
        setHeaderLeftOffset,
        setShouldForceExpandedGlobalNav,
      }}
    >
      {children}
    </GlobalHeaderContext.Provider>
  )
}

export const useGlobalHeaderContext = () => useContext(GlobalHeaderContext)

export default GlobalHeaderProvider
