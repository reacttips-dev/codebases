import { Entry } from 'contentful'
import { ICtaButton as IContentfulCtaButton } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { CTAButton, IProps as ICtaButtonProps } from 'marketing-site/src/library/elements/CTAButton'
import * as Utils from 'marketing-site/src/library/utils'
import React from 'react'

function handleCTAClick(e: React.MouseEvent) {
  e.preventDefault()
}

export function isCTAButton(entry: Entry<any>): entry is IContentfulCtaButton {
  return entry.sys.contentType.sys.id === 'ctaButton'
}

export const ContentfulCTAButton = (ctaButton: IContentfulCtaButton) => (
  <EntryMarker entry={ctaButton}>
    <CTAButton {...transformCTAButton(ctaButton)} />
  </EntryMarker>
)

export function transformCTAButton({ fields }: IContentfulCtaButton): ICtaButtonProps {
  return {
    ...fields,
    text: fields.text,
    bgColor: Utils.getTypedCtaTheme<Utils.CTATheme>(fields.colorTheme),
    icon: fields.icon && Utils.getTypedIcon(fields.icon),
    onClick: handleCTAClick,
  }
}
