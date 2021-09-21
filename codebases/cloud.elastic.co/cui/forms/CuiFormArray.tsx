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

import React, { ComponentType, Fragment, FunctionComponent, ReactElement } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { Field, FieldArray, FieldProps } from 'formik'
import { get } from 'lodash'

import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFieldText,
  EuiFormRow,
  EuiText,
  EuiToolTip,
} from '@elastic/eui'

import './cuiFormArray.scss'

interface Props<T> {
  name: string
  label?: string | ReactElement<typeof FormattedMessage>
  addMessage: string | ReactElement<typeof FormattedMessage>
  helpText?: string | ReactElement<typeof FormattedMessage>
  component?: ComponentType<CuiFormArrayRowProps>
  fullWidth?: boolean
  initialValue: T
  'data-test-id'?: string
  addDisabled?: boolean
  addDisabledMessage?: string | ReactElement<typeof FormattedMessage>
  [propName: string]: any
}

const messages = defineMessages({
  remove: {
    id: 'cui.cuiFormArray.remove',
    defaultMessage: 'Remove',
  },
})

export interface CuiFormArrayRowProps {
  index: number
  canRemove: boolean
  onRemove: () => void
  field: FieldProps['field']
}

const CuiFormArrayRow: FunctionComponent<CuiFormArrayRowProps & WrappedComponentProps> = ({
  intl: { formatMessage },
  field,
  canRemove,
  onRemove,
  ...rest
}) => (
  <EuiFieldText
    {...field}
    append={
      <EuiButtonIcon
        color='danger'
        iconType='trash'
        aria-label={formatMessage(messages.remove)}
        onClick={onRemove}
        data-test-id='remove-button'
        disabled={canRemove}
      />
    }
    {...rest}
  />
)

const FieldRowArrayInnerWithIntl = injectIntl(CuiFormArrayRow)

export function CuiFormArray<T>(props: Props<T>) {
  const {
    name,
    label,
    helpText,
    addMessage,
    fullWidth,
    initialValue,
    component: RowComponent = FieldRowArrayInnerWithIntl,
    'data-test-id': dataTestSubj,
    addDisabled,
    addDisabledMessage,
    ...rest
  } = props

  if (addDisabled && !addDisabledMessage) {
    throw new Error('Must supply addDisabledMessage if addDisabled is true')
  }

  return (
    <FieldArray name={name}>
      {({ remove, push, form: { errors, touched, values } }) => {
        const arrayValues = get(values, name, [])

        const isAddDisabled = addDisabled || arrayValues.length === 10

        const addButton = (
          <EuiButtonEmpty
            size='xs'
            data-test-id={`${dataTestSubj || 'cui-form-array'}-add-button`}
            disabled={isAddDisabled}
            onClick={() => push(initialValue)}
          >
            <EuiText size='s'>+ {addMessage}</EuiText>
          </EuiButtonEmpty>
        )

        return (
          <Fragment>
            {arrayValues.map((_, index) => {
              const fieldName = name + '.' + index
              const isInvalid = get(touched, fieldName) != null && errors[fieldName] != null

              return (
                <EuiFormRow
                  className='cuiFormArray'
                  fullWidth={fullWidth}
                  key={index}
                  display='rowCompressed'
                  isInvalid={isInvalid}
                  error={errors[fieldName]}
                  // Only the first row gets a label
                  label={index === 0 ? label : undefined}
                  // and only the last row gets the helpText
                  helpText={index === arrayValues.length - 1 ? helpText : undefined}
                >
                  <Field name={`${name}.${index}`}>
                    {({ field }) => (
                      <RowComponent
                        index={index}
                        field={field}
                        canRemove={arrayValues.length < 2}
                        onRemove={() => remove(index)}
                        {...rest}
                      />
                    )}
                  </Field>
                </EuiFormRow>
              )
            })}

            <div>
              {isAddDisabled ? (
                <EuiToolTip content={addDisabledMessage}>{addButton}</EuiToolTip>
              ) : (
                addButton
              )}
            </div>
          </Fragment>
        )
      }}
    </FieldArray>
  )
}
