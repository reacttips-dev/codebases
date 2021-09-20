import React, { useState, useEffect } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import { IEarlyStagePartnerList } from 'marketing-site/@types/generated/contentful'
import { WithAdditionalSignupCtaParams } from 'marketing-site/src/components/context/SignupCTAParamsContext'
import { useRouter } from 'next/router'

export const EarlyStageContext = React.createContext<{
  isEarlyStage: boolean
  isEarlyStagePartner: boolean
}>({ isEarlyStage: false, isEarlyStagePartner: false })

export default function EarlyStage({ data, children }: IPageBehaviorComponentProps) {
  if (
    !data.references ||
    !data.references[0] ||
    data.references[0].sys.contentType.sys.id !== 'earlyStagePartnerList'
  ) {
    throw new Error('Expected early-stage pageBehavior to reference an early stage partner list')
  }

  const earlyStagePartnerList = data.references[0] as unknown as IEarlyStagePartnerList
  const allPartnerNames = earlyStagePartnerList.fields.partners

  const router = useRouter()
  const pathname = router.asPath
  const currentPartnerName = (pathname.match(/early-stage(\/(.*))/) || [])[2] || undefined

  if (
    currentPartnerName &&
    !allPartnerNames.includes(currentPartnerName) &&
    typeof window !== 'undefined'
  ) {
    window.location.href = '/early-stage'
  }

  const [params, setParams] = useState<Record<string, any>>({})

  // The partner ID here will never SSR because it's reliant on the url and nginx config.
  // This means that on hydration, react isn't able to diff the anchor tag href attributes
  // and the attribute never gets updated. The solution here is to set the context in a hook
  // in order to ensure that the component gets re-rendered when loaded on the client.
  useEffect(() => {
    setParams({
      partner: currentPartnerName,
    })
  }, [currentPartnerName])

  return (
    <WithAdditionalSignupCtaParams params={params}>
      <EarlyStageContext.Provider
        value={{ isEarlyStage: true, isEarlyStagePartner: !!currentPartnerName }}
      >
        {children}
      </EarlyStageContext.Provider>
    </WithAdditionalSignupCtaParams>
  )
}
