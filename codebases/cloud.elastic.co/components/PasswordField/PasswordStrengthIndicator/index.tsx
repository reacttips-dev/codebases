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

import React, { Fragment, PureComponent, ReactChild, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEqual } from 'lodash'
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import messages from '../messages'

import './passwordStrengthIndicator.scss'

interface PasswordStrength {
  hasMinimumBasicPasswordLength: boolean
  hasMinimumComplexPasswordLength: boolean
  hasRequiredCharacters: boolean
}
type IndicatorColor = 'subdued' | 'primary'

interface Props {
  password: string
}

interface State {
  isValidPassword?: boolean
  passwordStrength: PasswordStrength
}

export const validatePassword = (password: string): boolean => {
  const passwordStrength = PasswordStrengthIndicator.getPasswordStrength(password)
  return PasswordStrengthIndicator.isValidPassword(passwordStrength)
}

class PasswordStrengthIndicator extends PureComponent<Props, State> {
  state = {
    isValidPassword: false,
    passwordStrength: {
      hasMinimumComplexPasswordLength: false,
      hasMinimumBasicPasswordLength: false,
      hasRequiredCharacters: false,
    },
  }

  static getDerivedStateFromProps(props: Props, state: State): State | null {
    const passwordStrength = PasswordStrengthIndicator.getPasswordStrength(props.password)
    const isValidPassword = PasswordStrengthIndicator.isValidPassword(passwordStrength)

    if (state.isValidPassword !== isValidPassword) {
      return { passwordStrength, isValidPassword }
    }

    if (!isEqual(state.passwordStrength, passwordStrength)) {
      return { passwordStrength }
    }

    return null
  }

  render(): ReactElement {
    return (
      <Fragment>
        <EuiText size='s'>
          <strong>
            <FormattedMessage
              id='password-strength-indicator-title'
              defaultMessage='Your password must:'
            />
          </strong>
        </EuiText>

        <EuiSpacer size='s' />

        {this.renderComplexIndicators()}

        <EuiSpacer size='s' />

        <EuiText>
          <strong>
            <FormattedMessage id='password-strength-indicator-or' defaultMessage='OR' />
          </strong>
        </EuiText>

        <EuiSpacer size='s' />

        {this.renderBasicIndicators()}

        <EuiHorizontalRule margin='m' />

        <EuiText>
          <FormattedMessage {...messages.passwordHelpText} />
        </EuiText>
      </Fragment>
    )
  }

  renderComplexIndicators(): ReactElement {
    const {
      passwordStrength: { hasMinimumComplexPasswordLength, hasRequiredCharacters },
    } = this.state

    return (
      <ul>
        {this.renderIndicatorListItems([
          {
            id: 'strength-indicator-minimum-characters-complex',
            color: this.getIndicatorColor(hasMinimumComplexPasswordLength),
            label: (
              <FormattedMessage
                id='strength-indicator-minimum-characters-complex'
                defaultMessage='Be a minimum of 8 characters'
              />
            ),
          },
          {
            id: 'strength-indicator-cast-of-characters',
            color: this.getIndicatorColor(hasRequiredCharacters),
            label: (
              <FormattedMessage
                id='strength-indicator-cast-of-characters'
                defaultMessage='Include a combination of letters, numbers and symbols'
              />
            ),
          },
        ])}
      </ul>
    )
  }

  renderBasicIndicators(): ReactElement {
    const {
      passwordStrength: { hasMinimumBasicPasswordLength },
    } = this.state

    return (
      <ul>
        {this.renderIndicatorListItems([
          {
            id: 'strength-indicator-minimum-characters-basic',
            color: this.getIndicatorColor(hasMinimumBasicPasswordLength),
            label: (
              <FormattedMessage
                id='strength-indicator-minimum-characters-basic'
                defaultMessage='Be a minimum of 15 characters without complexity'
              />
            ),
          },
        ])}
      </ul>
    )
  }

  renderIndicatorListItems(
    items: Array<{ color: string; label: ReactChild; id: string }>,
  ): ReactElement {
    return (
      <Fragment>
        {items.map(({ color, label, id }, index) => (
          <li className='password-strength-indicator-item' data-test-id={id} key={id}>
            {index > 0 && <EuiSpacer size='s' />}

            <EuiFlexGroup gutterSize='s' responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiIcon type='checkInCircleFilled' className={`${color} ${id}`} />
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiText>{label}</EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </li>
        ))}
      </Fragment>
    )
  }

  static getPasswordStrength(password: string): PasswordStrength {
    const hasLetters = !!password.match(/([a-z])/i)
    const hasNumber = !!password.match(/([0-9])/)
    const hasSpecialCharacters = !!password.match(/([^A-Za-z0-9])/)

    return {
      hasMinimumComplexPasswordLength: password.length >= 8,
      hasMinimumBasicPasswordLength: password.length >= 15,
      hasRequiredCharacters: hasLetters && hasNumber && hasSpecialCharacters,
    }
  }

  static isValidPassword(passwordStrength: PasswordStrength): boolean {
    const {
      hasMinimumBasicPasswordLength,
      hasMinimumComplexPasswordLength,
      hasRequiredCharacters,
    } = passwordStrength

    return (
      (hasMinimumComplexPasswordLength && hasRequiredCharacters) || hasMinimumBasicPasswordLength
    )
  }

  getIndicatorColor(meetsRequirement: boolean): IndicatorColor {
    return meetsRequirement ? 'primary' : 'subdued'
  }
}

export default PasswordStrengthIndicator
