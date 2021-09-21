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

import IlmSummary from '../../../Topology/DeploymentTemplates/DeploymentTemplateView/components/IlmSummary'

import { InstanceConfiguration, ElasticsearchClusterPlan } from '../../../../lib/api/v1/types'
import { isData } from '../../../../lib/stackDeployments'
import { isEnabledConfiguration } from '../../../../lib/deployments/conversion'

type Props = {
  plan: ElasticsearchClusterPlan
  instanceConfigurations: InstanceConfiguration[]
}

const EditIlm: FunctionComponent<Props> = ({ instanceConfigurations, plan }) => {
  const data = plan.cluster_topology
    .filter((topologyElement) => isData({ topologyElement }))
    .filter(isEnabledConfiguration)

  return (
    <IlmSummary instanceConfigurations={instanceConfigurations} data={data} ilmEnabled={true} />
  )
}

export default EditIlm
