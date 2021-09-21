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
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiComboBox, EuiFormLabel, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../Alert'
import { CuiClusterName } from '../ClusterName'

import { AsyncRequestState, Cluster, ElasticsearchCluster } from '../../types'

type TCluster = ElasticsearchCluster

type ComboBoxOption = {
  label: string
  value: TCluster
  disabled?: boolean
}

type ComboBoxOptionGroup = {
  label: string
  options: ComboBoxOption[]
}

type ComboBoxItem = ComboBoxOption | ComboBoxOptionGroup

type Props = WrappedComponentProps & {
  searchClusters: (query: string) => void
  searchClustersRequest: AsyncRequestState

  // pass in `clusters`, letting `CuiClusterPicker` create the combo box options
  clusters?: TCluster[]

  // pass in `options` defining the combo box options yourself, allows for groups
  options?: ComboBoxItem[]
  value: TCluster | null
  onChange: (cluster: TCluster | null) => void
  label?: ReactElement
  placeholder?: string
  ['data-test-id']?: string
  fullWidth?: boolean
}

const messages = defineMessages({
  defaultPlaceholder: {
    id: `cui-cluster-picker.default-placeholder`,
    defaultMessage: `Select a deployment`,
  },
})

class CuiClusterPickerImpl extends Component<Props> {
  componentDidMount() {
    this.searchClusters(``)
  }

  render() {
    const {
      intl: { formatMessage },
      searchClustersRequest,
      label,
      placeholder: consumerPlaceholder,
      [`data-test-id`]: dataTestSubj,
      fullWidth,
    } = this.props

    const { options, selectedOptions } = this.getOptions()

    const placeholder = consumerPlaceholder || formatMessage(messages.defaultPlaceholder)

    return (
      <Fragment>
        {label && <EuiFormLabel>{label}</EuiFormLabel>}

        <EuiComboBox
          fullWidth={fullWidth}
          async={true}
          singleSelection={{ asPlainText: true }}
          placeholder={placeholder}
          isLoading={searchClustersRequest.inProgress}
          // @ts-ignore the TS defs for combo box aren't helpful for the onChange handler
          options={options}
          selectedOptions={selectedOptions}
          onSearchChange={this.searchClusters}
          // @ts-ignore the TS defs for combo box aren't helpful for the onChange handler
          onChange={this.onChange}
          // @ts-ignore the TS defs for combo box aren't helpful for the onChange handler
          renderOption={this.renderClusterOption}
          data-test-id={dataTestSubj}
        />

        {searchClustersRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{searchClustersRequest.error}</CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }

  renderClusterOption = (option: ComboBoxOption, searchValue, contentClassName) => (
    <CuiClusterName
      cluster={option.value}
      linkify={false}
      highlight={searchValue}
      className={contentClassName}
    />
  )

  getOptions() {
    const { value } = this.props
    const options = getConsumerOptions(this.props)
    const selectedOptions = getSelectedOptions(value)

    return { options, selectedOptions }
  }

  searchClusters = (query: string): void => {
    const { searchClusters } = this.props
    searchClusters(query)
  }

  onChange = (selection: ComboBoxOption[]): void => {
    const { onChange } = this.props
    const [selectedOption] = selection
    const nextValue = selectedOption ? selectedOption.value : null

    onChange(nextValue)
  }
}

function getConsumerOptions(props: Props): ComboBoxItem[] {
  const { options, clusters } = props

  if (Array.isArray(options)) {
    return options
  }

  if (Array.isArray(clusters)) {
    return clusters.map((cluster) => getOption(cluster))
  }

  throw new Error(
    `Expected at least one of \`clusters\` or \`options\` to be an array at <CuiClusterPicker/>`,
  )
}

function getOption(cluster: TCluster): ComboBoxOption {
  return {
    label: getClusterPickerLabel(cluster),
    value: cluster,
  }
}

function getSelectedOptions(value: TCluster | null): ComboBoxOption[] {
  if (value === null) {
    return []
  }

  return [getOption(value)]
}

// we don't actually use this, but EUI might — now or in the future — because a11y
export function getClusterPickerLabel(cluster: Cluster): string {
  const { id, stackDeploymentId } = cluster

  // @ts-ignore TS doesn't understand but we're ok that it might not be a thing
  const name: string | undefined = cluster.name

  const displayId = stackDeploymentId ? stackDeploymentId.slice(0.6) : id.slice(0, 6)
  return name ? `${name} (${displayId})` : displayId
}

export const CuiClusterPicker = injectIntl(CuiClusterPickerImpl)
