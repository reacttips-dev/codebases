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

import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiComboBox, EuiFormRow } from '@elastic/eui'
import { TimePeriodOptionItem } from '../../../../../../types'

interface Props {
  isDisabled: boolean
  onChange: (selectedTimePeriod: TimePeriodOptionItem[]) => void
  options: TimePeriodOptionItem[]
  selectedOption: TimePeriodOptionItem
}

class TimePeriod extends PureComponent<Props> {
  render() {
    const { isDisabled, options, selectedOption } = this.props

    return (
      <EuiFormRow
        label={
          <FormattedMessage
            id='cost-analysis.filter.time-period.label'
            defaultMessage='Time period'
          />
        }
        display='rowCompressed'
      >
        <EuiComboBox
          options={options}
          selectedOptions={[selectedOption]}
          singleSelection={{ asPlainText: true }}
          onChange={this.onChange}
          isClearable={false}
          isDisabled={isDisabled}
          data-test-id='cost-analysis.filter.time-period'
        />
      </EuiFormRow>
    )
  }

  onChange = (selectedTimePeriod: TimePeriodOptionItem[]): void => {
    const { onChange, selectedOption: prevSelectedOption } = this.props
    const selectedOption = selectedTimePeriod[0]

    if (selectedOption.id === prevSelectedOption.id) {
      return
    }

    onChange(selectedTimePeriod)
  }
}

export default TimePeriod
