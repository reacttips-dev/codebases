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

import { EuiFlexGroup, EuiFlexItem, EuiSelectOption } from '@elastic/eui'

import ProviderControl from './ProviderControl'
import RegionControl from './RegionControl'

import { ConsumerProps, DispatchProps, StateProps } from './types'

interface Props extends StateProps, ConsumerProps, DispatchProps {}

interface State {
  providerOptions: EuiSelectOption[]
  regionOptions: EuiSelectOption[]
  selectedProvider: string
  selectedRegion: string
}

class ProviderAndRegionControl extends PureComponent<Props, State> {
  state = {
    providerOptions: [],
    regionOptions: [],
    selectedProvider: '',
    selectedRegion: '',
  }

  componentDidMount(): void {
    const { fetchProviders } = this.props
    fetchProviders()
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    const { selectedRegion } = this.state
    const { selectedRegion: prevSelectedRegion, selectedProvider: prevSelectedProvider } = prevState

    if (
      selectedRegion !== prevSelectedRegion ||
      (this.selectedProviderHasNoRegions() &&
        this.selectionHasChanged({ prevSelectedProvider, prevSelectedRegion }))
    ) {
      this.onSelectionChange()
    }
  }

  render(): ReactElement {
    const { defaultProvider, disabled, fetchProviderRequest, providers } = this.props
    const { selectedProvider } = this.state
    const isLoading = fetchProviderRequest.inProgress || providers.length === 0

    return (
      <EuiFlexGroup>
        <EuiFlexItem>
          <ProviderControl
            defaultProvider={defaultProvider}
            disabled={disabled}
            isLoading={isLoading}
            onSelectProvider={this.onSelectProvider}
            providers={providers}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <RegionControl
            disabled={disabled}
            isLoading={isLoading}
            providers={providers}
            selectedProvider={selectedProvider}
            onSelectRegion={this.onSelectRegion}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  selectionHasChanged({
    prevSelectedProvider,
    prevSelectedRegion,
  }: {
    prevSelectedProvider: string
    prevSelectedRegion: string
  }): boolean {
    const { selectedProvider, selectedRegion } = this.state

    if (prevSelectedRegion || selectedRegion) {
      return selectedProvider !== prevSelectedProvider && selectedRegion !== prevSelectedRegion
    }

    return selectedProvider !== prevSelectedProvider
  }

  selectedProviderHasNoRegions(): boolean | undefined {
    const { providers } = this.props
    const { selectedProvider } = this.state

    if (!providers.length || !selectedProvider) {
      return
    }

    const providerState = providers.find((provider) => provider.name === selectedProvider)
    return !providerState!.regions.length
  }

  onSelectProvider = (selectedProvider: string): void => {
    this.setState({ selectedProvider })
  }

  onSelectRegion = (selectedRegion: string): void => {
    this.setState({ selectedRegion })
  }

  onSelectionChange(): void {
    const { onSelect } = this.props
    const { selectedProvider, selectedRegion } = this.state

    onSelect({
      provider: selectedProvider,
      region: selectedRegion,
    })
  }
}

export default ProviderAndRegionControl
