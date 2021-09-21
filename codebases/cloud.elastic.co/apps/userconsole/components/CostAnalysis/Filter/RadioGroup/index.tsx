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
import { EuiFormRow, EuiRadioGroup } from '@elastic/eui'

interface OptionItem {
  id: string
  label: string
}

interface Props {
  isDisabled: boolean
  label: React.ReactChild
  options: OptionItem[]
  selected: string
  onChange: (selected: string) => void
}

const RadioGroup: FunctionComponent<Props> = ({
  isDisabled,
  label,
  onChange,
  options,
  selected,
}) => (
  <EuiFormRow label={label} display='rowCompressed'>
    <EuiRadioGroup
      disabled={isDisabled}
      options={options}
      idSelected={selected}
      onChange={onChange}
      name='cost-analysis-radio-group'
      data-test-id='cost-analysis-radio-group'
    />
  </EuiFormRow>
)

export default RadioGroup
