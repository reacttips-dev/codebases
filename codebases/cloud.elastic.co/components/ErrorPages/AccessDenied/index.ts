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
import { RouteComponentProps } from 'react-router-dom'

import { parse } from 'query-string'

import AccessDenied from './AccessDenied'

import { getTheme } from '../../../reducers'
import { ReduxState } from '../../../types'

type StateProps = {
  theme: 'dark' | 'light'
  source: string | string[] | null
}

interface DispatchProps {}

interface ConsumerProps extends RouteComponentProps {}

const mapStateToProps = (state: ReduxState, { location }: ConsumerProps): StateProps => {
  const query = parse(location.search.slice(1))

  return {
    theme: getTheme(state),
    source: query.source,
  }
}

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AccessDenied)
