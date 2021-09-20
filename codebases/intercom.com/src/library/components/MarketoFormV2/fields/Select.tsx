import { Field } from 'formik'
import { IMarketoSelectField } from 'marketing-site/lib/marketo/client'
import React from 'react'
import { sanitizeText } from '../Field'
import getValidationErrorIfAny, { IValidationOptions } from '../utils/getValidationErrorIfAny'
import { Color } from 'marketing-site/src/library/utils'

export type ISelectField = IMarketoSelectField & {
  dataType: 'select'
  isDisabled: boolean
  validationOptions: IValidationOptions
}

export const testIds = {
  label: 'form-field-select-label',
  option: (value: string) => `form-field-select-option-${value}`,
}

export const Select = (field: ISelectField) => {
  const { id, isDisabled, label, required, fieldMetaData, validationOptions } = field
  const fieldId = `${id}_field`
  const labelId = `${id}_label`

  return (
    <>
      <label className="form-field-select" data-testid={testIds.label}>
        {label && sanitizeText(label)}

        <Field
          id={fieldId}
          as="select"
          name={id}
          disabled={isDisabled}
          aria-labelledby={labelId}
          aria-required={required}
          validate={(value: string) => getValidationErrorIfAny(field, value, validationOptions)}
        >
          {fieldMetaData.values.map(({ label, value }) => (
            <option value={value} key={label} data-testid={testIds.option(value)}>
              {label}
            </option>
          ))}
        </Field>
      </label>
      <style jsx>{`
        .form-field-select {
          :global(select) {
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
          }
        }
      `}</style>
    </>
  )
}
