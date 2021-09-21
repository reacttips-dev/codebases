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

import { EuiIconProps } from '@elastic/eui'

import { CuiThemedIcon as CuiThemedIconImpl } from './CuiThemedIcon'

import { getTheme } from '../../reducers'

import { StrictOmit } from '../../lib/ts-essentials'
import { Theme } from '../../types'

type StateProps = {
  theme: Theme
}

interface DispatchProps {}

type ConsumerProps = {
  darkType: EuiIconProps['type']
  lightType: EuiIconProps['type']
} & StrictOmit<EuiIconProps, 'type'>

const mapStateToProps = (state): StateProps => ({
  theme: getTheme(state),
})

const mapDispatchToProps: DispatchProps = {}

export const CuiThemedIcon = connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(CuiThemedIconImpl)
