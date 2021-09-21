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

import TrialModal from './TrialModal'

import { extendTrial, resetExtendTrial } from '../../../../actions/extendTrial'

import { extendTrialRequest, getTheme } from '../../../../reducers'
import { getProfile } from '../../reducers'

import { ThunkDispatch, ProfileState, AsyncRequestState, Theme } from '../../../../types'

type StateProps = {
  profile: ProfileState
  extendTrialRequest: AsyncRequestState
  theme: Theme
}

type DispatchProps = {
  extendTrial: (selectedAnswer, textAreaValue) => Promise<any>
  resetExtendTrial: () => void
}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  profile: getProfile(state),
  extendTrialRequest: extendTrialRequest(state),
  theme: getTheme(state),
})

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  extendTrial: (selectedAnswer, textAreaValue) =>
    dispatch(extendTrial(selectedAnswer, textAreaValue)),
  resetExtendTrial: () => dispatch(resetExtendTrial()),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(TrialModal)
