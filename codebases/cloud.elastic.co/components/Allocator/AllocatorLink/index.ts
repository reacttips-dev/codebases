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

import AllocatorLink from './AllocatorLink'
import { getAllocatorSearchResults, searchAllocatorsRequest } from '../../../reducers'
import { AsyncRequestState, ReduxState } from '../../../types'
import { ExternalHyperlink } from '../../../lib/api/v1/types'

interface StateProps {
  externalLinks?: ExternalHyperlink[]
  fetchDeploymentAllocatorsRequest: AsyncRequestState
  healthy?: boolean
}

interface ConsumerProps {
  allocatorId: string
  deploymentId: string
  regionId: string
}

interface DispatchProps {}

const mapStateToProps = (
  state: ReduxState,
  { allocatorId, deploymentId, regionId },
): StateProps => {
  const deploymentAllocators = getAllocatorSearchResults(
    state,
    regionId,
    `search-deployment-allocators/${deploymentId}`,
  )

  const allocator = (deploymentAllocators || []).find(({ id }) => id === allocatorId)

  return {
    externalLinks: allocator?.externalLinks,
    fetchDeploymentAllocatorsRequest: searchAllocatorsRequest(
      state,
      regionId,
      `search-deployment-allocators/${deploymentId}`,
    ),
    healthy: allocator?.healthy,
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(AllocatorLink)
