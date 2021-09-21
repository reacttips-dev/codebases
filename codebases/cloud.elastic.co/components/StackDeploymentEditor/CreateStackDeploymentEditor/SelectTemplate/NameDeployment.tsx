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

import React, { Component } from 'react'
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import cx from 'classnames'

import {
  EuiFieldText,
  EuiFormLabel,
  EuiFormControlLayout,
  EuiSpacer,
  EuiTitle,
  EuiFlexItem,
} from '@elastic/eui'

import PrivacySensitiveContainer from '../../../PrivacySensitiveContainer'

interface Props extends WrappedComponentProps {
  name?: string
  onChange: (nextName: string) => void
  disabled?: boolean
  isAdminconsole?: boolean
}

type State = {
  isNamePristine: boolean
  name: string
}

class NameDeployment extends Component<Props, State> {
  state = {
    isNamePristine: true,
    name: 'My deployment',
  }

  componentDidMount() {
    const { onChange, name } = this.props

    if (!name) {
      onChange(this.getPlaceholder())
    }
  }

  componentDidUpdate() {
    const { name, onChange } = this.props
    const { name: nameState } = this.state

    if (name !== nameState) {
      onChange(nameState)
    }
  }

  render() {
    const { isAdminconsole } = this.props
    const { name } = this.state

    const isPlaceholder = name === this.getPlaceholder()

    if (isAdminconsole) {
      return (
        <EuiFlexItem>
          <EuiFormControlLayout
            fullWidth={true}
            prepend={
              <EuiFormLabel style={{ width: `180px` }}>
                <FormattedMessage defaultMessage='Name' id='name-deployment-label' />
              </EuiFormLabel>
            }
          >
            {this.renderNameInput()}
          </EuiFormControlLayout>
        </EuiFlexItem>
      )
    }

    return (
      <div className={cx({ 'create-deployment-placeholder': isPlaceholder })}>
        <EuiTitle size='s'>
          <h2>
            <FormattedMessage id='create-deployment.name-deployment.title' defaultMessage='Name' />
          </h2>
        </EuiTitle>
        <EuiSpacer size='m' />
        {this.renderNameInput()}
      </div>
    )
  }

  renderNameInput = () => {
    const { disabled } = this.props
    const { name } = this.state

    return (
      <PrivacySensitiveContainer>
        <EuiFieldText
          fullWidth={true}
          data-test-id='deployment-name'
          name='deployment-name'
          value={name}
          onChange={this.onNameType}
          onFocus={this.onNameFocus}
          onBlur={this.onNameBlur}
          disabled={disabled}
        />
      </PrivacySensitiveContainer>
    )
  }

  onNameType = (e) => {
    const { onChange } = this.props
    onChange(e.target.value)
    this.setState({ isNamePristine: false, name: e.target.value })
  }

  onNameFocus = () => {
    const { onChange } = this.props
    const { isNamePristine } = this.state

    if (isNamePristine) {
      this.setState({ isNamePristine: false, name: '' })
      onChange('')
    }
  }

  onNameBlur = () => {
    const { onChange } = this.props
    const { name } = this.state

    if (!name) {
      onChange(this.getPlaceholder())
      this.setState({ isNamePristine: true, name: this.getPlaceholder() })
    }
  }

  getPlaceholder = () => {
    const {
      intl: { formatMessage },
    } = this.props

    return formatMessage({
      id: 'select-solution.name-deployment.placeholder',
      defaultMessage: 'My deployment',
    })
  }
}

export default injectIntl(NameDeployment)
