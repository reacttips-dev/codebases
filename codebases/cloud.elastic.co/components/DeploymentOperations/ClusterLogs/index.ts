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

import { downloadClusterLogs, resetDownloadClusterLogsRequest } from '../../../actions/clusters'

import { getClusterLogs, downloadClusterLogsRequest } from '../../../reducers'

import { isFeatureActivated } from '../../../selectors'
import Feature from '../../../lib/feature'

import ClusterLogs, { ConsumerProps, StateProps } from './ClusterLogs'

export interface DispatchProps {
  downloadClusterLogs: (regionId: string, clusterId: string, date: Date) => void
  resetDownloadClusterLogsRequest: () => void
}

const mapStateToProps = (state, { regionId, clusterId }: ConsumerProps): StateProps => ({
  clusterLogs: getClusterLogs(state, regionId, clusterId),
  downloadClusterLogsRequest: downloadClusterLogsRequest(state, regionId, clusterId),
  isEnabled: isFeatureActivated(state, Feature.downloadClusterLogs),
})

const mapDispatchToProps: DispatchProps = {
  downloadClusterLogs,
  resetDownloadClusterLogsRequest,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterLogs)
