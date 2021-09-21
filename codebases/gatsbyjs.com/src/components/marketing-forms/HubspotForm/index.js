import React, { Component } from "react"
import PropTypes from "prop-types"
import HubspotForm from "react-hubspot-form"
import {
  inputStyles,
  textAreaStyles,
  labelStyles,
  errorLabelStyles,
  selectStyles,
} from "../../form"
import { buttonStyles } from "../../core/button"

class GatsbyHubspotForm extends Component {
  static propTypes = {
    singleColumn: PropTypes.bool,
    wrapperCss: PropTypes.object,
  }
  render() {
    const { singleColumn, title, subtitle, wrapperCss, className } = this.props

    return (
      <div
        className={className}
        css={theme => ({
          ".hs-form": {
            "& fieldset": {
              maxWidth: `none`,
              width: `100%`,
            },
            "& label": labelStyles(theme),
            "& .hs-error-msgs label": errorLabelStyles(theme),
            "& .hs-form-field": {
              marginBottom: 20,
              border: `none`,
              zIndex: 10,
              display: `block`,
            },
            ".hs-form-required": {
              color: theme.colors.grey[40],
            },
            '& input[type="text"], & input[type="email"], & input[type="tel"], & textarea, & select': {
              ...inputStyles(theme),
              position: `relative`,
              fontSize: theme.fontSizes[2],
              minHeight: `40px`,
            },
            "& input.error": {
              borderColor: theme.colors.warning,
              ":focus": {
                borderColor: theme.colors.gatsby,
              },
            },
            "& select": {
              ...selectStyles(theme),
              width: `100% !important`,
            },
            '& input[type="radio"]': {
              width: `auto`,
              marginRight: 8,
            },
            "& ul.inputs-list": {
              listStyleType: `none`,
              margin: 0,
            },
            "& .hs-button.primary": {
              ...buttonStyles(theme).primary[`&&`],
              alignItems: `center`,
              cursor: `pointer`,
              display: `flex`,
              justifyContent: `center`,
              padding: `${theme.space[3]} ${theme.space[5]}`,
              fontSize: `${theme.fontSizes[2]} !important`,
              fontFamily: `${theme.fonts.heading}`,

              ":hover": {
                fontFamily: `${theme.fonts.heading}`,
              },
            },
            "& textarea": {
              ...textAreaStyles(theme),
              position: `relative`,
              width: `100% !important`,
            },
          },
          ".form-columns-1 .input, .form-columns-2 .input": {
            marginRight: `${theme.space[5]} !important`,
          },
          "& .field": {
            width: singleColumn ? `100% !important` : `inherit`,
          },
          "& label.hs-form-radio-display, & label.hs-form-checkbox-display": {
            fontSize: theme.fontSizes[2],
            color: theme.colors.grey[90],
            display: `inline-flex`,
            alignItems: `baseline`,
            margin: 0,
            "& .hs-input": {
              marginRight: theme.space[3],
              flexShrink: 0,
            },
          },
          ...wrapperCss,
        })}
      >
        {title && (
          <h3 css={{ "&&": { marginTop: 0, marginBottom: 0 } }}>{title}</h3>
        )}
        {subtitle && (
          <span css={theme => ({ marginBottom: theme.space[3] })}>
            {subtitle}
          </span>
        )}
        <HubspotForm
          {...this.props}
          loading={<div>Loading...</div>}
          {...{ css: `` }}
        />
      </div>
    )
  }
}

export default GatsbyHubspotForm
