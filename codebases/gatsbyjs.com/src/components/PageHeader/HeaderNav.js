import React from "react"
import { Link } from "gatsby"
import { Global } from "@emotion/core"

import { mainSection, docsSection, sideSection, sideDocsSection } from "./data"
import { HeaderNavSection } from "./HeaderNavSection"
import { GatsbyLogo } from "../shared/logos/GatsbyLogo"
import { HeaderNavMobileActions } from "./HeaderNavMobileActions"
import { debounce } from "../shared/helpers"

const rootCss = _theme => ({
  display: `flex`,
  width: `100%`,
  justifyContent: `space-between`,

  // reset ul and li styles for all list nested in dropdown
  ul: {
    margin: 0,
    listStyle: `none`,
  },
  li: {
    margin: 0,
  },
})

const positionCss = ({ theme, mobileNavIsOpen }) => ({
  background: theme.colors.white,
  bottom: 0,
  display: `flex`,
  flexGrow: 1,
  left: `100%`,
  paddingTop: `7rem`,
  paddingBottom: theme.space[10],
  position: `fixed`,
  top: 0,
  transform: `translateX(${mobileNavIsOpen ? `-100%` : `0`})`,
  transition: `transform ${theme.transitions.speed.slow} ${theme.transitions.curve.default}`,
  width: `100%`,
  overflowY: `auto`,

  [theme.mediaQueries.desktop]: {
    background: `none`,
    display: `flex`,
    justifyContent: `flex-start`,
    position: `relative`,
    bottom: `auto`,
    top: `0.25rem`, // push things down a bit to line up with the logo wordmark
    left: `auto`,
    padding: 0,
    transform: `none`,
    transition: `none`,
    overflowY: `visible`,
  },
})

const listCss = ({ theme, mobileNavIsOpen }) => ({
  display: `flex`,
  flexDirection: `column`,
  width: `100%`,
  position: `relative`,
  transition: `opacity ${theme.transitions.speed.slow} ${theme.transitions.curve.fastOutLinearIn}`,
  opacity: mobileNavIsOpen ? 1 : 0,

  [theme.mediaQueries.desktop]: {
    flexWrap: `wrap`,
    flexDirection: `row`,
    justifyContent: `flex-end`,
    alignItems: `center`,
    opacity: 1,

    "& > li:last-of-type": {
      marginLeft: `auto`,
    },
  },
})

const logoLinkCss = theme => ({
  alignSelf: `flex-start`,
  display: `flex`,
  flexShrink: 0,
  padding: `${theme.space[3]} 0.375rem`, // we add this padding for nice looking focus outline; the extra 2px vertical padding are to keep the nav height consistent
  transform: `translateX(-0.375rem)`, // and this nivelate the horizontal positioning
  textDecoration: `none`,
  fontWeight: 600,
  alignItems: `center`,
})

const docsLogoLinkCss = theme => ({
  ...logoLinkCss(theme),
  borderRadius: theme.radii[2],
  "&:hover": {
    background: theme.colors.purple[10],
  },
})

export function HeaderNav({
  isInverted,
  location,
  mobileNavIsOpen,
  setMobileNavIsOpen,
  docType,
}) {
  const data = [mainSection, sideSection]
  const [windowWidth, setWindowWidth] = React.useState(0)

  const debouncedWindowMeasure = React.useCallback(() =>
    debounce(() => {
      setWindowWidth(window.innerWidth || document.documentElement.clientWidth)
    }, 250)
  )

  React.useEffect(() => {
    setWindowWidth(window.innerWidth || document.documentElement.clientWidth)

    const measure = debouncedWindowMeasure()
    window.addEventListener("resize", measure)

    return () => {
      window.removeEventListener("resize", measure)
    }
  }, [])

  if (!data || !data.length) {
    return null
  }

  const docsSections = [docsSection, sideDocsSection]

  return (
    <nav className="navigation" css={rootCss}>
      <Global
        styles={_theme => ({
          body: {
            position: mobileNavIsOpen ? `fixed` : undefined,
            maxWidth: mobileNavIsOpen ? `100%` : undefined,
          },
        })}
      />
      <div css={{ display: "flex" }}>
        <Link
          to="/"
          css={theme => [
            docType ? docsLogoLinkCss(theme) : logoLinkCss(theme),
            { marginRight: docType ? null : theme.space[6] },
          ]}
          aria-label="Link to home"
        >
          <GatsbyLogo
            isInverted={isInverted}
            height="1.5rem"
            width="5.6875rem"
          />
        </Link>
        {(docType ||
          (location &&
            typeof location === "string" &&
            location.startsWith(`/blog`))) && (
          <Link
            to={docType ? "/docs/" : "/blog"}
            css={theme => [docsLogoLinkCss(theme), {}]}
            aria-label={docType ? "Link to Docs home" : "Link to Blog home"}
          >
            <span
              css={theme => ({
                width: 16,
                height: 1,
                transform: `rotate(-60deg)`,
                display: `inline-block`,
                marginLeft: `-12px`,
                background: theme.colors.purple[30],
              })}
            />
            <span css={{ marginTop: `1px`, marginBottom: `-1px` }}>
              {`${docType ? `docs` : `blog`} `}
            </span>
          </Link>
        )}
      </div>

      <HeaderNavMobileActions
        data={data}
        mobileNavIsOpen={mobileNavIsOpen}
        setMobileNavIsOpen={setMobileNavIsOpen}
      />

      <div css={theme => positionCss({ theme, mobileNavIsOpen })}>
        <ul css={theme => listCss({ theme, mobileNavIsOpen })}>
          {docType
            ? docsSections.map((section, idx) => (
                <HeaderNavSection
                  key={idx}
                  data={section}
                  isInverted={isInverted}
                  mobileNavIsOpen={mobileNavIsOpen}
                  setMobileNavIsOpen={setMobileNavIsOpen}
                  location={location}
                  windowWidth={windowWidth}
                  activeIndex={
                    !idx && docType.navBarIndex ? docType.navBarIndex - 1 : null
                  }
                />
              ))
            : data.map((section, idx) => (
                <HeaderNavSection
                  key={idx}
                  data={section}
                  isInverted={isInverted}
                  mobileNavIsOpen={mobileNavIsOpen}
                  setMobileNavIsOpen={setMobileNavIsOpen}
                  location={location}
                  windowWidth={windowWidth}
                />
              ))}
        </ul>
      </div>
    </nav>
  )
}
