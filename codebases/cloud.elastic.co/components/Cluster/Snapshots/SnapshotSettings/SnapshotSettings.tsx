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
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { get, merge } from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiIcon,
  EuiLink,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  EuiToolTip,
} from '@elastic/eui'

import { CuiAlert, CuiFieldEmpty, CuiPermissibleControl } from '../../../../cui'

import SpinButton from '../../../SpinButton'
import DocLink from '../../../DocLink'

import toNumber, { toNumberOrElse } from '../../../../lib/toNumber'
import { prettyDuration } from '../../../../lib/prettyTime'
import { parseWeirdApiTimeAsMs, parseWeirdApiTimeObject } from '../../../../lib/weirdTime'

import lightTheme from '../../../../lib/theme/light'

import messages from './messages'

import { hasPermission, ifPermitted } from '../../../../lib/requiresPermission'
import Permission from '../../../../lib/api/v1/permissions'
import { AsyncRequestState, ElasticsearchCluster } from '../../../../types'
import { ClusterSnapshotSettings } from '../../../../lib/api/v1/types'

const { euiBreakpoints } = lightTheme

type ClusterSnapshotFullSettings = ClusterSnapshotSettings & { retention?: { snapshots: number } }

interface Props {
  cluster: ElasticsearchCluster
  snapshotSettings: any
  updateSnapshotSettings: (
    cluster: ElasticsearchCluster,
    settings: ClusterSnapshotFullSettings,
  ) => unknown
  fetchSnapshotSettings: (cluster: ElasticsearchCluster) => void
  setSnapshotSettings: (ElasticsearchCluster, Object) => void
  fetchSnapshotSettingsRequest: AsyncRequestState
  updateSnapshotSettingsRequest: AsyncRequestState
  isUserConsole: boolean
  intl: IntlShape
}

interface State {
  isModalOpen: boolean
  showIntervalWarning: boolean
}

class SnapshotSettings extends Component<Props, State> {
  state: State = {
    isModalOpen: false,
    showIntervalWarning: false,
  }

  componentDidUpdate(prevProps) {
    if (this.props.snapshotSettings !== prevProps.snapshotSettings) {
      this.toggleIntervalWarning(this.props.snapshotSettings)
    }
  }

  render() {
    return (
      <Fragment>
        <EuiLink data-test-id='open-snapshot-settings-modal' onClick={this.openModal}>
          <FormattedMessage id='snapshot-settings.edit-link' defaultMessage='Edit settings' />
        </EuiLink>

        {this.renderModal()}
      </Fragment>
    )
  }

  renderModal() {
    const { isModalOpen } = this.state

    if (!isModalOpen) {
      return null
    }

    const {
      intl: { formatMessage },
      fetchSnapshotSettingsRequest,
      updateSnapshotSettingsRequest,
      snapshotSettings,
    } = this.props

    const value = get(snapshotSettings, [`interval`, `value`], ``)
    const unit = get(snapshotSettings, [`interval`, `unit`], ``)

    return (
      <EuiOverlayMask>
        <EuiModal onClose={this.closeModal} style={{ width: euiBreakpoints.m }}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage id='snapshot-settings.title' defaultMessage='Settings' />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>{this.renderModalBody()}</EuiModalBody>

          <EuiModalFooter>
            <div>
              <EuiFlexGroup gutterSize='m' justifyContent='flexEnd'>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty onClick={this.closeModal}>
                    <FormattedMessage id='snapshot-settings.close' defaultMessage='Close' />
                  </EuiButtonEmpty>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                  <div data-test-id='update-snapshot-repo-button'>
                    {ifPermitted(
                      Permission.updateEsClusterSnapshotSettings,
                      () => (
                        <EuiToolTip
                          position='right'
                          content={formatMessage(messages.changeMessage)}
                        >
                          <SpinButton
                            disabled={value === '' || unit === ''}
                            requiresSudo={true}
                            fill={true}
                            onClick={() => this.updateSnapshotSettings()}
                            spin={
                              fetchSnapshotSettingsRequest.inProgress ||
                              updateSnapshotSettingsRequest.inProgress
                            }
                          >
                            {formatMessage(messages.saveSettings)}
                          </SpinButton>
                        </EuiToolTip>
                      ),
                      () => (
                        <CuiPermissibleControl
                          permissions={Permission.updateEsClusterSnapshotSettings}
                        >
                          <EuiButton>{formatMessage(messages.saveSettings)}</EuiButton>
                        </CuiPermissibleControl>
                      ),
                    )}
                  </div>
                </EuiFlexItem>
              </EuiFlexGroup>

              {updateSnapshotSettingsRequest.error && (
                <Fragment>
                  <EuiSpacer size='m' />
                  <CuiAlert size='s' type='error'>
                    {updateSnapshotSettingsRequest.error}
                  </CuiAlert>
                </Fragment>
              )}

              {updateSnapshotSettingsRequest.isDone && !updateSnapshotSettingsRequest.error && (
                <Fragment>
                  <EuiSpacer size='m' />
                  <EuiCallOut
                    size='s'
                    title={formatMessage(messages.snapshotSettingsRequestSuccess)}
                  />
                </Fragment>
              )}
            </div>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderModalBody() {
    const {
      fetchSnapshotSettingsRequest,
      snapshotSettings,
      intl: { formatMessage },
    } = this.props

    const { showIntervalWarning } = this.state

    if (!snapshotSettings && !fetchSnapshotSettingsRequest.isDone) {
      return <EuiLoadingSpinner />
    }

    if (fetchSnapshotSettingsRequest.error) {
      return (
        <div data-test-id='fetch-snapshot-settings-error'>
          <CuiAlert type='error'>{fetchSnapshotSettingsRequest.error}</CuiAlert>
        </div>
      )
    }

    const { retention } = snapshotSettings
    const { snapshots, maxAge } = retention

    const retentionInMs = parseWeirdApiTimeAsMs(maxAge)
    const prettyRetentionTime = prettyDuration({ milliseconds: retentionInMs })
    const isUpdateDenied = !hasPermission(Permission.updateEsClusterSnapshotSettings)

    return (
      <div data-test-id='snapshot-settings'>
        <EuiText>
          <FormattedMessage
            id='snapshot-settings.saas.settings'
            defaultMessage='Select the snapshot interval and the number of snapshots to save.'
          />
        </EuiText>

        <EuiSpacer size='m' />

        <EuiForm>
          <EuiFormRow
            label={formatMessage(messages.intervalLabel)}
            helpText={
              showIntervalWarning ? (
                <FormattedMessage
                  id='snapshot-settings.interval-help-warning'
                  defaultMessage='Time between snapshots. {intervalWarning}.'
                  values={{
                    intervalWarning: (
                      <EuiTextColor color='warning'>
                        <span data-test-id='cluster-update-snapshot-settings.interval-warning'>
                          <FormattedMessage
                            id='snapshot-settings.data-loss-warning'
                            defaultMessage='Long snapshot intervals between snapshots increase the {riskOfLosingData}'
                            values={{
                              riskOfLosingData: (
                                <DocLink link='snapshotRetentionDocLink'>
                                  <FormattedMessage
                                    id='snapshot-settings.data-loss-link'
                                    defaultMessage='risk of losing your most recent data'
                                  />
                                </DocLink>
                              ),
                            }}
                          />
                        </span>
                      </EuiTextColor>
                    ),
                  }}
                />
              ) : (
                <FormattedMessage
                  id='snapshot-settings.interval-help'
                  defaultMessage='Time between snapshots'
                />
              )
            }
          >
            {this.renderIntervalField()}
          </EuiFormRow>

          <div>
            <EuiFlexGroup gutterSize='m'>
              <EuiFlexItem grow={false}>
                <EuiFormRow
                  label={formatMessage(messages.numberOfSnapshotsLabel)}
                  helpText={formatMessage(messages.numberOfSnapshotsHelp)}
                >
                  <EuiToolTip position='right' content={formatMessage(messages.numberOfSnapshots)}>
                    <EuiFieldNumber
                      disabled={isUpdateDenied}
                      min={2}
                      max={100}
                      step={1}
                      name='number-of-snapshots'
                      value={snapshots}
                      onChange={(e) =>
                        this.handleChange({ retention: { snapshots: toNumber(e.target.value) } })
                      }
                    />
                  </EuiToolTip>
                </EuiFormRow>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiFormRow label={formatMessage(messages.retentionPeriodLabel)}>
                  <CuiFieldEmpty>
                    <span>{prettyRetentionTime}</span>
                    <span>{` `}</span>
                    <EuiToolTip position='right' content={formatMessage(messages.retentionPeriod)}>
                      <EuiIcon type='iInCircle' />
                    </EuiToolTip>
                  </CuiFieldEmpty>
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        </EuiForm>
      </div>
    )
  }

  renderIntervalField() {
    const {
      isUserConsole,
      intl: { formatMessage },
    } = this.props

    const { value, unit } = this.getSnapshotInterval()

    const presetInterval = [
      { value: `min`, text: formatMessage(messages.minutes) },
      { value: `h`, text: formatMessage(messages.hours) },
      { value: `d`, text: formatMessage(messages.days) },
    ]

    const disabled = !hasPermission(Permission.updateEsClusterSnapshotSettings)

    if (isUserConsole) {
      return (
        <EuiSelect
          disabled={disabled}
          options={[
            { value: `30`, text: formatMessage(messages.valueMinutes, { value: 30 }) },
            { value: String(4 * 60), text: formatMessage(messages.valueHours, { value: 4 }) },
            { value: String(24 * 60), text: formatMessage(messages.valueHours, { value: 24 }) },
          ]}
          onChange={(e) => this.handleChange({ interval: { value: e.target.value, unit: 'min' } })}
          value={value}
        />
      )
    }

    return (
      <EuiFlexGroup gutterSize='m'>
        <EuiFlexItem>
          <EuiFieldNumber
            disabled={disabled}
            onChange={(e) => this.handleChange({ interval: { value: e.target.value, unit } })}
            min={0}
            value={toNumberOrElse(value, 0)}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiSelect
            disabled={disabled}
            options={presetInterval}
            hasNoInitialSelection={value === '' || unit === ''}
            value={unit}
            data-test-id='update-snapshot-settings'
            onChange={(e) => this.handleChange({ interval: { value, unit: e.target.value } })}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  handleChange(val) {
    const { cluster, setSnapshotSettings, snapshotSettings } = this.props
    const updatedSnapshotSettings = merge({}, snapshotSettings, val)
    const { retention, interval } = updatedSnapshotSettings
    const maxAge = `${retention.snapshots * interval.value}${interval.unit}`
    setSnapshotSettings(cluster, {
      retention: { snapshots: retention.snapshots, maxAge },
      interval,
    })
  }

  updateSnapshotSettings() {
    const { snapshotSettings } = this.props
    const { value, unit } = snapshotSettings.interval
    const { updateSnapshotSettings, cluster } = this.props

    const settings = value + unit === '30min' ? 'default' : value + unit
    updateSnapshotSettings(cluster, {
      retention: { snapshots: snapshotSettings.retention.snapshots },
      interval: settings,
    })
  }

  getSnapshotInterval() {
    const { snapshotSettings } = this.props
    const {
      interval: { value, unit },
    } = snapshotSettings

    if (unit.startsWith(`s`)) {
      return {
        value: String(Math.floor(value / 60)),
        unit: `m`,
      }
    }

    return {
      value: String(value),
      unit,
    }
  }

  toggleIntervalWarning(snapshotSettings) {
    const {
      interval: { value, unit },
    } = snapshotSettings

    const dayInMs = 60 * 60 * 24 * 1000
    const { ms } = parseWeirdApiTimeObject({ unit, value })
    const showIntervalWarning = ms >= dayInMs

    if (showIntervalWarning !== this.state.showIntervalWarning) {
      this.setState({ showIntervalWarning })
    }
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }
}

export default injectIntl(SnapshotSettings)
