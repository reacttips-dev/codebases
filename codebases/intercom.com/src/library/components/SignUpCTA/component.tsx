import { EmailSubmissionResult } from '@intercom/gtm-js/dist/types/email_submission_result'
import {
  VBP_MAY2021_EXPERIMENT_NAME,
  VBP_MAY2021_VARIATIONS,
} from 'marketing-site/lib/optimizelyExperiments'
import { EarlyStageContext } from 'marketing-site/lib/page-behaviors/EarlyStage'
import { captureException } from 'marketing-site/lib/sentry'
import { TEAMMATE_APP_URL } from 'marketing-site/lib/teammateAppUrl'
import { useAssignedVariations } from 'marketing-site/src/components/context/AssignedVariationsContext'
import { useMarketoForms } from 'marketing-site/src/components/context/MarketoFormsContext'
import SignupCTAOverridePropsContext from 'marketing-site/src/components/context/SignupCTAOverridePropsContext'
import SignupCTAParamsContext from 'marketing-site/src/components/context/SignupCTAParamsContext'
import { CTALink } from 'marketing-site/src/library/elements/CTALink'
import { EmailForm, useEmailValidation } from 'marketing-site/src/library/elements/EmailForm'
import { CTATheme } from 'marketing-site/src/library/utils'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import React, { useContext, useRef, useState } from 'react'
import getSignupIntentRedirectPath from '../../utils/getSignupIntentRedirectPath'
import ButtonOnlyCTAContext from './buttonOnlyCTAContext'
import { IProps } from './index'
import { submit } from './submission'

export function SignUpCTA(props: IProps) {
  const overrideProps = useContext(SignupCTAOverridePropsContext)
  const {
    errorText,
    buttonLabel,
    placeholderText,
    small,
    forceBusinessEmail,
    businessEmailErrorMessage,
    pricingTabId,
    entryDescriptionRequired: entryDescription,
    marketoFormId,
    showSuccessMessage,
    eventContext,
  } = { ...props, ...overrideProps }
  const { email, setEmail, validity, validate } = useEmailValidation({
    allowPersonalEmails: !forceBusinessEmail,
    invalidFormatErrorMessage: errorText,
    businessEmailErrorMessage: businessEmailErrorMessage,
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const isAppPartnerProgram = entryDescription?.includes('App Partner Program - Partner Newsletter')

  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const signupCTAParams = useContext(SignupCTAParamsContext)
  const { isEarlyStage } = useContext(EarlyStageContext)
  const buttonOnlyCTA = useContext(ButtonOnlyCTAContext)
  const marketoForms = useMarketoForms()
  const marketoForm = marketoForms.find((f) => f.id === parseInt(marketoFormId))

  // TODO [vbpnp][demo] this is tech debt to support a specific Marketo tag for Value-Based Pricing
  // and Packaging and can be removed when the VBP&P experiment has concluded.
  //
  // The marketing site codebase should generally not be aware of specific experiments or content.
  const assignments = useAssignedVariations()
  const vbpFeb2021ExperimentAssignment = assignments[VBP_MAY2021_EXPERIMENT_NAME]?.variationKey
  const pricingModelShown = VBP_MAY2021_VARIATIONS[vbpFeb2021ExperimentAssignment] || ''
  const isInVbpnp =
    pricingModelShown.startsWith('VBP') || assignments.vbpnp?.variationKey === 'variation'

  async function redirectToPricingOrTalkToSalesOrDemo(
    emailSubmissionResult: EmailSubmissionResult | null,
  ) {
    const path = await getSignupIntentRedirectPath({
      emailSubmissionResult,
      extraPricingQueryParams: { tab: pricingTabId, ...signupCTAParams },
      eventContext,
    })

    window.location.assign(path)
  }

  function redirectToSignupFlow(emailSubmissionId: number | undefined) {
    const redirectURL =
      `${TEAMMATE_APP_URL}/a/signup/teams?` +
      queryString.stringify({
        email_submission_id: emailSubmissionId, // eslint-disable-line @typescript-eslint/camelcase
        ...signupCTAParams,
      })

    window.location.href = redirectURL
  }

  async function onSubmit() {
    setLoading(true)
    const isValid = await validate()

    if (!isValid) {
      setLoading(false)
      return
    }

    if (email.includes('t2sales')) {
      window.location.href = '/welcome'
      return
    }

    let emailSubmission = null

    if (marketoForm) {
      emailSubmission = await submit({ email, isInVbpnp, marketoForm, pricingModelShown })
    } else {
      captureException(
        new Error(`SignupCTA tried to load a non-existent marketo form with id=${marketoFormId}`),
      )
    }

    setLoading(false)

    if (showSuccessMessage || isAppPartnerProgram) {
      setSuccess(true)
    } else if (router.asPath.match('/pricing') || isEarlyStage) {
      redirectToSignupFlow(emailSubmission?.id)
    } else {
      redirectToPricingOrTalkToSalesOrDemo(emailSubmission)
    }
  }

  if (success) {
    return (
      // eslint-disable-next-line
      <div className="email-form__success-message" data-testid="success">
        Thanks for signing up! 👍
      </div>
    )
  }
  if (buttonOnlyCTA) {
    return (
      <CTALink
        small={small}
        text={buttonLabel}
        url="/pricing"
        bgColor={CTATheme.BlackFill}
        arrow={false}
      />
    )
  } else {
    return (
      <EmailForm
        buttonLabel={buttonLabel}
        inputRef={inputRef}
        loading={loading}
        onChange={setEmail}
        onSubmit={onSubmit}
        placeholderText={placeholderText}
        small={small}
        validity={validity}
      />
    )
  }
}
