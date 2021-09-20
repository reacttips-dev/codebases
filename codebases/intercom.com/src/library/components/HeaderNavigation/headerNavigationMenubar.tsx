import classnames from 'classnames'
import useFocusableGroup from 'marketing-site/lib/useFocusableGroup'
import React, { useState } from 'react'
import { Chevron } from '../../elements/Chevron'
import { Text } from '../../elements/Text'
import { mq } from '../../utils'
import { HeaderNavigationMenu } from './headerNavigationMenu'
import { getUrlWithPageviewParam, IHeaderNavigationMenuBar, isHeaderNavigationLink } from './index'

export function HeaderNavigationMenubar({
  navigationElements,
  setIsActive,
  isAnyComponentActive,
}: IHeaderNavigationMenuBar) {
  const [activeMenu, setActiveMenuInt] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  /* eslint-disable-next-line */
  const { itemProps, refList, focusFirst, focusLast, focusPrevious, focusNext } = useFocusableGroup<
    HTMLAnchorElement & HTMLButtonElement
  >({
    loop: true,
  })

  const setActiveMenu = (val: number | null) => {
    if (val === activeMenu) return

    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 300)

    setActiveMenuInt(val)
    setIsActive && setIsActive(val !== null)
  }

  function handleItemClick(menuIndex: number) {
    if (isTransitioning) return

    if (activeMenu === menuIndex) {
      setActiveMenu(null)
    } else {
      setActiveMenu(menuIndex)
    }
  }

  // function onRequestCloseMenu() {
  //   setActiveMenu(null)
  //   const ref = refList[activeMenu === null ? -1 : activeMenu]
  //   if (!ref) return
  //   const element = ref.current
  //   if (!element) return
  //   element.focus()
  // }

  function handleBlur(event: React.FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setActiveMenu(null)
    }
  }

  function handleMouseOver(menuIndex: number) {
    setActiveMenu(menuIndex)
  }

  function handleMouseOut(event: React.MouseEvent) {
    if (event.target !== document.activeElement) {
      setActiveMenu(null)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<any>) {
    switch (event.key) {
      case 'Home':
        event.preventDefault()
        setActiveMenu(null)
        focusFirst()
        break
      case 'End':
        event.preventDefault()
        setActiveMenu(null)
        focusLast()
        break
      case 'ArrowLeft':
        event.preventDefault()
        focusPrevious()
        activeMenu !== null && setActiveMenu(activeMenu - 1)
        break
      case 'ArrowRight':
        event.preventDefault()
        focusNext()
        activeMenu !== null && setActiveMenu(activeMenu + 1)
        break
    }
  }

  function handleItemKeyDown(event: React.KeyboardEvent<any>, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveMenu(index)
    }
  }

  return (
    <nav className="menu-item-wrapper" data-testid="header-navigation-menubar">
      <ul onKeyDown={handleKeyDown} role="menubar">
        {navigationElements.map((navigationElement, index) => {
          const { title } = navigationElement
          const isThisMenuActive = activeMenu === index

          let isAnotherMenuActive = false
          if (activeMenu === null) {
            // if no menu in the menu bar is active and another
            // component is, mute this menu
            if (isAnyComponentActive) isAnotherMenuActive = true
          } else {
            // if this menu is inactive, but another menu in the
            // menu bar is active, mute this menu
            if (!isThisMenuActive) isAnotherMenuActive = true
          }

          const id = `headernavigationmenu-${title.toLowerCase().replace(/\W/g, '')}`

          return (
            <li
              className={classnames('menu-item', { muted: isAnotherMenuActive })}
              key={title}
              role="none"
              onBlur={handleBlur}
              onMouseOver={() => handleMouseOver(index)}
              onFocus={() => handleMouseOver(index)}
              onMouseOut={handleMouseOut}
            >
              {isHeaderNavigationLink(navigationElement) ? (
                <a
                  href={getUrlWithPageviewParam(navigationElement.url)}
                  role="menuitem"
                  className={`menu-item-link test__${id}`}
                  data-testid={id}
                  {...itemProps(index)}
                >
                  <Text size="md+">{title}</Text>
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    className="menu-item-link menu-item-link-dropdown"
                    onClick={() => handleItemClick(index)}
                    onKeyDown={(event) => handleItemKeyDown(event, index)}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={isThisMenuActive}
                    id={id}
                    data-testid={id}
                    {...itemProps(index)}
                  >
                    <Text size="md+">{title}</Text>
                    <span className={classnames('chevron', { invert: isThisMenuActive })}>
                      <Chevron />
                    </span>
                  </button>
                  {!isHeaderNavigationLink(navigationElement) && (
                    <HeaderNavigationMenu
                      navigationElement={navigationElement}
                      active={isThisMenuActive}
                    />
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>
      <style jsx>{`
        .menu-item-wrapper {
          display: flex;
          align-items: center;
          padding: 0;
        }

        .menu-item {
          display: inline-block;
          position: relative;
          padding: 0;
          border: none;
          width: auto;
          transition: $timing-fast;

          &:hover {
            z-index: 1;
          }

          &.muted {
            opacity: 0.4;
          }
        }

        .menu-item-link {
          @include focusable($inlineOffset: 0, $blockOffset: 0);

          display: inline-block;
          color: $black;
          padding: 7px 10px;
          position: relative;

          &:focus {
            outline: 0;
          }

          /* Add a triangle-shaped hit zone above each menu */
          &[aria-haspopup='true']::before {
            display: block;
            content: '';
            position: absolute;
            top: 80%;
            left: 50%;
            width: 70px;
            height: 70px;
            transform: scaleX(6) translateX(-10%) rotate(45deg);
            z-index: 0;
            pointer-events: none;
          }
        }

        .menu-item:hover .menu-item-link::before {
          pointer-events: auto;
        }

        @media (${mq.desktopLg}) {
          .menu-item-wrapper {
            margin: 0 33px;
          }

          .menu-item-link-dropdown {
            margin-right: 23px;
          }
        }

        .chevron {
          display: inline-block;
          margin-left: 6px;
          vertical-align: middle;
          transition: $timing-superfast;

          &.invert {
            transform: rotate(180deg);
          }
        }
      `}</style>
    </nav>
  )
}
