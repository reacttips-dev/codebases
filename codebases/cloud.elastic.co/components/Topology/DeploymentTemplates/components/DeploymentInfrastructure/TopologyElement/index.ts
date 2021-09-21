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

import TopologyElementRouter from './TopologyElementRouter'

import { getRegion } from '../../../../../../reducers'

import { getProfile, getExternalSubscription } from '../../../../../../apps/userconsole/reducers'

import { getConfigForKey } from '../../../../../../selectors'

import { getNumberOfAvailableZones } from '../../../../../../lib/deployments/availabilityZones'

import { getRegionId } from '../../../../../../lib/stackDeployments'

import { inTrial } from '../../../../../../lib/trial'

import { AllProps } from './TopologyElement'

type ConnectedPropKeys = 'maxInstanceCountForEnvironment' | 'maxZoneCount' | 'inTrial'
type StateProps = Pick<AllProps, ConnectedPropKeys> & {
  subscription?: string | null
}

type ConsumerProps = Omit<AllProps, ConnectedPropKeys>

const mapStateToProps = (state, { deployment }): StateProps => {
  const profile = getProfile(state)
  const regionId = getRegionId({ deployment })
  const region = getRegion(state, regionId!)
  const maxZoneCount = getNumberOfAvailableZones(region)

  return {
    inTrial: inTrial({ profile }),
    maxZoneCount,
    subscription: getExternalSubscription(state),
    maxInstanceCountForEnvironment: getConfigForKey(state, `MAX_INSTANCE_COUNT`),
  }
}

export default connect<StateProps, null, ConsumerProps>(mapStateToProps)(TopologyElementRouter)
