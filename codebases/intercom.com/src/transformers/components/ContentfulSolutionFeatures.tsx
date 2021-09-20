import { ISolutionFeaturesModalData } from 'marketing-site/src/library/components/SolutionFeaturesModal'
import { ISolutionFeatures as IContentfulSolutionFeatures } from 'marketing-site/@types/generated/contentful'
import { transformFeatureSection } from 'marketing-site/src/transformers/components/ContentfulFeatureSection'

export function transformSolutionFeatures({
  fields,
}: IContentfulSolutionFeatures): ISolutionFeaturesModalData {
  return {
    ...fields,
    featureSections: fields.featureSections.map((section) => transformFeatureSection(section)),
    modalOpen: false,
    closeModal: () => {},
  }
}
