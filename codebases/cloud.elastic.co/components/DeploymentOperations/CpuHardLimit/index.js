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

import CpuHardLimit from './CpuHardLimit'

import { setCpuHardLimit } from '../../../actions/clusters'
import { setCpuHardLimitRequest } from '../../../reducers'
import { isFeatureActivated } from '../../../selectors'
import Feature from '../../../lib/feature'

const mapStateToProps = (state, { cluster }) => ({
  setCpuHardLimitRequest: setCpuHardLimitRequest(state, cluster.regionId, cluster.id),
  canToggleCpuHardLimit: isFeatureActivated(state, Feature.toggleCpuHardLimit),
})

export default connect(mapStateToProps, {
  setCpuHardLimit,
})(CpuHardLimit)
