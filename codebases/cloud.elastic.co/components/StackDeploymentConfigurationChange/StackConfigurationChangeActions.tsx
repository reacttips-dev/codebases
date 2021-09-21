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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import CopyToClipboard from 'react-copy-to-clipboard'

import { CuiActionButton, CuiActionButtonActionProps, CuiPermissibleControl } from '../../cui'

import ClusterLockingGate from '../ClusterLockingGate'

import { canCopyRawJson, getRawJson } from './StackConfigurationChangeRawPlanJsonCopyButton'

import RetryStackDeploymentAttemptButton from '../StackDeployments/RetryStackDeploymentAttemptButton'

import CancelPlanButton from './CancelPlanButton'

import { isPendingAttempt } from '../../lib/stackDeployments'

import { setAdvancedEditInitialStateFromAttempt } from '../StackDeploymentEditor/EditStackDeploymentAdvanced/carryover'

import { deploymentAdvancedEditUrl } from '../../lib/urlBuilder'

import {
  AnyClusterPlanInfo,
  AnyResourceInfo,
  SliderInstanceType,
  StackDeployment,
} from '../../types'

import Permission from '../../lib/api/v1/permissions'

type Props = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
}

const StackConfigurationChangeActions: FunctionComponent<Props> = ({
  deployment,
  resource,
  resourceType,
  planAttempt,
}) => {
  const { id } = deployment
  const pending = isPendingAttempt({ planAttempt })
  const canCopy = canCopyRawJson({ planAttempt })
  const rawPlanJson = getRawJson({ planAttempt })

  const copyAction = canCopy && {
    iconType: `copyClipboard`,
    name: (
      <FormattedMessage id='configuration-change-actions.copy-json' defaultMessage='Copy JSON' />
    ),
    wrapper: ({ children }) => <CopyToClipboard text={rawPlanJson}>{children}</CopyToClipboard>,
  }

  const reapplyAdvancedAction = !pending &&
    canCopy && {
      iconType: `documentEdit`,
      name: (
        <FormattedMessage
          id='configuration-change-actions.advanced-reapply'
          defaultMessage='Advanced reapply'
        />
      ),
      href: deploymentAdvancedEditUrl(id),
      onClick: () =>
        setAdvancedEditInitialStateFromAttempt({
          deployment,
          planAttempt,
          planAttemptSliderInstanceType: resourceType,
        }),
    }

  const actions: CuiActionButtonActionProps[] = []

  if (reapplyAdvancedAction) {
    actions.push(reapplyAdvancedAction)
  }

  if (copyAction) {
    actions.push(copyAction)
  }

  const primaryAction = (
    <ClusterLockingGate>
      {pending ? (
        <CancelPlanButton deployment={deployment} resource={resource} resourceType={resourceType} />
      ) : (
        <CuiPermissibleControl permissions={Permission.updateDeployment}>
          <RetryStackDeploymentAttemptButton
            deployment={deployment}
            sliderInstanceType={resourceType}
            planAttempt={planAttempt}
            color='primary'
          >
            <FormattedMessage id='configuration-change-actions.reapply' defaultMessage='Reapply' />
          </RetryStackDeploymentAttemptButton>
        </CuiPermissibleControl>
      )}
    </ClusterLockingGate>
  )

  return <CuiActionButton size='s' primaryAction={primaryAction} actions={actions} />
}

export default StackConfigurationChangeActions
