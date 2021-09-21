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

import { withTransaction } from '@elastic/apm-rum-react'

import HelpSupportArea from './HelpSupportArea'

import { fetchOktaApplications } from '../../../actions/profile'

import { fetchOktaApplicationsRequest } from '../../../reducers'

import { ProfileState, AsyncRequestState } from '../../../../../types'

type StateProps = {
  fetchOktaApplicationsRequest: AsyncRequestState
}

type DispatchProps = {
  fetchOktaApplications: () => void
}

interface ConsumerProps {
  profile: NonNullable<ProfileState>
}

const mapStateToProps = (state): StateProps => ({
  fetchOktaApplicationsRequest: fetchOktaApplicationsRequest(state),
})

const mapDispatchToProps: DispatchProps = {
  fetchOktaApplications,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withTransaction(`HelpSupportArea`, `component`)(HelpSupportArea))
