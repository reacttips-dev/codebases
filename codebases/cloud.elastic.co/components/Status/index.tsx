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

import React from 'react'
import cx from 'classnames'
import jif from 'jif'

import { EuiIcon, EuiLoadingSpinner, IconType } from '@elastic/eui'

import './status-dot.scss'

export type StatusValue = boolean | 'stopped' | 'warning' | 'maintenance'

type Props = {
  status?: StatusValue | null
  iconType?: IconType
  iconShape?: string
  className?: string
  pending?: boolean
  quiet?: boolean
}

function Status({ status, iconType, iconShape = 'default', className, pending, quiet }: Props) {
  const isDefault = iconShape === `default`
  const isStandalone = iconShape === `standalone`
  const isDot = iconShape === `dot`

  const statusClasses = cx(
    `status`,
    {
      'status-foreground': isStandalone || isDot,
      'status-background': isDefault,
      'status--pending': pending,
      'status--ok': !pending && status === true,
      'status--error': !pending && status === false,
      'status--warning': status === `warning` || status === `maintenance`,
      'status--stopped': status === `stopped`,
      'status--quiet': quiet,
    },
    className,
  )

  const icon = getStatusIcon({ isDot, status, iconType })

  return (
    <span className='statusWrapper'>
      <span className={statusClasses} data-test-id='statusIcon'>
        {jif(
          pending,
          () => (
            <EuiLoadingSpinner size='m' />
          ),
          () => (
            <EuiIcon type={icon} />
          ),
        )}
      </span>
    </span>
  )
}

function getStatusIcon({
  isDot,
  status,
  iconType = `cross`,
}: {
  isDot: boolean
  status?: StatusValue | null
  iconType?: IconType
}): IconType {
  if (isDot) {
    return `dot`
  }

  if (status === `stopped`) {
    return `stopFilled`
  }

  if (status === `maintenance`) {
    return `wrench`
  }

  if (status === true) {
    return `check`
  }

  return iconType
}

export default Status
