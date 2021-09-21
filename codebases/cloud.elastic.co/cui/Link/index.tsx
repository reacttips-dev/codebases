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

import React, { ComponentType, FunctionComponent } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import cx from 'classnames'

import { EuiLinkColor } from '@elastic/eui'

import { StrictOmit } from '../../lib/ts-essentials'
import { CommonProps } from '../../types'

import './cuiLink.scss'

type AnchorProps = {
  to: LinkProps['to']
  className?: string
}

interface CuiRouterLinkProps extends CommonProps, LinkProps {
  component: ComponentType<AnchorProps>
  color?: EuiLinkColor | 'inherit'
}

export const CuiLinkCustom: FunctionComponent<CuiRouterLinkProps> = ({
  component: LinkTag,
  children,
  className,
  color = `primary`,
  ...other
}) => {
  const inherit = color === 'inherit'

  const classes = cx(
    `euiLink`,
    {
      [`euiLink--${color}`]: !inherit,
      'cuiLink--inheritColor': inherit,
    },
    className,
  )

  return (
    <LinkTag className={classes} {...other}>
      {children}
    </LinkTag>
  )
}

type CuiLinkProps = StrictOmit<CuiRouterLinkProps, 'component'>

export const CuiLink: FunctionComponent<CuiLinkProps> = ({ ...props }) => (
  <CuiLinkCustom component={Link} {...props} />
)
