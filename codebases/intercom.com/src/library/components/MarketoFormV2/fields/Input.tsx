import classnames from 'classnames'
import { Field } from 'formik'
import { IMarketoField } from 'marketing-site/lib/marketo/client'
import React from 'react'
import { sanitizeText } from '../Field'
import getValidationErrorIfAny, { IValidationOptions } from '../utils/getValidationErrorIfAny'
import { Color } from 'marketing-site/src/library/utils'

export type IInputField = IMarketoField & {
  dataType: 'text' | 'email' | 'hidden'
  hideLabel?: boolean
  isDisabled: boolean
  hasError: boolean
  validationOptions: IValidationOptions
}

export const testIds = {
  inputLabel: 'form-field-input-label',
  inputLabelText: 'form-field-input-label-text',
  inputField: (id: string) => `form-field-input-field-${id}`,
}

export const Input = (field: IInputField) => {
  const {
    id,
    label,
    dataType,
    maxLength,
    required,
    hintText,
    validationOptions,
    hideLabel,
    isDisabled,
    hasError,
  } = field
  const fieldId = `${id}_field`
  const labelId = `${id}_label`

  const labelClassNames = classnames('form-field-input', {
    'has-error': hasError,
  })

  const labelText = label && sanitizeText(label)
  const showLabelText = dataType !== 'hidden' && !hideLabel && label

  return (
    <>
      <label id={labelId} data-testid={testIds.inputLabel} className={labelClassNames}>
        {showLabelText && (
          <span className="label-text" data-testid={testIds.inputLabelText}>
            {labelText}
          </span>
        )}

        <Field
          id={fieldId}
          name={id}
          type={dataType}
          placeholder={hintText}
          maxLength={maxLength}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-required={required}
          validate={(value: string) => getValidationErrorIfAny(field, value, validationOptions)}
          data-testid={testIds.inputField(id)}
        />
      </label>

      <style jsx>{`
        .form-field-input {
          display: grid;
          grid-row-gap: 0.25em;

          :global(input) {
            width: 100%;
            -webkit-appearance: none;
            background-color: ${Color.White};
            line-height: 1.5em;
            color: ${Color.Black};
            border: 2px solid ${Color.Black};
            border-radius: 6px;
            padding: 12px 17px;
            min-height: 1.9em;
            font: inherit;
            resize: none;
            outline: none;

            &::placeholder {
              color: ${Color.UIGray};
            }
          }

          &.has-error {
            :global(input) {
              border: 2px solid ${Color.UIError};
            }
          }
        }
      `}</style>
    </>
  )
}
