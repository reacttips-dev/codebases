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

import React, { FunctionComponent } from 'react'
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { Moment } from 'moment'
import { EuiDatePickerRange, EuiDatePicker, EuiFormRow } from '@elastic/eui'
import { messages } from '../messages'

import './datePicker.scss'

interface Props extends WrappedComponentProps {
  isDisabled: boolean
  onChangeStartDate: (date: Moment) => void
  onChangeEndDate: (date: Moment) => void
  selectedStartDate?: Moment
  selectedEndDate?: Moment
  startDate?: Moment
  endDate?: Moment
  maxDate: Moment
  minDate: Moment
}

const DatePicker: FunctionComponent<Props> = ({
  isDisabled,
  intl,
  onChangeStartDate,
  onChangeEndDate,
  selectedStartDate,
  selectedEndDate,
  startDate,
  endDate,
  maxDate,
  minDate,
}) => {
  const { formatMessage } = intl
  let isInvalid = false

  if (startDate && endDate) {
    isInvalid = startDate > endDate
  }

  return (
    <EuiFormRow
      className='date-range-form-row'
      helpText={
        <FormattedMessage
          id='cost-analysis.filter.date-picker.help-text'
          defaultMessage='Usage data available from {date}'
          values={{ date: minDate.format('MMM D, YYYY') }}
        />
      }
      label={
        <FormattedMessage id='cost-analysis.filter.date-picker.label' defaultMessage='Date range' />
      }
    >
      <EuiDatePickerRange
        startDateControl={
          <EuiDatePicker
            disabled={isDisabled}
            popperPlacement='bottom-end'
            selected={selectedStartDate}
            onChange={onChangeStartDate}
            startDate={startDate}
            endDate={endDate}
            isInvalid={isInvalid}
            aria-label={formatMessage(messages.startDate)}
            showTimeSelect={false}
            maxDate={selectedEndDate || maxDate}
            minDate={minDate}
            adjustDateOnChange={false}
          />
        }
        endDateControl={
          <EuiDatePicker
            disabled={isDisabled}
            popperPlacement='bottom-end'
            selected={selectedEndDate}
            onChange={onChangeEndDate}
            startDate={startDate}
            endDate={endDate}
            isInvalid={isInvalid}
            aria-label={formatMessage(messages.endDate)}
            showTimeSelect={false}
            maxDate={maxDate}
            minDate={selectedStartDate || minDate}
            adjustDateOnChange={false}
          />
        }
      />
    </EuiFormRow>
  )
}

export default injectIntl(DatePicker)
