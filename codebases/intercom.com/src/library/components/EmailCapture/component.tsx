import React from 'react'
import { CheckMarks } from '../../elements/CheckMarks'
import { CTALink } from '../../elements/CTALink'
import { RichText } from '../../elements/RichText/component'
import { Text } from '../../elements/Text'
import emailPatternImage from '../../images/email_pattern.gif'
import { containerMaxWidth, mq, getColorTheme } from '../../utils'
import { CTATheme } from '../../utils/constants/themes'
import { Color } from 'marketing-site/src/library/utils/constants/colors'
import { IProps } from './index'
import classNames from 'classnames/bind'
import { useMediaQuery } from 'marketing-site/src/library/utils/mediaQuery'

const styles = {
  asBiggerCard: 'email-capture--as-bigger-card',
}

const getComponentClassNames = classNames.bind(styles)

export const EmailCapture = ({
  bgColor,
  bgImage,
  checkmarks,
  cta,
  fullWidth = true,
  heading,
  subheading,
  renderEmailForm,
  asBiggerCard,
}: IProps) => {
  const isMobile = useMediaQuery(`(${mq.mobile})`)
  const gridWidth = fullWidth === true ? 14 : 12
  const gridStart = fullWidth === true ? 1 : 2
  const themeColors = getColorTheme(bgColor)

  const getCTAColor = () =>
    bgColor !== Color.Black ? CTATheme.LinkOnlyBlack : CTATheme.LinkOnlyWhite

  return (
    <div className={getComponentClassNames('email-capture', { asBiggerCard })}>
      <div className="background">
        {/* Left Column */}
        <div className="text-container">
          {/* Heading */}
          <p className="heading">
            <Text size={isMobile ? 'xl' : 'xxl+'}>{heading}</Text>
          </p>
          {/* Subeading */}
          {subheading && (
            <div className="subheading">
              <Text size="body">
                <RichText html={subheading} />
              </Text>
            </div>
          )}
          {/* CTA link */}
          {cta && (
            <span className="cta">
              <CTALink {...cta} bgColor={getCTAColor()} />
            </span>
          )}
        </div>
        {/* Right Column */}
        <div className="form">
          {renderEmailForm()}
          {/* Checkmarks */}
          {checkmarks && (
            <span className="checkmarks">
              <CheckMarks {...checkmarks} inverse={themeColors.textColor === Color.White} />
            </span>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .email-capture {
            display: grid;
            grid-template-columns: repeat(14, 1fr);
            background-color: ${fullWidth ? themeColors.backgroundColor : 'unset'};
            background-image: ${bgImage && fullWidth ? `url(${emailPatternImage})` : 'unset'};
            background-size: ${fullWidth && bgImage ? 'cover' : 'unset'};
            background-position: center center;

            &--as-bigger-card {
              margin-top: 60px;
            }
          }

          .background {
            display: grid;
            background-color: ${fullWidth ? 'unset' : themeColors.backgroundColor};
            background-image: ${bgImage && !fullWidth ? `url(${emailPatternImage})` : 'unset'};
            background-size: cover;
            background-position: center center;
            border-radius: ${fullWidth ? 0 : '25px'};
            grid-template-columns: repeat(${gridWidth}, 1fr);
            grid-column: ${gridStart} / span ${gridWidth};
            padding: 60px 0;
            width: 100%;
          }

          .text-container,
          .form {
            grid-column: 2 / span ${gridWidth - 2};
            text-align: center;
          }

          .text-container {
            color: ${themeColors.textColor};
            padding-bottom: 20px;
          }

          .heading {
            margin-bottom: 16px;
            word-break: break-word;
          }

          .cta {
            display: block;
            margin-top: 12px;
          }

          .checkmarks {
            display: inline-block;
            margin-top: 13px;
          }

          @media (${mq.tablet}) {
            .background {
              padding: 60px 0;
              max-width: ${containerMaxWidth};
              margin: 0 auto;
            }
          }

          @media (${mq.desktop}) {
            .email-capture {
              grid-column-gap: 24px;
              grid-template-columns: [left-gutter] 1fr [content] 12fr [right-gutter] 1fr;
              &--as-bigger-card {
                grid-column-gap: 0;
                margin-top: 130px;
              }
            }
            .background {
              grid-column: ${fullWidth ? '1 / span 3' : 'content'};
              grid-template-columns: [gutter-left] 1fr [email-text] 6fr [gap] 1fr [form] 5fr [gutter-right] 1fr;
              padding: 100px 0;
            }

            .text-container {
              grid-column: email-text;
              text-align: left;
              align-self: center;
              padding-bottom: 0;
            }

            .checkmarks {
              display: flex;
              justify-content: flex-end;
            }

            .form {
              grid-column: form;
              align-self: center;
            }
          }
        `}
      </style>
    </div>
  )
}
