import classnames from 'classnames'
import { kebabCase } from 'lodash'
import mergeQueryParams from 'marketing-site/lib/mergeQueryParams'
import { setTeammateAppUrl } from 'marketing-site/lib/teammateAppUrl'
import CTALinkOverridePropsContext from 'marketing-site/src/components/context/CTALinkOverridePropsContext'
import SignupCTAParamsContext from 'marketing-site/src/components/context/SignupCTAParamsContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { AnalyticsEvent, CTATheme, Icon, renderIconSVG } from '../../utils'
import { Text } from '../Text'
import { IProps } from './index'
import styles from './styles.scss'

export function CTALink(props: IProps) {
  const overrideProps = useContext(CTALinkOverridePropsContext)
  const {
    url,
    text: label,
    arrow = true,
    bgColor,
    newWindow = false,
    small,
    eventContext,
    eventObjectName,
    dataAttribute,
    wide,
    textSize,
    openMessenger,
    preloadedMessengerText,
    anchorRef,
    tighter,
  } = { ...props, ...overrideProps }

  const additionalParams = useContext(SignupCTAParamsContext)
  const urlWithAdditionalParams = mergeQueryParams(setTeammateAppUrl(url), additionalParams)
  const shouldUseNextTransition = ['/welcome-to-intercom', '/features'].some((url) =>
    urlWithAdditionalParams.startsWith(url),
  )
  const router = useRouter()

  useEffect(() => {
    if (shouldUseNextTransition) router.prefetch(urlWithAdditionalParams)
  }, [router, shouldUseNextTransition, urlWithAdditionalParams])

  const handleClick = function (event: React.MouseEvent<HTMLAnchorElement>) {
    if (eventContext) {
      const data = {
        action: 'clicked',
        object: eventObjectName || 'cta_link',
        context: eventContext,
      }
      const analyticsEvent = new AnalyticsEvent(data)
      analyticsEvent.setPlaceFromPath(window.location.pathname)
      analyticsEvent.send()
    }

    if (!event.currentTarget || !event.currentTarget.href) {
      return
    }

    // Custom bots will only fire off the first matching element on a page. This is an internal API from team-operator to work around this
    if (eventObjectName && eventObjectName.includes('talk_to_sales_test_cta')) {
      window.Intercom('trigger', '12768')
    }

    if (openMessenger) {
      window.Intercom('showNewMessage', preloadedMessengerText)
    }

    // Use Next.js router for the transition if the link is relative
    if (shouldUseNextTransition) {
      event.preventDefault()
      router.push(urlWithAdditionalParams)
    }
  }

  const dataAttributeObject = dataAttribute ? { [dataAttribute]: 'true' } : {}

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
    <a
      ref={anchorRef}
      className={classnames(`cta-link cta-link--${themeNames[bgColor]}`, {
        'cta-link--small': small,
        'cta-link--wide': wide,
        'cta-link--tighter': tighter,
      })}
      data-testid={`cta-link-${kebabCase(label)}`}
      href={urlWithAdditionalParams}
      target={newWindow ? '_blank' : ''}
      rel={newWindow ? 'noopener' : ''}
      onClick={handleClick}
      {...dataAttributeObject}
    >
      <Text size={textSize || 'md+'}>{label}</Text>
      {arrow && renderIconSVG(Icon.Arrow, 'cta-link__arrow')}
      <style jsx>{styles}</style>
    </a>
  )
}
