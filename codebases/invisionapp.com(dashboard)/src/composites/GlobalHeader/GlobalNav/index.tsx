import React, {
  CSSProperties,
  ReactElement,
  cloneElement,
  useCallback,
} from 'react'
import cx from 'classnames'

export interface GlobalNavProps {
  globalNav: ReactElement
  isStuck: boolean
  isExpanded: boolean
  style?: CSSProperties
  headerHeight?: number
  headerLeftOffset?: number
  onMenuVisibilityChanged: (data: {
    menu: string
    status: 'open' | 'closed'
  }) => void
}

const GlobalNav = ({
  globalNav,
  isStuck,
  isExpanded,
  style,
  onMenuVisibilityChanged,
  headerHeight,
  headerLeftOffset,
  ...rest
}: GlobalNavProps) => {
  const onChange = useCallback(
    action => {
      // Allow the normal usage of onChange
      globalNav.props.onChange && globalNav.props.onChange(action)

      // Patch in the onMenuVisibilityChanged callback, this allows us to monitor if a user is interacting with a menu in global nav
      // It is used to "pin" the global nav open if a menu is opened and the user continues to scroll
      if (action.type === 'MENU_VISIBILITY_CHANGED') {
        onMenuVisibilityChanged(action.data)
      }
    },
    [globalNav, onMenuVisibilityChanged]
  )

  return (
    <div {...rest}>
      <div
        style={{
          height: isStuck || isExpanded ? headerHeight : 0,
        }}
      />
      <div
        className={cx('hds-global-header-global-nav-wrapper', {
          'hds-global-header-global-nav-wrapper-is-stuck': isStuck,
          'hds-global-header-global-nav-wrapper-is-expanded': isExpanded,
        })}
        style={{
          ...style,
          paddingLeft: isStuck || isExpanded ? headerLeftOffset : 0,
        }}
        data-banner-injection-id="global-header-nav-wrapper"
      >
        {cloneElement(globalNav, { onChange })}
      </div>
    </div>
  )
}

export default GlobalNav
