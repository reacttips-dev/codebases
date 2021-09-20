import { IHomepageHero as IContentfulHomepageHero } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  HomepageHero,
  IProps as IHomepageHero,
} from 'marketing-site/src/library/components/HomepageHero'
import {
  ContentfulVariationContainer,
  isVariationContainer,
} from 'marketing-site/src/transformers/components/ContentfulVariationContainer'
import { CTA } from 'marketing-site/src/transformers/CTA'
import React from 'react'

export const ContentfulHomepageHero = (homepageHero: IContentfulHomepageHero) => (
  <EntryMarker entry={homepageHero}>
    {() => <HomepageHero {...transformHomepageHero(homepageHero)} />}
  </EntryMarker>
)

export function transformHomepageHero({ fields }: IContentfulHomepageHero): IHomepageHero {
  return {
    ...fields,
    renderEmailForm: () => {
      if (isVariationContainer(fields.signUpCta)) {
        return <ContentfulVariationContainer {...fields.signUpCta} />
      }
      return <CTA {...fields.signUpCta} elementLocation="hero" />
    },
  }
}
