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

import { EuiCodeBlock } from '@elastic/eui'

import { getTheme } from '../../reducers'
import { Theme } from '../../types'

import { withErrorBoundary } from '../Boundary'

type StateProps = {
  color: Theme
  language?: string
}

type DispatchProps = unknown

type ConsumerProps = {
  language?: string
}

const mapStateToProps = (state, { language }: ConsumerProps): StateProps => {
  const isText = language === 'text' || language === 'txt'

  return {
    color: getTheme(state),
    language: isText ? undefined : language,
  }
}

const mapDispatchToProps: DispatchProps = {}

export const CuiCodeBlock = withErrorBoundary(
  connect<StateProps, DispatchProps, ConsumerProps>(
    mapStateToProps,
    mapDispatchToProps,
  )(EuiCodeBlock),
)
