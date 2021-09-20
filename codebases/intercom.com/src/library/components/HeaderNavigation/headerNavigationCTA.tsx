import {
  ICtaButton as IContentfulCtaButton,
  ICtaLink as IContentfulCtaLink,
  ISignupCta as IContentfulSignupCta,
  IVariationContainer as IContentfulVariationContainer,
} from 'marketing-site/@types/generated/contentful'
import { renderEntry } from 'marketing-site/lib/render'
import { mqBreakpoints } from 'marketing-site/src/library/utils'
import { WithAdditionalSignupCTAOverrideProps } from 'marketing-site/src/components/context/SignupCTAOverridePropsContext'
import { WithAdditionalCTALinkOverrideProps } from 'marketing-site/src/components/context/CTALinkOverridePropsContext'
import React from 'react'

interface IProps {
  cta:
    | IContentfulCtaButton
    | IContentfulCtaLink
    | IContentfulSignupCta
    | IContentfulVariationContainer
}

export function HeaderNavigationCTA({ cta }: IProps) {
  return (
    <WithAdditionalSignupCTAOverrideProps overrideProps={{ small: true }}>
      <WithAdditionalCTALinkOverrideProps overrideProps={{ small: true, arrow: false }}>
        <span className="cta" data-testid="header-navigation-cta">
          {renderEntry(cta)}
          <style jsx>{`
            @media (max-width: ${mqBreakpoints.desktopLg - 1}px) {
              .cta :global(.email-form) {
                max-width: 278px;
              }
              .cta :global(.email-form__input),
              .cta :global(.email-form__submit) {
                min-width: auto !important;
              }

              .cta :global(.email-form--small .email-form__submit) {
                padding: 6px 20px 6px 16px;
              }
            }
          `}</style>
        </span>
      </WithAdditionalCTALinkOverrideProps>
    </WithAdditionalSignupCTAOverrideProps>
  )
}
