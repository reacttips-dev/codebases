import React, { useContext } from 'react'

import Head from 'next/head'

import CurrentPathContext from 'marketing-site/src/components/context/CurrentPathContext'
import { EarlyStageContext } from 'marketing-site/lib/page-behaviors/EarlyStage'

import IntercomLogo from 'marketing-site/src/images/intercom-logo.png'

export interface ISeoProps {
  metaTitle: string
  metaDescription: string
  metaKeywords?: string
  openGraphTitle: string
  openGraphImage: string
  openGraphDescription?: string
  twitterImage: string
  disableCrawling: boolean
  metaCanonical?: string
}

const SEOMetadata: React.FC<ISeoProps> = (props) => {
  const specifiedCanonical = props.metaCanonical
  const inferredCanonical = useContext(CurrentPathContext).canonical

  const url = specifiedCanonical || inferredCanonical

  const { isEarlyStagePartner } = useContext(EarlyStageContext)
  const disableCrawling = isEarlyStagePartner || props.disableCrawling

  return (
    <Head>
      <meta name="title" content={props.metaTitle} />
      <meta name="description" content={props.metaDescription} />
      {props.metaKeywords && <meta name="keywords" content={props.metaKeywords} />}
      {disableCrawling && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={props.openGraphTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`https:${props.openGraphImage}`} />
      {props.openGraphDescription && (
        <meta property="og:description" content={props.openGraphDescription} />
      )}

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@intercom" />
      <meta property="twitter:title" content={props.openGraphTitle} />
      <meta property="twitter:image" content={`https:${props.twitterImage}`} />
      {props.openGraphDescription && (
        <meta property="twitter:description" content={props.openGraphDescription} />
      )}
      <meta
        name="ahrefs-site-verification"
        content="3339929cc312135208881c331e81248c9466f8e90c0ea2e478bfeff69beb7023"
      />
      <link rel="canonical" href={url} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "http://schema.org",
            "@type": "Organization",
            "url": "https://www.intercom.com",
            "logo": "${IntercomLogo}"
          }`,
        }}
      />
    </Head>
  )
}

export default SEOMetadata
