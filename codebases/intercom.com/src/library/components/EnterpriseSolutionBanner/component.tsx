import React from 'react'
import { IProps } from './index'
import { CTALink } from '../../elements/CTALink'
import { RichText } from '../../elements/RichText'
import { Text } from '../../elements/Text'
import { Color, getColorTheme, mq, useMediaQuery } from '../../utils'
import styles from './styles.scss'
import { Image } from '../../elements/Image'

export const EnterpriseSolutionBanner = (props: IProps) => {
  const { heading, subheading, icon, cta, imageRef, bgColor = Color.White } = props

  const colorTheme = getColorTheme(bgColor)

  const isTabletOrAbove = useMediaQuery(`(${mq.tablet})`)

  return (
    <div className="enterprise-solution-banner enterprise-solution-banner--theme">
      <div className="enterprise-solution-banner__background">
        <div className="enterprise-solution-banner__lead">
          <div className="enterprise-solution-banner__icon-wrapper icon__wrapper">
            {icon && <img alt="icon" src={icon} className="enterprise-solution-banner__icon" />}
            <h2 className="enterprise-solution-banner__heading">
              <Text size="md+">{heading}</Text>
            </h2>
          </div>

          {subheading && (
            <div className="enterprise-solution-banner__subheading">
              <Text size="body">
                <RichText html={subheading} />
              </Text>
            </div>
          )}
        </div>

        <div className="enterprise-solution-banner__children">
          {cta && (
            <div className="enterprise-solution-banner__cta">
              <CTALink {...cta} />
            </div>
          )}
        </div>

        <div className="enterprise-solution-banner__media">
          {imageRef && isTabletOrAbove && (
            <div className="enterprise-solution-banner__image-wrapper">
              <Image {...imageRef} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .enterprise-solution-banner--theme {
          background: ${colorTheme.backgroundColor};
        }
      `}</style>

      <style jsx>{styles}</style>
    </div>
  )
}
