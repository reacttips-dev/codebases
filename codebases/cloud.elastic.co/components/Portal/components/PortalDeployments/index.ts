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
import { fetchKibana } from '../../../../actions/kibana'
import { ThunkDispatch } from '../../../../types'

import PortalDeployments from './PortalDeployments'

export interface FetchKibanaProps {
  regionId: string
  kibanaId: string
}

interface DispatchProps {
  fetchKibana: (props: FetchKibanaProps) => Promise<any>
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  fetchKibana: ({ regionId, kibanaId }) => dispatch(fetchKibana(regionId, kibanaId)),
})

export default connect<unknown, DispatchProps, unknown>(null, mapDispatchToProps)(PortalDeployments)
