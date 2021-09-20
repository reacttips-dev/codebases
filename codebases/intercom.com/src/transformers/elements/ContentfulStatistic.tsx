import { IStatProps as IProps } from 'marketing-site/src/library/components/Statistics'
import { IStatistic as IContentfulStatistic } from 'marketing-site/@types/generated/contentful'

import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export function transformStat({ fields }: IContentfulStatistic): IProps {
  return {
    stat: fields.statistic,
    statImage: fields.statImage && fields.statImage.fields.file.url,
    description: documentToHtmlString(fields.description),
    credit: fields.credit && { ...fields.credit.fields },
    backgroundImage: fields.backgroundImage && fields.backgroundImage.fields.file.url,
  }
}
