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

import React, { Component, Fragment, ReactElement } from 'react'
import { throttle } from 'lodash'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiComboBox, EuiFormLabel, EuiSpacer, EuiText } from '@elastic/eui'

import { CuiAlert } from '../Alert'
import { CuiDeploymentName } from '../DeploymentName'

import { AsyncRequestState, StackDeployment } from '../../types'
import { DeploymentSearchResponse, DeploymentsSearchResponse } from '../../lib/api/v1/types'

type ComboBoxOption = {
  key: string
  label: string
  options?: ComboBoxOption[]
  value?: DeploymentSearchResponse | null
  disabled?: boolean
}

type ComboBoxItem = {
  label: string
  options?: ComboBoxOption[]
}

export type Props = WrappedComponentProps & {
  ['data-test-id']?: string
  deployment?: StackDeployment | null
  label?: ReactElement
  onChange: (deployment: DeploymentSearchResponse | null) => void
  placeholder?: string
  searchDeploymentList: ({ searchValue }: { searchValue?: string | null }) => void
  searchDeploymentsRequest: AsyncRequestState
  searchResults: DeploymentsSearchResponse | null
  value: DeploymentSearchResponse | null
}

type State = {
  searchValue: string | null
}

const messages = defineMessages({
  defaultPlaceholder: {
    id: `cui-deployment-picker.default-placeholder`,
    defaultMessage: `Search for a deployment`,
  },
  noDeploymentsFound: {
    id: `cui-deployment-picker.no-deployments`,
    defaultMessage: `No compatible deployments`,
  },
  selectedDeployment: {
    id: `deployment-monitoring-search.selected-deployments`,
    defaultMessage: `Selected deployment`,
  },
  loggingDeployments: {
    id: `deployment-monitoring-search.logging-deployments`,
    defaultMessage: `Monitoring deployments`,
  },
  availableDeployments: {
    id: `deployment-monitoring-search.available-deployments`,
    defaultMessage: `Available deployments`,
  },
  thisDeployments: {
    id: `deployment-monitoring-search.this-deployment`,
    defaultMessage: `This deployment (not recommended)`,
  },
})

class CuiDeploymentPickerImpl extends Component<Props> {
  state: State = {
    searchValue: null,
  }

  constructor(props) {
    super(props)
    this.onSearchChange = throttle(this.onSearchChange, 500, { trailing: true })
  }

  render() {
    const {
      intl: { formatMessage },
      searchDeploymentsRequest,
      label,
      placeholder: consumerPlaceholder,
      [`data-test-id`]: dataTestId,
      searchResults,
    } = this.props

    const placeholder = consumerPlaceholder || formatMessage(messages.defaultPlaceholder)

    const listOptions: ComboBoxItem[] = searchResults ? this.getOptions() : []

    const selectedDeployment = this.getSelectedDeployment()

    const selectedDeploymentGroup = {
      label: formatMessage(messages.selectedDeployment),
      options: selectedDeployment,
    }

    return (
      <Fragment>
        {label && <EuiFormLabel>{label}</EuiFormLabel>}

        <EuiComboBox
          async={true}
          singleSelection={{ asPlainText: true }}
          placeholder={placeholder}
          isLoading={searchDeploymentsRequest.inProgress}
          // @ts-ignore the TS defs for combo box aren't helpful for the onChange handler
          options={[selectedDeploymentGroup, ...listOptions]}
          selectedOptions={selectedDeployment}
          // @ts-ignore the TS defs for combo box aren't helpful for the onChange handler
          onChange={this.onChange}
          onSearchChange={this.onSearchChange}
          // @ts-ignore the TS defs for combo box aren't helpful for the onChange handler
          renderOption={this.renderDeploymentOption}
          data-test-id={dataTestId}
        />

        {searchDeploymentsRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{searchDeploymentsRequest.error}</CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }

  renderDeploymentOption = (option: ComboBoxOption, searchValue, contentClassName) => {
    if (option.value === null) {
      return (
        <EuiText textAlign='center' size='s' color='default'>
          {option.label}
        </EuiText>
      )
    }

    return (
      <CuiDeploymentName
        data-test-id='deployment-picker-deployment-name'
        deployment={option.value}
        highlight={searchValue}
        className={contentClassName}
        linkify={false}
      />
    )
  }

  getSelectedDeployment() {
    const { value } = this.props
    return getSelectedDeploymentValue(value)
  }

  getOptions() {
    const {
      searchResults,
      deployment,
      intl: { formatMessage },
      value,
    } = this.props

    if (searchResults?.deployments.length === 0) {
      return [
        {
          label: formatMessage(messages.noDeploymentsFound),
          value: null,
        },
      ]
    }

    const [loggingOptions, availableOptions, selfCluster] = mapResultsToOptions()

    const optionsGroup = [
      {
        label: formatMessage(messages.loggingDeployments),
        options: loggingOptions,
      },
      {
        label: formatMessage(messages.availableDeployments),
        options: availableOptions,
      },
      {
        label: formatMessage(messages.thisDeployments),
        options: selfCluster,
      },
    ]

    return optionsGroup

    function mapResultsToOptions() {
      if (searchResults === null) {
        return []
      }

      const selfCluster: ComboBoxOption[] = []
      const loggingOptions: ComboBoxOption[] = []
      const availableOptions: ComboBoxOption[] = []

      searchResults.deployments.forEach((searchDeployment) => {
        const deploymentLabel =
          searchDeployment.name !== '' ? searchDeployment.name : searchDeployment.id

        const deploymentItem: ComboBoxOption = {
          key: searchDeployment.id,
          label: deploymentLabel,
          value: searchDeployment,
          disabled: false,
        }

        if (value && searchDeployment.id === value.id) {
          return
        }

        if (deployment && searchDeployment.id === deployment.id) {
          selfCluster.push(deploymentItem)
          return
        }

        const checkMonitoring = searchDeployment.resources.elasticsearch.filter((resource) =>
          Boolean(resource.info.elasticsearch_monitoring_info),
        )

        if (checkMonitoring.length > 0) {
          loggingOptions.push(deploymentItem)
        } else {
          availableOptions.push(deploymentItem)
        }
      })

      return [loggingOptions, availableOptions, selfCluster]
    }
  }

  onChange = (selection: ComboBoxOption[]): void => {
    const { onChange } = this.props
    const [selectedOption] = selection

    const nextValue =
      selectedOption && selectedOption?.value !== undefined ? selectedOption.value : null

    onChange(nextValue)
  }

  onSearchChange = (searchValue: string): void => {
    const { searchDeploymentList } = this.props

    searchDeploymentList({ searchValue })
  }
}

function getOption(deployment: DeploymentSearchResponse): ComboBoxOption {
  return {
    key: deployment.id,
    label: getDeploymentPickerLabel(deployment),
    value: deployment,
  }
}

function getSelectedDeploymentValue(value: DeploymentSearchResponse | null): ComboBoxOption[] {
  if (value === null) {
    return []
  }

  return [getOption(value)]
}

// we don't actually use this, but EUI might — now or in the future — because a11y
export function getDeploymentPickerLabel(deployment: DeploymentSearchResponse): string {
  if (!deployment) {
    return ''
  }

  const { id, name } = deployment

  const displayName: string | undefined = name
  const displayId = id.slice(0, 6)

  return displayName ? `${displayName} (${displayId})` : displayId
}

export const CuiDeploymentPicker = injectIntl(CuiDeploymentPickerImpl)
