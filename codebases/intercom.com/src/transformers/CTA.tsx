import {
  ICtaButton as IContentfulCtaButton,
  ICtaLink as IContentfulCtaLink,
  IMarketoForm as IContentfulMarketoForm,
  IModalButton as IContentfulModalButton,
  ISignupCta as IContentfulSignupCta,
  IWatchADemoCta as IContentfulWatchADemoCta,
} from 'marketing-site/@types/generated/contentful'
import { captureException } from 'marketing-site/lib/sentry'
import { SignUpCTA } from 'marketing-site/src/library/components/SignUpCTA'
import {
  isMarketoForm,
  transformMarketoFormV2,
} from 'marketing-site/src/transformers/components/ContentfulMarketoForm'
import {
  ContentfulWatchADemoCTA,
  isWatchADemoCTA,
} from 'marketing-site/src/transformers/components/ContentfulWatchADemoCTA'
import {
  isSignUpCTA,
  transformSignupCTA,
} from 'marketing-site/src/transformers/elements/ContentfulSignUpCTA'
import React from 'react'
import { MarketoFormV2 } from '../library/components/MarketoFormV2'
import { ContentfulCTAButton, isCTAButton } from './elements/ContentfulCTAButton'
import { ContentfulCTALink, isCTALink } from './elements/ContentfulCTALink'
import { ContentfulModalButton, isModalButton } from './elements/ContentfulModalButton'

export type ICTA =
  | IContentfulCtaLink
  | IContentfulMarketoForm
  | IContentfulModalButton
  | IContentfulSignupCta
  | IContentfulWatchADemoCta
  | IContentfulCtaButton

type ICTAProps = ICTA & {
  elementLocation?: string
}

export function CTA(entry: ICTAProps) {
  const { elementLocation } = entry
  const contentType = entry.sys.contentType.sys.id

  if (isWatchADemoCTA(entry)) {
    return <ContentfulWatchADemoCTA {...entry} />
  } else if (isMarketoForm(entry)) {
    return <MarketoFormV2 {...transformMarketoFormV2(entry.fields)} hideLabels={true} />
  } else if (isSignUpCTA(entry)) {
    return <SignUpCTA {...transformSignupCTA(entry)} elementLocation={elementLocation} />
  } else if (isCTALink(entry)) {
    return <ContentfulCTALink {...entry} />
  } else if (isCTAButton(entry)) {
    return <ContentfulCTAButton {...entry} />
  } else if (isModalButton(entry)) {
    return <ContentfulModalButton {...entry} />
  }

  captureException(`Tried to render a CTA with an invalid type=${contentType}`)
  return null
}
