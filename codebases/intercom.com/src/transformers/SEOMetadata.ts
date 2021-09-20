import { ISeoMetadata } from 'marketing-site/@types/generated/contentful'
import { ISeoProps } from 'marketing-site/src/components/common/SEOMetadata'

export function transformSeoMetadata({ fields }: ISeoMetadata): ISeoProps {
  return {
    metaTitle: fields.metaTitle,
    metaDescription: fields.metaDescription,
    metaKeywords: fields.metaKeywords?.join(','),
    openGraphTitle: fields.openGraphTitle,
    openGraphImage: fields.openGraphImage.fields.file.url,
    openGraphDescription: fields.openGraphDescription,
    twitterImage: fields.twitterImage.fields.file.url,
    disableCrawling: fields.disableCrawling,
    metaCanonical: fields.metaCanonical,
  }
}
