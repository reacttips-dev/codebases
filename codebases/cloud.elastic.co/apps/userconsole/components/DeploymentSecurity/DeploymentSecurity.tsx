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
import { get } from 'lodash'

import UserconsoleDeploymentSecurityEditorBefore5x from './UserconsoleDeploymentSecurityEditorBefore5x'
import DeploymentSecurityEditor from '../../../../components/DeploymentSecurity/DeploymentSecurityEditor'

import { gte } from '../../../../lib/semver'

import { ElasticsearchCluster, AsyncRequestState, StackDeployment } from '../../../../types'

interface ShieldConfig {
  users: string
  users_roles: string
  roles: string
}

type Props = {
  deployment: StackDeployment | null
  cluster?: ElasticsearchCluster | null
  saveShieldConfig: (cluster: ElasticsearchCluster, shieldConfig: ShieldConfig) => void
  saveShieldConfigRequest: AsyncRequestState
}

const DeploymentSecurity: FunctionComponent<Props> = ({
  deployment,
  cluster,
  saveShieldConfig,
  saveShieldConfigRequest,
}) => {
  if (deployment === null) {
    return null
  }

  if (cluster == null) {
    return null
  }

  const { plan } = cluster

  if (!plan.isActive) {
    return null
  }

  if (plan.version && gte(plan.version, `5.0.0`)) {
    const kibanaId = get(cluster, [`kibana`, `id`])
    return (
      <DeploymentSecurityEditor deployment={deployment} cluster={cluster} kibanaId={kibanaId} />
    )
  }

  return (
    <UserconsoleDeploymentSecurityEditorBefore5x
      config={cluster.security.config}
      saveShieldConfig={(securityConfig) => saveShieldConfig(cluster, securityConfig)}
      saveShieldConfigRequest={saveShieldConfigRequest}
    />
  )
}

export default DeploymentSecurity
