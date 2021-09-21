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
import { parse } from 'query-string'

import StackDeploymentPricingTable from './StackDeploymentPricingTable'
import { fetchElasticSearchServicePrices } from '../../../../../actions/prices'
import { fetchElasticSearchServicePricesRequest } from '../../../../../reducers'
import { getElasticSearchServicePrices } from '../../../reducers'

import { ThunkDispatch } from '../../../../../types'
import { ConsumerProps, DispatchProps, StateProps } from './types'

const mapStateToProps = (state, { location }: ConsumerProps): StateProps => {
  const { search } = location

  return {
    query: parse(search.slice(1)),
    elasticSearchServicePrices: getElasticSearchServicePrices(state),
    fetchElasticSearchServicePricesRequest: fetchElasticSearchServicePricesRequest(state),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  fetchElasticSearchServicePrices: ({ region, isMarketplace }) =>
    dispatch(fetchElasticSearchServicePrices({ region, isMarketplace })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(StackDeploymentPricingTable)
