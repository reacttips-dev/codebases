import React, { useState } from 'react'
import { mq } from '../../utils'
import { HeaderLogo } from './headerLogo'
import { HeaderNavigationCTA } from './headerNavigationCTA'
import { HeaderNavigationMenubar } from './headerNavigationMenubar'
import { HeaderNavigationSignInLink } from './headerNavigationSignInLink'
import { IProps } from './index'

export function HeaderNavigationDesktop({
  navigationElements,
  navigationElementsAlignRight,
  cta,
  isTheLogoClickable,
  signInLink,
}: IProps) {
  const [isMenuElementActive, setIsMenuElementActive] = useState<boolean>(false)
  const shouldSyncMenuElementsState = !cta
  return (
    <div data-testid="header-navigation-desktop">
      <div className="container">
        <div className="logo-wrapper">
          <HeaderLogo isClickable={isTheLogoClickable} logoOnly={false} />
        </div>

        {navigationElementsAlignRight && <div className="horizontal_spacer" />}

        {navigationElements.length > 0 && (
          <div className="navigation-elements-wrapper">
            <HeaderNavigationMenubar
              navigationElements={navigationElements}
              setIsActive={setIsMenuElementActive}
              isAnyComponentActive={shouldSyncMenuElementsState && isMenuElementActive}
            />
          </div>
        )}

        {!navigationElementsAlignRight && <div className="horizontal_spacer" />}

        {cta && (
          <div className="cta-wrapper">
            <HeaderNavigationCTA cta={cta} />
          </div>
        )}

        {signInLink && (
          <div className="signin-link-wrapper">
            <HeaderNavigationSignInLink
              {...signInLink}
              setIsActive={setIsMenuElementActive}
              isAnyComponentActive={shouldSyncMenuElementsState && isMenuElementActive}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
        }

        .horizontal_spacer {
          flex-grow: 1;
        }

        .navigation-elements-wrapper {
          margin: 0 ${cta ? '12px' : '0'};
        }

        .cta-wrapper:not(:last-child) {
          margin-right: 5px;
        }

        @media (${mq.desktop}) {
          .navigation-elements-wrapper {
            margin: 0 ${cta ? '20px' : '0'};
          }
        }

        @media (${mq.desktopLg}) {
          .cta-wrapper:not(:last-child) {
            margin-right: 18px;
          }

          .navigation-elements-wrapper {
            margin: 0 ${cta ? '43px' : '0'};
          }
        }
      `}</style>
    </div>
  )
}
