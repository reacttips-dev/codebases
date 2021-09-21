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
import { FormattedMessage, defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import moment from 'moment'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiRadio,
  EuiSpacer,
  EuiTitle,
  htmlIdGenerator,
} from '@elastic/eui'

import { CuiTable } from '../../../cui'

import { getModels, deriveDownloadBlob } from './deploymentsFormat'

import { getConfigForKey, isFeatureActivated } from '../../../store'

import lightTheme from '../../../lib/theme/light'

import Feature from '../../../lib/feature'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

type Props = WrappedComponentProps & {
  deployments: DeploymentSearchResponse[]
  close: () => void
}

type State = {
  fields: string[]
  sortFields: string[]
  blobUrl?: string
  format: 'json' | 'csv'
}

const { euiBreakpoints } = lightTheme
const makeId = htmlIdGenerator()
const sampleSize = 15

const alwaysAvailableFields = [
  `id`,
  `region`,
  `name`,
  `version`,
  `platform`,
  `instances`,
  `memory_capacity`,
  `storage_capacity`,
  `topology`,
  `healthy`,
  `maintenance`,
  `running`,
  `pending`,
  `latest_snapshot`,
  `latest_snapshot_success`,
]

const saasAdminconsoleFields = [`organization`, `subscription`]

const hiddenClusterFields = [`hidden`]

const defaultFields = [`region`, `id`, `name`, `version`, `topology`, `latest_snapshot`]

const defaultSortFields = [`region`, `id`]

const messages = defineMessages({
  jsonFormat: {
    id: `export-deployments.json-format`,
    defaultMessage: `JSON`,
  },
  csvFormat: {
    id: `export-deployments.csv-format`,
    defaultMessage: `CSV`,
  },
  displayName_id: {
    id: `export-deployments.field-display-name:id`,
    defaultMessage: `ID`,
  },
  displayName_region: {
    id: `export-deployments.field-display-name:region`,
    defaultMessage: `Region`,
  },
  displayName_name: {
    id: `export-deployments.field-display-name:name`,
    defaultMessage: `Name`,
  },
  displayName_version: {
    id: `export-deployments.field-display-name:version`,
    defaultMessage: `Version`,
  },
  displayName_organization: {
    id: `export-deployments.field-display-name:organization`,
    defaultMessage: `Organization`,
  },
  displayName_platform: {
    id: `export-deployments.field-display-name:platform`,
    defaultMessage: `Platform`,
  },
  displayName_instances: {
    id: `export-deployments.field-display-name:instances`,
    defaultMessage: `Instances`,
  },
  displayName_memory_capacity: {
    id: `export-deployments.field-display-name:memory_capacity`,
    defaultMessage: `Memory capacity`,
  },
  displayName_storage_capacity: {
    id: `export-deployments.field-display-name:storage_capacity`,
    defaultMessage: `Storage capacity`,
  },
  displayName_topology: {
    id: `export-deployments.field-display-name:topology`,
    defaultMessage: `Topology`,
  },
  displayName_healthy: {
    id: `export-deployments.field-display-name:healthy`,
    defaultMessage: `Healthy`,
  },
  displayName_maintenance: {
    id: `export-deployments.field-display-name:maintenance`,
    defaultMessage: `Maintenance`,
  },
  displayName_running: {
    id: `export-deployments.field-display-name:running`,
    defaultMessage: `Running`,
  },
  displayName_pending: {
    id: `export-deployments.field-display-name:pending`,
    defaultMessage: `Pending changes`,
  },
  displayName_hidden: {
    id: `export-deployments.field-display-name:hidden`,
    defaultMessage: `Hidden`,
  },
  displayName_latest_snapshot: {
    id: `export-deployments.field-display-name:latest_snapshot`,
    defaultMessage: `Latest snapshot`,
  },
  displayName_latest_snapshot_success: {
    id: `export-deployments.field-display-name:latest_snapshot_success`,
    defaultMessage: `Latest snapshot success`,
  },
  displayName_subscription: {
    id: `export-deployments.field-display-name:subscription`,
    defaultMessage: `Subscription`,
  },
})

class ExportDeploymentsModal extends Component<Props, State> {
  state: State = {
    fields: defaultFields,
    sortFields: defaultSortFields,
    blobUrl: undefined,
    format: `json`,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const { intl, deployments } = nextProps
    const { fields, sortFields, blobUrl, format } = prevState

    return deriveDownloadBlob({
      intl,
      deployments,
      fields,
      sortFields,
      blobUrl,
      format,
    })
  }

  render() {
    const {
      intl: { formatMessage },
      close,
    } = this.props
    const { blobUrl, format } = this.state
    const blobName = this.getBlobName()

    return (
      <EuiOverlayMask>
        <EuiModal style={{ width: euiBreakpoints.m }} onClose={close}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage id='export-deployments.title' defaultMessage='Export deployments' />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <div style={{ maxWidth: `700px` }}>
              {this.renderSettings()}

              <EuiSpacer size='m' />

              {this.renderSampleTable()}
            </div>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiFlexGroup gutterSize='m' justifyContent='spaceBetween'>
              <EuiFlexItem grow={false}>
                <EuiFlexGroup gutterSize='m'>
                  <EuiFlexItem grow={false}>
                    <EuiRadio
                      id={makeId()}
                      label={formatMessage(messages.jsonFormat)}
                      checked={format === `json`}
                      onChange={() => this.setState({ format: `json` })}
                      data-test-id='exportDeploymentAsJson'
                    />
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <EuiRadio
                      id={makeId()}
                      label={formatMessage(messages.csvFormat)}
                      checked={format === `csv`}
                      onChange={() => this.setState({ format: `csv` })}
                      data-test-id='exportDeploymentAsCsv'
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiFlexGroup gutterSize='m'>
                  <EuiFlexItem grow={false}>
                    <EuiButtonEmpty onClick={close}>
                      <FormattedMessage id='export-deployments.close' defaultMessage='Close' />
                    </EuiButtonEmpty>
                  </EuiFlexItem>

                  <EuiFlexItem grow={false}>
                    <EuiButton
                      iconType='importAction'
                      fill={true}
                      download={blobName}
                      href={blobUrl}
                      data-test-id='exportDeploymentDownloadButton'
                    >
                      <FormattedMessage
                        id='export-deployments.download'
                        defaultMessage='Download'
                      />
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderSettings() {
    const { fields, sortFields } = this.state

    const isSaasAdminconsole = getConfigForKey(`CLOUD_UI_APP`) === `saas-adminconsole`
    const hideInsteadOfDelete = isFeatureActivated(Feature.hideClusterInsteadOfDelete)

    const availableFields = [...alwaysAvailableFields]

    if (isSaasAdminconsole) {
      availableFields.push(...saasAdminconsoleFields)
    }

    if (hideInsteadOfDelete) {
      availableFields.push(...hiddenClusterFields)
    }

    const fieldOptions = availableFields.map(this.fieldToComboOption)
    const sortFieldOptions = availableFields.map(this.fieldToComboOption)

    const selectedFields = fields.map(this.fieldToComboOption)
    const selectedSortFields = sortFields.map(this.fieldToComboOption)

    return (
      <EuiFlexGroup gutterSize='m' alignItems='flexStart'>
        <EuiFlexItem>
          <EuiFormLabel>
            <FormattedMessage id='export-deployments.fields' defaultMessage='Fields' />
          </EuiFormLabel>

          <div>
            <EuiComboBox
              options={fieldOptions}
              selectedOptions={selectedFields}
              onChange={this.onChangeFields}
              onCreateOption={this.onCreateField}
              isClearable={false}
            />
          </div>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiFormLabel>
            <FormattedMessage id='export-deployments.sort-order' defaultMessage='Sort order' />
          </EuiFormLabel>

          <div>
            <EuiComboBox
              options={sortFieldOptions}
              selectedOptions={selectedSortFields}
              onChange={this.onChangeSortFields}
              onCreateOption={this.onCreateSortField}
              isClearable={false}
            />
          </div>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderSampleTable() {
    const { intl, deployments } = this.props
    const { fields, sortFields } = this.state

    const rows = getModels({
      intl,
      deployments,
      fields,
      sortFields,
      structured: false,
    }).slice(0, sampleSize)

    const columns = fields.map((field) => ({
      label: this.getFieldLabel(field),
      render: (row) => row[field],
      truncateText: true,
    }))

    return (
      <Fragment>
        <EuiTitle>
          <h4>
            <FormattedMessage id='export-deployments.sample-data' defaultMessage='Sample data' />
          </h4>
        </EuiTitle>

        <EuiSpacer size='s' />

        <CuiTable columns={columns} rows={rows} />
      </Fragment>
    )
  }

  onChangeFields = (selectedOptions) => {
    const fields = selectedOptions.map(comboOptionToField)
    this.setState({ fields })
  }

  onChangeSortFields = (selectedOptions) => {
    const sortFields = selectedOptions.map(comboOptionToField)
    this.setState({ sortFields })
  }

  onCreateField = (searchValue, selectOptions) => {
    this.onCreateOption({
      searchValue,
      selectOptions,
      stateFields: this.state.fields,
      onChange: this.onChangeFields,
    })
  }

  onCreateSortField = (searchValue, selectOptions) => {
    this.onCreateOption({
      searchValue,
      selectOptions,
      stateFields: this.state.sortFields,
      onChange: this.onChangeSortFields,
    })
  }

  onCreateOption({ searchValue, selectOptions, stateFields, onChange }) {
    const query = normalizeComboLabel(searchValue)
    const matchingOptions = selectOptions.filter((option) =>
      normalizeComboLabel(option.label).startsWith(query),
    )

    if (matchingOptions.length !== 1) {
      return
    }

    const [matchingOption] = matchingOptions
    const selectedOptions = stateFields.map(this.fieldToComboOption)
    const fields = [...selectedOptions, matchingOption]

    onChange(fields)
  }

  getFieldLabel(field) {
    const {
      intl: { formatMessage },
    } = this.props
    const key = `displayName_${field}`
    const message = messages[key]

    if (message) {
      return formatMessage(message)
    }

    return field
  }

  fieldToComboOption = (field) => ({
    label: this.getFieldLabel(field),
    value: field,
  })

  getBlobName() {
    const { format } = this.state
    const timestamp = moment().format(`YYYY-MMM-DD--HH_mm_ss`)
    const blobName = `deployments-${timestamp}.${format}`
    return blobName
  }
}

function comboOptionToField(option) {
  return option.value
}

function normalizeComboLabel(label) {
  return label.trim().toLowerCase()
}

export default injectIntl(ExportDeploymentsModal)
