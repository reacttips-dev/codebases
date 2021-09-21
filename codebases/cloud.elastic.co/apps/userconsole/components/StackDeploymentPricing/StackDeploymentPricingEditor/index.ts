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

import { withRouter, RouteComponentProps } from 'react-router'

import StackDeploymentPricingEditor from './StackDeploymentPricingEditor'

import { getVersionStacks } from '../../../../../reducers'

import { fetchBasePrices } from '../../../actions/pricing'

import { ReduxState, BillingSubscriptionLevel } from '../../../../../types'

import { StackVersionConfig } from '../../../../../lib/api/v1/types'

import { CreateEditorComponentConsumerProps } from '../../../../../components/StackDeploymentEditor/types'

type FetchBasePricesSettings = {
  regionId: string
  level?: BillingSubscriptionLevel
  marketplace?: boolean
}

interface StateProps {
  stackVersions: StackVersionConfig[] | null
}

interface DispatchProps {
  fetchBasePrices: ({ regionId, level, marketplace }: FetchBasePricesSettings) => void
}

type ConsumerProps = CreateEditorComponentConsumerProps & RouteComponentProps

const mapStateToProps = (
  state: ReduxState,
  { editorState: { regionId } }: ConsumerProps,
): StateProps => ({
  stackVersions: (regionId && getVersionStacks(state, regionId)) || null,
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
  fetchBasePrices: (settings: FetchBasePricesSettings) => dispatch(fetchBasePrices(settings)),
})

export default withRouter(
  // @ts-ignore: no clue how to avoid this TS error without degrading the specificity of types we want to indicate
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(StackDeploymentPricingEditor),
)
