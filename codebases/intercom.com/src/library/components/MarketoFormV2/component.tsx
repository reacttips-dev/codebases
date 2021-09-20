import { Form, Formik, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { captureException } from 'marketing-site/lib/sentry'
import MarketoFormOverridePropsContext from 'marketing-site/src/components/context/MarketoFormOverridePropsContext'
import { useMarketoForms } from 'marketing-site/src/components/context/MarketoFormsContext'
import { IProps } from 'marketing-site/src/library/components/MarketoFormV2'
import Field from 'marketing-site/src/library/components/MarketoFormV2/Field'
import { Color } from 'marketing-site/src/library/utils'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from '../../elements/Text'
import getInitialValues from './utils/getInitialValues'
import { incrementMetric, recordTimingMetric } from './utils/metrics'
import { submit } from './utils/submission'

export const testIds = {
  form: 'test-marketo-form',
  heading: 'test-marketo-form-heading',
  submitButton: 'test-submit-button',
}
export const submitButtonSubmittingText = 'Please wait...'

export const MarketoFormV2 = (props: IProps) => {
  const t0 = typeof window !== 'undefined' ? window.performance.now() : 0

  const [error, setError] = useState<string | null>(null)

  const overrideProps = useContext(MarketoFormOverridePropsContext)
  const {
    formId,
    submitButtonLabel,
    redirectUrl,
    headingSize,
    headingText,
    subheadingSize,
    subheadingText,
    hideLabels,
    forceBusinessEmail,
    emailSubmissionSource,
    onSubmit,
    hiddenFieldIds,
  } = { ...props, ...overrideProps }

  const marketoForms = useMarketoForms()
  const formData = marketoForms.find((f) => f.id === formId)
  const validationOptions = { forceBusinessEmail }

  useEffect(() => {
    if (!formData) {
      incrementMetric('Marketo.formRender.error', formId)
    } else {
      if (t0 > 0) {
        const t1 = window.performance.now()
        recordTimingMetric('Marketo.renderForm', t1 - t0, formId)
      }

      incrementMetric('Marketo.formRendered', formId)
    }
  }, [])

  if (!formData) {
    captureException(`Tried to load form with id ${formId} but it wasn't found`)
    return <p>We can&apos;t load this form.</p>
  }

  const hasError = (errors: FormikErrors<FormikValues>, fieldId: string) => !!errors[fieldId]
  const isTouched = (touched: FormikTouched<FormikValues>, fieldId: string) => !!touched[fieldId]

  return (
    <div className="marketo-form-wrapper" data-testid={testIds.form}>
      {headingText && (
        <div className="heading" data-testid={testIds.heading}>
          <Text size={headingSize || 'lg+'}>{headingText}</Text>
        </div>
      )}
      {subheadingText && (
        <p className="subheading">
          <Text size={subheadingSize || 'body'}>{subheadingText}</Text>
        </p>
      )}
      {error && (
        <div className="error-message" data-testid="generic-error-message">
          {error}
        </div>
      )}
      <Formik
        initialValues={getInitialValues(formData.fields)}
        onSubmit={async (values) => {
          setError(null)
          const { result, emailSubmissionResult } = await submit(
            formId,
            values,
            emailSubmissionSource,
          )

          if (onSubmit) {
            onSubmit(result, values, emailSubmissionResult)
          }

          if (!result.success) {
            const error = Array.isArray(result.errors) ? result.errors[0] : 'Something went wrong'

            if (result.result?.status === 'skipped') {
              const reasons = result.result.reasons?.map((reason) => reason.message).join(', ')
              captureException(new Error(`Form submission was skipped: ${reasons}`))
            }

            setError(error)
          } else if (redirectUrl) {
            window.location.assign(redirectUrl)
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form">
            {formData.fields.map((field) => (
              <Field
                {...field}
                hideLabel={hideLabels}
                hasError={hasError(errors, field.id)}
                isTouched={isTouched(touched, field.id)}
                isDisabled={isSubmitting}
                validationOptions={validationOptions}
                key={field.id}
                isHidden={hiddenFieldIds?.includes(field.id)}
              />
            ))}

            <button
              className="submit-button"
              type="submit"
              disabled={isSubmitting}
              data-testid={testIds.submitButton}
            >
              {isSubmitting ? submitButtonSubmittingText : submitButtonLabel}
            </button>
          </Form>
        )}
      </Formik>
      <style jsx>{`
        .marketo-form-wrapper {
          max-width: 575px;

          .heading {
            margin-bottom: 16px;
          }

          .error-message {
            display: block;
            width: 100%;
            text-align: center;
            background-color: ${Color.UIError};
            border-radius: 30px;
            margin-bottom: 16px;
            padding: 8px;
          }

          .submit-button {
            background-color: ${Color.Black};
            border: 2px solid ${Color.Black};
            border-radius: 30px;
            margin-top: 1em;
            padding: 12px 25px;
            cursor: pointer;
            color: ${Color.White};
            font-family: $fontGraphik;
            font-weight: bold;
            transition: background-color 500ms, color 500ms;
            width: 100%;
            text-align: center;

            &:hover,
            &:focus {
              background-color: ${Color.White};
              color: ${Color.Black};
            }
          }
        }
      `}</style>
    </div>
  )
}
