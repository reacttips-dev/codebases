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

import React, { ReactNode } from 'react'
import { connect } from 'react-redux'

import Gate from './Gate'

import { ReduxState } from '../../types'

type StateProps = {
  storeState: ReduxState
}

interface DispatchProps {}

type ConsumerProps = GateProps & WithGateConsumerProps

type GateProps = {
  allow?: (storeState: ReduxState) => boolean
  deny?: (storeState: ReduxState) => boolean
}

type WithGateConsumerProps = {
  reverse?: boolean
  children: ReactNode
}

const mapStateToProps = (state): StateProps => ({
  storeState: state,
})

const ConnectedGate = connect<StateProps, DispatchProps, ConsumerProps>(mapStateToProps)(Gate)

export default ConnectedGate

export function withGate(gateProps: GateProps) {
  return (props: WithGateConsumerProps) => <ConnectedGate {...props} {...gateProps} />
}
