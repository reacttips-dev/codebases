/* global requestAnimationFrame, cancelAnimationFrame */
import React, { ReactNode, ReactElement, useEffect, useRef } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import TabNav from '../../components/TabNav'
import Sticky, { Observer } from './Sticky'
import GlobalNav from './GlobalNav'
import Container from './Container'
import { useGlobalHeaderContext } from './Provider'
import GlobalHeaderCTA from './GlobalHeaderCTA'
import { TabNavItems } from '../../components/TabNav/types'
import { GlobalHeaderCTANodes } from './types'
import { CreateButtonOrder } from '../../components/CreateButton/types'

const useAnimationFrame = (callback: (n: number) => any) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<any>()
  const previousTimeRef = useRef<number>()

  const animate = (time: number) => {
    if (previousTimeRef.current != null) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])
  /* eslint-disable react-hooks/exhaustive-deps */
}

export interface GlobalHeaderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  title: string | ReactElement
  globalNav: ReactElement
  shouldDisableNavShadow?: boolean
  hasBottomMargin?: boolean
  ctaNodes?: GlobalHeaderCTANodes
  hasNoContainer?: boolean
  items?: TabNavItems
  children?: ReactNode
  rightAlignedItems?: ReactNode
  shouldForceExpandedGlobalNav?: boolean
  hasSelectableTitle?: boolean
  documentType?: CreateButtonOrder
}

const GlobalHeader = (props: GlobalHeaderProps) => {
  const {
    children,
    className,
    title,
    ctaNodes,
    items,
    globalNav,
    shouldDisableNavShadow = false,
    hasBottomMargin = true,
    hasNoContainer,
    rightAlignedItems,
    shouldForceExpandedGlobalNav = false,
    hasSelectableTitle = false,
    documentType,
    ...rest
  } = props
  const {
    shouldExpandGlobalNav,
    isStuck,
    setIsStuck,
    setIsNavStuck,
    setIsNavButtonSmaller,
    isTableHeaderStuck,
    hasStickyNavBar,
    setHasStickyNavBar,
    hasStickyTableHeader,
    setShouldForceGlobalNavOpen,
    headerHeight,
    setHeaderHeight,
    headerLeftOffset,
    setHeaderLeftOffset,
    isNavButtonSmaller,
    setShouldForceExpandedGlobalNav,
  } = useGlobalHeaderContext()

  useAnimationFrame(() => {
    setHeaderHeight((prevTotal: number) => {
      const w = document.querySelector(
        '[data-banner-injection-id="global-header-nav-wrapper"]'
      )
      if (!w) {
        return prevTotal
      }
      const rect = w.getBoundingClientRect()
      if (!rect) {
        return prevTotal
      }
      const { height } = rect
      const total = height
      return total
    })
  })

  useAnimationFrame(() => {
    setHeaderLeftOffset((prevTotal: number) => {
      const w = document.querySelector('.hds-global-header')
      if (!w) {
        return prevTotal
      }
      const rect = w.getBoundingClientRect()
      if (!rect) {
        return prevTotal
      }
      const { left } = rect
      const total = left
      return total
    })
  })

  useEffect(() => {
    if (shouldForceExpandedGlobalNav) setShouldForceExpandedGlobalNav(true)
  }, [])

  useEffect(() => {
    // There is only a sticky navbar when there are nav items
    if (items) {
      setHasStickyNavBar(true)
    } else {
      setHasStickyNavBar(false)
    }
  }, [items, setHasStickyNavBar])

  const resizeButtonOffset = 29

  const placeGlobalNavOutsideRoot = !hasStickyNavBar && !hasStickyTableHeader

  return (
    <>
      {/* When there is no navbar or table header (eg: settings), the transition is smoother to have the Global Nav outside of Root */}
      {placeGlobalNavOutsideRoot && (
        <GlobalNav
          globalNav={globalNav}
          isStuck={isStuck}
          headerHeight={headerHeight}
          isExpanded={shouldExpandGlobalNav}
          onMenuVisibilityChanged={data => {
            setShouldForceGlobalNavOpen(data.status === 'open')
          }}
        />
      )}

      <div
        {...rest}
        className={cx('hds-global-header', className)}
        style={{
          pointerEvents:
            hasStickyNavBar && !hasSelectableTitle ? 'none' : 'auto', // so the floating CTA can be clickable
        }}
      >
        {!placeGlobalNavOutsideRoot && (
          <GlobalNav
            globalNav={globalNav}
            isStuck={isStuck}
            isExpanded={shouldExpandGlobalNav}
            headerHeight={headerHeight}
            onMenuVisibilityChanged={data => {
              setShouldForceGlobalNavOpen(data.status === 'open')
            }}
            headerLeftOffset={headerLeftOffset}
          />
        )}
        <Container hasPadding={!hasNoContainer}>
          <div
            className={cx('hds-global-header-top-section', {
              'hds-global-header-top-section-has-no-children':
                !items && !children,
            })}
          >
            {typeof title === 'string' ? (
              <Text
                size="heading-32"
                color="surface-100"
                style={{ lineHeight: '48px' }}
                as="h1"
              >
                {title}
              </Text>
            ) : (
              title
            )}

            {/* The CTA is static when there is no navbar */}
            {ctaNodes && !hasStickyNavBar && (
              <GlobalHeaderCTA
                ctaNodes={ctaNodes}
                buttonOffset={headerHeight}
                documentType={documentType}
              />
            )}
          </div>
          {children && (
            <div className="hds-global-header-extra-content">{children}</div>
          )}
        </Container>
        <Observer
          onStickyStateChange={setIsNavButtonSmaller}
          offsetTop={headerHeight + resizeButtonOffset}
        />
        <Observer
          onStickyStateChange={setIsNavStuck}
          offsetTop={headerHeight}
        />
      </div>

      <Sticky
        onStickyStateChange={setIsStuck}
        offsetTop={shouldExpandGlobalNav ? headerHeight : 0}
      >
        {hasStickyNavBar && (
          <div
            className={cx('hds-global-header-header', {
              'hds-global-header-header-no-margin': !hasBottomMargin,
              'hds-global-header-header-has-no-shadow': shouldDisableNavShadow,
              'hds-global-header-header-has-shadow':
                !shouldDisableNavShadow && isStuck && !isTableHeaderStuck,
            })}
          >
            <Container hasPadding={!hasNoContainer}>
              <div className="hds-global-header-nav-container">
                {items && (
                  <TabNav className="hds-global-header-tab-nav" items={items} />
                )}
                {rightAlignedItems && (
                  <div
                    className={cx('hds-global-header-right-aligned', {
                      'hds-flex': !isNavButtonSmaller,
                      'hds-hidden': isNavButtonSmaller,
                    })}
                  >
                    {rightAlignedItems}
                  </div>
                )}
                {ctaNodes && (
                  <GlobalHeaderCTA
                    ctaNodes={ctaNodes}
                    buttonOffset={headerHeight}
                    documentType={documentType}
                  />
                )}
              </div>
            </Container>
          </div>
        )}
      </Sticky>
    </>
  )
}

export default GlobalHeader
