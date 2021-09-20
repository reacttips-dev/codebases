import { EmailSubmissionResult } from '@intercom/gtm-js/dist/types/email_submission_result'
import Cookies from 'js-cookie'
import mergeQueryParams from 'marketing-site/lib/mergeQueryParams'
import queryString from 'query-string'

type ExtraPricingQueryParams = Record<string, string | number | undefined>

interface IOptions {
  emailSubmissionResult?: EmailSubmissionResult | null
  extraPricingQueryParams?: ExtraPricingQueryParams
  eventContext?: string
  inboundExperimentEnabled?: boolean
}

export default function getSignupIntentRedirectPath(options?: IOptions): string {
  const { inboundExperimentEnabled, extraPricingQueryParams, emailSubmissionResult, eventContext } =
    options || {}

  let path = ''
  if (shouldTalkToSales(emailSubmissionResult)) {
    Cookies.set('t2s', '1', { expires: 90 })
    path = getTalkToSalesUrl(!!inboundExperimentEnabled)
  } else {
    path = getPricingUrl(emailSubmissionResult, extraPricingQueryParams)
  }

  if (eventContext) {
    path = mergeQueryParams(path, { on_pageview_event: eventContext }) // eslint-disable-line @typescript-eslint/camelcase
  }

  return path
}

function shouldTalkToSales(emailSubmissionResult?: EmailSubmissionResult | null): boolean {
  return !!emailSubmissionResult?.talk_to_sales
}

function getPricingUrl(
  emailSubmissionResult?: EmailSubmissionResult | null,
  extraPricingQueryParams?: ExtraPricingQueryParams,
) {
  const pricingQueryParams = queryString.stringify({
    referrer: window.location.pathname,
    email_submission_id: emailSubmissionResult?.id, // eslint-disable-line @typescript-eslint/camelcase
    ...extraPricingQueryParams,
  })
  return `/pricing?${pricingQueryParams}`
}

function getTalkToSalesUrl(inboundExperimentEnabled: boolean): string {
  return inboundExperimentEnabled ? '/book-custom-demo' : '/welcome'
}
