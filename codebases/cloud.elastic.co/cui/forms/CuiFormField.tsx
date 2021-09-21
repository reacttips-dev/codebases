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

import React, { ComponentType, FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'formik'
import { get } from 'lodash'

import { EuiFieldText, EuiFormRow } from '@elastic/eui'

interface Props {
  label?: string | ReactElement<typeof FormattedMessage>
  helpText?: string | ReactElement<typeof FormattedMessage>
  name: string
  component?: ComponentType<any>
  isDisabled?: boolean | ((values: any) => boolean)

  [propName: string]: any
}

export const CuiFormField: FunctionComponent<Props> = ({
  label,
  helpText,
  isDisabled,
  name,
  component: Component = EuiFieldText,
  ...props
}) => (
  <Field name={name}>
    {({ field: { onChange, ...field }, form: { touched, errors, values, setFieldTouched } }) => {
      // field.name is just a string, the path to a field in the form values.
      // The structure of `touched` mirrors this, whereas `errors` is created
      // by a custom validation function. Our convention is use a flat structure
      // for errors, so that we can simply key on the field path.
      const error = get(touched, field.name) && errors[field.name]

      const isDisabledProp =
        typeof isDisabled === 'function' ? isDisabled(values) : Boolean(isDisabled)

      return (
        <EuiFormRow label={label} helpText={helpText} isInvalid={error != null} error={error}>
          <Component
            onChange={(e) => {
              setFieldTouched(name, true)
              return onChange(e)
            }}
            {...field}
            {...props}
            disabled={isDisabledProp}
          />
        </EuiFormRow>
      )
    }}
  </Field>
)
