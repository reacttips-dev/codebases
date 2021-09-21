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
import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiCode, EuiSpacer } from '@elastic/eui'

import DocLink from '../../../DocLink'

import { isUsingNodeRoles } from '../../../../lib/stackDeployments'
import {
  isAutoscalingEnabled,
  isAutoscalingEnabledOnGet,
  isDeploymentGetUsingNodeRoles,
} from '../../../../lib/stackDeployments/selectors'

import { DeploymentGetResponse, DeploymentUpdateRequest } from '../../../../lib/api/v1/types'

type Props = {
  // If a deployment update request isn't supplied, we assume it's because we always want to show the warning
  deployment?: DeploymentUpdateRequest
  deploymentUnderEdit: DeploymentGetResponse
}

const NodeRolesWarning: FunctionComponent<Props> = (props) => {
  if (!showWarning(props)) {
    return null
  }

  return (
    <Fragment>
      <EuiCallOut
        data-test-id='ldap-provider-validation-problems'
        color='primary'
        title={
          <FormattedMessage
            id='nodeRoles.migrationWarning.title'
            defaultMessage='Changes to index allocation and deployment API'
          />
        }
      >
        <FormattedMessage
          id='nodeRoles.migrationWarning.body'
          defaultMessage='As part of this configuration change, the deployment will use the new Elasticsearch node roles configuration. This change might affect your index allocation so you need to take action to ensure your index allocation and index lifecycle policies continue to work as expected. Additionally, if you manage this deployment using the API, you need to update your integration to support the new {node_roles} field. {docLink}'
          values={{
            node_roles: <EuiCode>node_roles</EuiCode>,
            docLink: (
              <DocLink link='nodeTypesDocLink'>
                <FormattedMessage
                  id='nodeRoles.migrationWarning.docLink'
                  defaultMessage='Learn more'
                />
              </DocLink>
            ),
          }}
        />
      </EuiCallOut>
      <EuiSpacer size='m' />
    </Fragment>
  )
}

function showWarning({ deployment, deploymentUnderEdit }: Props): boolean {
  // If we don't have a current deployment, it's because a subsequent change will enable it.
  const updateHasNodeRoles = deployment ? isUsingNodeRoles({ deployment }) : true
  const updateHasAutoscaling = deployment ? isAutoscalingEnabled({ deployment }) : true

  const hasEnabledAutoscaling =
    !isAutoscalingEnabledOnGet({ deployment: deploymentUnderEdit }) && updateHasAutoscaling

  return (
    !isDeploymentGetUsingNodeRoles({ deployment: deploymentUnderEdit }) &&
    (hasEnabledAutoscaling || updateHasNodeRoles)
  )
}

export default NodeRolesWarning
