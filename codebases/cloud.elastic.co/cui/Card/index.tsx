/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

/**
 * This is a fork of EuiCard, the only significant different being
 * that the `description` content is wrapped in a `div` instead of a `p`.
 * We did raise this upstream, but it was decided not to alter the
 * upstream component.
 */

import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

import { EuiBetaBadge, EuiIcon, EuiText, EuiTitle, getSecureRelForTarget } from '@elastic/eui'

import { CommonProps } from '../../types'

/**
 * Infers the type of a component's props. EUI also provides this, but in this file
 * the EUI definition doesn't work. Until we sort that out, we'll keep using this version.
 */
type PropsOf<SomeComponent> = SomeComponent extends React.ComponentType<infer SomeProps>
  ? SomeProps
  : never

interface CuiCardProps {
  children?: ReactNode

  title: ReactNode

  /**
   * Determines the title's heading element. Will force to 'span' if
   * the card is a button.
   */
  titleElement?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

  description: ReactNode

  /**
   * Requires a <EuiIcon> node
   */
  icon?: ReactElement<PropsOf<typeof EuiIcon>>

  /**
   * Accepts a url in string form
   */
  image?: string

  /**
   * Accepts any combination of elements
   */
  footer?: ReactNode

  /**
   * Use only if you want to forego a button in the footer and make the whole card clickable
   */
  onClick?: () => any
  href?: string
  target?: string
  rel?: string
  textAlign?: 'left' | 'center' | 'right'

  /**
   * Change to "horizontal" if you need the icon to be left of the content
   */
  layout?: 'vertical' | 'horizontal'

  /**
   * Add a badge to the card to label it as "Beta" or other non-GA state
   */
  betaBadgeLabel?: string | ReactElement<typeof FormattedMessage>

  /**
   * Add a description to the beta badge (will appear in a tooltip)
   */
  betaBadgeTooltipContent?: ReactNode

  /**
   * Optional title will be supplied as tooltip title or title attribute otherwise the label will be used
   */
  betaBadgeTitle?: string

  isClickable?: boolean
}

export type Props = CommonProps & CuiCardProps

const textAlignToClassNameMap = {
  left: `euiCard--leftAligned`,
  center: `euiCard--centerAligned`,
  right: `euiCard--rightAligned`,
}

const layoutToClassNameMap = {
  vertical: ``,
  horizontal: `euiCard--horizontal`,
}

export const CuiCard: FunctionComponent<Props> = ({
  className,
  description,
  title,
  titleElement = 'span',
  icon,
  image,
  footer,
  onClick,
  href,
  rel,
  target,
  textAlign = 'center',
  isClickable,
  betaBadgeLabel,
  betaBadgeTooltipContent,
  betaBadgeTitle,
  layout = 'vertical',
  ...rest
}) => {
  if (layout === `horizontal` && (image || footer)) {
    throw new Error(`layout='horizontal' cannot be used in conjunction with 'image' or 'footer'.`)
  }

  const classes = classNames(
    `euiCard`,
    textAlign ? textAlignToClassNameMap[textAlign] : undefined,
    layout ? layoutToClassNameMap[layout] : undefined,
    {
      'euiCard--isClickable': onClick || href || isClickable,
      'euiCard--hasBetaBadge': betaBadgeLabel,
      'euiCard--hasIcon': icon,
    },
    className,
  )

  let secureRel

  if (href) {
    secureRel = getSecureRelForTarget({ href, target, rel })
  }

  let imageNode

  if (image && layout === `vertical`) {
    imageNode = <img className='euiCard__image' src={image} alt='' />
  }

  let iconNode

  if (icon) {
    iconNode = React.cloneElement(icon, {
      className: classNames(icon.props.className, `euiCard__icon`),
    })
  }

  let OuterElement = `div`

  if (href) {
    OuterElement = `a`
  } else if (onClick) {
    OuterElement = `button`
  }

  let TitleElement = titleElement

  if (OuterElement === `button`) {
    TitleElement = `span`
  }

  let optionalCardTop

  if (imageNode || iconNode) {
    optionalCardTop = (
      <span className='euiCard__top'>
        {imageNode}
        {iconNode}
      </span>
    )
  }

  let optionalBetaBadge

  if (betaBadgeLabel) {
    optionalBetaBadge = (
      <span className='euiCard__betaBadgeWrapper'>
        <EuiBetaBadge
          label={betaBadgeLabel}
          title={betaBadgeTitle}
          tooltipContent={betaBadgeTooltipContent}
          className='euiCard__betaBadge'
        />
      </span>
    )
  }

  return (
    // @ts-ignore
    <OuterElement
      onClick={onClick}
      className={classes}
      href={href}
      target={target}
      rel={secureRel}
      {...rest}
    >
      {optionalBetaBadge}

      {optionalCardTop}

      <span className='euiCard__content'>
        <EuiTitle className='euiCard__title'>
          <TitleElement>{title}</TitleElement>
        </EuiTitle>

        <EuiText size='s' className='euiCard__description'>
          <div>{description}</div>
        </EuiText>
      </span>

      {layout === `vertical` && <span className='euiCard__footer'>{footer}</span>}
    </OuterElement>
  )
}
