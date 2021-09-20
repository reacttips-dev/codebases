import classnames from 'classnames'
import { CTALink } from 'marketing-site/src/library/elements/CTALink'
import { Logo } from 'marketing-site/src/library/elements/Logo'
import edgeTexture from 'marketing-site/src/library/images/bottom-texture-11.svg'
import { containerMaxWidth, gridGap, mq, getColorTheme } from 'marketing-site/src/library/utils'
import React from 'react'
import { HeadingsPair } from './headingsPair'
import { Headings, IProps, ISingleHeading } from './index'
import { SingleHeading } from './singleHeading'

function isSingleHeading(headings: Headings): headings is ISingleHeading {
  return !!(headings as ISingleHeading).heading
}

export const LogoParty = (props: IProps) => {
  const { headings, bgColor, small, fullWidth, textAlign, noPadding, logos, cta, opacity } = props
  const themeColors = getColorTheme(bgColor)
  const logoPartyClassNames = classnames('logo-party', {
    'logo-party-full-width': fullWidth,
    'logo-party-small': small,
    'logo-party-no-padding': noPadding,
  })

  return (
    <div className={logoPartyClassNames}>
      <div className="content">
        <div className="headings">
          {isSingleHeading(headings) ? (
            <SingleHeading {...headings} />
          ) : (
            <HeadingsPair {...headings} />
          )}
        </div>
        <ol className="logos">
          {logos.map((logo) => {
            return (
              <li className="logo" key={logo.logoUrl}>
                <Logo {...logo} />
              </li>
            )
          })}
        </ol>
        {cta && (
          <div className="cta">
            <CTALink {...cta} bgColor={themeColors.CTATheme} />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .logo-party {
            position: relative;
            display: grid;
            grid-template-columns: [left-gutter] 1fr [content] 12fr [right-gutter] 1fr;
            grid-column-gap: ${gridGap.mobile};
            background-color: ${themeColors.backgroundColor};
            padding: ${themeColors.backgroundColor !== '#FFFFFF' ? '100px 0' : '0'};
            text-align: ${textAlign};
            color: ${themeColors.textColor};
            opacity: ${opacity ? opacity : 1};
          }

          .logo-party:after {
            content: '';
            position: absolute;
            z-index: -1;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: ${themeColors.backgroundColor};
            height: 18px;
            mask-image: url(${edgeTexture});
            mask-repeat: repeat no-repeat;
            transform: translateY(13px);
          }

          .content {
            grid-column: content;
            max-width: ${containerMaxWidth};
            margin: 0 auto;
          }

          .headings {
            max-width: 820px;
            margin: 0 auto 36px;
            position: relative;
          }

          .logos {
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: ${textAlign};
            align-items: center;
          }

          .logo {
            margin: 8px 16px;
            max-width: 120px;
            max-height: 32px;

            :global(img) {
              max-width: inherit;
              max-height: inherit;
            }
          }

          .logo-party-small .logo {
            max-width: 80px;
            max-height: 25px;
          }

          .cta {
            margin-top: 36px;
          }

          .logo-party-full-width {
            display: block;

            .content {
              max-width: none;
            }

            .headings {
              margin: 0;
            }

            .logo:first-child {
              margin-left: 0;
            }

            .logo:last-child {
              margin-right: 0;
            }
          }

          .logo-party-no-padding {
            padding: 0;
          }

          @media (${mq.tablet}) {
            .logo-party {
              grid-template-columns: [left-gutter] 1fr [content] 12fr [right-gutter] 1fr;
              grid-column-gap: ${gridGap.desktop};
            }

            .logo {
              margin: 12px 24px;
              max-width: 160px;
              max-height: 50px;
            }

            .logo-party-small .logo {
              margin: 8px 16px;
              max-width: 80px;
              max-height: 25px;
            }

            .cta {
              margin-top: 36px;
            }
          }
        `}
      </style>
    </div>
  )
}
