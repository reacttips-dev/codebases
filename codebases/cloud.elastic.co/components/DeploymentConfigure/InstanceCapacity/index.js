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

import { get } from 'lodash'
import { connect } from 'react-redux'

import InstanceCapacity from './InstanceCapacity'

import { getNodeConfiguration } from '../../../reducers'

import { planPaths } from '../../../config/clusterPaths'

import { getConfigForKey } from '../../../store'

const mapStateToProps = (state, { regionId, plan }) => {
  const isSaasUserConsole = getConfigForKey(`CLOUD_UI_APP`) === `saas-userconsole`
  const nodeConfigurationId = get(plan, planPaths.nodeConfiguration) || `default`
  const nodeConfiguration = getNodeConfiguration(state, regionId, nodeConfigurationId)

  return {
    nodeConfiguration,
    userProfileLevel: isSaasUserConsole ? state.profile.level : `premium`,
  }
}

export default connect(mapStateToProps, {})(InstanceCapacity)
