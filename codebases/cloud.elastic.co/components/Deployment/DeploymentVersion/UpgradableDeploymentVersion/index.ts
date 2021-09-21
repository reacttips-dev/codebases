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

import UpgradableDeploymentVersion from './UpgradableDeploymentVersion'

import { fetchRegionIfNeeded } from '../../../../actions/regions'
import { fetchVersion, fetchVersions } from '../../../../actions/elasticStack'

import { fetchVersionRequest, getRegion, getVersionStack } from '../../../../reducers'

import { getLowestSliderVersion, getRegionId } from '../../../../lib/stackDeployments'

import { StackVersionConfig } from '../../../../lib/api/v1/types'

import {
  VersionNumber,
  AsyncRequestState,
  ReduxState,
  Region,
  StackDeployment,
} from '../../../../types'

type StateProps = {
  availableVersions?: string[]
  esVersionRequest: AsyncRequestState
  lowestVersion?: VersionNumber
  region?: Region
  versionStack?: StackVersionConfig
}

type DispatchProps = {
  fetchVersionStack: (version: string, regionId: string) => void
  fetchVersionStacks: (regionId: string) => void
  fetchRegion: (regionId: string) => void
}

type ConsumerProps = {
  deployment: StackDeployment
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const lowestVersion = getLowestSliderVersion({ deployment })!
  const regionId = getRegionId({ deployment })!

  const versionStack = getVersionStack(state, regionId, lowestVersion)

  return {
    region: getRegion(state, regionId),
    availableVersions: versionStack && versionStack.upgradable_to,
    esVersionRequest: fetchVersionRequest(state, regionId),
    lowestVersion,
    versionStack,
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps, {
  fetchRegion: fetchRegionIfNeeded,
  fetchVersionStack: fetchVersion,
  fetchVersionStacks: fetchVersions,
})(UpgradableDeploymentVersion)
