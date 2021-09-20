import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import {
  IHeroWithCta as IContentfulHeroWithCTA,
  ITwoCtAsHeroElement as IContentfulCtaHeroElement,
} from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { IHeroContentAlignment, ILayout } from 'marketing-site/src/library/components/Hero'
import {
  HeroWithCTA,
  IProps as IHeroWithCTA,
} from 'marketing-site/src/library/components/HeroWithCTA'
import React from 'react'
import { CTA } from '../CTA'
import { transformVideoOrImage } from '../elements/ContentfulVideoOrImage'
import { transformValuePropsWithModalVideo } from './ContentfulValuePropsWithModalVideo'

export const ContentfulHeroWithCta = (heroWithCta: IContentfulHeroWithCTA) => (
  <EntryMarker entry={heroWithCta}>
    {() => <HeroWithCTA {...transformHeroWithCta(heroWithCta)} />}
  </EntryMarker>
)

function transformCtaHeroElement({ fields }: IContentfulCtaHeroElement) {
  return {
    renderCta1: () => <CTA {...fields.cta1} elementLocation="hero" />,
    renderCta2: () => fields.cta2 && <CTA {...fields.cta2} elementLocation="hero" />,
    footnote: fields.footnoteRichText && documentToHtmlString(fields.footnoteRichText),
  }
}

function getLayoutFromData(alignment: IHeroContentAlignment): ILayout {
  return {
    leftAlign: alignment === 'Left',
    compact: false,
  }
}

function getMediaLayoutFromData(leftAlignMedia: boolean | undefined): boolean {
  return Boolean(leftAlignMedia)
}

export function transformHeroWithCta({ fields }: IContentfulHeroWithCTA): IHeroWithCTA {
  return {
    ...fields,
    ...transformCtaHeroElement(fields.ctAsHeroElement),
    layout: getLayoutFromData(fields.alignment),
    media: fields.media === undefined ? undefined : transformVideoOrImage(fields.media),
    leftAlignMedia: getMediaLayoutFromData(fields.leftAlignMedia),
    valuePropsWithModalVideo:
      fields.valuePropsWithModalVideo &&
      transformValuePropsWithModalVideo(fields.valuePropsWithModalVideo),
  }
}
