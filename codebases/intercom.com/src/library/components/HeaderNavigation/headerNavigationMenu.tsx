import classnames from 'classnames'
import React from 'react'
import { Color, mq } from 'marketing-site/src/library/utils'
import { HeaderNavigationMenuSection } from './headerNavigationMenuSection'
import { HeaderNavigationSpotlight } from './headerNavigationSpotlight'
import {
  IHeaderNavigationMenu,
  IHeaderNavigationMenuSection,
  IHeaderNavigationSpotlight,
  isHeaderNavigationSection,
  isSectionWide,
} from './index'

const GRID_SPOTLIGHT_WIDTH = '322px'

export interface IProps {
  navigationElement: IHeaderNavigationMenu
  active: boolean
}

function getSectionsGridTemplate(
  sections: (IHeaderNavigationMenuSection | IHeaderNavigationSpotlight)[],
) {
  switch (sections.length) {
    case 4:
      // Four sections, the last one being a Spotlight, separated by dividers
      return `minmax(310px, 5fr) 1fr 2fr 1fr 2fr minmax(10px, 1fr) ${GRID_SPOTLIGHT_WIDTH}`
    default:
      return sections
        .map((section) => {
          if (isHeaderNavigationSection(section)) {
            // Width for each section and a separator
            return isSectionWide(section) ? '3fr 0.5fr' : '1fr 0.5fr'
          } else {
            // Spotlight gets fixed width
            return GRID_SPOTLIGHT_WIDTH
          }
        })
        .join(' ')
  }
}

export function HeaderNavigationMenu({ navigationElement, active }: IProps) {
  const { title, sections } = navigationElement
  return (
    <div className={classnames('menu', { active })} data-testid="header-navigation-menu">
      <div className="menu-wrapper" key={title} aria-haspopup="true" aria-expanded={active}>
        <div className="spacer"></div>
        <div className="sections">
          {sections &&
            sections.map((section, index) => {
              if (isHeaderNavigationSection(section)) {
                return (
                  <>
                    {index > 0 && <div className="section-divider"></div>}
                    <HeaderNavigationMenuSection key={section.title} {...section} />
                  </>
                )
              } else {
                return (
                  <>
                    {/* This empty div is needed for the grid layout, to create
                    spacing before the spotlight */}
                    <div></div>
                    <HeaderNavigationSpotlight key={section.title} {...section} />
                  </>
                )
              }
            })}
        </div>
      </div>

      <style jsx>{`
        .menu {
          position: fixed;
          margin: 0 auto;
          top: var(--header-height);
          left: 0;
          right: 0;

          /* Add 3D rotation on open/close */
          &.active {
            opacity: 1;
            pointer-events: auto;
          }
          opacity: 0;
          pointer-events: none;
          --menu-sections-py: 25px;
        }

        .menu-wrapper {
          box-shadow: 0px 10px 18px rgba(0, 0, 0, 0.05);
          background-color: ${Color.White};
          padding-left: calc(
            max((100% - #{$container-max-width}) / 2, var(--header-navigation-compact-px))
          );
        }

        .spacer {
          position: fixed;
          left: 0;
          right: 0;
          background-color: ${Color.LightGray};
          height: 1px;
        }

        .sections {
          display: grid;
          grid-template-columns: ${getSectionsGridTemplate(sections)};
          justify-content: space-between;
        }

        .section-divider {
          width: 30px;
        }

        @media (${mq.desktop}) {
          .menu {
            &.active {
              transform: rotateX(0);
            }
            // shift origin up for larger arc of rotation
            transform-origin: center -20px;
            transform: rotateX(-15deg);
            transition: transform $timing-fast, opacity $timing-fast;
          }
        }

        @media (${mq.desktopLg}) {
          .sections {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}
