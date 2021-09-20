import { WithAdditionalMarketoFormOverrideProps } from 'marketing-site/src/components/context/MarketoFormOverridePropsContext'
import {
  IOnMarketoFormSubmit,
  IProps as IMarketoFormV2Props,
} from 'marketing-site/src/library/components/MarketoFormV2'
import getSignupIntentRedirectPath from 'marketing-site/src/library/utils/getSignupIntentRedirectPath'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'

export default function InboundPage({ children }: IPageBehaviorComponentProps) {
  const router = useRouter()

  const onMarketoFormSubmit: IOnMarketoFormSubmit = (response, _, emailSubmissionResult) => {
    if (response.success) {
      const redirectUrl = getSignupIntentRedirectPath({
        emailSubmissionResult,
        inboundExperimentEnabled: true,
      })
      router.push(redirectUrl)
    }
  }

  useEffect(() => {
    router.prefetch('/book-custom-demo')
    router.prefetch('/pricing')
  }, [])

  const marketoOverrideProps: Partial<IMarketoFormV2Props> = {
    onSubmit: onMarketoFormSubmit,
    hiddenFieldIds: ['FirstName'],
  }

  return (
    <WithAdditionalMarketoFormOverrideProps overrideProps={marketoOverrideProps}>
      {children}
    </WithAdditionalMarketoFormOverrideProps>
  )
}
