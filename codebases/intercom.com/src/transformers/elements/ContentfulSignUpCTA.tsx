import { Entry } from 'contentful'
import { ISignupCta as IContentfulSignupCta } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  IProps as ISignupCtaData,
  SignUpCTA,
} from 'marketing-site/src/library/components/SignUpCTA'
import React from 'react'

export const ContentfulSignUpCTA = (signUpCta: IContentfulSignupCta) => (
  <EntryMarker entry={signUpCta}>
    <SignUpCTA {...transformSignupCTA(signUpCta)} />
  </EntryMarker>
)

export function isSignUpCTA(entry: Entry<any>): entry is IContentfulSignupCta {
  return entry.sys.contentType.sys.id === 'signupCta'
}

export function transformSignupCTA({ fields }: IContentfulSignupCta): ISignupCtaData {
  return {
    ...fields,
    placeholderText: fields.placeholder,
  }
}
