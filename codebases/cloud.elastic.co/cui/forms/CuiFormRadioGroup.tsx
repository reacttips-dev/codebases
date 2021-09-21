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

import React, { FunctionComponent, Fragment, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'formik'
import { get } from 'lodash'

import {
  // @ts-ignore
  EuiFormErrorText,
  EuiFormRow,
  EuiRadio,
  EuiRadioGroupOption,
  EuiRadioGroupProps,
} from '@elastic/eui'

import { StrictOmit } from '../../lib/ts-essentials'

interface Props extends StrictOmit<EuiRadioGroupProps, 'onChange' | 'idSelected'> {
  name: string
  label?: string | ReactElement<typeof FormattedMessage>
  helpText?: string | ReactElement<typeof FormattedMessage> | null

  // Missing from EuiRadioGroupProps
  compressed?: boolean

  // Make options required. Also add properties missing from the tsdefs
  options: Array<EuiRadioGroupOption & { disabled?: boolean; value: string }>
}

export const CuiFormRadioGroup: FunctionComponent<Props> = ({
  label,
  helpText,
  options,
  name,
  className,
  disabled,
  compressed,
}) => (
  <EuiFormRow label={label} helpText={helpText}>
    <div className={className}>
      {options.map((option, index) => {
        const { disabled: isOptionDisabled, ...optionRest } = option
        return (
          <Field key={index} name={name}>
            {({ field: { onChange, onBlur, value: currentValue }, form: { touched, errors } }) => {
              // field.name is just a string, the path to a field in the form values.
              // The structure of `touched` mirrors this, whereas `errors` is created
              // by a custom validation function. Our convention is use a flat structure
              // for errors, so that we can simply key on the field path.
              let error = null

              if (index === options.length - 1) {
                error = get(touched, name) && errors[name]
              }

              return (
                <Fragment>
                  <EuiRadio
                    className='euiRadioGroup__item'
                    label={label}
                    name={name}
                    checked={option.value === currentValue}
                    disabled={disabled || isOptionDisabled}
                    onChange={onChange}
                    onBlur={onBlur}
                    compressed={compressed}
                    {...optionRest}
                  />
                  {error != null && <EuiFormErrorText>{error}</EuiFormErrorText>}
                </Fragment>
              )
            }}
          </Field>
        )
      })}
    </div>
  </EuiFormRow>
)
