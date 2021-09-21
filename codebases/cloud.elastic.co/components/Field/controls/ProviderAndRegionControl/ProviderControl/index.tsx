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
import { FormattedMessage } from 'react-intl'
import { isEqual } from 'lodash'

import { EuiFormRow, EuiSelect, EuiSelectOption } from '@elastic/eui'
import { ProviderState } from '../../../../../reducers/providers'

interface Props {
  defaultProvider?: string
  disabled: boolean
  isLoading: boolean
  onSelectProvider: (providerId: string) => void
  providers: ProviderState[]
}

interface State {
  options: EuiSelectOption[]
  selected: string
}

class ProviderControl extends PureComponent<Props, State> {
  state = {
    options: [],
    selected: '',
  }

  componentDidUpdate(prevProps: Props): void {
    const { providers } = this.props
    const { providers: prevProviders } = prevProps
    const { options } = this.state

    if (providers.length > 0 && (!isEqual(providers, prevProviders) || !options.length)) {
      this.setProviderData()
    }
  }

  render(): ReactElement {
    const { disabled, isLoading } = this.props
    const { options, selected } = this.state

    return (
      <EuiFormRow
        fullWidth={true}
        label={
          <FormattedMessage
            id='provider-region-control.cloud-provider'
            defaultMessage='Cloud provider'
          />
        }
      >
        <EuiSelect
          disabled={disabled}
          id='provider-control'
          options={options}
          value={selected}
          onChange={this.onSelectProvider}
          fullWidth={true}
          isLoading={isLoading}
        />
      </EuiFormRow>
    )
  }

  setProviderData(): void {
    const { defaultProvider, providers, onSelectProvider } = this.props
    const state: State = {
      options: [],
      selected: '',
    }

    if (providers.length) {
      state.options = providers.map(({ name }) => ({ value: name, text: name.toUpperCase() }))
      state.selected = defaultProvider || providers[0].name
    }

    this.setState(state, () => onSelectProvider(state.selected))
  }

  onSelectProvider = (e: React.BaseSyntheticEvent): void => {
    const { onSelectProvider } = this.props
    const selected = e.target.value
    this.setState({ selected }, () => onSelectProvider(selected))
  }
}

export default ProviderControl
