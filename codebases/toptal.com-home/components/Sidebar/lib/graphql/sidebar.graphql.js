import gql from 'nanographql'

const sidebar = gql `
  query($kind: String!) {
    sidebar(kind: $kind) {
      caseStudiesSection {
        title
        order
        testimonials {
          title
          videoIdentifier
          logoImageUrl: imageUrl(kind: "author_logo_white_square")
          backgroundImageUrl: imageUrl(kind: "preview_square")
        }
      }

      searchSection {
        order
        searchWidgetSection {
          searchWidget {
            placeholder
            emptyMessage
            errorMessage
          }
          popularResourcesSection {
            serviceList {
              title
              items {
                label
                href
              }
            }
            skillList {
              title
              items {
                label
                href
              }
            }
          }
        }
      }

      inDemandResourcesSection {
        title
        order
        talents {
          iconUrl
          page {
            label: title
            href: publicUrl
          }
        }
        services {
          iconUrl
          page {
            label: title
            href: publicUrl
          }
        }
      }

      socialShareSection {
        title
        order
        links {
          label
          href
        }
      }

      trendingSkillsSection {
        title
        order
        skills {
          iconUrl
          page {
            label: title
            href: publicUrl
          }
        }
      }

      skillSelector {
        order
        title
        skillList {
          verticals {
            title
            vertical {
              name
              title
            }
            skills {
              label
              href
            }
          }
        }
      }

      videoSection {
        order
        title
        video {
          backgroundImageUrl
          playButtonLabel
          title
          videoIdentifier
        }
      }
    }
  }
`

export default sidebar