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

import classNames from 'classnames'
import { negate } from 'lodash'

import React, { FunctionComponent, ComponentType, ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  ButtonSize,
  EUI_MODAL_CANCEL_BUTTON,
  EUI_MODAL_CONFIRM_BUTTON,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiButtonProps,
  EuiConfirmModalProps,
  IconType,
} from '@elastic/eui'

import { CuiButtonAny, CuiButtonAnyProps, CuiButtonType, CuiButtonCustomRenderFn } from '../../cui'

type ModalBody = ReactElement<typeof FormattedMessage> | string | null

export type DangerButtonModalProps = Partial<EuiConfirmModalProps> & {
  title?: string | ReactElement<typeof FormattedMessage>
  cancelButtonText?: string | ReactElement<typeof FormattedMessage>
  confirmButtonText?: string | ReactElement<typeof FormattedMessage>
  defaultFocusedButton?: typeof EUI_MODAL_CONFIRM_BUTTON | typeof EUI_MODAL_CANCEL_BUTTON
  body?: ModalBody | (() => ModalBody)
}

export interface Props {
  'aria-label'?: string
  'data-test-id'?: string
  buttonProps?: { [key: string]: any }
  buttonType?: CuiButtonType | ComponentType<any>
  children?: ReactNode
  className?: string
  color?: CuiButtonAnyProps['color']
  disabled?: boolean
  fill?: boolean
  iconSide?: EuiButtonProps['iconSide']
  iconType?: IconType
  isBusy?: boolean
  onClose?: () => void
  isConfirmDisabled?: () => boolean
  isDisabled?: boolean
  isEmpty?: boolean
  modal?: DangerButtonModalProps
  onConfirm: () => void | Promise<any>
  onConfirmPromise?: boolean
  requiresSudo?: boolean
  size?: ButtonSize
  spin?: boolean
  type?: 'button' | 'submit'
}

const DangerButton: FunctionComponent<Props> = ({
  buttonType,
  className,
  disabled,
  isBusy,
  isConfirmDisabled,
  isDisabled,
  isEmpty,
  modal,
  onClose,
  onConfirm,
  onConfirmPromise,
  spin,
  ...rest
}) => (
  <CuiButtonAny
    buttonType={getCuiButtonType({ buttonType, isEmpty })}
    className={classNames('dangerButton', className)}
    confirm={true}
    confirmExtensions={{
      onModalClose: onClose,
      canOpenModal: isConfirmDisabled && negate(isConfirmDisabled),
      fulfillBeforeModalClose: onConfirmPromise,
    }}
    confirmModalProps={getConfirmModalProps({ modal })}
    disabled={disabled || isDisabled}
    onClick={onConfirm}
    spin={spin || isBusy}
    {...rest}
  />
)

export default DangerButton

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

  if (typeof buttonType === `function`) {
    return buttonType as CuiButtonCustomRenderFn
  }

  return `EuiButton`
}

function getConfirmModalProps({
  modal,
}: {
  modal: Props['modal']
}): CuiButtonAnyProps['confirmModalProps'] {
  if (!modal) {
    return modal
  }

  const { body } = modal

  if (typeof body === `function`) {
    return () => ({
      ...modal,
      body: typeof body === `function` ? body() : body,
    })
  }

  // otherwise TS doesn't understand `modal.body` cannot be a function at this point 🤷‍♂️
  return {
    ...modal,
    body,
  }
}
