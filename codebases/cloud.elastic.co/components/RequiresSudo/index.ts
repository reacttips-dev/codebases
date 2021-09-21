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

import { ComponentType, ReactNode } from 'react'
import { connect } from 'react-redux'

import RequiresSudo from './RequiresSudo'

import { isFeatureActivated } from '../../selectors'

import { SAD_hasUnexpiredSudo } from '../../lib/auth'

import Feature from '../../lib/feature'

type RenderSudoGateFn = (props: { children: ReactNode; openSudoModal: () => void }) => ReactNode

type StateProps = {
  isSudoFeatureActivated: boolean
  hasSudo: boolean
}

type DispatchProps = unknown

type ConsumerProps = {
  buttonType?: ComponentType<any>
  to?: string | ReactNode
  children?: ReactNode
  helpText?: boolean
  actionPrefix?: boolean
  onSudo?: (result: any) => void
  renderSudoGate?: RenderSudoGateFn | boolean
  [buttonProp: string]: any
}

const mapStateToProps = (state) => ({
  isSudoFeatureActivated: isFeatureActivated(state, Feature.sudo),
  hasSudo: SAD_hasUnexpiredSudo(),
})

const mapDispatchToProps: DispatchProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(RequiresSudo)
