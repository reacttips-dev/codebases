import classnames from 'classnames'
import React, { useState } from 'react'
import { Text } from '../../elements/Text'
import { mq } from '../../utils'
import { ISignInLink } from './index'

export function HeaderNavigationSignInLink({
  url,
  title,
  isAnyComponentActive,
  setIsActive,
}: ISignInLink) {
  const [isLinkActive, setIsLinkActive] = useState<boolean>(false)
  const isAnotherElementActive = isAnyComponentActive && !isLinkActive

  function toggleActiveState(isActive: boolean) {
    setIsLinkActive(isActive)
    setIsActive && setIsActive(isActive)
  }

  function handleMouseOver() {
    toggleActiveState(true)
  }

  function handleMouseOut(event: React.MouseEvent) {
    if (event.target !== document.activeElement) {
      toggleActiveState(false)
    }
  }

  function handleBlur(event: React.FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      toggleActiveState(false)
    }
  }

  return (
    <>
      <a
        href={url}
        className={classnames('link', { muted: isAnotherElementActive })}
        role="menuitem"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleMouseOver}
        onBlur={handleBlur}
        data-testid="header-navigation-sign-in-link"
      >
        <Text size="md+">{title}</Text>
      </a>
      <style jsx>{`
        .link {
          @include focusable($inlineOffset: 0, $blockOffset: 0);

          display: inline-block;
          padding: 7px 12px;
          position: relative;
          width: auto;
          color: $black;
          transition: $timing-fast;

          &:focus {
            outline: 0;
          }

          &.muted {
            opacity: 0.4;
          }
        }

        @media (${mq.desktop}) {
          .link {
            margin-right: -7px;
          }
        }
      `}</style>
    </>
  )
}
