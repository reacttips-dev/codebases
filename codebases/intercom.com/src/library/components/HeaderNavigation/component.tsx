import classnames from 'classnames'
import debounce from 'lodash.debounce'
import { Color, mq, useMediaQuery } from 'marketing-site/src/library/utils'
import React, { useEffect, useRef, useState } from 'react'
import { HeaderNavigationCompact } from './headerNavigationCompact'
import { HeaderNavigationDesktop } from './headerNavigationDesktop'
import { IProps } from './index'

const stickyScrollThreshold = 20

export function HeaderNavigation(navProps: IProps) {
  const [isRendered, setIsRendered] = useState(false)
  const isDesktopView = useMediaQuery(`(${mq.desktop})`)
  const userHasScrolled = () => {
    return typeof window !== 'undefined' ? window.scrollY >= stickyScrollThreshold : false
  }
  const [fixed, setFixed] = useState(false)
  const listener = useRef(debounce(() => setFixed(userHasScrolled()), 100))

  useEffect(() => {
    const currentListener = listener.current
    window.addEventListener('scroll', currentListener)
    return () => window.removeEventListener('scroll', currentListener)
  }, [listener])

  useEffect(() => {
    setIsRendered(true)
  }, [isDesktopView])

  return (
    <header id="site-header" className={classnames({ 'header--fixed': fixed })}>
      <div className="container">
        {isDesktopView ? (
          <HeaderNavigationDesktop {...navProps} />
        ) : (
          <HeaderNavigationCompact {...navProps} />
        )}
      </div>

      <style jsx>
        {`
          header {
            visibility: ${isRendered ? 'visible' : 'hidden'};
            position: relative;
            position: sticky;
            top: 0;
            background-color: ${Color.White};
            width: 100%;
            height: var(--header-height, auto);
            padding: 0 var(--header-navigation-compact-px, 7%);
            padding-top: 30px;
            margin: 0 auto;
            z-index: 100; // stay above page content z-indices
          }

          .container {
            max-width: $container-max-width;
            margin: 0 auto;
            position: relative;
          }

          .container .email-form .error-text-desktop {
            position: absolute;
          }

          @media (${mq.desktop}) {
            header {
              padding-top: 37px;
              perspective: 2000px; // create 3D space for open/close animation
            }
          }

          @media (${mq.desktopLg}) {
            header {
              padding-top: 47px;
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          :root {
            --header-navigation-compact-px: 7%;
            --accordion-wrapper-py: 30px;
            --header-height: 96px;
          }

          @media (${mq.tablet}) {
            :root {
              --header-navigation-compact-px: 30px;
              --header-height: 80px;
            }
          }

          @media (${mq.laptop}) {
            :root {
              --header-navigation-compact-px: 50px;
            }
          }

          @media (${mq.desktop}) {
            :root {
              --header-navigation-compact-px: 40px;
              --header-height: 87px;
            }
          }

          @media (${mq.desktopLg}) {
            :root {
              --header-navigation-compact-px: 80px;
              --header-height: 110px;
            }
          }
        `}
      </style>
    </header>
  )
}
