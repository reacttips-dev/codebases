import React from 'react'

import { emojiIndex } from 'emoji-mart'
import Head from 'next/head'

import { Media } from 'tribe-api/interfaces'
import { getMediaURL } from 'tribe-components'
import { i18n } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { isIOS } from 'utils/ios'
import { sanitizeHTML, sanitizeJSON } from 'utils/sanitize.utils'
import { truncate } from 'utils/strings'

import { SeoPageProps } from '../../@types'

const IMGIX_ROUNDED_IMAGE_PARAMS = '&ar=1:1&mask=ellipse&fit=crop'

const getIcon = (media?: Media | null, size?: number) => {
  if (media && media.__typename === 'Image') {
    return (
      getMediaURL(media, {
        size: 'xs',
        dimensions: { w: size, h: size },
      }) + IMGIX_ROUNDED_IMAGE_PARAMS
    )
  }
  if (media && media.__typename === 'Emoji') {
    try {
      const nativeEmoji = emojiIndex
        .search(media.text)
        ?.map(o => (o as any).native)?.[0]
      const svg = `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${nativeEmoji}</text></svg>`
      return `data:image/svg+xml,${svg}`
    } catch (e) {
      // ignore
    }
  }
  // blank image otherwise
  return 'data:;base64,iVBORw0KGgo='
}

export const GenericMeta = ({
  seo,
  path,
  origin,
}: {
  seo?: SeoPageProps // To skip this page completly you can send seo prop as null
  path?: string
  origin?: string
}) => {
  const isClient = typeof window !== 'undefined'
  const skip = seo === null
  const { network } = useGetNetwork(undefined, { skip })
  if (skip) return null
  const _origin = origin || (isClient && window.location.origin)

  let title = seo?.title || network?.name || ''
  if (seo?.appendNetworkName && network?.name) {
    title = `${title} - ${network?.name}`
  }
  title = truncate(sanitizeHTML(title), 50)

  let description =
    seo?.description ||
    network?.description ||
    i18n.t('common:seo.network.description', {
      defaultValue:
        'Join {{name}} to start sharing and connecting with like-minded people.',
      name: network?.name,
    })
  description = truncate(sanitizeHTML(description), 160)

  const brandColor = network?.brandColor || '#FFFFFF'
  const icon = network?.favicon || network?.logo
  const defaultIcon = getIcon(icon)

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <link rel="icon" href={defaultIcon} />
      <link rel="icon" sizes="192x192" href={getIcon(icon, 192)} />
      <link rel="apple-touch-icon" sizes="180x180" href={getIcon(icon, 180)} />

      <meta name="application-name" content={title} />
      <meta name="apple-mobile-web-app-title" content={title} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link
        rel="canonical"
        href={_origin && path ? _origin + path : undefined}
      />

      {/* IE */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="msapplication-navbutton-color" content={brandColor} />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="msapplication-TileColor" content={brandColor} />
      <link
        rel="msapplication-TileImage"
        sizes="152x152"
        href={getIcon(icon, 152)}
      />

      {/* Add to homescreen for Chrome on Android */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={brandColor} />

      {/* iOS */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-touch-fullscreen" content="yes" />
      {/* <meta name="apple-touch-startup-image" content="" /> */}

      {/* General OpenGraph */}
      <meta key="og:type" property="og:type" content="website" />
      <meta property="og:site_name" content={network?.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:url"
        content={_origin && path ? _origin + path : undefined}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:url"
        content={_origin && path ? _origin + path : undefined}
      />
      {isIOS() && (
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      )}
      <meta name="format-detection" content="telephone=no" />

      {seo?.additionalMeta?.map(meta => {
        if ('name' in meta) {
          return (
            <meta
              key={meta.name}
              name={meta.name}
              content={meta.content || undefined}
            />
          )
        }

        return (
          <meta
            key={meta.property}
            property={meta.property}
            content={meta.content || undefined}
          />
        )
      })}

      {seo?.jsonld && (
        <script type="application/ld+json">
          {sanitizeJSON(JSON.stringify(seo?.jsonld))}
        </script>
      )}

      <link
        rel="manifest"
        href={`data:application/manifest+json,${JSON.stringify({
          name: title,
          short_name: title,
          display: 'standalone',
          start_url: `${_origin || ''}/`,
          // theme_color: brandColor,
          icons: [
            {
              src: getIcon(icon, 192),
              sizes: '192x192',
            },
            {
              src: getIcon(icon, 512),
              sizes: '512x512',
            },
          ],
        })}`}
      />
    </Head>
  )
}
