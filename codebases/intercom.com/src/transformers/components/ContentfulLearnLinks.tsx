import React from 'react'
import { ILearnDirectoryLinks } from 'marketing-site/@types/generated/contentful'
import { LearnLinks, IProps as ILinks } from '../../components/bespoke/resources/links'
import { ILink } from '../../components/bespoke/resources/link'
import { getLabelByKey } from '../../components/bespoke/resources/links'
import { IDemo, ILearnDirectoryLink, IBook } from 'marketing-site/@types/generated/contentful'
import { getHexColorFromName } from 'marketing-site/src/library/utils'

export const ContentfulLearnLinks = (group: ILearnDirectoryLinks) => (
  <LearnLinks {...transformLearnLinks(group)} />
)

export function transformLearnLinks({ fields }: ILearnDirectoryLinks): ILinks {
  return {
    headline: fields.headline,
    ctaUrl: fields.ctaUrl,
    appearance: fields.appearance,
    background: getHexColorFromName(fields.background),
    links: transformLearnLink(fields.links),
  }
}

export function transformLearnLink(
  links: ILearnDirectoryLinks['fields']['links'],
): (ILink | null)[] {
  if (!links) return []

  return links?.map((link) => {
    switch (link.sys.contentType.sys.id) {
      case 'book': {
        const book = link as IBook
        const bookType = book.fields.resourceType
        const bookTypeSlug = `${bookType}s`

        return {
          id: book.sys.id,
          label: getLabelByKey(bookType),
          title: book.fields.title,
          shortTitle: book.fields?.shortTitle,
          description: book.fields.description,
          url: `/resources/${bookTypeSlug}/${book.fields.slug}`,
          ctaLabel: `Read ${bookTypeSlug}`,
          thumbnail:
            book.fields.shareImage?.fields.file.url ||
            book.fields.coverPhoto.fields?.image?.fields.file.url,
        }
      }
      case 'learnDirectoryLink': {
        const article = link as ILearnDirectoryLink
        return {
          id: article.sys.id,
          label: getLabelByKey(article.fields.label),
          title: article.fields.title,
          description: article.fields.description,
          url: article.fields.url,
          ctaLabel: article.fields.ctaLabel || 'Read article',
          newWindow: article.fields.openInNewWindow,
          thumbnail: article.fields.coverPhoto.fields?.image.fields.file.url,
        }
      }
      case 'demo': {
        const demo = link as IDemo

        return {
          id: demo.sys.id,
          label: getLabelByKey('Demo'),
          title: demo.fields.title,
          description: demo.fields.shortDescription,
          url: `/resources/demos/${demo.fields.slug}`,
          ctaLabel: 'Watch video',
          thumbnail:
            demo.fields.shareImage?.fields.file.url || demo.fields.thumbnail.fields.file.url,
        }
      }

      default: {
        return null
      }
    }
  })
}
