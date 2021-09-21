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

import React, { FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import cx from 'classnames'

import { EuiToolTip } from '@elastic/eui'

import Permission from '../../lib/api/v1/permissions'
import { isPermitted } from '../../lib/requiresPermission'

import { isFeatureActivated } from '../../store'
import Feature from '../../lib/feature'

import './permissibleControl.scss'

interface Props {
  className?: string
  permissions: Permission | Permission[]
  children: ReactElement
  fillSpace?: boolean
  force?: boolean
}

export const CuiPermissibleControl: FunctionComponent<Props> = ({
  className,
  permissions,
  children,
  fillSpace = false,
  force = false,
}) => {
  if (!isFeatureActivated(Feature.rbacPermissions) && !isFeatureActivated(Feature.manageRbac)) {
    return children
  }

  if (children == null) {
    return null
  }

  if (!force && isPermitted(permissions)) {
    return children
  }

  const newChildren = React.cloneElement(children, {
    disabled: true,
  })

  const tooltip = (
    <FormattedMessage
      id='permissibleControl.defaultTooltip'
      defaultMessage="You don't have permission to access this feature. Contact your system administrator."
    />
  )

  const classes = {
    'permissibleControl-toolTipAnchor-fillSpace': fillSpace,
  }

  return (
    // @ts-ignore
    <EuiToolTip anchorClassName={cx(className, classes)} content={tooltip}>
      {newChildren}
    </EuiToolTip>
  )
}
