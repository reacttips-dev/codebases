import React from 'react'
import { AnalyticsEvent, CTATheme, renderIconSVG, Icon } from '../../utils'
import classnames from 'classnames'
import { Text } from '../Text'
import { IProps } from './index'
import { LoadingAnimation } from '../LoadingAnimation'
import styles from './styles.scss'

export const CTAButton = ({
  text,
  arrow = true,
  bgColor,
  small,
  onClick,
  dataAttribute,
  eventContext,
  type = 'button',
  loading,
  icon,
  disabled = false,
}: IProps) => {
  const dataAttributeObject = dataAttribute ? { [dataAttribute]: 'true' } : {}
  const analyticsEvent = new AnalyticsEvent({
    action: 'clicked',
    object: 'cta_button',
    context: eventContext || text.toLowerCase().split(' ').join('_'),
  })

  const handleClick = function (e: React.MouseEvent) {
    analyticsEvent.setPlaceFromPath(window.location.pathname)
    analyticsEvent.send()
    return onClick(e)
  }

  const themeNames: Record<CTATheme, string> = {
    [CTATheme.BlackFill]: 'black-fill',
    [CTATheme.BlackOutline]: 'black-outline',
    [CTATheme.WhiteOutline]: 'white-outline',
    [CTATheme.LinkOnlyBlack]: 'link-only-black',
    [CTATheme.LinkOnlyWhite]: 'link-only-white',
    [CTATheme.TealFill]: 'teal-fill',
    [CTATheme.BlackFillTransparentHover]: 'black-fill-transparent-hover',
  }

  return (
    <button
      type={type}
      className={classnames('cta-button', `cta-button--${themeNames[bgColor]}`, {
        'cta-button--small': small,
      })}
      data-testid="cta-button"
      {...dataAttributeObject}
      onClick={handleClick}
      disabled={loading || disabled}
    >
      {loading && (
        <div className="email-form__submit__loading-indicator">
          <LoadingAnimation />
        </div>
      )}
      <span style={{ opacity: loading ? 0 : 1 }}>
        <Text size="md+">{text}</Text>
        {icon ? renderIconSVG(icon) : arrow && renderIconSVG(Icon.Arrow, 'cta-button__arrow')}
      </span>
      <style jsx>{styles}</style>
    </button>
  )
}
