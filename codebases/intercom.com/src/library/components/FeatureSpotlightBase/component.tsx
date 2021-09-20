import React, { useRef, useState, useEffect } from 'react'
import classnames from 'classnames'
import { JumpLink } from 'marketing-site/src/library/elements/JumpLink'
import { CTALink } from '../../elements/CTALink'
import { RichText } from '../../elements/RichText'
import { Text } from '../../elements/Text'
import { getColorTheme, ColorName, Color } from '../../utils'
import { IProps } from './index'
import styles from './styles.scss'
import checkmarkwhite from '../../images/checkmark-white.svg'

export const FeatureSpotlightBase = (props: IProps) => {
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setWrap(wrapper.current)
  }, [])

  const {
    isZippered,
    isFlipped,
    eyebrow,
    heading,
    subheading,
    icon,
    iconText,
    bgColor,
    cta,
    children,
    renderMedia,
    hasTopTexture,
    jumpLink,
  } = props

  const colorTheme = getColorTheme(bgColor || Color.White)

  const featureSpotlightClassnames = classnames('feature-spotlight', {
    [`feature-spotlight--${ColorName[colorTheme.id as Color]}`]: bgColor,
    'feature-spotlight--white-checkmarks': colorTheme.textColor === Color.White,
  })

  const backgroundClassnames = classnames('feature-spotlight__background', {
    'feature-spotlight__background--hasTopTexture': hasTopTexture,
  })

  const leadClassnames = classnames('feature-spotlight__lead', {
    'feature-spotlight__lead--flipped': isFlipped,
  })

  const mediaClassnames = classnames('feature-spotlight__media', {
    'feature-spotlight__media--flipped': isFlipped,
  })

  const childrenClassnames = classnames('feature-spotlight__children', {
    'feature-spotlight__children--zippered': isZippered,
    'feature-spotlight__children--flipped': isFlipped,
  })

  return (
    <div className={featureSpotlightClassnames} ref={wrapper}>
      {jumpLink && wrap && <JumpLink {...jumpLink} container={wrap} />}
      <div className={backgroundClassnames}>
        <div className={leadClassnames}>
          {icon && (
            <div className="feature-spotlight__icon-wrapper icon__wrapper">
              <img alt="" src={icon} className="feature-spotlight__icon" />
              <div className="feature-spotlight__icon-text">
                {iconText && <Text size="md+">{iconText}</Text>}
              </div>
            </div>
          )}

          {eyebrow && (
            <span className="feature-spotlight__eyebrow">
              <Text size="lg-eyebrow">{eyebrow}</Text>
            </span>
          )}

          <h2 className="feature-spotlight__heading">
            <Text size={eyebrow ? 'xl+' : 'xxl+'}>{heading}</Text>
          </h2>

          {subheading && (
            <div className="feature-spotlight__subheading">
              <Text size={eyebrow ? 'body' : 'lg'}>
                <RichText html={subheading} />
              </Text>
            </div>
          )}
        </div>

        <div className={childrenClassnames}>
          {cta && (
            <div className="feature-spotlight__cta">
              <CTALink {...cta} arrow bgColor={colorTheme.CTATheme} />
            </div>
          )}
          {children}
        </div>

        <div className={mediaClassnames}>{renderMedia()}</div>
      </div>
      <style jsx>{styles}</style>
      <style jsx>{`
        .feature-spotlight {
          background-color: ${bgColor ? colorTheme.id : 'transparent'};
          color: ${colorTheme.textColor};
        }
      `}</style>
      <style jsx global>{`
        .feature-spotlight {
          &--white-checkmarks ul li::before {
            background-image: url(${checkmarkwhite});
          }

          &__media {
            video {
              border-radius: 25px;
              overflow: hidden;
            }
          }
        }
      `}</style>
    </div>
  )
}
