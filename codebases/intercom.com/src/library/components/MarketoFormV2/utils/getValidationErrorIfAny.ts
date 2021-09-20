import { getGtmClient } from 'marketing-site/lib/gtm'
import { IMarketoField } from 'marketing-site/lib/marketo/client'
import { VALID_EMAIL as VALID_EMAIL_REGEX } from 'marketing-site/lib/validEmail'

export interface IValidationOptions {
  forceBusinessEmail?: boolean
}

export default async function getValidationErrorIfAny(
  { required, dataType }: IMarketoField,
  value: string,
  options: IValidationOptions,
) {
  if (dataType === 'hidden') return ''

  if (required && !value) {
    return 'This field is required.'
  }

  if (dataType === 'email' && !VALID_EMAIL_REGEX.test(value)) {
    return 'Must be valid email. example@yourdomain.com'
  }

  if (dataType === 'email' && options.forceBusinessEmail) {
    const gtmClient = await getGtmClient()
    if (await gtmClient.personalEmailDomain(value)) {
      return 'Please enter a business email address'
    }
  }

  return ''
}
