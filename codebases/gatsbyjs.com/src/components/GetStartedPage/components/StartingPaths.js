import React from "react"
import { LinkButton, Heading, Link } from "gatsby-interface"
import { MdArrowForward, MdStar } from "react-icons/md"
import { AccountGroupIcon } from "../../shared/icons/AccountGroupIcon"
import { ScaleBalanceIcon } from "../../shared/icons/ScaleBalanceIcon"
import { GatsbyCloudLogo } from "../../shared/logos/GatsbyCloudLogo"
import { GatsbyOpenSourceLogo } from "../../shared/logos/GatsbyOpenSourceLogo"
import { CloudFeatures } from "./CloudFeatures"
import { NpmCommand } from "./NpmCommand"
import { ctaBtnCss } from "../../shared/styles"
import { useTracker, SegmentEventType } from "../../../utils/analytics"

const rootCss = theme => ({
  display: `grid`,
  gridTemplateColumns: `1fr`,
  gridColumnGap: theme.space[15],
  gridRowGap: theme.space[10],
  position: `relative`,

  [theme.mediaQueries.desktop]: {
    gridTemplateColumns: `1fr 1fr`,
  },
})

const emphasizedHeadingCss = theme => ({
  fontSize: theme.fontSizes[8],
  lineHeight: theme.lineHeights.dense,

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[8],
  },
})

const optionCss = theme => ({
  alignItems: `center`,
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  maxWidth: `32rem`,
  position: `relative`,

  [theme.mediaQueries.desktop]: {
    "&:first-of-type": {
      "&:after": {
        bottom: 0,
        content: `""`,
        position: `absolute`,
        right: `-${theme.space[10]}`,
        top: 0,
        width: `1px`,
        background: theme.colors.grey[30],
      },
    },
  },
})

const logoCss = theme => ({
  marginBottom: theme.space[5],
  width: theme.space[15],
  height: theme.space[15],

  [theme.mediaQueries.desktop]: {
    width: `auto`,
    height: `auto`,
  },
})

const descriptionCss = theme => ({
  color: theme.colors.grey[70],
  fontSize: theme.fontSizes[2],
  textAlign: `center`,
  marginTop: theme.space[5],

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[3],
    padding: `0 ${theme.space[8]}`,
  },
})

const noteCss = theme => ({
  fontSize: theme.fontSizes[0],
  color: theme.colors.grey[50],
  margin: 0,
  textAlign: `center`,

  svg: {
    verticalAlign: `middle`,
    fill: theme.colors.grey[40],
  },

  span: {
    "&:not(:first-of-type)": {
      marginLeft: theme.space[5],
    },
  },
})

const installationNoteCss = theme => [
  noteCss(theme),
  {
    fontSize: theme.fontSizes[1],
  },
]

const linkCss = theme => ({
  textDecoration: `none`,
  fontWeight: theme.fontWeights.semiBold,
})

const ctaCss = ({ theme, tone }) => [
  ctaBtnCss({ theme, tone }),
  {
    marginBottom: theme.space[3],
    marginTop: theme.space[8],
  },
]

const bottomCss = _theme => ({
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  marginTop: `auto`,
})

export function StartingPaths() {
  const { trackSegment, trackButtonClicked } = useTracker()

  return (
    <div css={rootCss}>
      <div css={optionCss}>
        <GatsbyOpenSourceLogo css={logoCss} />
        <Heading as="h3" variant="EMPHASIZED" css={emphasizedHeadingCss}>
          Gatsby Framework
        </Heading>
        <p css={descriptionCss}>
          Get started with Gatsby, an open-source framework for building amazing
          websites.
        </p>
        <p css={noteCss}>
          <span>
            <MdStar /> 50k+ GitHub stars
          </span>
          <span>
            <AccountGroupIcon /> 3.6k+ contributors
          </span>
        </p>

        <NpmCommand
          onClick={() => {
            trackButtonClicked(`Copy npm init gatsby`, {
              uiSource: `Get Started`,
            })
            trackSegment({
              type: SegmentEventType.Track,
              event: `Clicked to copy the CLI command`,
            })
          }}
        />

        <p css={installationNoteCss}>
          You need Node v12+ — see the detailed{" "}
          <Link to="/docs/quick-start/" css={linkCss}>
            installation docs
          </Link>
          {`.`}
        </p>
        <div css={bottomCss}>
          <LinkButton
            size="XL"
            to="/docs/quick-start/"
            onClick={() => {
              trackButtonClicked(`Selected Quick Start`, {
                uiSource: `Get Started`,
              })
              trackSegment({
                type: SegmentEventType.Track,
                event: `Clicked to Quick Start`,
              })
            }}
            rightIcon={<MdArrowForward />}
            css={theme => ctaCss({ theme })}
          >
            Start Building
          </LinkButton>
          <p css={noteCss}>
            <ScaleBalanceIcon /> MIT license
          </p>
        </div>
      </div>
      <div css={optionCss}>
        <GatsbyCloudLogo css={logoCss} />
        <Heading as="h3" variant="EMPHASIZED" css={emphasizedHeadingCss}>
          Gatsby Cloud
        </Heading>
        <p css={descriptionCss}>
          Build, Deploy, and Host your site on Gatsby Cloud for a{" "}
          <strong>fast, secure, and scalable</strong> Gatsby experience.
        </p>

        <CloudFeatures />

        <div css={bottomCss}>
          <LinkButton
            size="XL"
            to="/dashboard/signup/"
            onClick={() => {
              trackButtonClicked(`Selected Gatsby Cloud`, {
                uiSource: `Get Started`,
              })
              trackSegment({
                type: SegmentEventType.Track,
                event: `Get Started - Selected Gatsby Cloud`,
              })
            }}
            rightIcon={<MdArrowForward />}
            css={theme => ctaCss({ theme, tone: `cloud` })}
          >
            Deploy now
          </LinkButton>
          <p css={noteCss}>No credit card required</p>
        </div>
      </div>
    </div>
  )
}
