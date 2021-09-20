import { EmailSubmissionResult } from '@intercom/gtm-js/dist/types/email_submission_result'
import { getGtmClient } from 'marketing-site/lib/gtm'
import { headerContentTypeJson } from 'marketing-site/lib/httpHeaderUtils'
import { captureException } from 'marketing-site/lib/sentry'
import {
  IRequest as ISubmitApiRequest,
  IResponse as ISubmitApiResponse,
} from 'marketing-site/pages/api/forms/submit'
import {
  googleTagManagerCustomEvents,
  triggerGoogleTagManagerCustomEvent,
} from 'marketing-site/src/library/utils'
import fetch, { Response } from 'node-fetch'
import { getTags } from './metrics'

export interface ISubmitResponse {
  result: ISubmitApiResponse
  emailSubmissionResult: EmailSubmissionResult | null
}

export async function submit(
  formId: number,
  formFields: Record<string, any>,
  emailSubmissionSource?: string,
): Promise<ISubmitResponse> {
  const result = await submitForm(formId, formFields)

  let emailSubmissionResult = null

  if (result && result.success) {
    updateUserInIntercom(formFields)
    triggerGoogleTagManagerEvent(formId, formFields)
    emailSubmissionResult = await recordEmailSubmission(formId, formFields, emailSubmissionSource)
  }

  return { result, emailSubmissionResult }
}

async function submitForm(
  formId: number,
  formFields: Record<string, any>,
): Promise<ISubmitApiResponse> {
  const visitorData = { pageURL: window.location.href }
  const body: ISubmitApiRequest = { formId, formFields, visitorData }

  const response: Response | void = await fetch('/api/forms/submit', {
    method: 'POST',
    headers: headerContentTypeJson,
    body: JSON.stringify(body),
  }).catch(captureException)

  if (!response) {
    captureException('Received empty response from /api/forms/submit')
    return { success: true }
  }

  const result = await response.json()

  if (response.status >= 500 && response.status < 600) {
    const errors = result.errors?.join(',') || ''
    captureException(
      `Received ${response.status} response from /api/forms/submit. Errors=${errors}`,
    )
    return { success: true }
  }

  return result
}

function triggerGoogleTagManagerEvent(formId: number, formFields: Record<string, any>) {
  triggerGoogleTagManagerCustomEvent(googleTagManagerCustomEvents.marketoFormSubmitted, {
    'marketo-form-id': formId,
    ...formFields,
  })
}

async function recordEmailSubmission(
  formId: number,
  formFields: Record<string, any>,
  source?: string,
) {
  const gtmClient = await getGtmClient()
  const email = formFields.Email || formFields.email

  if (email) {
    try {
      return await gtmClient.recordEmailSubmissionWithOptions({
        email,
        createQualifiedProspect: true,
        pageViewId: gtmClient.pageviewId!,
        opts: {
          source: source || 'marketo-form',
          visitor_id: window.Intercom && window.Intercom('getVisitorId'), // eslint-disable-line @typescript-eslint/camelcase
        },
        disableMarketoIntegration: true,
        extraMetricsTags: getTags(formId),
        marketoFormId: formId,
        extraMarketoFields: formFields,
      })
    } catch (error) {
      captureException(error)
    }
  }
  return null
}

async function updateUserInIntercom(formFields: Record<string, any>) {
  if (!window.Intercom) return

  const data: any = {}

  const firstName = formFields.FirstName
  const lastName = formFields.LastName
  if (firstName && lastName) {
    data.name = `${firstName} ${lastName}`
  }

  const email = formFields.Email || formFields.email
  if (email) {
    data.email = email
  }

  if (Object.keys(data).length > 0) {
    try {
      // Note: This will override existing value on Intercom for this user
      window.Intercom('update', data)
    } catch (error) {
      captureException(error)
    }
  }
}
