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

import React, { Component, Fragment } from 'react'

import { EuiConfirmModal, EuiOverlayMask, EuiProgress } from '@elastic/eui'

import { CuiPermissibleControl } from '../PermissibleControl'

import RequiresSudo from '../../components/RequiresSudo'

import {
  getButtonComponent,
  getButtonUnionProps,
  getConfirmModalProps,
  renderButton,
} from './props'

import { Props, ButtonUnionProps, EuiButtonProps, MouseClickEvent } from './types'

import './cuiButton.scss'

type State = {
  isConfirmModalOpen: boolean
}

export class CuiButtonImpl<T extends ButtonUnionProps = Partial<EuiButtonProps>> extends Component<
  Props<T>,
  State
> {
  state: State = {
    isConfirmModalOpen: false,
  }

  render() {
    return (
      <div>
        {this.renderButton()}
        {this.renderConfirmModal()}
      </div>
    )
  }

  renderButton() {
    const { requiresSudo, permissions } = this.props
    const button = requiresSudo ? this.renderSudoButton() : this.renderActualButton()

    if (permissions) {
      return <CuiPermissibleControl permissions={permissions}>{button}</CuiPermissibleControl>
    }

    return button
  }

  renderSudoButton() {
    const { buttonType, children } = this.props
    const button = this.renderActualButton()
    const buttonUnionProps = getButtonUnionProps<T>(this.props)
    const buttonComponent = getButtonComponent({ buttonType })
    const buttonClick = this.onButtonClick

    return (
      <RequiresSudo
        {...buttonUnionProps}
        buttonType={buttonComponent}
        helpText={false}
        actionPrefix={false}
        to={<Fragment>{children}</Fragment>}
        onSudo={buttonClick}
      >
        {button}
      </RequiresSudo>
    )
  }

  renderActualButton() {
    const onClick = this.onButtonClickFromEvent
    const children = this.renderButtonChildren()

    return renderButton<T>(this.props, {
      onClick,
      children,
    })
  }

  renderButtonChildren() {
    const { children } = this.props

    return (
      <Fragment>
        {this.renderSpin()}
        {children}
      </Fragment>
    )
  }

  renderSpin() {
    const { spin } = this.props

    if (!spin) {
      return null
    }

    return <EuiProgress size='xs' color='primary' position='absolute' />
  }

  renderConfirmModal() {
    const { isConfirmModalOpen } = this.state

    if (!isConfirmModalOpen) {
      return null
    }

    const modalProps = getConfirmModalProps<T>(this.props, {
      onCancel: this.closeConfirmModal,
      onConfirm: this.onConfirm,
    })

    return (
      <EuiOverlayMask>
        <EuiConfirmModal {...modalProps} />
      </EuiOverlayMask>
    )
  }

  onButtonClickFromEvent = (e: MouseClickEvent) => {
    const { type, onClick } = this.props

    if (e && type !== `submit` && onClick) {
      e.preventDefault()
    }

    this.onButtonClick()
  }

  onButtonClick = () => {
    const { confirm } = this.props

    if (confirm) {
      this.openConfirmModal()
      return
    }

    this.onConfirm()
  }

  openConfirmModal = () => {
    const { confirm, confirmExtensions = {} } = this.props
    const { canOpenModal } = confirmExtensions

    if (!confirm) {
      this.closeConfirmModal() // sanity
      return
    }

    if (typeof canOpenModal === 'function') {
      const isConfirmModalOpen = canOpenModal()
      this.setState({ isConfirmModalOpen })
      return
    }

    this.setState({ isConfirmModalOpen: true })
  }

  onConfirm = async () => {
    const { onClick, confirmExtensions = {} } = this.props
    const { fulfillBeforeModalClose } = confirmExtensions

    if (onClick) {
      const maybePromise = onClick()

      if (fulfillBeforeModalClose) {
        await maybePromise // non-thenable just fullfils immediately
      }
    }

    this.closeConfirmModal()
  }

  closeConfirmModal = () => {
    const { confirm, confirmExtensions = {} } = this.props
    const { onModalClose } = confirmExtensions

    this.setState({ isConfirmModalOpen: false })

    if (!confirm) {
      return
    }

    if (onModalClose) {
      onModalClose()
    }
  }
}
