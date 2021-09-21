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

import React, { ReactNode, ComponentType, FunctionComponent } from 'react'
import { connect } from 'react-redux'

import { getReduxState, isFeatureActivated as isFeatureActivatedAtStore } from '../store'

import { currentUserHasPermission } from '../reducers'
import { isFeatureActivated } from '../selectors'

import Feature from './feature'
import Permission from '../lib/api/v1/permissions'
import { ReduxState } from '../types'

type StateProps = {
  hasPermission: boolean
  manageRbac: boolean
  rbacPermissions: boolean
}

interface DispatchProps {}

/**
 * Returns the wrapped component if user has the supplied permissions, else null
 */
function requiresPermission<ConsumerProps = any>(
  WrappedComponent: ComponentType<ConsumerProps>,
  ...permissions: Permission[]
): ComponentType<ConsumerProps> {
  if (permissions.length === 0) {
    throw new Error('Cannot call requiresPermission() without permissions')
  }

  const RequiresPermission: FunctionComponent<StateProps> = ({
    hasPermission,
    rbacPermissions,
    manageRbac,
    ...consumerProps
  }) => {
    if (!rbacPermissions && !manageRbac) {
      return <WrappedComponent {...(consumerProps as ConsumerProps)} />
    }

    if (!hasPermission) {
      return null
    }

    return <WrappedComponent {...(consumerProps as ConsumerProps)} />
  }

  const mapStateToProps = (state: ReduxState): StateProps => ({
    hasPermission: currentUserHasPermission(state, permissions),
    manageRbac: isFeatureActivated(state, Feature.manageRbac),
    rbacPermissions: isFeatureActivated(state, Feature.rbacPermissions),
  })

  return connect<StateProps, DispatchProps, ConsumerProps, ReduxState>(mapStateToProps)(
    RequiresPermission,
  )
}

export default requiresPermission

/**
 * Returns a boolean as to whether the current user has the supplied permissions
 */
export function hasPermission(...permissions: Permission[]): boolean {
  if (permissions.length === 0) {
    throw new Error('Cannot call hasPermission() without permissions')
  }

  const state = getReduxState()
  return currentUserHasPermission(state, permissions)
}

/**
 * Returns a boolean for whether the user has the supplied permissions
 */
export function isPermitted(permissions: Permission | Permission[]): boolean {
  if (
    !isFeatureActivatedAtStore(Feature.rbacPermissions) &&
    !isFeatureActivatedAtStore(Feature.manageRbac)
  ) {
    return true
  }

  const passablePerms: Permission[] = Array.isArray(permissions) ? permissions : [permissions]
  return hasPermission(...passablePerms)
}

/**
 * jif-style functional ternary for use in rendering
 */
export function ifPermitted(
  permissions: Permission | Permission[],
  trueCondition: (() => ReactNode) | undefined,
  falseCondition?: () => ReactNode,
): ReactNode | undefined {
  if (isPermitted(permissions)) {
    return trueCondition != null ? trueCondition() : undefined
  }

  return falseCondition != null ? falseCondition() : undefined
}
