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
import { ProviderState, RegionState } from '../../../../../reducers/providers'

interface Props {
  disabled: boolean
  isLoading: boolean
  providers: ProviderState[]
  selectedProvider: string
  onSelectRegion: (regionId: string) => void
}

interface State {
  options: EuiSelectOption[]
  selected: string
}

class RegionControl extends PureComponent<Props, State> {
  state = {
    options: [],
    selected: '',
  }

  componentDidUpdate(prevProps: Props): void {
    const { selectedProvider } = this.props
    const { selectedProvider: prevSelectedProvider } = prevProps

    if (!isEqual(selectedProvider, prevSelectedProvider)) {
      this.setRegionData()
    }
  }

  render(): ReactElement {
    const { disabled, isLoading } = this.props
    const { options, selected } = this.state

    return (
      <EuiFormRow
        fullWidth={true}
        label={<FormattedMessage id='provider-region-control.region' defaultMessage='Region' />}
      >
        <EuiSelect
          disabled={disabled}
          id='region-control'
          options={options}
          value={selected}
          onChange={this.onSelectRegion}
          fullWidth={true}
          isLoading={isLoading}
        />
      </EuiFormRow>
    )
  }

  getRegionsByProvider(): RegionState[] {
    const { providers, selectedProvider } = this.props
    const currentProvider = providers.find((provider) => provider.name === selectedProvider)

    return (currentProvider && currentProvider.regions) || []
  }

  getRegionOptions(): EuiSelectOption[] {
    const regions = this.getRegionsByProvider() || []

    return regions.map((region) => {
      const { identifier, name } = region
      return {
        value: identifier,
        text: name,
      }
    })
  }

  setRegionData(): void {
    const { onSelectRegion } = this.props
    const options = this.getRegionOptions()
    const selected = options.length > 0 ? (options[0].value as string) : ''

    this.setState(
      {
        options,
        selected,
      },
      () => onSelectRegion(selected),
    )
  }

  onSelectRegion = (e: React.BaseSyntheticEvent): void => {
    const { onSelectRegion } = this.props
    const selected = e.target.value
    this.setState({ selected }, () => onSelectRegion(selected))
  }
}

export default RegionControl
