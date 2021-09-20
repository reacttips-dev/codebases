import React from 'react'
import { IProps as IFeaturesModal } from 'marketing-site/src/library/components/FeaturesModal'
import { IFeaturesModal as IContentfulFeaturesModal } from 'marketing-site/@types/generated/contentful'
import { IFeaturesGroup as IContentfulFeaturesGroup } from 'marketing-site/@types/generated/contentful'
import { IFeature as IContentfulFeature } from 'marketing-site/@types/generated/contentful'
import {
  IFeature,
  FeaturesModal,
  IFeaturesGroup,
} from 'marketing-site/src/library/components/FeaturesModal'
import { transformPlanColumnGroup } from './components/ContentfulPlanColumnGroup'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { transformEnterpriseSolutionBanner } from './components/ContentfulEnterpriseSolutionBanner'

export const ContentfulFeaturesModal = (featuresModal: IContentfulFeaturesModal) => (
  <FeaturesModal {...transformFeaturesModal(featuresModal)} />
)

export function transformFeatures({ fields }: IContentfulFeature): IFeature {
  return {
    ...fields,
    mainText: fields.mainText && documentToHtmlString(fields.mainText),
  }
}

export function transformFeaturesGroups({ fields }: IContentfulFeaturesGroup): IFeaturesGroup {
  return {
    ...fields,
    icon: fields.icon && fields.icon.fields.file.url,
    features: fields.features && fields.features.map(transformFeatures),
    banner: fields.banner && transformEnterpriseSolutionBanner(fields.banner),
  }
}

export function transformFeaturesModal({ fields }: IContentfulFeaturesModal): IFeaturesModal {
  return {
    ...fields,
    planGroupings:
      (fields.planGroupings && fields.planGroupings.map(transformPlanColumnGroup)) || [],
    featuresGroups: fields.featuresGroups.map(transformFeaturesGroups),
    modalOpen: false,
    closeModal: () => {},
  }
}
