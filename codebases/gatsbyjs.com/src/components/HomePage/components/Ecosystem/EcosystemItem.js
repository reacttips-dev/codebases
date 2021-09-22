import React from "react"
import { Heading, LinkButton } from "gatsby-interface"
import { MdExpandMore, MdChevronRight } from "react-icons/md"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = theme => ({
  position: `relative`,
  paddingLeft: theme.space[10],

  "&:not(:last-of-type)": {
    "&:after": {
      content: `""`,
      position: `absolute`,
      left: theme.space[9],
      right: 0,
      height: `1px`,
      background: theme.colors.grey[10],
    },
  },
})

const headingCss = theme => ({
  fontSize: theme.fontSizes[6],
  position: `relative`,

  small: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.orange[90],
    fontFamily: theme.fonts.body,
    fontWeight: theme.fontWeights.body,
    marginLeft: theme.space[2],
    transform: `translateY(-20%)`,
  },
})

const buttonCss = theme => ({
  outline: `none`,
  alignItems: `center`,
  background: `none`,
  border: `none`,
  cursor: `pointer`,
  display: `flex`,
  justifyContent: `flex-start`,
  width: `100%`,
  padding: `${theme.space[4]} 0`,
})

const iconCss = theme => ({
  position: `absolute`,
  left: 0,
  top: theme.space[4],
  transform: `translateX(-${theme.space[10]})`,
  height: theme.space[8],
  width: theme.space[8],
})

const expandCss = ({ theme, isExpanded }) => [
  {
    alignItems: `center`,
    borderRadius: theme.radii[2],
    display: `flex`,
    justifyContent: `center`,
    marginLeft: `auto`,

    svg: {
      transition: `transform ${theme.transitions.speed.slow} ${theme.transitions.curve.default}`,
      fill: theme.colors.grey[40],
    },

    "button:focus > &": {
      background: theme.colors.purple[10],

      svg: {
        fill: theme.colors.purple[60],
      },
    },
  },
  isExpanded && {
    svg: {
      transform: `rotate(180deg)`,
    },
  },
]

const regionCss = ({ theme, isExpanded }) => [
  {
    alignItems: `flex-start`,
    color: theme.colors.grey[70],
    display: `none`,
    flexDirection: `column`,
    marginTop: theme.space[4],
    marginBottom: theme.space[10],

    p: {
      margin: 0,
    },
  },
  isExpanded && {
    display: `flex`,
  },
]

const ctaCss = theme => ({
  marginTop: theme.space[7],
  borderRadius: theme.radii[3],
})

export function EcosystemItem({ data = {}, isExpanded, expand }) {
  const {
    Svg: svgContent,
    Heading: headingContent,
    Markdown: markdown,
    Cta: ctaContent,
  } = normalizeData(data)

  const icon = svgContent?.image?.file?.url

  const onClickHandler = () => {
    const scrollTop = document.documentElement.scrollTop

    // this prevents unwanted window scrolling
    setTimeout(() => {
      expand()
      window.scrollTo(0, scrollTop)
    }, 0)
  }

  return (
    <div css={rootCss}>
      <Heading css={headingCss} variant="EMPHASIZED" as="h3">
        {icon && <img src={icon} alt="" css={iconCss} loading="lazy" />}
        <button
          css={buttonCss}
          onClick={onClickHandler}
          aria-expanded={isExpanded}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: headingContent?.text?.text,
            }}
          />
          <span css={theme => expandCss({ theme, isExpanded })}>
            <MdExpandMore />
          </span>
        </button>
      </Heading>
      <div css={theme => regionCss({ theme, isExpanded })} role="region">
        <div
          dangerouslySetInnerHTML={{
            __html: markdown?.body?.childMarkdownRemark.html,
          }}
        />
        <LinkButton
          size="XL"
          to={ctaContent?.href}
          css={ctaCss}
          rightIcon={<MdChevronRight />}
        >
          {ctaContent?.anchorText}
        </LinkButton>
      </div>
    </div>
  )
}

export default EcosystemItem
