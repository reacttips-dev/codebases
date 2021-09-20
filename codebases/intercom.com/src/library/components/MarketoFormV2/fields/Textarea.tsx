import classnames from 'classnames'
import { Field } from 'formik'
import { IMarketoField } from 'marketing-site/lib/marketo/client'
import React from 'react'
import { sanitizeText } from '../Field'
import getValidationErrorIfAny, { IValidationOptions } from '../utils/getValidationErrorIfAny'
import { Color } from 'marketing-site/src/library/utils'

export type ITextareaField = IMarketoField & {
  dataType: 'textArea'
  hideLabel?: boolean
  isDisabled: boolean
  hasError: boolean
  validationOptions: IValidationOptions
}

export const testIds = {
  textareaLabel: 'form-field-textarea-label',
  textareaLabelText: 'form-field-textarea-label-text',
  textareaField: (id: string) => `form-field-textarea-field-${id}`,
}

export const Textarea = (field: ITextareaField) => {
  const {
    id,
    label,
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

  const labelClassNames = classnames('form-field-textarea', {
    'has-error': hasError,
  })

  const labelText = label && sanitizeText(label)
  const showLabelText = !hideLabel && label

  return (
    <>
      <label id={labelId} data-testid={testIds.textareaLabel} className={labelClassNames}>
        {showLabelText && (
          <span className="label-text" data-testid={testIds.textareaLabelText}>
            {labelText}
          </span>
        )}

        <Field
          id={fieldId}
          name={id}
          as="textarea"
          placeholder={hintText}
          maxLength={maxLength}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-required={required}
          validate={(value: string) => getValidationErrorIfAny(field, value, validationOptions)}
          data-testid={testIds.textareaField(id)}
        />
      </label>

      <style jsx>{`
        .form-field-textarea {
          display: grid;
          grid-row-gap: 0.25em;

          :global(textarea) {
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
            :global(textarea) {
              border: 2px solid ${Color.UIError};
            }
          }
        }
      `}</style>
    </>
  )
}
