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

import IlmMigration from './IlmMigration'

import { getStackDeployment } from '../../reducers'

import {
  withStackDeploymentRouteParams,
  WithStackDeploymentRouteParamsProps,
} from '../StackDeploymentEditor'

import { migrateToIlm, IndexPatternConversion } from '../../actions/ilm/migrateToIlm'
import { isFeatureActivated } from '../../selectors'
import Feature from '../../lib/feature'

import { StackDeployment } from '../../types'
import { ElasticsearchResourceInfo } from '../../lib/api/v1/types'

type StateProps = {
  stackDeployment: StackDeployment | null
  ilmMigrationFeature: boolean
}

type DispatchProps = {
  migrateToIlm: (params: {
    deployment: StackDeployment
    resource: ElasticsearchResourceInfo
    indexPatterns: IndexPatternConversion[]
  }) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps

const mapStateToProps = (state: any, { stackDeploymentId }: ConsumerProps): StateProps => ({
  stackDeployment: getStackDeployment(state, stackDeploymentId),
  ilmMigrationFeature: isFeatureActivated(state, Feature.ilmMigrationFeature),
})

const mapDispatchToProps: DispatchProps = {
  migrateToIlm,
}

export default withStackDeploymentRouteParams(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(IlmMigration),
)
