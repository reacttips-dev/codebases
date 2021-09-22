/** @jsx jsx */
import { jsx } from "theme-ui"
import { Fragment } from "react"
import { Component } from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { normalizeFeaturedSiteData } from "./utils"

import {
  screenshot,
  screenshotHover,
  withTitleHover,
  shortcutIcon,
} from "../shared/styles"
import ShowcaseItemCategories from "./showcase-item-categories"
import ShowcaseIcon from "../../assets/icons/showcase"
import { MdArrowForward as ArrowForwardIcon } from "react-icons/md"
import { MdLaunch as LaunchSiteIcon } from "react-icons/md"
import { Link } from "gatsby"
import url from "url"
import { AnchorButton, hexToRGBA, useTheme } from "gatsby-interface"

const slugify = require(`slugify`)

const cleanUrl = mainUrl => {
  const parsed = url.parse(mainUrl)
  let path = parsed.pathname
  if (path[path.length - 1] === `/`) path = path.slice(0, path.length - 1)
  return parsed.hostname + path
}

const screenshotImageStyling = {
  "&&": {
    borderBottom: `none`,
    color: `black`,
    fontFamily: `heading`,
    fontSize: 3,
    fontWeight: `bold`,
    textDecoration: `none`,
    transition: t =>
      `box-shadow ${t.transitions.speed.slow} ${t.transitions.curve.default}, transform .3s ${t.transitions.curve.default}`,
    "&:hover": { ...screenshotHover },
  },
}

const featuredSitesCard = {
  display: `flex`,
  flexDirection: `column`,
  flexGrow: 0,
  flexShrink: 0,
  width: [320, null, null, null, null, 360, 400],
  marginBottom: 10,
  marginRight: [7, null, null, null, null, 9],
}

const GradientOverlay = () => {
  const { colors } = useTheme()
  return (
    <div
      sx={{
        background: () =>
          `linear-gradient(90deg, ${hexToRGBA(
            colors.secondaryBackground,
            0
          )} 0%, ${hexToRGBA(colors.secondaryBackground, 1)} 100%)`,
        bottom: 7,
        pointerEvents: `none`,
        position: `absolute`,
        right: -7,
        top: 0,
        width: 60,
      }}
    />
  )
}

const ScreenshotImage = ({ node }) => (
  <Fragment>
    {node.image && (
      <GatsbyImage image={node.image} alt={node.title} sx={{ ...screenshot }} />
    )}
    <div>
      <span className="title">{node.title}</span>
    </div>
  </Fragment>
)

const FeaturedSiteLink = ({ useModals, to, children }) => {
  return useModals ? (
    <Link
      to={slugify(cleanUrl(to))}
      state={{ isModal: true }}
      sx={screenshotImageStyling}
    >
      {children}
    </Link>
  ) : (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      sx={screenshotImageStyling}
    >
      {children}
    </a>
  )
}

export const FeaturedSitesGrid = ({
  featured,
  setFilters,
  setFilterToFeatured,
  hideShowcaseLink,
  hideLaunchIcon = false,
  useModals = true,
}) => {
  return (
    <div css={{ position: `relative` }}>
      <div
        sx={{
          borderBottom: t => `1px solid ${t.colors.ui.border}`,
          display: `flex`,
          flexShrink: 0,
          mx: -7,
          overflowX: `scroll`,
          pt: 7,
          px: 7,
        }}
      >
        {featured.slice(0, 9).map((node, index) => {
          const siteData = normalizeFeaturedSiteData(node)
          return (
            <div
              key={`${siteData.id}-${index}`}
              sx={{
                ...featuredSitesCard,
                ...withTitleHover,
              }}
            >
              <FeaturedSiteLink to={siteData.url} useModals={useModals}>
                <ScreenshotImage node={siteData} />
              </FeaturedSiteLink>
              <div
                sx={{
                  color: `text.secondary`,
                  fontSize: 1,
                  fontWeight: `body`,
                  marginTop: [null, null, null, null, `auto`],
                }}
              >
                {siteData.builtBy && (
                  <div
                    sx={{
                      color: `text.primary`,
                      fontFamily: `heading`,
                      fontSize: 2,
                    }}
                  >
                    Built by {siteData.builtBy}
                  </div>
                )}
                {siteData.categories && (
                  <ShowcaseItemCategories
                    categories={siteData.categories.nodes}
                    onCategoryClick={c => setFilters(c)}
                  />
                )}
                {hideShowcaseLink && !hideLaunchIcon && (
                  <a
                    sx={shortcutIcon}
                    href={siteData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open website for ${siteData.title}`}
                  >
                    <LaunchSiteIcon style={{ verticalAlign: `text-top` }} />
                  </a>
                )}
              </div>
            </div>
          )
        })}
        {!hideShowcaseLink && (
          <div sx={{ display: `flex` }}>
            <a
              href="#showcase"
              sx={{
                backgroundColor: `white`,
                borderRadius: 1,
                marginRight: t => `${t.space[7]} !important`,
                textAlign: `center`,
                "&&": {
                  border: 0,
                  transition: t => t.transitions.default,
                  "&:hover": {
                    transform: t => `translateY(-${t.space[2]})`,
                    boxShadow: `overlay`,
                  },
                },
                ...featuredSitesCard,
              }}
              onClick={setFilterToFeatured}
            >
              <div
                sx={{
                  alignItems: `center`,
                  borderRadius: 1,
                  display: `flex`,
                  flexBasis: `100%`,
                  position: `relative`,
                }}
              >
                <span
                  sx={{
                    color: `gatsby`,
                    mx: `auto`,
                  }}
                >
                  <span
                    sx={{
                      display: `block`,
                      height: [44, null, null, 64, null, 72],
                      mx: `auto`,
                      mb: 7,
                      width: `auto`,
                      "& svg": {
                        height: `100%`,
                      },
                    }}
                  >
                    <ShowcaseIcon />
                  </span>
                  View all Featured Sites
                </span>
              </div>
            </a>
          </div>
        )}
      </div>
      <GradientOverlay />
    </div>
  )
}

class FeaturedSites extends Component {
  setFilterToFeatured = e => {
    e.preventDefault()

    this.props.setFilters(`Featured`)
  }

  render() {
    const { featured, setFilters } = this.props

    return (
      <section
        className="featured-sites"
        sx={{
          mt: 7,
          mx: 7,
          position: `relative`,
          display: [`none`, null, null, null, `block`],
        }}
      >
        <div
          sx={{
            display: `flex`,
            alignItems: `center`,
            flexWrap: `wrap`,
          }}
        >
          <h1
            sx={{
              fontFamily: `heading`,
              fontSize: 4,
              fontWeight: `bold`,
              ml: 2,
              mr: 30,
              my: 0,
            }}
          >
            Featured Sites
          </h1>
          <a
            href="#showcase"
            sx={{
              ...withTitleHover,
              display: [`none`, null, `block`],
              fontSize: 1,
              "&&": {
                borderBottom: 0,
                cursor: `pointer`,
                "&:hover": {
                  color: `link.hoverColor`,
                },
              },
            }}
            onClick={this.setFilterToFeatured}
          >
            <span className="title">View all</span>
            {` `}
            <ArrowForwardIcon sx={{ verticalAlign: `sub` }} />
          </a>
          <div
            css={{
              alignItems: `center`,
              display: `flex`,
              marginLeft: `auto`,
            }}
          >
            <div
              sx={{
                color: `text.secondary`,
                display: [`none`, null, null, `block`],
                fontSize: 1,
                mr: 5,
              }}
            >
              Want to get featured?
            </div>
            <AnchorButton
              href="https://www.gatsbyjs.com/contributing/community-contributions/"
              target="_blank"
              rel="noopener noreferrer"
              variant="SECONDARY"
              size="M"
              rightIcon={<ArrowForwardIcon />}
            >
              Submit your Site
            </AnchorButton>
          </div>
        </div>
        <FeaturedSitesGrid
          featured={featured}
          setFilters={setFilters}
          setFilterToFeatured={this.setFilterToFeatured}
        />
      </section>
    )
  }
}

export default FeaturedSites
