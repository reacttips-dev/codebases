import React from "react"
import { contentPositionerCss } from "../shared/styles"
import { HeaderNav } from "./HeaderNav"
import { SearchWidget } from "./SearchWidget"
import MarketingBanner from "../marketing-banner"

const rootCss = ({
  theme,
  isAbsolute,
  isFullWidth,
  isFixed,
  mobileNavIsOpen,
}) => [
  contentPositionerCss({ theme, isFullWidth }),
  {
    display: `flex`,
    flexDirection: "column",
    position: `relative`,
    zIndex: theme.zIndices.toasts, // temporary overvalued z-index for fighting with elements in page
  },
  isAbsolute && {
    position: `absolute`,
    left: `50%`,
    transform: `translateX(-50%)`,
    top: 0,
  },
  isFixed && {
    [theme.mediaQueries.tablet]: {
      background: `rgba(255, 255, 255, .9)`,
      backdropFilter: "blur(8px)",
      position: `fixed`,
      left: `50%`,
      transform: `translateX(-50%)`,
      top: 0,
      // the following z-index relates to `sticky-responsive-sidebar` (and more)
      // TODO alter `gatsby-interface` to provide a variable for the needed value
      // looking at
      // - https://github.com/gatsby-inc/mansion/pull/11505 and
      // - https://gatsby-interface.netlify.app/?path=/story/theme-z-indices--page
      // this value needs to be less than the `theme.zIndices.a11yIndicators=10000`
      // because that conflicts with Gatsby develop's error modal (...)
      // TODO replace related values (there's more `1000` and `1000`) with tokens
      zIndex: theme.zIndices.modals + 1, // 1001, 1 higher than the sidebar
      bottom: mobileNavIsOpen ? 0 : null,
    },
  },
]

export function PageHeader({
  isAbsolute,
  isInverted,
  isFullWidth,
  isFixed,
  docType,
  location,
}) {
  const [mobileNavIsOpen, setMobileNavIsOpen] = React.useState(false)

  return (
    <div
      css={theme =>
        rootCss({ theme, isAbsolute, isFullWidth, isFixed, mobileNavIsOpen })
      }
    >
      <MarketingBanner
        isInverted={isInverted}
        location={location}
        isDocs={!!docType}
        mobileNavIsOpen={mobileNavIsOpen}
        setMobileNavIsOpen={setMobileNavIsOpen}
      />
      <header
        className="page-header"
        css={theme => ({
          paddingTop: theme.space[4],
          paddingBottom: theme.space[4],
          position: "relative",
        })}
      >
        <HeaderNav
          isInverted={isInverted}
          location={location}
          docType={docType}
          mobileNavIsOpen={mobileNavIsOpen}
          setMobileNavIsOpen={setMobileNavIsOpen}
        />

        {!mobileNavIsOpen && (
          <SearchWidget
            isInverted={isInverted}
            currentSection={docType ? `docs` : null}
          />
        )}
      </header>
    </div>
  )
}
