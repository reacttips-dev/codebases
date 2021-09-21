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

import classNames from 'classnames'

import React, { ReactNode, FunctionComponent } from 'react'

import { EuiBadge } from '@elastic/eui'

import './boolBadge.scss'

type Props = {
  value: any
  truthyLabel: ReactNode
  truthyColor?: 'secondary'
  falsyLabel: ReactNode
  falsyColor?: 'danger' | 'warning'
}

export const CuiBoolBadge: FunctionComponent<Props> = ({
  value,
  truthyLabel,
  truthyColor = 'secondary',
  falsyLabel,
  falsyColor = 'warning',
}) => {
  const truthy = Boolean(value)

  const classes = classNames('cuiBoolBadge', {
    [`cuiBoolBadge-truthy--${truthyColor}`]: truthy,
    [`cuiBoolBadge-falsy--${falsyColor}`]: truthy === false,
  })

  return (
    <EuiBadge className={classes} iconType={truthy ? 'check' : 'cross'} color='hollow'>
      {truthy ? truthyLabel : falsyLabel}
    </EuiBadge>
  )
}
