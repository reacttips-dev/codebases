/* eslint-disable react/display-name */
import React from 'react'
import {
  IProps as IEmailCapture,
  EmailCapture,
} from 'marketing-site/src/library/components/EmailCapture'
import { IEmailCapture as IContentfulEmailCapture } from 'marketing-site/@types/generated/contentful'
import { transformCheckmarks } from 'marketing-site/src/transformers/elements/ContentfulCheckmarks'
import { transformCTALink } from 'marketing-site/src/transformers/elements/ContentfulCTALink'
import { transformSignupCTA } from 'marketing-site/src/transformers/elements/ContentfulSignUpCTA'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { SignUpCTA } from 'marketing-site/src/library/components/SignUpCTA'
import { getHexColorFromName } from 'marketing-site/src/library/utils'

export const ContentfulEmailCapture = (emailCapture: IContentfulEmailCapture) => (
  <EntryMarker entry={emailCapture}>
    {() => <EmailCapture {...transformEmailCapture(emailCapture)} />}
  </EntryMarker>
)

export function transformEmailCapture({ fields }: IContentfulEmailCapture): IEmailCapture {
  return {
    ...fields,
    subheading: fields.subheading && documentToHtmlString(fields.subheading),
    bgColor: getHexColorFromName(fields.bgColor),
    checkmarks: fields.checkmarks && transformCheckmarks(fields.checkmarks[0]),
    cta: fields.cta && transformCTALink(fields.cta),
    renderEmailForm: () => (
      <SignUpCTA {...transformSignupCTA(fields.signUpCta)} elementLocation="footer" />
    ),
  }
}
