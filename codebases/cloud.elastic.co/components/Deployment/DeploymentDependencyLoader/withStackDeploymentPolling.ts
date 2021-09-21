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

import { flatMap, get, without } from 'lodash'

import { fetchDeployment } from '../../../actions/stackDeployments'

import { getStackDeployment } from '../../../reducers'

import { getAllKnownSliderInstanceTypes } from '../../../lib/sliders/sliders'

import withPolling from '../../../lib/withPolling'

const mapStateToProps = (state, { stackDeploymentId }) => ({
  stackDeployment: getStackDeployment(state, stackDeploymentId),
})

const mapDispatchToProps = {
  fetchDeployment,
}

const stackDeploymentPoller = (props) => {
  const { fetchDeployment, stackDeploymentId, deployment, kibana, apm } = props

  const anyPendingPlan =
    get(deployment, [`plan`, `isPending`]) ||
    get(kibana, [`plan`, `isPending`]) ||
    get(apm, [`plan`, `isPending`])

  const pollImmediatelyBecauseStack = [[`deployment`, `regionId`], `stackDeploymentId`]
  const pollImmediatelyBecauseEs = [`deploymentId`, [`deployment`, `wasDeleted`]]

  const pollImmediatelyBecauseKib = [[`pendingKibana`, `isCreating`]]

  const pollImmediatelyBecauseApm = [[`pendingApm`, `isCreating`]]

  const pollImmediatelyBecauseSliders = flatMap(
    without(getAllKnownSliderInstanceTypes(), `elasticsearch`),
    (sliderInstanceType) => [
      [`deployment`, sliderInstanceType, `enabled`],
      [`deployment`, sliderInstanceType, `id`],
      [sliderInstanceType, `plan`, `waitingForPending`],
    ],
  )

  return {
    onPoll: () => fetchDeployment({ deploymentId: stackDeploymentId }),

    // We need to poll more frequently if a plan is in-flight, because messaging and health changes more often.
    interval: anyPendingPlan ? 15 : 30,
    pollImmediately: [
      ...pollImmediatelyBecauseStack,
      ...pollImmediatelyBecauseEs,
      ...pollImmediatelyBecauseKib,
      ...pollImmediatelyBecauseApm,
      ...pollImmediatelyBecauseSliders,
    ],
    stopPolling: deployment && deployment.wasDeleted,
  }
}

export default (wrappedComponent) =>
  connect(mapStateToProps, mapDispatchToProps)(withPolling(wrappedComponent, stackDeploymentPoller))
