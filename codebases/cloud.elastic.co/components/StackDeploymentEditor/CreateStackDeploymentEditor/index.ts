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

import CreateStackDeploymentEditor from './CreateStackDeploymentEditor'

import { getConfigForKey, isFeatureActivated } from '../../../selectors'
import { getVersionStacks, createStackDeploymentRequest } from '../../../reducers'
import { getProfile } from '../../../apps/userconsole/reducers'

import Feature from '../../../lib/feature'

import { StackVersionConfig } from '../../../lib/api/v1/types'

import { AsyncRequestState, ProfileState } from '../../../types'

import { CreateEditorComponentConsumerProps as ConsumerProps } from '../types'

type StateProps = {
  showPrice: boolean
  stackVersions: StackVersionConfig[] | null
  createStackDeploymentRequest: AsyncRequestState
  profile: ProfileState
}

interface DispatchProps {}

const mapStateToProps = (state, { region }: ConsumerProps): StateProps => {
  const regionId = region ? region.id : null

  const showPrice =
    getConfigForKey(state, `APP_NAME`) === `userconsole` &&
    isFeatureActivated(state, Feature.showPrices)

  return {
    showPrice,
    stackVersions: regionId ? getVersionStacks(state, regionId) : null,
    createStackDeploymentRequest: createStackDeploymentRequest(state),
    profile: getProfile(state),
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CreateStackDeploymentEditor)
