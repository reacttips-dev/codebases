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

import React, { FunctionComponent, Fragment, ReactNode } from 'react'
import classNames from 'classnames'

import { EuiText, EuiTitle } from '@elastic/eui'

import { withSmallErrorBoundary } from '../Boundary'

import { CommonProps } from '../../types'

const colorToClassNameMap = {
  default: null,
  subdued: 'euiStat__title--dark',
  primary: 'euiStat__title--primary',
  secondary: 'euiStat__title--secondary',
  danger: 'euiStat__title--danger',
  accent: 'euiStat__title--accent',
}

const textAlignToClassNameMap = {
  left: 'euiStat--leftAligned',
  center: 'CeiStat--centerAligned',
  right: 'euiStat--rightAligned',
}

interface Props extends CommonProps {
  /**
   * Set the title (value) text
   */
  title: ReactNode

  /**
   * Set the description (label) text
   */
  description: ReactNode

  /**
   * Places the title (value) above the description (label)
   */
  reverse?: boolean

  /**
   * Define the size of the title text. See EuiTitle for sizing options ('s', 'm', 'l'... etc)
   */
  titleSize?: 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l'

  /**
   * Define the color of the title text
   */
  titleColor?: keyof typeof colorToClassNameMap

  /**
   * Define how you want the content aligned
   */
  textAlign?: keyof typeof textAlignToClassNameMap

  /**
   * Define the element that will contain the stat content
   */
  statElement?: 'div' | 'p' | 'strong'
}

const CuiStatImpl: FunctionComponent<Props> = ({
  children,
  statElement: StatElement = 'p',
  className,
  description,
  title,
  titleSize = 'l',
  titleColor = 'default',
  textAlign = 'left',
  reverse = false,
  ...rest
}) => {
  const classes = classNames('euiStat', textAlignToClassNameMap[textAlign], className)

  const titleClasses = classNames('euiStat__title', colorToClassNameMap[titleColor])

  const descriptionDisplay = (
    <EuiText size='s' className='euiStat__description'>
      <StatElement>{description}</StatElement>
    </EuiText>
  )

  const titleDisplay = (
    <EuiTitle size={titleSize} className={titleClasses}>
      <StatElement>{title}</StatElement>
    </EuiTitle>
  )

  let statDisplay

  if (reverse) {
    statDisplay = (
      <Fragment>
        {titleDisplay}
        {descriptionDisplay}
      </Fragment>
    )
  } else {
    statDisplay = (
      <Fragment>
        {descriptionDisplay}
        {titleDisplay}
      </Fragment>
    )
  }

  return (
    <div className={classes} {...rest}>
      {statDisplay}
      {children}
    </div>
  )
}

export const CuiStat = withSmallErrorBoundary(CuiStatImpl)
