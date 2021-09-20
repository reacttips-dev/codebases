import classnames from 'classnames'
import { renderEntry } from 'marketing-site/lib/render'
import React, { createRef, useEffect, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { AccordionSection } from '../../elements/AccordionSection'
import { Text } from '../../elements/Text'
import menuLineNew from '../../images/menu_line_new.svg'
import { mq, useMediaQuery } from '../../utils'
import { Color } from '../../utils/constants/colors'
import ButtonOnlyCTAContext from '../SignUpCTA/buttonOnlyCTAContext'
import { HeaderLogo } from './headerLogo'
import { HeaderNavigationCTA } from './headerNavigationCTA'
import { HeaderNavigationMenuSection } from './headerNavigationMenuSection'
import { HeaderNavigationSignInLink } from './headerNavigationSignInLink'
import { HeaderNavigationSpotlight } from './headerNavigationSpotlight'
import {
  IHeaderNavigationMenu,
  IProps,
  isHeaderNavigationLink,
  isHeaderNavigationSection,
  getUrlWithPageviewParam,
} from './index'

export function HeaderNavigationCompact({
  isTheLogoClickable,
  navigationElements,
  cta,
  signInLink,
}: IProps) {
  const isMobile = useMediaQuery(`(${mq.mobile})`, true)
  const [mobileMenuActive, setMobileMenuActive] = useState<boolean>(false)
  const hasNavigationElements = navigationElements.length > 0
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null)

  const navElementsArrLength = navigationElements.length
  const [navElementRefs, setNavElementRefs] = useState<React.RefObject<HTMLDivElement>[]>([])

  const OPEN_TRANSITION_DURATION = 500

  useEffect(() => {
    // add or remove refs
    setNavElementRefs((navElementRefs) =>
      Array(navElementsArrLength)
        .fill(null)
        .map((_, i) => navElementRefs[i] || createRef()),
    )
  }, [navElementsArrLength])

  useEffect(() => {
    // hide Intercom launcher when the menu is active
    window.Intercom &&
      window.Intercom(
        'update',
        { hide_default_launcher: mobileMenuActive }, // eslint-disable-line @typescript-eslint/camelcase
      )
  }, [mobileMenuActive])

  const renderTitleBlock = (
    navigationElement: IHeaderNavigationMenu,
    index: number,
  ): React.ReactNode => {
    return (
      <div ref={navElementRefs[index]} className="title-block-wrapper">
        <Text size="xl+">{navigationElement.title}</Text>
        <style jsx>{`
          .title-block-wrapper {
            display: inline-block;
            width: 100%;
            height: 80px;
            line-height: 80px;
            white-space: nowrap;
          }
        `}</style>
      </div>
    )
  }
  const optionallyRenderDivider = (idx: number): React.ReactNode =>
    idx !== 0 && (
      <div className="section-divider">
        <style jsx>
          {`
            .section-divider {
              width: calc(100% - 2 * var(--header-navigation-compact-px, 7%));
              margin: 30px var(--header-navigation-compact-px, 7%);
              border-top: 1px solid $ui-gray;
            }

            @media (${mq.tablet}) {
              .section-divider {
                margin: 40px var(--header-navigation-compact-px, 7%);
              }
            }
          `}
        </style>
      </div>
    )

  const navigationLink = (title: string, url: string) => {
    return (
      <li key={title}>
        <a className="header-navigation-compact__category-item" href={getUrlWithPageviewParam(url)}>
          <div className="header-navigation-compact__category-item-link-wrapper">
            <div className="header-navigation-compact__category-item-link">
              <Text size="xl+">{title}</Text>
            </div>
          </div>
        </a>
        <style jsx>{`
          .header-navigation-compact__category-item {
            padding: 0 var(--header-navigation-compact-px, 7%);
            display: inline-block;
            width: 100%;
            position: relative;
          }

          .header-navigation-compact__category-item-link-wrapper {
            border-bottom: 1px solid $ui-gray;
            padding: 22px 0;
          }

          .header-navigation-compact__category-item-link {
            color: $black;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
          }
        `}</style>
      </li>
    )
  }

  return (
    <div className="header-navigation-compact" data-testid="header-navigation-compact">
      <div className="logo-wrapper">
        <HeaderLogo isClickable={isTheLogoClickable} logoOnly={false} />
      </div>

      {hasNavigationElements ? (
        <button
          type="button"
          className={classnames('header-navigation-compact__menu-button-wrapper', {
            'header-navigation-compact__menu-button-wrapper--active': mobileMenuActive,
          })}
          aria-label="Open and close navigation menu"
          aria-haspopup="true"
          data-testid="header-navigation-compact-open"
          onClick={() => setMobileMenuActive(!mobileMenuActive)}
        >
          <span className="header-navigation-compact__menu-line header-navigation-compact__menu-line--top" />
          <span className="header-navigation-compact__menu-line header-navigation-compact__menu-line--bottom" />
        </button>
      ) : (
        <>
          <div className="horizontal_spacer" />

          {cta && (
            <ButtonOnlyCTAContext.Provider value={isMobile}>
              <HeaderNavigationCTA cta={cta} />
            </ButtonOnlyCTAContext.Provider>
          )}

          {!isMobile && signInLink && <HeaderNavigationSignInLink {...signInLink} />}
        </>
      )}

      {mobileMenuActive && (
        <div
          className={classnames('header-navigation-compact__menu', {
            'header-navigation-compact__menu--active': mobileMenuActive,
          })}
          aria-hidden={mobileMenuActive ? false : true}
          role="menu"
        >
          <div
            className="optional-background-blur"
            aria-hidden
            onClick={() => setMobileMenuActive(false)}
          ></div>
          <RemoveScroll forwardProps>
            <ul
              className={classnames(
                'header-navigation-compact__category-wrapper',
                RemoveScroll.classNames.zeroRight,
              )}
            >
              {navigationElements.map((navigationElement, index) => {
                if (isHeaderNavigationLink(navigationElement)) {
                  return navigationLink(navigationElement.title, navigationElement.url)
                } else {
                  return (
                    <AccordionSection
                      title={navigationElement.title}
                      key={navigationElement.title}
                      renderTitleBlock={() => renderTitleBlock(navigationElement, index)}
                      hasLine={index < navigationElements.length - 1}
                      largeChevron={true}
                      backgroundColor={Color.LightGray}
                      isActive={activeMenuIndex === index}
                      setIsActive={(isActive: boolean) => {
                        setActiveMenuIndex(isActive ? index : null)
                        isActive &&
                          setTimeout(() => {
                            navElementRefs[index]?.current?.scrollIntoView(true)
                          }, OPEN_TRANSITION_DURATION + 50)
                      }}
                    >
                      {navigationElement.sections &&
                        navigationElement.sections.map((sectionProps, idx) => {
                          const childElement = isHeaderNavigationSection(sectionProps) ? (
                            <HeaderNavigationMenuSection
                              key={sectionProps.title}
                              {...sectionProps}
                            />
                          ) : (
                            <HeaderNavigationSpotlight key={sectionProps.title} {...sectionProps} />
                          )
                          return (
                            <>
                              {optionallyRenderDivider(idx)}
                              {childElement}
                            </>
                          )
                        })}
                    </AccordionSection>
                  )
                }
              })}

              {signInLink && navigationLink(signInLink.title, signInLink.url)}
              {cta && <div className="cta">{renderEntry(cta!)}</div>}
            </ul>
          </RemoveScroll>
        </div>
      )}
      <style jsx>{`
        .header-navigation-compact {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-wrapper {
          margin-left: 5px;
        }

        .header-navigation-compact__menu {
          width: 100%;
          height: calc(100% - var(--header-height, 96px));
          position: fixed;
          top: var(--header-height, 96px);
          left: 0;
          transition: all ${OPEN_TRANSITION_DURATION}ms;
          opacity: 0;
          visibility: hidden;
          display: flex;

          &--active {
            opacity: 1;
            visibility: visible;
          }
        }

        .optional-background-blur {
          width: 0;
          background-color: $black;
          opacity: 25%;
        }

        .horizontal_spacer {
          flex-grow: 1;
        }

        .header-navigation-compact__menu-button-wrapper {
          width: 34px;
          height: 24px;
          position: relative;
          cursor: pointer;

          &:focus {
            outline: 1px dotted $black;
            outline-offset: 3px;
          }

          &--active {
            transform: translateX(5px);
          }

          &--active .header-navigation-compact__menu-line {
            &--top {
              transform: rotate(45deg);
            }

            &--bottom {
              transform: rotate(-45deg);
            }
          }
        }

        .header-navigation-compact__menu-line {
          backface-visibility: hidden;
          width: 100%;
          height: 4px;
          position: absolute;
          left: 0;
          top: 10px;
          transform-origin: center center;
          transition: transform 0.3s, background 0.3s;
          background-image: url('${menuLineNew}');

          &--top {
            transform: translateY(-4.5px);
          }

          &--bottom {
            transform: translateY(4.5px);
          }
        }

        .header-navigation-compact__category-wrapper {
          width: 100%;
          padding: 20px 0 0;
          background-color: $white;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .cta {
          margin: auto var(--header-navigation-compact-px, 7%) 0;
          padding: 30px 0;
        }

        @media (${mq.tablet}) {
          .header-navigation-compact__category-wrapper {
            width: 375px;
          }

          .optional-background-blur {
            flex-grow: 1;
          }
        }

        @media (${mq.laptop}) {
          .header-navigation-compact__category-wrapper {
            width: 435px;
            overflow-y: scroll;
          }
        }
      `}</style>
    </div>
  )
}
