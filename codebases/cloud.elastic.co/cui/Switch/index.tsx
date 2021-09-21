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

import React, { FunctionComponent } from 'react'

import { EuiSwitch, EuiSwitchProps } from '@elastic/eui'

import RequiresSudo from '../../components/RequiresSudo'

type Props = EuiSwitchProps & {
  requiresSudo?: boolean
}

export const CuiSwitch: FunctionComponent<Props> = ({
  onChange,
  requiresSudo = false,
  ...restSwitchProps
}) => {
  const switchProps: EuiSwitchProps = {
    onChange,
    ...restSwitchProps,
    showLabel: false,
  }

  const makeSwitch = (props = {}) => <EuiSwitch {...switchProps} {...props} />
  const actualSwitch = makeSwitch()

  if (!requiresSudo) {
    return actualSwitch
  }

  const makeSudoSwitch = (openSudoModal) => makeSwitch({ onChange: openSudoModal })

  return (
    <RequiresSudo
      helpText={false}
      actionPrefix={false}
      renderSudoGate={({ openSudoModal }) => makeSudoSwitch(openSudoModal)}
      onSudo={onChange}
    >
      {actualSwitch}
    </RequiresSudo>
  )
}
