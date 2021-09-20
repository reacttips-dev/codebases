import { Entry } from 'contentful'
import {
  IMarketoForm as IContentfulMarketoForm,
  IMarketoFormFields as IContentfulMarketoFormFields,
} from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  IProps as MarketoFormV2Props,
  MarketoFormV2,
} from 'marketing-site/src/library/components/MarketoFormV2'
import React from 'react'

// redirectUrl may be injected from the ContentfulModalButton component
type IFields = IContentfulMarketoFormFields & {
  redirectUrl?: string
}

export function isMarketoForm(entry: Entry<any>): entry is IContentfulMarketoForm {
  return entry.sys.contentType.sys.id === 'marketoForm'
}

export const ContentfulMarketoForm = (data: IContentfulMarketoForm) => (
  <EntryMarker entry={data}>
    <MarketoFormV2 {...transformMarketoFormV2(data.fields)} />
  </EntryMarker>
)

export function transformMarketoFormV2({
  marketoForm,
  submitButtonLabel,
  redirectUrl,
  headingText,
  headingSize,
  subheadingText,
  subheadingSize,
  forceBusinessEmail,
}: IFields): MarketoFormV2Props {
  return {
    formId: marketoForm.id,
    submitButtonLabel: submitButtonLabel || marketoForm.buttonLabel,
    headingText,
    headingSize,
    subheadingText,
    subheadingSize,
    forceBusinessEmail: forceBusinessEmail || false,
    redirectUrl,
  }
}
