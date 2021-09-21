import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { hexToRGBA } from "gatsby-interface"

import { primaryButtonDefaultStyles } from "../../utils/styles"

const defaultStyles = theme => ({
  ...primaryButtonDefaultStyles(theme),
  alignItems: `center`,
  // the 1px transparent border hotfixes a Google Chrome rendering
  // quirk, see https://github.com/gatsby-inc/mansion/pull/1448#issue-240448071
  // for a screenshot — the background gradient is not fully drawn,
  // resulting in a black area at the right of the button
  border: `1px solid transparent`,
  borderRadius: theme.radii[3],
  color: theme.colors.white,
  display: `inline-flex`,
  fontFamily: theme.fonts.heading,
  fontWeight: `bold`,
  padding: `${theme.space[4]} ${theme.space[5]}`,
  textAlign: `center`,
  textDecoration: `none`,
  transition: `all ${theme.transitions.speed.default} ${theme.transitions.curve.default}`,
  WebkitFontSmoothing: `antialiased`,
  width: `100%`,
  [theme.mediaQueries.phablet]: {
    fontSize: theme.fontSizes[4],
    width: `auto`,
  },
  ":hover, :focus": {
    background: theme.colors.purple[90],
    boxShadow: `0 0 0 0.2rem ${hexToRGBA(theme.colors.lilac, 0.25, true)}`,
  },
})

const primaryStyle = theme => ({
  "&&": {
    ...defaultStyles(theme),
  },
})

const secondaryStyle = theme => ({
  "&&": {
    ...defaultStyles(theme),
    color: theme.colors.purple[90],
    fontWeight: `normal`,
    background: theme.colors.white,
    ":hover, :focus": {
      color: theme.colors.gatsby,
      background: theme.colors.white,
      boxShadow: `0 0 0 0.2rem ${hexToRGBA(theme.colors.lilac, 0.25, true)}`,
    },
  },
})

const accentStyle = theme => ({
  "&&": {
    ...defaultStyles(theme),
    background: theme.colors.yellow[50],
    color: theme.colors.blackFade[80],
    fontWeight: `normal`,
    "&&:hover, &&:focus": {
      background: theme.colors.yellow[60],
      boxShadow: `0 0 0 0.2rem ${hexToRGBA(
        theme.colors.yellow[50],
        0.25,
        true
      )}`,
    },
  },
})

export const buttonStyles = theme => ({
  primary: primaryStyle(theme),
  secondary: secondaryStyle(theme),
  accent: accentStyle(theme),
})

const Href = ({ to, children, buttonStyle }) => {
  const buttonCSS = theme => {
    return buttonStyle
      ? buttonStyles(theme)[buttonStyle]
      : buttonStyles(theme).primary
  }

  return (
    <a className="button" css={theme => buttonCSS(theme)} href={to}>
      {buttonStyle !== `secondary` && <PrimaryButton>{children}</PrimaryButton>}
      {buttonStyle === `secondary` && <Fragment>{children}</Fragment>}
    </a>
  )
}

Href.propTypes = {
  to: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string,
}

const PrimaryButton = ({ children }) => <Fragment>{children}</Fragment>

// @todo clean up this mess
export const Button = ({ ariaLabel, to, children, buttonStyle, onClick }) => {
  const isExternal = to && to.indexOf(`http`) === 0
  const buttonCSS = theme => {
    return buttonStyle
      ? buttonStyles(theme)[buttonStyle]
      : buttonStyles(theme).primary
  }

  return (
    <Fragment>
      {!isExternal && !onClick && (
        <Link
          className="button"
          css={theme => buttonCSS(theme)}
          to={to}
          aria-label={ariaLabel}
        >
          {buttonStyle !== `secondary` && (
            <PrimaryButton>{children}</PrimaryButton>
          )}
          {buttonStyle === `secondary` && [children]}
        </Link>
      )}
      {!isExternal && onClick && (
        <button
          className="button"
          css={theme => buttonCSS(theme)}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {buttonStyle !== `secondary` && (
            <PrimaryButton>{children}</PrimaryButton>
          )}
          {buttonStyle === `secondary` && [children]}
        </button>
      )}
      {isExternal && (
        <Href to={to} buttonStyle={buttonStyle} aria-label={ariaLabel}>
          {children}
        </Href>
      )}
    </Fragment>
  )
}

Button.propTypes = {
  ariaLabel: PropTypes.string,
  to: PropTypes.string,
  buttonStyle: PropTypes.string,
  onClick: PropTypes.func,
}

export const ButtonGroup = ({ children, ...rest }) => (
  <div
    className="button-group"
    css={theme => ({
      marginTop: theme.space[10],
      marginBottom: theme.space[10],
      display: `flex`,
      flexDirection: `column`,
      justifyContent: `center`,
      "&&": {
        "& .button": {
          marginLeft: `0`,
          marginRight: `0`,
          marginBottom: theme.space[7],
        },
        [theme.mediaQueries.tablet]: {
          flexDirection: `row`,
          "& .button": {
            marginRight: theme.space[4],
          },
        },
      },
    })}
    {...rest}
  >
    {children}
  </div>
)

ButtonGroup.propTypes = {
  customStyles: PropTypes.object,
}
