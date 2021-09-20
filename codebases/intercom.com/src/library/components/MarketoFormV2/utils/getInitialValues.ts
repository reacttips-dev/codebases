import Cookies from 'js-cookie'
import { IMarketoField } from 'marketing-site/lib/marketo/client'
import { captureException } from 'marketing-site/lib/sentry'
import queryString from 'query-string'

/*
 * This file implements the autofill functionality from Marketo Forms.
 * This functionality is not documented so it has been reverse-engineered.
 *
 * The 'autoFill' property is only present on hidden fields. It has three attributes:
 *  - 'valueFrom': Can be one of the following:
 *     * 'default': Default value has been specified (see 'value' attribute)
 *     * 'cookie': Autofill from a cookie (see 'parameterName' attribute)
 *     * 'query': Autofill from a query param (see 'parameterName' attribute)
 *  - 'value': When 'valueFrom' is 'default', this represents the default field value
 *  - 'parameterName': When 'valueFrom' is 'cookie' or 'query', this represents the name of the
 *                     cookie or query param that we should use to autofill the field.
 *
 * This method returns a key:value hash with the format required for Formik's initialValues property
 */

// Hidden fields are limited to 255 characters
const MAX_HIDDEN_FIELD_LENGTH = 255

export default function getInitialValues(fields: IMarketoField[]): Record<string, string> {
  const submittableFields = getSubmittableFields(fields)
  return submittableFields.reduce((initialValues, field) => {
    const initialValue = getFieldInitialValue(field) || ''
    initialValues[field.id] = sanitizeInitialValue(field, initialValue)
    return initialValues
  }, {} as Record<string, string>)
}

function getSubmittableFields(fields: IMarketoField[]): IMarketoField[] {
  return fields.filter((field) => field.dataType !== 'htmltext' && field.id !== 'profiling')
}

function getFieldInitialValue({ autoFill }: IMarketoField): string {
  if (!autoFill) return ''

  const { value, valueFrom, parameterName } = autoFill

  if (valueFrom === 'default') {
    return getDefaultValue(value)
  } else if (valueFrom === 'query' && !!parameterName) {
    return getFieldInitialValueFromQueryParam(parameterName)
  } else if (valueFrom === 'cookie' && !!parameterName) {
    return (parameterName && Cookies.get(parameterName)) || ''
  } else {
    captureException(
      new Error(
        `Unexpected autoFill value provided valueFrom=${valueFrom} parameterName=${parameterName}`,
      ),
    )
    return ''
  }
}

function getDefaultValue(value: string): string {
  if (value === '{{system.dateTime}}') {
    return new Date().toISOString()
  }
  return value
}

function getFieldInitialValueFromQueryParam(parameterName: string): string {
  const searchQuery = typeof window !== 'undefined' ? window.location.search : ''
  const parsedQueryString = queryString.parse(searchQuery)

  let initialValue = parsedQueryString[parameterName] || ''
  if (Array.isArray(initialValue)) {
    initialValue = initialValue.join(' ')
  }

  return initialValue
}

function sanitizeInitialValue(field: IMarketoField, value: string): string {
  if (field.dataType === 'hidden' && value.length > MAX_HIDDEN_FIELD_LENGTH) {
    return value.substring(0, MAX_HIDDEN_FIELD_LENGTH)
  }

  return value
}
