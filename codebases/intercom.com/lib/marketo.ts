import { IMarketoField } from './marketo/client'

export const marketoFormIds = {
  books: 1021,
  webinar: 1022,
  exitIntentPopup: 1533,
}

const marketoAccountId = '258-CLW-344'

export const marketoTrackingCookieName = '_mkto_trk'

export const getMarketoCookieRegex = (hostname?: string): string =>
  `^id:${marketoAccountId}&token:_mch-${hostname || '(\\w+\\.)+\\w+'}-\\d+-\\d{5}$`

// TODO: verify value matches type and length requirements
export const verifyFormStructure = (
  formFields: Record<string, any>,
  fieldsDef: IMarketoField[],
): boolean => {
  let isInputValid = true
  for (let i = 0; i < fieldsDef.length; i++) {
    const field = fieldsDef[i]
    if (field.required && !(field.id in formFields)) {
      isInputValid = false
      break
    }
  }
  return isInputValid
}
