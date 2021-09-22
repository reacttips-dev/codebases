import React from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../../helpers/omitType'
import { hasSidebarEnabled } from '../../../helpers/hasSidebarEnabled'

export interface GlobalHeaderContainerProps extends HTMLProps<HTMLDivElement> {
  hasPadding?: boolean
  maxWidth?: any
}

const GlobalHeaderContainer = (props: GlobalHeaderContainerProps) => {
  const { hasPadding, maxWidth, className, children, ...rest } = props
  return (
    <div
      {...rest}
      className={cx('hds-global-header-container', {
        'hds-global-header-container-no-padding': !hasPadding,
        'hds-global-header-container-has-max-width': maxWidth != null,
        'hds-global-header-container-has-sidebar-enabled': hasSidebarEnabled(),
      })}
      style={{
        maxWidth,
      }}
    >
      {children}
    </div>
  )
}

GlobalHeaderContainer.defaultProps = {
  hasPadding: true,
}

export default GlobalHeaderContainer
