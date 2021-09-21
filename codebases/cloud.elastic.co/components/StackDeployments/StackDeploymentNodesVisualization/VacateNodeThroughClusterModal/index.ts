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

import { connect } from 'react-redux'

import VacateNodeThroughClusterModal from './VacateNodeThroughClusterModal'

import { vacateEsCluster } from '../../../../actions/clusters'

import {
  vacateEsClusterRequest,
  vacateEsClusterValidateRequest,
  getEsClusterVacateValidate,
} from '../../../../reducers'

import { AsyncRequestState } from '../../../../types'

import {
  ElasticsearchResourceInfo,
  ClusterInstanceInfo,
  TransientElasticsearchPlanConfiguration,
} from '../../../../lib/api/v1/types'

type StateProps = {
  vacateEsClusterRequest: AsyncRequestState
  vacateEsClusterValidateRequest: AsyncRequestState
  vacateEsClusterValidateResult?: TransientElasticsearchPlanConfiguration
}

type DispatchProps = {
  vacateEsCluster: (options: { payload?: TransientElasticsearchPlanConfiguration }) => Promise<any>
  vacateEsClusterValidate: (options: { instancesDown?: boolean }) => Promise<any>
}

type ConsumerProps = {
  resource: ElasticsearchResourceInfo
  instance: ClusterInstanceInfo
  close: () => void
  onAfterVacate: () => void
}

const mapStateToProps = (
  state,
  { resource: { region, id }, instance: { instance_name } }: ConsumerProps,
): StateProps => ({
  vacateEsClusterRequest: vacateEsClusterRequest(state, region, id, instance_name),
  vacateEsClusterValidateResult: getEsClusterVacateValidate(state, region, id, [instance_name]),
  vacateEsClusterValidateRequest: vacateEsClusterValidateRequest(state, region, id, instance_name),
})

const mapDispatchToProps = (
  dispatch,
  { resource: { region, id }, instance: { instance_name } }: ConsumerProps,
): DispatchProps => ({
  vacateEsCluster: ({ payload }: { payload?: TransientElasticsearchPlanConfiguration } = {}) =>
    dispatch(
      vacateEsCluster({
        regionId: region,
        clusterId: id,
        instanceIds: [instance_name],
        validateOnly: false,
        payload,
      }),
    ),
  vacateEsClusterValidate: ({ instancesDown }: { instancesDown?: boolean } = {}) =>
    dispatch(
      vacateEsCluster({
        regionId: region,
        clusterId: id,
        instanceIds: [instance_name],
        validateOnly: true,
        instancesDown,
      }),
    ),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(VacateNodeThroughClusterModal)
