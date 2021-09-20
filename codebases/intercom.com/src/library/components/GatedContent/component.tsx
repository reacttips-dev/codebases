import classnames from 'classnames'
import React from 'react'
import { Image } from '../../elements/Image'
import { Text } from '../../elements/Text'
import { ColorName as themeNames, getColor, getColorTheme, HeadingStyle, mq } from '../../utils'
import EdgeTexture from '../../images/edge-texture.svg'
import { AllColors as BrandColors } from '../../utils/constants/themes'
import { IProps } from './index'
import { TextAlign } from '../../utils/constants/textAlign'
import { LogoParty } from '../LogoParty/component'

export const GatedContent = ({
  bgColor,
  heading,
  subheading,
  subheadingLinkText,
  subheadingLinkUrl,
  renderEmailForm,
  texturedBorder,
  image,
  enableBorders,
  logoParty,
  icon,
  eyebrow,
}: IProps) => {
  const compatibleColor = getColor(bgColor)
  const classes = classnames(
    'gated-content',
    `gated-content-theme theme-${themeNames[compatibleColor as BrandColors]}`,
    {
      'gated-content--image': image,
      'gated-content--logo-party': logoParty,
      'gated-content--textured-border': texturedBorder,
    },
  )
  const theme = getColorTheme(bgColor)

  const showEyebrow = eyebrow || icon

  return (
    <div className={classes}>
      <div className="background">
        {/* Image? */}
        <div className="image">{image && <Image {...image} />}</div>
        {/* Left Column */}
        <div className="text-container">
          {/* Eyebrow */}
          {showEyebrow && (
            <div className="eyebrow-container">
              {icon && <img alt="icon" src={icon} className="icon" />}
              {eyebrow && <Text size="lg-eyebrow">{eyebrow}</Text>}
            </div>
          )}

          {/* Heading */}
          {!logoParty && (
            <p className="heading">
              <Text size="xxl+">{heading}</Text>
            </p>
          )}

          {/* Subeading */}
          {subheading && (
            <div className="subheading">
              <Text size="body">{subheading}</Text>
            </div>
          )}

          {subheadingLinkText && subheadingLinkUrl && (
            <div className="subheading-link">
              <a href={subheadingLinkUrl}>
                <Text size="body">{subheadingLinkText}</Text>
              </a>
            </div>
          )}

          {logoParty && (
            <LogoParty
              {...logoParty}
              headings={{
                heading: heading,
                style: HeadingStyle.Tiny,
                magicSparklesEffectEnabled: false,
              }}
              bgColor={bgColor}
              textAlign={TextAlign.Center}
              noPadding
              fullWidth
            />
          )}

          {/* Image causes CTA to be nested inside of text container */}
          {image && <div className="email-form">{renderEmailForm()}</div>}
        </div>
        {/* Right Column */}
        {!image && <div className="email-form">{renderEmailForm()}</div>}
      </div>
      <style jsx>{`
        .gated-content-theme {
          background-color: ${theme.backgroundColor};
          color: ${theme.textColor};

          .background:before,
          .background:after {
            background-color: ${theme.backgroundColor};
          }
        }

        .background {
          display: grid;
          background-size: cover;
          grid-template-columns:
            [gutter-left] 1fr
            [content] 12fr
            [gutter-right] 1fr;
          padding: 60px 0;
          max-width: $container-max-width;
          margin: 0 auto;
          position: relative;
        }

        .gated-content--textured-border .background:before,
        .gated-content--textured-border .background:after {
          content: '';
          position: absolute;
          height: 18px;
          left: 50%;
          mask-image: 'none';
          mask-repeat: repeat no-repeat;
          width: 106vw; // bumped up from 100vw to ensure svg is fullwidth at all screensizes
          z-index: -1;
          mask-image: url(${EdgeTexture});
        }

        .gated-content--textured-border {
          .background:before {
            top: -17px;
            transform: translateX(-50%) rotate(180deg);
          }

          .background:after {
            bottom: -17px;
            transform: translateX(-50%);
          }
        }

        :global(.gated-content .image img) {
          box-shadow: 0px 5px 10px rgba(75, 75, 75, 0.11), 0px 5px 20px rgba(89, 89, 89, 0.12);
          border-radius: ${enableBorders ? '25px' : '0'};
        }

        :global(.gated-content--logo-party .logo) {
          margin: 8px 16px;
          max-width: 130px;
          max-height: 40px;
        }

        :global(.gated-content--logo-party .headings span) {
          font-size: 22px;
        }

        .image {
          display: none;
        }

        .text-container,
        .email-form {
          grid-column: content;
          text-align: center;
        }

        .text-container {
          padding-bottom: 20px;
        }

        .subheading {
          margin: 16px 0;
        }

        .subheading-link a {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid;
        }

        .subheading-link a:hover,
        .subheading-link a:focus {
          border-bottom: 1px solid;
          outline: none;
        }

        .eyebrow-container {
          margin-bottom: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .icon {
          width: 28px;
          height: 28px;
        }

        @media (${mq.laptop}) {
          .background {
            grid-template-columns:
              [gutter-left] 3fr
              [content] 8fr
              [gutter-right] 3fr;
          }

          .email-form {
            display: flex;
            justify-content: center;
          }
        }

        @media (${mq.desktop}) {
          .background {
            grid-template-columns:
              [gutter-left] 1fr
              [text-container] 5fr
              [gap] 1fr
              [email-form] 4fr
              [gutter-right] 1fr;
            padding: 100px 0;
          }

          .gated-content--image {
            .background {
              grid-template-columns:
                [gutter-left] 1fr
                [image] 3fr
                [gap] 1fr
                [text-container] 6fr
                [gutter-right] 1fr;
            }

            .image {
              display: block;
              grid-column: image;
              max-width: 348px;
            }

            .email-form {
              margin-top: 15px;
              text-align: left;
              justify-content: flex-start;
            }
          }

          .gated-content--logo-party {
            .background {
              grid-template-columns:
                [gutter-left] 1fr
                [text-container] 6fr
                [gap] 1fr
                [email-form] 3fr
                [gutter-right] 1fr;
            }

            .email-form {
              margin-top: 15px;
              justify-content: center;
            }
          }

          .text-container {
            grid-column: text-container;
            text-align: left;
            align-self: center;
          }

          .text-container {
            padding-bottom: 0;
          }

          .email-form {
            grid-column: email-form;
            align-self: center;
          }
        }

        @media (${mq.desktopLg}) {
          .gated-content--logo-party {
            .background {
              grid-template-columns:
                [gutter-left] 1.5fr
                [text-container] 5fr
                [gap] 1fr
                [email-form] 3fr
                [gutter-right] 1.5fr;
            }
          }
        }
      `}</style>
    </div>
  )
}
