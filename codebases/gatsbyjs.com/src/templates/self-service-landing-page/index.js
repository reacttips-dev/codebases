import React from "react"
import { graphql } from "gatsby"
// import { Spacer } from "gatsby-interface"
import Layout from "../../layouts"
import Header from "../../components/header"
import Footer from "../../components/footer"
import SEO from "../../components/seo"
import {
  Hero,
  mapHeroProps,
} from "../../components/self-serving-landing-page/components/Hero"
import {
  TwoColumnHero,
  mapTwoColumnHeroProps,
} from "../../components/self-serving-landing-page/components/TwoColumnHero"
import {
  FeatureGrid,
  mapFeatureGridProps,
} from "../../components/self-serving-landing-page/components/FeatureGrid"
import {
  ContactForm,
  mapContactFormProps,
} from "../../components/self-serving-landing-page/components/ContactForm"
import {
  Banner,
  mapBannerProps,
} from "../../components/self-serving-landing-page/components/Banner"
import {
  WalkThrough,
  mapWalkthroughProps,
} from "../../components/self-serving-landing-page/components/WalkThrough"
import {
  FeatureColumn,
  mapFeatureColumnProps,
} from "../../components/self-serving-landing-page/components/FeatureColumn"
import {
  FeaturedSites,
  mapFeaturedSitesProps,
} from "../../components/self-serving-landing-page/components/FeaturedSites"
import {
  Testimonial,
  mapTestimonialProps,
} from "../../components/self-serving-landing-page/components/Testimonial"
import {
  FeatureItems,
  mapFeatureItemsProps,
} from "../../components/self-serving-landing-page/components/FeatureItems"
import {
  RichTextBlock,
  mapProps as mapRichTextBlockProps,
} from "../../components/self-serving-landing-page/components/RichTextBlock"

import { ColorSchemeProvider } from "components/self-serving-landing-page/color-scheme-provider"
import { mainContainerCss } from "components/self-serving-landing-page/style-utils"
// import { spacingOptions } from "./constants"

const ComponentsMap = {
  Hero: { component: Hero, mapProps: mapHeroProps },
  TwoColumnHero: { component: TwoColumnHero, mapProps: mapTwoColumnHeroProps },
  FeatureGrid: {
    component: FeatureGrid,
    mapProps: mapFeatureGridProps,
  },
  FeatureColumn: {
    component: FeatureColumn,
    mapProps: mapFeatureColumnProps,
  },
  FeaturedSites: {
    component: FeaturedSites,
    mapProps: mapFeaturedSitesProps,
  },
  ContactForm: {
    component: ContactForm,
    mapProps: mapContactFormProps,
  },
  Banner: {
    component: Banner,
    mapProps: mapBannerProps,
  },
  Walkthrough: {
    component: WalkThrough,
    mapProps: mapWalkthroughProps,
  },
  Testimonial: {
    component: Testimonial,
    mapProps: mapTestimonialProps,
  },
  FeatureItems: {
    component: FeatureItems,
    mapProps: mapFeatureItemsProps,
  },
  RichTextBlock: {
    component: RichTextBlock,
    mapProps: mapRichTextBlockProps,
  },
}

const prepareComponents = data => {
  const safeData = data?.contentfulSelfServiceLandingPage?.sections || []

  return safeData.map((section, index) => {
    const componentDefinition = ComponentsMap[section.layout]
    const theme = section?.appearance?.theme || "DEFAULT"
    // const { verticalMargin: spacing, theme } = section.appearance
    // const numSpacers = spacingOptions[spacing] ?? 1

    if (componentDefinition) {
      const Component = componentDefinition.component
      const props = componentDefinition.mapProps(section)
      return (
        <React.Fragment key={`${section.layout}-${index}`}>
          <ColorSchemeProvider colorScheme={theme}>
            <Component {...props} />
          </ColorSchemeProvider>
          {/* {Array(numSpacers)
            .fill()
            .map((_, idx) => (
              <Spacer
                key={idx}
                size={10}
                responsiveSize={{
                  desktop: 15,
                  mobile: 12,
                }}
              />
            ))} */}
        </React.Fragment>
      )
    }

    return null
  })
}

export default function SelfServiceLandingPage({ data, location }) {
  const Components = prepareComponents(data)
  const {
    name,
    metaTitle,
    metaDescription,
    socialMediaImage,
    seoIndex: shouldIndex,
  } = data.contentfulSelfServiceLandingPage
  const { pathname } = location

  return (
    <Layout pathname={pathname}>
      <SEO
        title={metaTitle || name}
        description={metaDescription}
        socialMediaImageUrl={socialMediaImage?.file?.url}
        shouldIndex={shouldIndex}
      />
      <Header isFullWidth={false} />
      <main css={mainContainerCss}>{Components}</main>
      <Footer />
    </Layout>
  )
}

export const pageQuery = graphql`
  query SelfServiceLandingPage($id: String!) {
    contentfulSelfServiceLandingPage(id: { eq: $id }) {
      id
      name
      slug
      seoIndex
      sections {
        layout
        alignment
        content {
          name
          primaryText
          secondaryText
          videoEmbedId
          images {
            file {
              url
            }
            fixed: gatsbyImageData(layout: FIXED, width: 200)
            constrained: gatsbyImageData(
              layout: CONSTRAINED
              quality: 80
              width: 800
            )
            fluid: gatsbyImageData(layout: FULL_WIDTH, quality: 80, width: 800)
          }
          description {
            childMarkdownRemark {
              html
            }
          }
          icon {
            file {
              url
            }
          }
          ctas {
            href
            anchorText
          }
          form {
            id
            marketoFormCampaignObject {
              formId
              name
            }
            thankYouMessage {
              childMarkdownRemark {
                html
              }
            }
          }
        }
        items {
          contentful_id
          name
          primaryText
          secondaryText
          images {
            gatsbyImageData(layout: CONSTRAINED, quality: 80, width: 800)
          }
          ctas {
            href
            anchorText
          }
          description {
            childMarkdownRemark {
              html
            }
          }
          icon {
            file {
              url
            }
          }
        }
        appearance {
          theme
          backgroundImages {
            file {
              url
            }
            gatsbyImageData(layout: FULL_WIDTH)
          }
          verticalMargin
          name
        }
      }
      metaTitle
      metaDescription
      socialMediaImage {
        file {
          url
        }
      }
    }
  }
`
