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

import Keystore from './Keystore'

import { deleteSecretFromKeystore, fetchKeystore } from '../../../actions/keystore'

import { getKeystore } from '../../../reducers'
import { deleteSecretRequest } from '../../../reducers/asyncRequests/registry'

import { getFirstEsClusterFromGet } from '../../../lib/stackDeployments'

import {
  AsyncRequestState,
  Keystore as KeystoreType,
  ReduxState,
  StackDeployment,
  ThunkDispatch,
} from '../../../types'

type StateProps = {
  keystore?: KeystoreType
  deleteSecretRequest: (key: string) => AsyncRequestState
}

type DispatchProps = {
  fetchKeystore: () => void
  deleteSecretFromKeystore: (key: string) => void
}

type ConsumerProps = {
  deployment: StackDeployment
  systemOwned: boolean
}

const mapStateToProps = (state: ReduxState, { deployment }: ConsumerProps): StateProps => {
  const { ref_id } = getFirstEsClusterFromGet({ deployment })!

  return {
    keystore: getKeystore(state, deployment.id, ref_id),
    deleteSecretRequest: (key: string) => deleteSecretRequest(state, deployment.id, ref_id, key),
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch,
  { deployment }: ConsumerProps,
): DispatchProps => {
  const { ref_id } = getFirstEsClusterFromGet({ deployment })!

  return {
    fetchKeystore: () => dispatch(fetchKeystore(deployment.id, ref_id)),
    deleteSecretFromKeystore: (key: string) =>
      dispatch(deleteSecretFromKeystore(deployment.id, ref_id, key)),
  }
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Keystore)
