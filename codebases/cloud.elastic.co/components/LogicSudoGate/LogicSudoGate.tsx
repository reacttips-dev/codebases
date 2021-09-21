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

import { noop } from 'lodash'
import React, { Fragment, FunctionComponent, ReactNode } from 'react'

import UserSudoModal from '../UserSudoModal'

type Props = {
  isSudoFeatureActivated: boolean
  hasSudo: boolean
  children?: ReactNode
  onCancel: () => void
  onSudo?: () => void
}

const LogicSudoGate: FunctionComponent<Props> = ({
  isSudoFeatureActivated,
  hasSudo,
  children,
  onCancel,
  onSudo,
}) => {
  if (isSudoFeatureActivated && !hasSudo) {
    return (
      <UserSudoModal
        onSudo={onSudo ? onSudo : noop}
        close={(success) => {
          if (!success) {
            onCancel()
          }
        }}
      />
    )
  }

  return <Fragment>{children}</Fragment>
}

export default LogicSudoGate
