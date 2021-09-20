import { Field } from 'formik'
import { IMarketoRadioButtonsField } from 'marketing-site/lib/marketo/client'
import { Color } from 'marketing-site/src/library/utils'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { sanitizeText } from '../Field'
import getValidationErrorIfAny, { IValidationOptions } from '../utils/getValidationErrorIfAny'

export type IRadioButtonsField = IMarketoRadioButtonsField & {
  dataType: 'radioButtons'
  isDisabled: boolean
  validationOptions: IValidationOptions
}

export const testIds = {
  label: 'form-field-radio-buttons-label',
  option: (value: string) => `form-field-radio-buttons-option-${value}`,
}

export const RadioButtons = (field: IRadioButtonsField) => {
  const { id, isDisabled, label, required, fieldMetaData, validationOptions } = field
  const fieldId = `${id}_field`
  const labelId = `${id}_label`

  return (
    <>
      <span className="radio-button-group-label" data-testid={testIds.label}>
        {label && sanitizeText(label)}
      </span>

      <div className="radio-button-group">
        {fieldMetaData.values.map(({ label, value }) => {
          const random = uuid()
          const buttonId = `${random}_${fieldId}_${value}`
          return (
            <>
              <Field
                id={buttonId}
                type="radio"
                name={id}
                value={value}
                disabled={isDisabled}
                aria-labelledby={labelId}
                aria-required={required}
                validate={(value: string) =>
                  getValidationErrorIfAny(field, value, validationOptions)
                }
              />
              <label key={value} htmlFor={buttonId} data-testid={testIds.option(value)}>
                {label && sanitizeText(label)}
              </label>
            </>
          )
        })}
      </div>
      <style jsx>{`
        .radio-button-group-label {
          text-align: left;
          display: block;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .radio-button-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          grid-template-areas:
            'one two'
            'three four';

          :global(input[type='radio']) {
            position: absolute;
            left: -9999px;

            &:checked + label {
              border-color: ${Color.LightBlue};
              background-color: ${Color.LightBlue};
            }
          }

          label {
            width: 100%;
            border: 2px solid black;
            background-color: white;
            border-radius: 5px;
            padding: 1em;
            text-align: center;
            cursor: pointer;

            &:nth-of-type(1) {
              grid-area: one;
            }

            &:nth-of-type(2) {
              grid-area: two;
            }

            &:nth-of-type(3) {
              grid-area: three;
            }

            &:nth-of-type(4) {
              grid-area: four;
            }

            &:hover {
              border-color: ${Color.LightBlue};
              background-color: ${Color.LightBlue};
            }
          }
        }
      `}</style>
    </>
  )
}
