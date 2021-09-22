import React from "react"
import { LinkButton, Button } from "gatsby-interface"
import { featuredMobileItems, Identifiers } from "./data"

const rootCss = ({ theme, mobileNavIsOpen }) => ({
  background: theme.colors.white,
  border: `1px solid ${theme.colors.grey[30]}`,
  display: `flex`,
  justifyContent: `space-evenly`,
  flexWrap: `wrap`,
  alignItems: `center`,
  left: `100%`,
  opacity: mobileNavIsOpen ? 1 : 0,
  padding: `${theme.space[3]} ${theme.space[8]}`,
  position: `fixed`,
  top: 0,
  transform: `translateX(${mobileNavIsOpen ? `-100%` : `0`})`,
  transition: `transform ${theme.transitions.speed.slow} ${theme.transitions.curve.default}, opacity ${theme.transitions.speed.slow} ${theme.transitions.curve.fastOutLinearIn}`,
  width: `100%`,
  zIndex: 1,

  a: {
    marginTop: theme.space[3],
    marginBottom: theme.space[3],
  },

  button: {
    marginTop: theme.space[3],
    marginBottom: theme.space[3],
  },

  [theme.mediaQueries.desktop]: {
    display: `none`,
  },
})

const rootButtonCss = ({ theme, mobileNavIsOpen }) => [
  {
    display: `inline-flex`,
    width: theme.space[9],
    height: theme.space[9],
    position: `relative`,
    zIndex: 2,
    opacity: mobileNavIsOpen ? 0 : 1,
    transition: `opacity ${theme.transitions.speed.slow}`,
    order: 1,

    "&:focus": {
      background: `inherit`,
    },

    [theme.mediaQueries.desktop]: {
      display: `none`,
    },
  },
]

const hamburgerCss = ({ theme }) => [
  {
    width: 24,
    height: `3px`,
    borderRadius: theme.radii[1],
    background: theme.colors.black,
    margin: `10px 0`,
    position: `relative`,
    zIndex: 1000,

    "&:before, &:after": {
      borderRadius: theme.radii[1],
      height: `3px`,
      background: theme.colors.black,
      content: `" "`,
      position: `absolute`,
      right: 0,
    },

    ":before": {
      top: -7,
      width: 20,
    },

    ":after": {
      top: 7,
      width: 16,
    },
  },
]

const closeCss = theme => [
  ...hamburgerCss({ theme }),
  {
    background: `none`,

    "&:before, &:after": {
      top: 0,
      width: 24,
    },
    "&:before": {
      transform: `rotate(45deg)`,
    },
    "&:after": {
      transform: `rotate(-45deg)`,
    },
    "&:hover": {
      transform: `scale(1.2)`,
    },
  },
]

export function HeaderNavMobileActions({
  mobileNavIsOpen,
  setMobileNavIsOpen,
}) {
  const closeButton = React.useRef(null)
  const hamburgerButton = React.useRef(null)
  const [buttonClicked, setButtonClicked] = React.useState(false)

  // for accessibility we want to maintain focus on the button, but mobileNavIsOpen is triggered by other components, so we need to track whether the user clicked the close button directly

  const onClickHandler = isCloseButton => {
    setButtonClicked(isCloseButton)
    setMobileNavIsOpen(!mobileNavIsOpen)
  }

  React.useEffect(() => {
    if (mobileNavIsOpen) {
      closeButton.current.focus()
    } else if (buttonClicked) {
      hamburgerButton.current.focus()
    }
  }, [mobileNavIsOpen])

  const items = Object.values(featuredMobileItems)

  return (
    <>
      {mobileNavIsOpen ? (
        <div css={theme => [rootCss({ theme, mobileNavIsOpen })]}>
          <Button
            variant="GHOST"
            size="l"
            css={theme =>
              rootButtonCss({
                theme,
              })
            }
            ref={closeButton}
            onClick={() => onClickHandler(true)}
            aria-expanded={mobileNavIsOpen}
            aria-label={`${mobileNavIsOpen ? `Close` : `Open`} navigation`}
          >
            <span css={theme => closeCss(theme)} />
          </Button>
          {items.map(item => {
            const { url, identifier, text } = item
            const isGetStartedLink = identifier === Identifiers.GetStarted

            return (
              <LinkButton
                key={identifier}
                to={url}
                variant={isGetStartedLink ? `PRIMARY` : `GHOST`}
                size="M"
                onClick={() => mobileNavIsOpen && setMobileNavIsOpen(false)}
              >
                {text}
              </LinkButton>
            )
          })}
        </div>
      ) : (
        <Button
          variant="GHOST"
          size="l"
          css={theme =>
            rootButtonCss({
              theme,
              mobileNavIsOpen,
            })
          }
          ref={hamburgerButton}
          onClick={() => onClickHandler(false)}
          aria-expanded={mobileNavIsOpen}
          aria-label={`${mobileNavIsOpen ? `Close` : `Open`} navigation`}
        >
          <span css={theme => hamburgerCss({ theme })} />
        </Button>
      )}
    </>
  )
}
