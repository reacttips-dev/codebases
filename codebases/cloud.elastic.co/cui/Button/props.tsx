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

import { omit } from 'lodash'
import classNames from 'classnames'

import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EUI_MODAL_CANCEL_BUTTON,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiConfirmModalProps,
} from '@elastic/eui'

import {
  ButtonUnionProps,
  CuiButtonType,
  EuiButtonEmptyProps,
  EuiButtonIconProps,
  EuiButtonProps,
  MouseClickEventHandler,
  Props,
} from './types'

export function renderButton<T extends ButtonUnionProps>(
  props: Props<T>,
  {
    onClick,
    children,
  }: {
    onClick: MouseClickEventHandler
    children: T['children']
  },
) {
  const { buttonType } = props

  if (typeof buttonType === 'function') {
    const CustomButton = buttonType
    const customButtonProps = getEuiButtonProps<T>(props, {
      onClick,
      children,
    })

    return <CustomButton {...customButtonProps} />
  }

  if (buttonType === 'EuiButtonIcon') {
    const buttonIconProps = getEuiButtonIconProps<T>(props, {
      onClick,
    })

    return <EuiButtonIcon {...buttonIconProps} />
  }

  if (buttonType === 'EuiButtonEmpty') {
    const buttonEmptyProps = getEuiButtonEmptyProps<T>(props, {
      onClick,
      children,
    })

    return <EuiButtonEmpty {...buttonEmptyProps} />
  }

  const buttonProps = getEuiButtonProps<T>(props, {
    onClick,
    children,
  })

  return <EuiButton {...buttonProps} />
}

export function getButtonComponent({ buttonType }: { buttonType?: CuiButtonType }) {
  if (typeof buttonType === 'function') {
    return buttonType
  }

  if (buttonType === 'EuiButtonEmpty') {
    return EuiButtonEmpty
  }

  if (buttonType === 'EuiButtonIcon') {
    return EuiButtonIcon
  }

  return EuiButton
}

export function getButtonUnionProps<T extends ButtonUnionProps>(props: Props<T>) {
  const {
    'aria-label': ariaLabel,
    'data-test-id': dataTestId,
    buttonProps = {},
    className,
    disabled,
    fill,
    href,
    iconSide,
    iconType,
    spin,
    target,
    type,
  } = props

  const color = getButtonColor<T>(props)
  const size = getButtonSize<T>(props)
  const isDisabled = disabled || spin

  const allButtonProps = {
    ...buttonProps,
    'aria-label': ariaLabel,
    'data-test-id': dataTestId,
    className: classNames(`cuiButton`, className),
    color,
    href,
    iconSide,
    iconType,
    isDisabled,
    size,
    target,
    type,
    fill,
  }

  return allButtonProps
}

export function getConfirmModalProps<T extends ButtonUnionProps>(
  props: Props<T>,
  directProps: {
    onCancel: EuiConfirmModalProps['onCancel']
    onConfirm: EuiConfirmModalProps['onConfirm']
  },
): EuiConfirmModalProps {
  const { confirmModalProps = {} } = props

  const modalSettings =
    typeof confirmModalProps === `function` ? confirmModalProps() : confirmModalProps

  const {
    title = <FormattedMessage id='cui-button.please-confirm' defaultMessage='Please confirm' />,
    body = null,
    cancel = <FormattedMessage id='cui-button.cancel' defaultMessage='Cancel' />,
    confirm = <FormattedMessage id='cui-button.confirm' defaultMessage='Confirm' />,
    focus = EUI_MODAL_CANCEL_BUTTON,
    buttonColor = getEuiButtonColor<T>(props),
    ...modalProps
  } = modalSettings

  return {
    title,
    cancelButtonText: cancel,
    confirmButtonText: confirm,
    defaultFocusedButton: focus,
    buttonColor,
    ...modalProps,

    // these shouldn't be overwritten by `...modalProps`
    ...directProps,
    children: body,
  }
}

function getEuiButtonProps<T extends ButtonUnionProps>(
  props: Props<T>,
  directProps: {
    onClick: MouseClickEventHandler
    children: EuiButtonProps['children']
  },
) {
  const allButtonProps = getButtonUnionProps<T>(props)

  const buttonProps: EuiButtonProps = {
    ...omit(allButtonProps, [`onClick`, `children`]),
    color: getEuiButtonColor<T>(props),
    size: getEuiButtonSize<T>(props),
    ...directProps,
  }

  return buttonProps
}

function getEuiButtonEmptyProps<T extends ButtonUnionProps>(
  props: Props<T>,
  directProps: {
    onClick: MouseClickEventHandler
    children: EuiButtonEmptyProps['children']
  },
) {
  const allButtonProps = getButtonUnionProps<T>(props)

  const buttonEmptyProps: EuiButtonEmptyProps = {
    ...omit(allButtonProps, [`onClick`, `children`, `fill`]),
    color: getEuiButtonEmptyColor<T>(props),
    size: getEuiButtonEmptySize<T>(props),
    ...directProps,
  }

  return buttonEmptyProps
}

function getEuiButtonIconProps<T extends ButtonUnionProps>(
  props: Props<T>,
  directProps: {
    onClick: MouseClickEventHandler
  },
) {
  const allButtonProps = getButtonUnionProps<T>(props)

  const buttonIconProps: EuiButtonIconProps = {
    ...omit(allButtonProps, [`onClick`, `children`, `fill`, `iconSide`]),
    color: getEuiButtonIconColor<T>(props),
    size: getEuiButtonIconSize<T>(props),
    iconType: String(allButtonProps.iconType || `empty`),
    ...directProps,
  }

  return buttonIconProps
}

function getButtonColor<T extends ButtonUnionProps>(props: Props<T>): ButtonUnionProps['color'] {
  const { buttonProps, color, confirm } = props

  if (buttonProps && buttonProps.hasOwnProperty(`color`)) {
    return buttonProps.color
  }

  if (color) {
    return color
  }

  if (confirm) {
    return `danger`
  }

  return `primary`
}

function getButtonSize<T extends ButtonUnionProps>(props: Props<T>): ButtonUnionProps['size'] {
  const { buttonProps, size } = props

  if (buttonProps && buttonProps.hasOwnProperty(`size`)) {
    return buttonProps.size
  }

  return size
}

function getEuiButtonColor<T extends ButtonUnionProps>(props: Props<T>): EuiButtonProps['color'] {
  const buttonColor = getButtonColor<T>(props)

  if (buttonColor === `accent`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButton> color prop "${buttonColor}". Pass in "danger" instead to clear this warning.`,
    )
    return `danger`
  }

  if (buttonColor === `success`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButton> color prop "${buttonColor}". Pass in "secondary" instead to clear this warning.`,
    )
    return `secondary`
  }

  if (buttonColor === `subdued`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButton> color prop "${buttonColor}". Pass in "text" instead to clear this warning.`,
    )
    return `text`
  }

  return buttonColor
}

function getEuiButtonEmptyColor<T extends ButtonUnionProps>(
  props: Props<T>,
): EuiButtonEmptyProps['color'] {
  const buttonColor = getButtonColor<T>(props)

  if (buttonColor === `accent`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> color prop "${buttonColor}". Pass in "danger" instead to clear this warning.`,
    )
    return `danger`
  }

  if (buttonColor === `secondary`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> color prop "${buttonColor}". Pass in "primary" instead to clear this warning.`,
    )
    return `primary`
  }

  if (buttonColor === `success`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> color prop "${buttonColor}". Pass in "primary" instead to clear this warning.`,
    )
    return `primary`
  }

  if (buttonColor === `subdued`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> color prop "${buttonColor}". Pass in "text" instead to clear this warning.`,
    )
    return `text`
  }

  return buttonColor
}

function getEuiButtonIconColor<T extends ButtonUnionProps>(
  props: Props<T>,
): EuiButtonIconProps['color'] {
  const buttonColor = getButtonColor<T>(props)

  if (buttonColor === `secondary`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonIcon> color prop "${buttonColor}". Pass in "primary" instead to clear this warning.`,
    )
    return `primary`
  }

  return buttonColor
}

function getEuiButtonSize<T extends ButtonUnionProps>(props: Props<T>): EuiButtonProps['size'] {
  const buttonSize = getButtonSize<T>(props)

  if (buttonSize === `l`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> size prop "l". Pass in "m" instead to clear this warning.`,
    )
    return `m`
  }

  if (buttonSize === `xs`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> size prop "xs". Pass in "s" instead to clear this warning.`,
    )
    return `s`
  }

  return buttonSize
}

function getEuiButtonEmptySize<T extends ButtonUnionProps>(
  props: Props<T>,
): EuiButtonEmptyProps['size'] {
  const buttonSize = getButtonSize<T>(props)

  if (buttonSize === `m`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonEmpty> size prop "m". Pass in "l" instead to clear this warning.`,
    )
    return `l`
  }

  return buttonSize
}

function getEuiButtonIconSize<T extends ButtonUnionProps>(
  props: Props<T>,
): EuiButtonIconProps['size'] {
  const buttonSize = getButtonSize<T>(props)

  if (buttonSize === `l`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonIcon> size prop "l". Pass in "m" instead to clear this warning.`,
    )
    return `m`
  }

  if (buttonSize === `xs`) {
    console.warn(
      `<CuiButton> received unexpected <EuiButtonIcon> size prop "xs". Pass in "s" instead to clear this warning.`,
    )
    return `s`
  }

  return buttonSize
}
