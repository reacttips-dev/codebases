import { graphql } from "gatsby"
import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"
import { useTheme } from "gatsby-interface"

import Img from "../components/core/img"
import { FaTwitter, FaGithub, FaGlobe } from "react-icons/fa"

import { linkStyles } from "../utils/styles"

const externalLinkStyles = theme => ({
  verticalAlign: `text-bottom`,
  marginRight: theme.space[2],
})
const socialMediaIcons = {
  twitter: <FaTwitter css={theme => externalLinkStyles(theme)} />,
  github: <FaGithub css={theme => externalLinkStyles(theme)} />,
  website: <FaGlobe css={theme => externalLinkStyles(theme)} />,
}

const ExternalLinkWithIcon = ({ to, icon, label }) => (
  <a
    aria-label={label}
    href={to}
    css={theme => ({
      color: theme.colors.lilac,
      marginRight: theme.space[2],
      transition: `all ${theme.transitions.speed.fast} ${theme.transitions.curve.default}`,
      "&:hover": {
        opacity: 1,
        color: theme.colors.gatsby,
      },
    })}
  >
    {socialMediaIcons[icon]}
  </a>
)

ExternalLinkWithIcon.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

const Profiles = ({ profiles }) => {
  const { mediaQueries } = useTheme()
  const breakpoint = mediaQueries.mobile

  return (
    <>
      {profiles.map((profile, i) => (
        <div
          key={i}
          css={theme => ({
            position: `relative`,
            marginBottom: theme.space[9],
            textAlign: `center`,
            width: `100%`,
            [breakpoint]: {
              display: `flex`,
              textAlign: `left`,
            },
            [theme.mediaQueries.tablet]: {
              flex: `0 0 45%`,
            },
          })}
        >
          <div>
            {profile.hoverPhoto && (
              <Img
                css={theme => ({
                  display: `none !important`,
                  position: `absolute !important`,
                  borderRadius: theme.radii[6],
                  marginBottom: theme.space[5],
                  transform: `translateZ(0)`,
                  [breakpoint]: {
                    marginBottom: 0,
                    display: `block !important`,
                  },
                })}
                fixed={profile.hoverPhoto.fixed}
              />
            )}
            {profile.photo && (
              <Img
                css={theme => ({
                  borderRadius: theme.radii[6],
                  marginBottom: theme.space[5],
                  transform: `translateZ(0)`,
                  [breakpoint]: {
                    marginBottom: 0,
                    ...(profile.hoverPhoto
                      ? {
                          ":hover": {
                            opacity: `0 !important`,
                          },
                        }
                      : {}),
                  },
                })}
                fixed={profile.photo.fixed}
              />
            )}
          </div>
          <div
            css={theme => ({
              [breakpoint]: { paddingLeft: theme.space[7] },
            })}
          >
            <div>
              <h3
                id={kebabCase(profile.name)}
                css={theme => ({ marginBottom: theme.space[4] })}
              >
                {profile.name}
              </h3>
              <h4
                css={theme => ({
                  color: theme.colors.grey[60],
                  marginBottom: 0,
                  fontWeight: 500,
                  fontSize: theme.fontSizes[1],
                  lineHeight: theme.lineHeights.dense,
                  fontFamily: theme.fonts.body,
                })}
              >
                {profile.title}
              </h4>
            </div>
            <div
              css={theme => ({
                marginBottom: theme.space[7],
              })}
            >
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter}`}
                  css={theme => ({
                    color: theme.colors.gatsby,
                    fontSize: theme.fontSizes[1],
                    fontWeight: 500,
                    marginRight: theme.space[3],
                    textDecoration: `none`,
                    transition: `all ${theme.transitions.speed.fast} ${theme.transitions.curve.default}`,
                    "&:hover": {
                      color: theme.colors.gatsby,
                    },
                  })}
                >
                  @{profile.twitter}
                </a>
              )}
              {profile.gitHub && (
                <ExternalLinkWithIcon
                  to={profile.gitHub}
                  icon="github"
                  label={`${profile.name}'s GitHub`}
                />
              )}
              {profile.website && (
                <ExternalLinkWithIcon
                  to={profile.website}
                  icon="website"
                  label={`${profile.name}'s website`}
                />
              )}
            </div>
            <div
              css={theme => ({
                color: theme.colors.grey[60],
                fontSize: theme.fontSizes[1],
                lineHeight: theme.lineHeights.loose,
                "& a": linkStyles(theme),
              })}
              dangerouslySetInnerHTML={{
                __html: profile.bio && profile.bio.childMarkdownRemark.html,
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}

Profiles.propTypes = {
  profiles: PropTypes.array.isRequired,
}

export default Profiles

export const query = graphql`
  fragment ProfilesFragment on ContentfulProfile {
    name
    title
    photo {
      fixed(width: 80, height: 80, quality: 90) {
        ...GatsbyContentfulFixed
      }
    }
    hoverPhoto {
      fixed(width: 80, height: 80, quality: 90) {
        ...GatsbyContentfulFixed
      }
    }
    twitter
    gitHub
    website
    bio {
      childMarkdownRemark {
        html
      }
    }
  }
`
