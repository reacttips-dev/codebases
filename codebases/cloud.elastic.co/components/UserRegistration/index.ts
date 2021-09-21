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
import { RouteComponentProps, withRouter } from 'react-router'
import { parse } from 'query-string'

import UserRegistration from './UserRegistration'

import { isFeatureActivated } from '../../selectors/config'

import { getTheme } from '../../reducers'

import Feature from '../../lib/feature'
import { getRegistrationSource } from '../../lib/urlUtils'

import { ReduxState, Theme } from '../../types'

type RouteParams = {
  variant: string
}

interface DispatchProps {}

interface ConsumerProps extends RouteComponentProps<RouteParams> {}

interface StateProps {
  locationQueryString: string
  theme: Theme
  isGovCloud: boolean
  downloads: boolean
  source?: string
}

const mapStateToProps = (state: ReduxState, { location }: ConsumerProps): StateProps => {
  const { search } = location
  const query = parse(location.search.slice(1))

  return {
    downloads: String(query.downloads) === `true`,
    source: getRegistrationSource(search),
    locationQueryString: search,
    theme: getTheme(state),
    isGovCloud: isFeatureActivated(state, Feature.hideIrrelevantSectionsFromGovCloud),
  }
}

export default withRouter(
  connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(UserRegistration),
)
