import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"
import Helmet from "react-helmet"
import config from "../config"
import striptags from "striptags"

const SEO = ({
  contentfulPage,
  url = config.url,
  title,
  description,
  socialMediaImageUrl,
  shouldIndex = true,
}) => {
  let metaTitle = ``
  let metaDescription = ``
  let ogImage = ``
  const robots = shouldIndex ? `index` : `noindex, nofollow`

  // legacy option,
  if (contentfulPage) {
    const { name, title, socialMediaImage } = contentfulPage

    metaTitle = name
    metaDescription = title ? striptags(title) : config.description
    // explicitly use http to bypass potential SSL certificate issues
    // without this, couldn't get the image to work with https://cards-dev.twitter.com/validator
    // ref. https://toodlepip.co.uk/2017/09/14/how-to-twitter-cards-not-showing-images-on-wordpress/
    // "Apparently, it’s very strict about SSL images, so if the certificate doesn’t exactly match your domain,
    // which it may not on a shared server, the image won’t show.Switching the image so it’s served from
    // a non - SSL server instead, solves the problem"
    ogImage = socialMediaImage?.file?.url
      ? `http:${socialMediaImage.file.url}`
      : config.image
  } else {
    metaTitle = title
    metaDescription = description ? description : config.description
    ogImage = socialMediaImageUrl ? `http:${socialMediaImageUrl}` : config.image
  }

  return (
    <Helmet
      title={metaTitle}
      titleTemplate={`%s | ${config.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `image`,
          content: ogImage,
        },
        {
          name: `robots`,
          content: robots,
        },
        /*
          @todo Schema.org tags
          @see https://github.com/jlengstorf/lengstorf.com/blob/master/src/components/SEO.js
        */

        /* OpenGraph tags */
        {
          property: `og:url`,
          content: url,
        },

        {
          property: `og:title`,
          content: metaTitle,
          name: `title`,
        },
        {
          property: `og:description`,
          content: metaDescription,
          name: `description`,
        },
        {
          property: `og:image`,
          content: ogImage,
          name: `image`,
        },
        {
          property: `fb:app_id`,
          content: config.fbAppID,
        },

        /* Twitter Card tags */
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: config.twitter,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: ogImage,
        },
      ]}
    />
  )
}

SEO.propTypes = {
  contentfulPage: PropTypes.object,
  url: PropTypes.string,
}

export default SEO

export const socialMediaImageFragment = graphql`
  fragment SocialMediaImage on ContentfulPage {
    socialMediaImage {
      file {
        url
      }
    }
  }
`
