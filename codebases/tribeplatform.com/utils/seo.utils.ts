import { SeoPageProps } from '@types'
import { Article, Organization, Person, WithContext } from 'schema-dts'

import { SpaceSeoQuery } from 'tribe-api'
import { Member, Network, Post } from 'tribe-api/interfaces'
import { getMediaURL } from 'tribe-components'
import { i18n } from 'tribe-translation'

import { getPostFieldValue } from 'containers/Post/utils'

export const postSeo = (post?: Post): SeoPageProps | undefined => {
  if (!post) {
    return
  }

  let postTitle: string | null = null
  switch (post?.postType?.name?.toLowerCase()) {
    case 'discussion':
      postTitle = getPostFieldValue(post, 'title')
      break
    case 'comment':
      break
    case 'question':
      postTitle = getPostFieldValue(post, 'question')
      break
    case 'answer':
      break
    default:
      break
  }
  let title = postTitle || ''
  if (post?.space?.name) {
    title = `${title} - ${post?.space?.name}`
  }
  const description = post?.shortContent || ''

  const author = post?.owner?.member

  const jsonld: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: postTitle || '',
    dateCreated: post.createdAt,
  }

  if (author) {
    jsonld.author = {
      '@type': 'Person',
      name: author.name || '',
      image: getMediaURL(author.profilePicture) ?? '',
      jobTitle: author.tagline || '',
    }
  }

  return {
    title,
    description,
    additionalMeta: [{ property: 'og:type', content: 'article' }],
    jsonld,
  }
}

export const spaceSeo = (
  space?: SpaceSeoQuery['space'],
): SeoPageProps | undefined => {
  if (!space) {
    return
  }

  const title = space?.name || ''
  const description = space?.description || ''

  return {
    title,
    description,
    appendNetworkName: true,
    additionalMeta: [
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:image',
        content: getMediaURL(space.banner),
      },

      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: getMediaURL(space.banner) },
      { property: 'og:image:width', content: '300' },
      { property: 'og:image:height', content: '300' },
    ],
  }
}

export const networkSeo = (network?: Network): SeoPageProps | undefined => {
  if (!network) {
    return
  }
  const title = network.name || ''
  const description = network.description || ''

  const jsonld: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: network.name,
    logo: getMediaURL(network.logo) || '',
    url: network.domain,
  }

  return {
    title,
    description,
    additionalMeta: [
      { name: 'twitter:image', content: getMediaURL(network.logo) },

      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: getMediaURL(network.logo) },
      { property: 'og:image:width', content: '200' },
      { property: 'og:image:height', content: '200' },
    ],
    jsonld,
  }
}

export const memberSeo = (member?: Member): SeoPageProps | undefined => {
  if (!member) {
    return
  }

  const title = member.name || ''
  const description = i18n.t('member:seo.description', {
    defaultValue:
      '{{name}} profile in {{network}} question and answer community. Ask {{name}} your questions right now!',
    name: member.name || '',
    network: member.network?.name || '',
  })

  const jsonld: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name || '',
    image: getMediaURL(member.profilePicture) ?? '',
    jobTitle: member.tagline || '',
  }

  return {
    title,
    description,
    appendNetworkName: true,
    additionalMeta: [
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:image', content: getMediaURL(member.profilePicture) },

      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: getMediaURL(member.profilePicture) },
      { property: 'og:image:width', content: '200' },
      { property: 'og:image:height', content: '200' },
    ],
    jsonld,
  }
}
