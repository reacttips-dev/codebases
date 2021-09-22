import React from "react"
import { SplitLink as Link } from "../links/SplitLink"
import { HeaderNavDropdownItemDetails } from "./HeaderNavDropdownItemDetails"
import { getLinkTargetProp } from "../shared/helpers"
import {
  headerNavSimpleLinkCss,
  headerNavLinkIconCss,
  displayOnMobileOnly,
  displayOnDesktopOnly,
} from "../shared/styles"

const rootCss = ({
  theme,
  bgColor,
  colored,
  isFirstColored,
  isFirst,
  isLast,
}) => [
  {
    [theme.mediaQueries.desktop]: {
      padding: `0 ${theme.space[7]}`,
      paddingBottom: theme.space[4],
      background: colored && theme.colors[bgColor][5],
    },
  },
  isFirst && {
    [theme.mediaQueries.desktop]: {
      paddingTop: theme.space[7],
    },
  },
  isLast && {
    [theme.mediaQueries.desktop]: {
      paddingBottom: theme.space[7],
      borderRadius: `0 0 ${theme.radii[3]} ${theme.radii[3]}`,
    },
  },
  isFirstColored && {
    [theme.mediaQueries.desktop]: {
      paddingTop: theme.space[7],

      "&&": {
        marginTop: theme.space[7],
      },
    },
  },
]

const linkCss = ({ theme }) => [
  headerNavSimpleLinkCss({ theme }),
  {
    display: `inline-flex`,
    textDecoration: `none`,
    cursor: `pointer`,
    fontSize: theme.fontSizes[2],

    "&:hover, &:focus": {
      textDecoration: `none`,
    },

    [theme.mediaQueries.desktop]: {
      display: `flex`,
      position: `relative`,
      flexDirection: `column`,
      fontSize: theme.fontSizes[1],
      alignItems: `flex-start`,
      padding: theme.space[4],
      paddingLeft: theme.space[11],
      paddingBottom: 0,
      transition: `background ${theme.transitions.speed.slow} ${theme.transitions.curve.default}`,
      transform: `none`,

      "&:hover, &:focus": {
        borderRadius: theme.radii[2],

        "> h2": {
          textDecoration: "underline",
        },

        "> h2, > h2:after": {
          color: theme.colors.purple[60],
        },

        "> h2:after": {
          // no `textDecoration: underline`
          display: "inline-block",
        },

        "> p": {
          color: theme.colors.blackFade[90],
          textDecoration: `none`,
        },
      },

      "&:after": {
        content: `none`,
      },
    },
  },
]

const headingCss = theme => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.blackFade[80],
  fontSize: theme.fontSizes[2],
  margin: 0,
  marginBottom: theme.space[1],
  fontWeight: theme.fontWeights.semiBold,

  "&:after": {
    content: `"›"`,
    color: theme.colors.blackFade[40],
    marginLeft: theme.space[2],
  },
})

const descriptionCss = theme => ({
  color: theme.colors.blackFade[70],
  fontSize: theme.fontSizes[1],
  margin: 0,
})

export function HeaderNavDropdownItem({
  data,
  blurHandler,
  setIsExpanded,
  isFirst,
  isLast,
  isFirstColored,
  bgColor,
  mobileNavIsOpen,
  setMobileNavIsOpen,
}) {
  const { text, url, description, Icon, colored, details = [] } = data
  return (
    <li
      css={theme =>
        rootCss({
          theme,
          bgColor,
          colored,
          isFirstColored,
          isLast,
          isFirst,
        })
      }
    >
      <Link
        css={theme => linkCss({ theme, bgColor })}
        {...getLinkTargetProp(url)}
        onBlur={isLast ? blurHandler : undefined}
        onClick={() =>
          mobileNavIsOpen ? setMobileNavIsOpen(false) : setIsExpanded(false)
        }
      >
        {Icon && <Icon css={theme => headerNavLinkIconCss({ theme })} />}
        <span css={theme => displayOnMobileOnly({ theme })}>{text}</span>
        <h2 css={theme => [headingCss(theme), displayOnDesktopOnly({ theme })]}>
          {text}
        </h2>
        {description && (
          <p
            css={theme => [
              descriptionCss(theme),
              displayOnDesktopOnly({ theme }),
            ]}
          >
            {description}
          </p>
        )}
      </Link>
      {!!details.length && <HeaderNavDropdownItemDetails data={details} />}
    </li>
  )
}
