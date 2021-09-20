import { EmailSubmissionResult } from '@intercom/gtm-js/dist/types/email_submission_result'
import { getGtmClient } from 'marketing-site/lib/gtm'
import { captureException } from 'marketing-site/lib/sentry'
import { IMarketoFormWithFields } from 'marketing-site/src/components/context/MarketoFormsContext'
import getInitialValues from 'marketing-site/src/library/components/MarketoFormV2/utils/getInitialValues'
import { submit as submitMarketoFormV2 } from 'marketing-site/src/library/components/MarketoFormV2/utils/submission'

export async function submit({
  email,
  marketoForm,
  isInVbpnp,
  pricingModelShown,
}: {
  email: string
  marketoForm: IMarketoFormWithFields
  isInVbpnp: boolean
  pricingModelShown: string
}): Promise<EmailSubmissionResult | null> {
  let emailSubmissionResult: EmailSubmissionResult | null = null

  try {
    emailSubmissionResult = await submitMarketoForm(
      email,
      marketoForm,
      isInVbpnp,
      pricingModelShown,
    )
    await recordPricingEvent()
  } catch (error) {
    console.warn('[gtm-js] Encountered an error when recording email submission', error)
    captureException(new Error(`EmailSubmissionError: ${error}`))
  }

  return emailSubmissionResult
}

async function submitMarketoForm(
  email: string,
  marketoForm: IMarketoFormWithFields,
  isInVbpnp: boolean,
  pricingModelShown: string,
): Promise<EmailSubmissionResult | null> {
  const initialValues = getInitialValues(marketoForm.fields)
  const { emailSubmissionResult } = await submitMarketoFormV2(
    marketoForm.id,
    {
      ...initialValues,
      Email: email,
      /* eslint-disable @typescript-eslint/camelcase */
      URL_last__c: window.location.href,
      // VBP 1 Feb 2020
      sees_vbp_feb20__c: isInVbpnp,
      // VBP 1.2 Feb 2021, VBP 1.1 Sept 2020
      Pricing_model_shown__c: pricingModelShown,
      /* eslint-enable @typescript-eslint/camelcase */
    },
    'signup-intent',
  )

  return emailSubmissionResult
}

async function recordPricingEvent() {
  const gtmClient = await getGtmClient()

  window.Intercom('trackEvent', 'get_started', {
    /* eslint-disable @typescript-eslint/camelcase */
    action: 'clicked',
    object: 'get_started',
    gtm_tracking_pageview_id: gtmClient.pageviewId || null,
    place: 'pricing_page_top',
    context: 'pricing_page',
    /* eslint-enable @typescript-eslint/camelcase */
  })
}
