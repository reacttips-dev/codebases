import classnames from 'classnames'
import { ErrorMessage } from 'formik'
import {
  IMarketoField,
  IMarketoRadioButtonsField,
  IMarketoSelectField,
} from 'marketing-site/lib/marketo/client'
import { captureException } from 'marketing-site/lib/sentry'
import React from 'react'
import { Checkbox } from './fields/Checkbox'
import { Input } from './fields/Input'
import { RadioButtons } from './fields/RadioButtons'
import { Select } from './fields/Select'
import { Textarea } from './fields/Textarea'
import { IValidationOptions } from './utils/getValidationErrorIfAny'
import { Color } from 'marketing-site/src/library/utils'

const IGNORED_DATA_TYPES: IMarketoField['dataType'][] = ['profiling']

type IField = IMarketoField & {
  hasError: boolean
  isTouched: boolean
  isDisabled: boolean
  hideLabel?: boolean
  validationOptions: IValidationOptions
  isHidden?: boolean
}

export const sanitizeText = (text: string) => text.replace(/(<([^>]+)>)/gi, '')

const isRadioButtonsField = (field: IMarketoField): field is IMarketoRadioButtonsField => {
  return field.dataType === 'radioButtons'
}

const isSelectField = (field: IMarketoField): field is IMarketoSelectField => {
  return field.dataType === 'select'
}

const renderField = (field: IField) => {
  const { dataType, text, isDisabled, hasError, hideLabel, validationOptions } = field
  if (dataType === 'htmltext') {
    return <div dangerouslySetInnerHTML={{ __html: text || '' }} />
  } else if (dataType === 'checkbox') {
    return <Checkbox {...field} isDisabled={isDisabled} validationOptions={validationOptions} />
  } else if (isRadioButtonsField(field)) {
    return <RadioButtons {...field} isDisabled={isDisabled} />
  } else if (isSelectField(field)) {
    return <Select {...field} isDisabled={isDisabled} />
  } else if (dataType === 'textArea') {
    return (
      <Textarea
        {...field}
        dataType={dataType}
        hideLabel={hideLabel}
        hasError={hasError}
        isDisabled={isDisabled}
      />
    )
  } else if (dataType === 'text' || dataType === 'email' || dataType === 'hidden') {
    return (
      <Input
        {...field}
        dataType={dataType}
        hideLabel={hideLabel}
        hasError={hasError}
        isDisabled={isDisabled}
      />
    )
  } else {
    captureException(new Error(`Attempted to render unknown form field type=${dataType}`))
  }
}

export default function MarketoFormV2Field(field: IField) {
  const { id, dataType, hasError, isTouched, isHidden } = field

  if (IGNORED_DATA_TYPES.includes(dataType)) {
    return null
  }

  const wrapperClassNames = classnames('marketo-form-field', {
    'form-field-visible': dataType !== 'hidden' && !isHidden,
    'form-field-has-error': isTouched && hasError,
  })

  return (
    <>
      <div className={wrapperClassNames} key={id}>
        {renderField(field)}

        {/* This is populated by Formik if the field with the same name has errors */}
        <ErrorMessage name={id} className="error-message" component="div" />
      </div>
      <style jsx>{`
        .marketo-form-field {
          display: none;
          margin-bottom: 1.5em;

          &.form-field-visible {
            display: grid;
            margin-bottom: 1em;
          }

          &.form-field-has-error {
            :global(.error-message) {
              position: relative;
              display: block;
              width: 100%;
              text-align: center;
              background-color: ${Color.UIError};
              color: ${Color.White};
              border-radius: 3px;
              padding: 8px;
              margin-top: 12.5px;

              &:before {
                position: absolute;
                display: block;
                bottom: 100%;
                left: 50%;
                content: ' ';
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: $ui-error;
                border-radius: 2px;
                transform: translate(-50%, 0) rotate(45deg);
                top: -4px;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
