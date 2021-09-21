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

import React, { FunctionComponent, ComponentType } from 'react'
import classNames from 'classnames'

import { EuiButtonEmpty, EuiButtonIcon } from '@elastic/eui'

import { CuiButtonAny, CuiButtonAnyProps, CuiButtonType } from '../../cui'

export type Props = Omit<CuiButtonAnyProps, 'buttonType'> & {
  buttonType?: ComponentType<any>
  isEmpty?: boolean
  isDisabled?: boolean
}

const SpinButton: FunctionComponent<Props> = ({
  buttonType,
  className,
  isEmpty,
  isDisabled,
  disabled,
  ...rest
}) => (
  <CuiButtonAny
    className={classNames(`spinButton`, className)}
    buttonType={getCuiButtonType({
      buttonType,
      isEmpty,
    })}
    disabled={disabled || isDisabled}
    {...rest}
  />
)

export default SpinButton

function getCuiButtonType({
  buttonType,
  isEmpty,
}: {
  buttonType: Props['buttonType']
  isEmpty: Props['isEmpty']
}): CuiButtonType {
  if (buttonType === EuiButtonEmpty || isEmpty) {
    return `EuiButtonEmpty`
  }

  if (buttonType === EuiButtonIcon) {
    return `EuiButtonIcon`
  }

  return `EuiButton`
}
