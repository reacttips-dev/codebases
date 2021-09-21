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

import React, { PureComponent, ReactElement } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import {
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiInputPopover,
} from '@elastic/eui'

import PasswordStrengthIndicator, { validatePassword } from './PasswordStrengthIndicator'

import './passwordField.scss'

interface Props extends WrappedComponentProps {
  fullWidth?: boolean
  hasFocus?: boolean
  hideLockIcon?: boolean
  hasStrengthIndicator?: boolean
  hideVisibilityToggle?: boolean
  hidePlaceholder?: boolean
  isInvalid?: boolean
  error?: React.ReactChild
  label: React.ReactChild
  name: string
  required?: boolean
  onChange: (input: HTMLInputElement, { isValidPassword }: { isValidPassword: boolean }) => void
}

interface State {
  clientError: ReactElement | null
  password: string
  passwordVisible: boolean
  isPopoverOpen: boolean
}

const messages = defineMessages({
  showPassword: {
    id: 'user-settings-profile.showPassword',
    defaultMessage: 'Show',
  },
  hidePassword: {
    id: 'user-settings-profile.hidePassword',
    defaultMessage: 'Hide',
  },
  placeholderPassword: {
    id: 'user-settings-profile.placeholderPassword',
    defaultMessage: 'Password',
  },
})

class PasswordField extends PureComponent<Props, State> {
  input: HTMLInputElement | null

  state = {
    clientError: null,
    password: '',
    passwordVisible: false,
    isPopoverOpen: false,
  }

  componentDidMount() {
    const { hasFocus } = this.props

    if (this.input !== null && hasFocus) {
      this.input.focus()
    }
  }

  render() {
    const { label, isInvalid, error, fullWidth } = this.props
    const { clientError } = this.state

    return (
      <EuiFormRow
        label={label}
        className='password-field-component'
        isInvalid={isInvalid || !!clientError}
        error={error || clientError}
        fullWidth={fullWidth}
      >
        <EuiFlexGroup direction='column' gutterSize='s' justifyContent='flexEnd' responsive={false}>
          <EuiFlexItem>{this.renderPasswordField()}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    )
  }

  renderPasswordField() {
    const { hasStrengthIndicator } = this.props

    if (hasStrengthIndicator) {
      return this.renderStrengthIndicatorEnabledInput()
    }

    return this.renderInputField()
  }

  renderStrengthIndicatorEnabledInput() {
    const { fullWidth } = this.props
    const { password, isPopoverOpen } = this.state

    return (
      <EuiInputPopover
        attachToAnchor={false}
        panelClassName='password-field-popover'
        isOpen={isPopoverOpen}
        closePopover={this.closePopover}
        panelPaddingSize='m'
        input={this.renderInputField()}
        disableFocusTrap={true}
        fullWidth={fullWidth}
      >
        <PasswordStrengthIndicator password={password} />
      </EuiInputPopover>
    )
  }

  renderInputField() {
    const {
      hideLockIcon,
      label,
      name,
      required,
      isInvalid,
      fullWidth,
      hidePlaceholder,
      intl: { formatMessage },
    } = this.props
    const { clientError, passwordVisible } = this.state

    return (
      <EuiFieldText
        arial-label={label}
        data-test-id='password-field'
        icon={hideLockIcon ? undefined : 'lock'}
        isInvalid={isInvalid || !!clientError}
        name={name}
        type={passwordVisible ? `text` : `password`}
        onChange={this.onChangePassword}
        className='password-field-input'
        required={required}
        onFocus={this.onFocusInputField}
        onBlur={this.onBlurInputField}
        inputRef={(el) => {
          this.input = el
        }}
        append={this.renderVisibilityToggle()}
        fullWidth={fullWidth}
        placeholder={hidePlaceholder ? undefined : formatMessage(messages.placeholderPassword)}
      />
    )
  }

  renderVisibilityToggle(): ReactElement | undefined {
    const {
      hideVisibilityToggle,
      intl: { formatMessage },
    } = this.props
    const { passwordVisible } = this.state
    const label = passwordVisible
      ? formatMessage(messages.hidePassword)
      : formatMessage(messages.showPassword)

    if (hideVisibilityToggle) {
      return undefined
    }

    return (
      <EuiButtonIcon
        data-test-id='visibility-toggle'
        iconType={passwordVisible ? 'eyeClosed' : 'eye'}
        onClick={this.showHidePassword}
        aria-label={label}
      >
        {label}
      </EuiButtonIcon>
    )
  }

  showHidePassword = () => {
    this.setState((prevState) => ({
      passwordVisible: !prevState.passwordVisible,
    }))
  }

  onChangePassword = (e) => {
    const input = e.target
    const password = input.value
    const isValidPassword = validatePassword(password)
    const clientError = isValidPassword ? null : this.state.clientError
    this.setState({ password, isPopoverOpen: !isValidPassword, clientError }, () => {
      this.props.onChange(input, { isValidPassword })
    })
  }

  onBlurInputField = () => {
    const { hasStrengthIndicator } = this.props
    const { password } = this.state
    const isValidPassword = validatePassword(password)

    this.closePopover()

    if (password && hasStrengthIndicator) {
      this.setState({
        clientError: isValidPassword ? null : (
          <FormattedMessage
            id='password-field.invalid-password'
            defaultMessage='Minimum password requirements not met'
          />
        ),
      })
      return
    }

    this.setState({ clientError: null })
  }

  onFocusInputField = () => {
    this.setState({ clientError: null }, () => {
      this.openPopover()
    })
  }

  openPopover = () => {
    const { password } = this.state
    const isValidPassword = validatePassword(password)
    this.setState({ isPopoverOpen: !isValidPassword })
  }

  closePopover = () => {
    this.setState({ isPopoverOpen: false })
  }
}

export default injectIntl(PasswordField)
