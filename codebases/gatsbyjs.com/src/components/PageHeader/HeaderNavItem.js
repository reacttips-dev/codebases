import React from "react"
import { MdExpandMore } from "react-icons/md"
import { Button, LinkButton, Link, Heading } from "gatsby-interface"

import { HeaderNavDropdown } from "./HeaderNavDropdown"
import { headerNavSimpleLinkCss, headerNavLinkIconCss } from "../shared/styles"
import { Identifiers, featuredMobileItems } from "./data"
import { displayOnMobileOnly, displayOnDesktopOnly } from "../shared/styles"

const rootCss = ({ theme, identifier }) => [
  {
    margin: 0,
    position: `relative`,
    padding: `${theme.space[5]} 0`,

    "&:not(:last-of-type)": {
      "&:after": {
        background: theme.colors.grey[20],
        bottom: 0,
        content: `""`,
        left: theme.space[7],
        height: `1px`,
        position: `absolute`,
        right: theme.space[7],
      },
    },

    [theme.mediaQueries.desktop]: {
      padding: 0,

      "&:not(:last-of-type)": {
        "&:after": {
          content: `none`,
        },
      },
    },
  },
  identifier === `cloud` && {
    padding: 0,
  },
]

const innerCss = ({ theme, identifier }) => [
  {
    padding: `${theme.space[2]} ${theme.space[8]}`,

    [theme.mediaQueries.desktop]: {
      padding: 0,
    },
  },
  identifier === `cloud` && {
    background: theme.colors.blue[5],
    padding: theme.space[8],

    [theme.mediaQueries.desktop]: {
      padding: 0,
      background: `none`,
    },
  },
]

const linkCss = ({ theme, isInverted, isCtaLink }) => [
  {
    color: theme.colors.grey[70],
  },
  isInverted && {
    color: theme.colors.white,

    "&:hover": {
      background: `rgba(255, 255, 255, 0.05)`, //
      color: theme.colors.white,
    },
  },
  isCtaLink && {
    color: theme.colors.white,
    marginLeft: theme.space[4],
  },
]

const mobileItemHeadingCss = theme => ({
  color: theme.colors.grey[50],
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[0],
  marginBottom: theme.space[5],
  textTransform: `uppercase`,
  textDecoration: `none`,

  "&:hover, &:focus": {
    textDecoration: `none`,
  },
})

const mobileItemHeadingAsLinkCss = theme => [
  headerNavSimpleLinkCss({ theme }),
  {
    fontSize: theme.fontSizes[2],
    display: `inline-flex`,
  },
]

export function HeaderNavItem({
  data = [],
  isInverted,
  mobileNavIsOpen,
  setMobileNavIsOpen,
  location,
  windowWidth,
  active,
  buttonSize = "M",
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const rootRef = React.useRef()

  const { pathname } = location || {}
  const {
    text,
    url,
    dropdown,
    identifier,
    Icon,
    highlightColor,
    showIconOnDesktop = false,
  } = data
  const { items = [], bgColor, dropdownWidth } = dropdown || {}

  const mouseLeaveHandler = () => setIsExpanded(false)
  const mouseEnterHandler = () => setIsExpanded(true)

  const clickHandler = () => setIsExpanded(!isExpanded)
  const blurHandler = () => {
    setTimeout(() => {
      const currentlyFocusedElement = document.activeElement
      const thisItem = rootRef.current

      if (thisItem && !thisItem.contains(currentlyFocusedElement)) {
        setIsExpanded(false)
      }
    }, 0)
  }

  const specialItemsOnMobile = Object.keys(featuredMobileItems)
  const isHiddenOnMobile =
    identifier && specialItemsOnMobile.includes(identifier)

  const isValidItemWithDropdown = !!items.length && !url
  const isValidLinkItem = url && !items.length
  const isCtaLink = identifier === Identifiers.GetStarted

  if (isCtaLink && pathname === url) {
    return null
  }

  return (
    <li
      ref={rootRef}
      css={theme => [
        rootCss({ theme, identifier }),
        isHiddenOnMobile && displayOnDesktopOnly({ theme }),
      ]}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
    >
      {(() => {
        if (isValidItemWithDropdown) {
          return (
            <div css={theme => innerCss({ theme, identifier })}>
              <Heading
                as="h3"
                css={theme => [
                  mobileItemHeadingCss(theme),
                  displayOnMobileOnly({ theme }),
                ]}
              >
                {text}
              </Heading>
              <Button
                size="M"
                variant="GHOST"
                rightIcon={<MdExpandMore />}
                onClick={clickHandler}
                aria-expanded={isExpanded}
                aria-controls={`${text}-dropdown`}
                onBlur={blurHandler}
                css={theme => [
                  linkCss({ theme, isInverted }),
                  displayOnDesktopOnly({ theme, as: `inline-flex` }),
                ]}
              >
                {text}
              </Button>
              <HeaderNavDropdown
                id={`${text.replace(/\s/gi, "-")}-dropdown`}
                items={items}
                bgColor={bgColor}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                blurHandler={blurHandler}
                mobileNavIsOpen={mobileNavIsOpen}
                setMobileNavIsOpen={setMobileNavIsOpen}
                windowWidth={windowWidth}
                dropdownWidth={dropdownWidth}
              />
            </div>
          )
        } else if (isValidLinkItem) {
          return (
            <React.Fragment>
              <div
                css={theme => [
                  innerCss({ theme }),
                  displayOnMobileOnly({ theme }),
                ]}
              >
                <Link
                  to={url}
                  onClick={() => mobileNavIsOpen && setMobileNavIsOpen(false)}
                  css={theme => mobileItemHeadingAsLinkCss(theme)}
                >
                  {Icon && (
                    <Icon css={theme => headerNavLinkIconCss({ theme })} />
                  )}{" "}
                  {text}
                </Link>
              </div>

              <LinkButton
                to={url}
                size={buttonSize}
                variant={isCtaLink ? `PRIMARY` : `GHOST`}
                className={active ? "active" : null}
                css={theme => [
                  linkCss({ theme, isInverted, isCtaLink }),
                  displayOnDesktopOnly({ theme, as: `inline-flex` }),
                  highlightColor ? highlightColor({ theme }) : null,
                ]}
              >
                {showIconOnDesktop && Icon && <Icon height={24} width={24} />}{" "}
                {text}
              </LinkButton>
            </React.Fragment>
          )
        } else {
          console.warn(
            `You can't set both: 'url' and 'dropdown' for the particular HeaderNavItem. The item could only works as one of the two types:
  - a regular link,
  - a dropdown toggle button`
          )
          return null
        }
      })()}
    </li>
  )
}
