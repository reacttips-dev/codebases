import React from "react"
import { MdSearch, MdClose } from "react-icons/md"
import { Button } from "gatsby-interface"
import SearchForm from "./search-form"
import { visuallyHiddenCss } from "../../shared/styles"

const rootCss = ({ theme, formIsVisible }) => [
  {
    display: `flex`,
    flexDirection: `row-reverse`,
    position: `absolute`,
    right: theme.space[9],
    bottom: theme.space[4],
    minHeight: theme.space[9],

    [theme.mediaQueries.desktop]: {
      right: 0,
      left: `auto`,
      bottom: theme.space[5],
      minHeight: theme.space[8],
    },
  },
  formIsVisible && {
    left: theme.space[8],

    [theme.mediaQueries.desktop]: {
      left: `auto`,
    },
  },
]

const btnCss = ({ theme, isInverted }) => [
  {
    paddingLeft: theme.space[3],
    paddingRight: theme.space[3],

    svg: {
      transform: `translateY(10%) scale(2)`,
      fill: theme.colors.grey[60],
    },

    "&:hover:not([disabled]) svg, &:focus:not([disabled]) svg": {
      animation: `none`,
    },
  },

  isInverted && {
    svg: {
      fill: theme.colors.white,
    },
  },
]

const formCss = ({ theme, formIsVisible }) => [
  {
    // Remove the border to fix things for updating to Docsearch v3
    // Not sure if we can remove this and related components altogether?!
    // ref. https://github.com/gatsby-inc/mansion/pull/10152#issuecomment-738792194
    //
    // border: `1px solid ${theme.colors.white}`,
    borderRadius: theme.radii[3],
    display: `none`,
    marginRight: theme.space[2],
    width: `100%`,

    [theme.mediaQueries.desktop]: {
      width: `24rem`,
    },

    input: {
      width: `100%`,
    },
  },
  formIsVisible && {
    display: `block`,
  },
]

export function SearchWidget({ isInverted, currentSection }) {
  const [formIsVisible, setFormIsVisible] = React.useState(false)
  const [shouldLoadJS, setShouldLoadJS] = React.useState(false)
  // TODO ask Greg why we deleted theme.colors.modes here

  return (
    <div css={theme => rootCss({ theme, formIsVisible })}>
      <Button
        variant="GHOST"
        size="M"
        onClick={() => setFormIsVisible(!formIsVisible)}
        css={theme => btnCss({ theme, isInverted })}
        aria-expanded={formIsVisible}
        onFocus={() => setShouldLoadJS(true)}
        onMouseOver={() => setShouldLoadJS(true)}
      >
        <span css={visuallyHiddenCss}>
          {formIsVisible ? "Hide Search Form" : "Show Search Form"}
        </span>
        {formIsVisible ? <MdClose /> : <MdSearch />}
      </Button>
      <div css={theme => formCss({ theme, formIsVisible })}>
        <SearchForm
          isVisible={formIsVisible}
          shouldLoadJS={shouldLoadJS}
          currentSection={currentSection}
          setClosed={() => setFormIsVisible(false)}
        />
      </div>
    </div>
  )
}
