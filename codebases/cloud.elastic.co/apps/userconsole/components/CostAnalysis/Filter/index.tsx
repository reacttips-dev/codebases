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

import React, { Fragment, PureComponent } from 'react'
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import moment, { Moment } from 'moment'
import {
  EuiButtonEmpty,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui'

import TimePeriod from './TimePeriod'
import DatePicker from './DatePicker'
import RadioGroup from './RadioGroup'
import { messages } from './messages'

import { getTimeRange } from '../lib'

import {
  SelectedFilterItems,
  SelectedViewByOption,
  TimePeriod as TimePeriodType,
  TimePeriodOptionItem,
  UserProfile,
} from '../../../../../types'
import { DeploymentCosts } from '../../../../../lib/api/v1/types'

import './filter.scss'

interface Props extends WrappedComponentProps {
  profile: UserProfile
  deployments: DeploymentCosts[] | null
  onFilter: (options: SelectedFilterItems) => void
  defaultTimePeriod?: TimePeriodType
  isDisabled: boolean
}

interface State {
  selectedItems: SelectedFilterItems
}

class CostAnalysisFilter extends PureComponent<Props, State> {
  state: State = this.getDefaultState()

  componentDidMount() {
    this.props.onFilter(this.state.selectedItems)
  }

  render() {
    const { deployments, isDisabled } = this.props
    const { selectedItems } = this.state
    const { selectedStartDate, selectedEndDate, selectedViewByOption } = selectedItems
    const canClearAll = this.isClearable()

    return (
      <EuiForm className='cost-analysis-filter' style={{ width: '275px' }}>
        <EuiFlexGroup alignItems='center' responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiTitle size='xxs'>
              <h5>
                <FormattedMessage id='cost-analysis.filter' defaultMessage='Filters' />
              </h5>
            </EuiTitle>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              isDisabled={isDisabled || !canClearAll}
              size='xs'
              onClick={this.onClear}
              data-test-id='cost-analysis.clear-all'
            >
              <FormattedMessage id='cost-analysis.clear-all.button' defaultMessage='Reset' />
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='l' />

        <TimePeriod
          isDisabled={isDisabled}
          onChange={this.onSelectTimeRange}
          options={this.getTimeRangeOptions()}
          selectedOption={selectedItems.timePeriodOptionItem}
        />

        {this.hasCustomRangeSelected() && (
          <Fragment>
            <EuiSpacer size='m' />
            <DatePicker
              isDisabled={isDisabled}
              onChangeStartDate={this.onChangeStartDate}
              onChangeEndDate={this.onChangeEndDate}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              maxDate={this.getDefaultMaxDate()}
              minDate={this.getDefaultMinDate()}
            />
          </Fragment>
        )}

        <EuiSpacer size='l' />

        <RadioGroup
          isDisabled={isDisabled}
          options={this.getViewByOptions()}
          selected={selectedViewByOption}
          onChange={this.onChangeViewByOptions}
          label={<FormattedMessage id='cost-analysis-view-by-label' defaultMessage='View by' />}
        />

        <EuiSpacer size='l' />

        {selectedViewByOption === 'deployment' && deployments && this.renderDeploymentFilter()}
      </EuiForm>
    )
  }

  renderDeploymentFilter() {
    const {
      deployments,
      profile,
      intl: { formatMessage },
      isDisabled,
    } = this.props
    const { inTrial } = profile
    const {
      selectedItems: { selectedDeployments },
    } = this.state

    if (inTrial || (deployments && deployments.length < 2)) {
      return null
    }

    return (
      <EuiFormRow
        label={
          <FormattedMessage
            id='cost-analysis-filter-by-deployments-label'
            defaultMessage='Deployments'
          />
        }
        display='rowCompressed'
      >
        <EuiComboBox
          isDisabled={isDisabled}
          placeholder={formatMessage(messages.allDeployment)}
          options={this.getDeploymentFilterOptions()}
          selectedOptions={selectedDeployments}
          onChange={this.onSelectDeployment}
          isClearable={true}
          className='cost-analysis-filter-by-deployments'
          data-test-id='cost-analysis-filter-by-deployments'
        />
      </EuiFormRow>
    )
  }

  getDefaultSelectedDates() {
    const { defaultTimePeriod } = this.props

    if (!defaultTimePeriod) {
      const { from: selectedStartDate, to: selectedEndDate } = getTimeRange({
        timePeriod: { id: 'currentMonth' },
      })
      return { selectedStartDate, selectedEndDate }
    }

    if (!defaultTimePeriod.to && !defaultTimePeriod.from) {
      const { from: selectedStartDate, to: selectedEndDate } = getTimeRange({
        timePeriod: { id: defaultTimePeriod.id },
      })
      return { selectedStartDate, selectedEndDate }
    }

    const { from: selectedStartDate, to: selectedEndDate } = defaultTimePeriod
    return { selectedStartDate, selectedEndDate }
  }

  getDefaultMinDate() {
    return moment().add(1, 'days').subtract(3, 'months').startOf('day')
  }

  getDefaultMaxDate() {
    return moment()
  }

  getDefaultCustomRangeStartDate(prevTimePeriodOptionItem: TimePeriodOptionItem) {
    if (prevTimePeriodOptionItem.id === 'currentMonth') {
      return moment().startOf('month')
    }

    return moment().subtract(1, 'month').startOf('month')
  }

  getDefaultCustomRangeEndDate(prevTimePeriodOptionItem: TimePeriodOptionItem) {
    if (prevTimePeriodOptionItem.id === 'currentMonth') {
      return moment().endOf('day')
    }

    return moment().subtract(1, 'month').endOf('month')
  }

  getDefaultState(args?: { isReset: true }): State {
    const timeRangeOptions = this.getTimeRangeOptions()
    const { selectedStartDate, selectedEndDate } = this.getDefaultSelectedDates()

    return {
      selectedItems: {
        timePeriodOptionItem:
          args && args.isReset ? timeRangeOptions[0] : this.getDefaultTimeRangeOption(),
        selectedStartDate,
        selectedEndDate,
        selectedViewByOption: this.getDefaultViewByOption().id as SelectedViewByOption,
        selectedDeployments: [],
      },
    }
  }

  onClear = () => {
    this.setState({ ...this.getDefaultState({ isReset: true }) }, this.onFilter)
  }

  isClearable() {
    const timeRangeOptions = this.getTimeRangeOptions()
    const { selectedItems } = this.state
    const defaultTimePeriodOption = timeRangeOptions[0]
    const defaultViewByOption = this.getDefaultViewByOption()

    return (
      selectedItems.timePeriodOptionItem.id !== defaultTimePeriodOption.id ||
      selectedItems.selectedViewByOption !== defaultViewByOption.id ||
      selectedItems.selectedDeployments.length > 0
    )
  }

  getDeploymentFilterOptions() {
    const { deployments } = this.props

    if (deployments) {
      return deployments.map((deployment) => {
        const { deployment_id, deployment_name } = deployment

        return {
          id: deployment_id,
          label: deployment_name,
        }
      })
    }

    return []
  }

  getViewByOptions() {
    const {
      intl: { formatMessage },
    } = this.props

    return [
      { id: 'deployment', label: formatMessage(messages.deployment) },
      { id: 'product', label: formatMessage(messages.product) },
    ]
  }

  getDefaultViewByOption() {
    return this.getViewByOptions()[0]
  }

  getTimeRangeOptions(): TimePeriodOptionItem[] {
    const {
      intl: { formatMessage },
    } = this.props

    return [
      { id: 'currentMonth', label: formatMessage(messages.currentMonth) },
      { id: 'lastMonth', label: formatMessage(messages.lastMonth) },
      { id: 'customRange', label: formatMessage(messages.customRange) },
    ]
  }

  getDefaultTimeRangeOption(): TimePeriodOptionItem {
    const { defaultTimePeriod } = this.props
    const timeRangeOptions = this.getTimeRangeOptions()

    if (!defaultTimePeriod) {
      return timeRangeOptions[0]
    }

    return (
      timeRangeOptions.filter((option) => option.id === defaultTimePeriod.id)[0] ||
      timeRangeOptions[0]
    )
  }

  hasCustomRangeSelected() {
    const { selectedItems } = this.state
    const customRange = this.getTimeRangeOptions()[2]
    return customRange.id === selectedItems.timePeriodOptionItem.id
  }

  onSelectTimeRange = (selectedTimeRange) => {
    const timePeriodOptionItem = selectedTimeRange[0]

    this.setState((prevState) => {
      const { timePeriodOptionItem: prevTimePeriodOptionItem } = prevState.selectedItems

      return {
        selectedItems: {
          ...prevState.selectedItems,
          timePeriodOptionItem,
          ...this.getRange({ timePeriodOptionItem, prevTimePeriodOptionItem }),
        },
      }
    }, this.onFilter)
  }

  getRange({ timePeriodOptionItem, prevTimePeriodOptionItem }) {
    const range: {
      selectedStartDate: Moment | undefined
      selectedEndDate: Moment | undefined
    } = {
      selectedStartDate: undefined,
      selectedEndDate: undefined,
    }

    if (timePeriodOptionItem.id === 'customRange') {
      range.selectedStartDate = this.getDefaultCustomRangeStartDate(prevTimePeriodOptionItem)
      range.selectedEndDate = this.getDefaultCustomRangeEndDate(prevTimePeriodOptionItem)
    } else {
      const { from, to } = getTimeRange({ timePeriod: { id: timePeriodOptionItem.id } })
      range.selectedStartDate = from
      range.selectedEndDate = to
    }

    return range
  }

  onChangeEndDate = (selectedEndDate) => {
    this.setState(
      (prevState) => ({
        selectedItems: {
          ...prevState.selectedItems,
          selectedEndDate,
        },
      }),
      this.onFilter,
    )
  }

  onChangeStartDate = (selectedStartDate) => {
    this.setState(
      (prevState) => ({
        selectedItems: {
          ...prevState.selectedItems,
          selectedStartDate,
        },
      }),
      this.onFilter,
    )
  }

  onChangeViewByOptions = (selectedViewByOption) => {
    this.setState(
      (prevState) => ({
        selectedItems: {
          ...prevState.selectedItems,
          selectedViewByOption,
        },
      }),
      this.onFilter,
    )
  }

  onSelectDeployment = (selectedDeployments) => {
    this.setState(
      (prevState) => ({
        selectedItems: {
          ...prevState.selectedItems,
          selectedDeployments,
        },
      }),
      this.onFilter,
    )
  }

  onFilter = () => {
    const { selectedItems } = this.state
    this.props.onFilter(selectedItems)
  }
}

export default injectIntl(CostAnalysisFilter)
