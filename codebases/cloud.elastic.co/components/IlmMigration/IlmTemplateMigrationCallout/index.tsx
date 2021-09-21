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

import IlmTemplateMigrationCallout from './IlmTemplateMigrationCallout'

import withPolling from '../../../lib/withPolling'
import { fetchDeploymentTemplates } from '../../../actions/topology/deploymentTemplates'
import { fetchDeploymentTemplatesRequest, getDeploymentTemplates } from '../../../reducers'

const mapStateToProps = (state) => ({
  deploymentTemplates: getDeploymentTemplates(state, `ece-region`, null) || [],
  deploymentTemplatesRequest: fetchDeploymentTemplatesRequest(state, `ece-region`),
})

const mapDispatchToProps = (dispatch) => ({
  fetchDeploymentTemplates: () =>
    dispatch(
      fetchDeploymentTemplates({
        regionId: `ece-region`, // This component is only shown in ece
        stackVersion: null,
      }),
    ),
})

const pollingComponent = withPolling(
  IlmTemplateMigrationCallout,
  ({ fetchDeploymentTemplates: onPoll }) => ({
    onPoll,
  }),
)

export default connect(mapStateToProps, mapDispatchToProps)(pollingComponent)
