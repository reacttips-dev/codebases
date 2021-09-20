import { Field } from 'formik'
import { IMarketoField } from 'marketing-site/lib/marketo/client'
import React from 'react'
import { sanitizeText } from '../Field'
import getValidationErrorIfAny, { IValidationOptions } from '../utils/getValidationErrorIfAny'
import checkmark from 'marketing-site/src/library/images/checkmark-white.svg'

export type ICheckboxField = IMarketoField & {
  isDisabled: boolean
  validationOptions: IValidationOptions
}

export const testIds = {
  label: 'marketoformv2-checkbox-label',
  checkbox: 'marketoformv2-checkbox-input',
}

export const Checkbox = (field: ICheckboxField) => {
  const { id, dataType, label, isDisabled, required, validationOptions } = field

  const fieldId = `${id}_field`
  const labelId = `${id}_label`

  return (
    <>
      <label
        id={labelId}
        data-testid={testIds.label}
        className="form-field-checkbox-label"
        key={id}
      >
        <div className="form-field-checkbox-input">
          <Field
            id={fieldId}
            name={id}
            type={dataType}
            disabled={isDisabled}
            aria-labelledby={labelId}
            aria-required={required}
            validate={(value: string) => getValidationErrorIfAny(field, value, validationOptions)}
            data-testid={testIds.checkbox}
          />
        </div>
        {label && sanitizeText(label)}
      </label>
      <style jsx>{`
        .form-field-checkbox-label {
          display: grid;
          grid-template-columns: 30px auto;
          align-items: start;
          text-align: left;

          .form-field-checkbox-input {
            display: inline-block;
            text-align: center;
            position: relative;
            width: 20px;
            height: 20px;

            :global(input[type='checkbox']) {
              width: 100%;
              height: 100%;
              font-size: 16px;

              &:before {
                display: inline-block;
                position: absolute;
                top: 0;
                left: 0;
                content: '';
                width: 100%;
                height: 100%;
                background-color: $light-gray;
                border: 1px solid $ui-gray;
              }

              &:checked {
                &::before {
                  background-color: $blue;
                  border: none;
                  background-image: url(${checkmark});
                  background-repeat: no-repeat;
                  background-position: 50% 50%;
                  background-size: 10px 10px;
                }
              }

              &:disabled {
                &::before {
                  background-color: $light-gray;
                  border: none;
                }
              }
            }
          }
        }
      `}</style>
    </>
  )
}
