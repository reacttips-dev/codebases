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

import React, { ReactElement, SFC } from 'react'
import { FormattedMessage } from 'react-intl'

import { Field } from 'formik'
import { get } from 'lodash'

import { EuiComboBox, EuiFormRow } from '@elastic/eui'

interface Props {
  fullWidth?: boolean
  label?: string | ReactElement<typeof FormattedMessage>
  helpText?: string | ReactElement<typeof FormattedMessage>
  name: string
  options: Array<{ value: string; label: string }>

  [propName: string]: any
}

export const CuiFormComboBox: SFC<Props> = ({
  fullWidth,
  label,
  helpText,
  name,
  options,
  ...props
}) => (
  <Field name={name}>
    {({ field: { value }, form: { touched, errors, setFieldValue } }) => {
      // field.name is just a string, the path to a field in the form values.
      // The structure of `touched` mirrors this, whereas `errors` is created
      // by a custom validation function. Our convention is use a flat structure
      // for errors, so that we can simply key on the field path.
      const error = get(touched, name) && get(errors, name)

      const selectedValues = value as string[]

      const selectedOptions = options.filter((option) => selectedValues.includes(option.value))

      return (
        <EuiFormRow
          fullWidth={fullWidth}
          label={label}
          helpText={helpText}
          isInvalid={error != null}
          error={error}
        >
          <EuiComboBox
            fullWidth={fullWidth}
            options={options}
            selectedOptions={selectedOptions}
            onChange={(newSelectedOptions) => {
              setFieldValue(
                name,
                newSelectedOptions.map((o) => o.value),
              )
            }}
            {...props}
          />
        </EuiFormRow>
      )
    }}
  </Field>
)
