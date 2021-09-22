import React, { ReactNode, useEffect } from 'react'
import cx from 'classnames'
import { Observer } from '../Sticky'
import { useGlobalHeaderContext } from '../Provider'
import { HEADER_HEIGHT, STICKY_TABLE_HEADER_OFFSET } from '../constants'
import { hasSidebarEnabled } from '../../../helpers/hasSidebarEnabled'

export interface GlobalTableStickyHeaderWrapperProps {
  children?: ReactNode
  hasCustomChildren?: boolean
  shouldDisableNavShadow?: boolean
}

const GlobalTableStickyHeaderWrapper = ({
  shouldDisableNavShadow = false,
  children,
  hasCustomChildren = false,
}: GlobalTableStickyHeaderWrapperProps) => {
  const {
    shouldExpandGlobalNav,
    isTableHeaderStuck,
    setIsTableHeaderStuck,
    hasStickyNavBar,
    setHasStickyTableHeader,
    headerHeight,
  } = useGlobalHeaderContext()

  // The offsetTop depends on if there is a navbar or not
  let offsetTop = shouldExpandGlobalNav
    ? headerHeight + HEADER_HEIGHT + STICKY_TABLE_HEADER_OFFSET
    : HEADER_HEIGHT + STICKY_TABLE_HEADER_OFFSET
  if (!hasStickyNavBar) {
    offsetTop = shouldExpandGlobalNav ? headerHeight : 0
  }

  useEffect(() => {
    setHasStickyTableHeader(true)
    return () => {
      setHasStickyTableHeader(false)
    }
  }, [setHasStickyTableHeader])

  if (!hasSidebarEnabled()) {
    return <>{children}</>
  }

  const style = {
    '--hds-global-header-sticky-top': `${offsetTop}px`,
  } as React.CSSProperties

  const tableClasses = cx('hds-global-header-table-sticky-header', {
    'hds-global-header-table-sticky-header-is-stuck': isTableHeaderStuck,
    'hds-global-header-table-sticky-header-is-expanded': shouldExpandGlobalNav,
    'hds-global-header-disable-nav-shadow': shouldDisableNavShadow,
  })

  const customClasses = cx('hds-global-header-custom-sticky-header', {
    'hds-global-header-custom-sticky-header-is-stuck': isTableHeaderStuck,
    'hds-global-header-custom-sticky-header-is-expanded': shouldExpandGlobalNav,
    'hds-global-header-disable-nav-shadow': shouldDisableNavShadow,
  })

  return (
    <>
      <Observer
        onStickyStateChange={setIsTableHeaderStuck}
        offsetTop={offsetTop}
      />
      <div
        className={cx('hds-global-header-table-header-background', {
          'hds-global-header-table-header-background-is-stuck': isTableHeaderStuck,
          'hds-global-header-table-header-background-is-expanded': shouldExpandGlobalNav,
          'hds-global-header-disable-nav-shadow': shouldDisableNavShadow,
        })}
        style={style}
      />
      <div
        className={cx({
          [customClasses]: hasCustomChildren,
          [tableClasses]: !hasCustomChildren,
        })}
        style={style}
      >
        {children}
      </div>
    </>
  )
}

export default GlobalTableStickyHeaderWrapper
