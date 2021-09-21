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

import React, { FunctionComponent, ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import cx from 'classnames'

import {
  ButtonColor,
  EuiButtonEmptySizes,
  EuiButtonEmptyColor,
  EuiIcon,
  IconType,
} from '@elastic/eui'

import { CommonProps } from '../../types'

function getClassNameForSize(
  size: EuiButtonEmptySizes | undefined,
  buttonClass: string,
): string | undefined {
  if (!size) {
    return undefined
  }

  return {
    xs: `${buttonClass}--xSmall`,
    s: `${buttonClass}--small`,
    l: `${buttonClass}--large`,
  }[size]
}

interface Props extends CommonProps {
  color?: ButtonColor | EuiButtonEmptyColor
  iconType?: IconType
  size?: EuiButtonEmptySizes
  fill?: boolean
  children?: ReactNode
  to: LinkProps['to']
  [key: string]: any
}

// The `buttonClass` prop is internal to this file, and is not supposed to
// be supplied by consumers of the exported components.
const CuiButton: FunctionComponent<Props & { buttonClass: string }> = ({
  children,
  className,
  color = `primary`,
  iconType,
  size,
  fill = false,
  buttonClass,
  ...other
}) => {
  const sizeClass = getClassNameForSize(size, buttonClass) || ``
  const classes = cx(
    `${buttonClass} ${buttonClass}--${color}`,
    sizeClass,
    {
      [`${buttonClass}--fill`]: fill,
      [`${buttonClass}--empty`]: !fill,
    },
    className,
  )

  const icon = iconType ? <EuiIcon className={`${buttonClass}__icon`} type={iconType} /> : null

  return (
    <Link className={classes} {...other}>
      {buttonClass === 'euiButtonIcon' && icon}

      {buttonClass !== 'euiButtonIcon' && (
        <span className={`euiButtonContent ${buttonClass}__content`}>
          {icon}
          <span>{children}</span>
        </span>
      )}
    </Link>
  )
}

export function CuiRouterLinkButton(props: Props) {
  return <CuiButton {...props} buttonClass='euiButton' />
}

export function CuiRouterLinkButtonEmpty(props: Props) {
  return <CuiButton {...props} buttonClass='euiButtonEmpty' />
}

export function CuiRouterLinkButtonIcon(props: Props) {
  const { size = 'xs' } = props
  return <CuiButton {...props} buttonClass='euiButtonIcon' size={size} />
}
