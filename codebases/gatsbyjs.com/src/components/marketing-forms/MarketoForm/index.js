import * as React from "react"
import {
  inputStyles,
  textAreaStyles,
  labelStyles,
  selectStyles,
} from "../../form"
import { buttonStyles } from "../../core/button"
import { Text } from "gatsby-interface"
import useMarketo from "./hooks/useMarketo"

const formCss = theme => ({
  display: `flex`,
  flexDirection: `column`,
  alignItems: `start`,

  maxWidth: 420,
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",

  ".mktoForm": {
    width: `100%`,
    padding: 0,

    "& fieldset": {
      maxWidth: `none`,
      width: `100%`,
    },
    "& .mktoFormRow, & .mktoFormCol, & .mktoFieldWrap": {
      display: `flex`,
      flexDirection: `column`,
    },
    "& .mktoFormRow": {
      marginBottom: theme.space[6],
    },
    "& .mktoGutter, & .mktoOffset": {
      display: `none`,
    },
    "& .mktoRequiredField .mktoAsterix": {
      color: theme.colors.blackFade[50],
    },
    "& .mktoRequiredField .mktoInvalid": {
      borderColor: theme.colors.warning,
    },
    "& label": {
      ...labelStyles(theme),
      fontWeight: theme.fontWeights.bold,
      marginBottom: theme.space[2],
      width: `fit-content!important`,
    },
    "& .mktoError": {
      position: `static`,
      marginTop: theme.space[2],
    },
    "& .mktoError .mktoErrorMsg": {
      backgroundColor: `inherit`,
      backgroundImage: `inherit`,
      boxShadow: `none`,
      textShadow: `none`,
      border: `none`,
      color: `inherit`,
      margin: 0,
      padding: 0,
    },
    "& .mktoError .mktoErrorArrowWrap": {
      display: `none!important`,
    },

    "& .mktoField": {
      zIndex: 10,
      display: `block`,
    },
    ".mktoRequired": {
      color: theme.colors.grey[40],
    },
    '& input[type="text"], & input[type="email"], & input[type="tel"], & input[type=url], & textarea.mktoField, & select.mktoField': {
      ...inputStyles(theme),
      borderRadius: theme.radii[2],
      fontSize: theme.fontSizes[2],
      minHeight: `40px`,
      position: `relative`,
      width: `100% !important`,
    },

    "& select": {
      ...selectStyles(theme),
      width: `100% !important`,
      color: `${theme.colors.blackFade[80]}!important`,
    },
    '& input[type="radio"]': {
      width: `auto`,
      marginRight: 8,
    },
    "& ul.inputs-list": {
      listStyleType: `none`,
      margin: 0,
    },
    "& .mktoButtonWrap .mktoButton[type='submit']": {
      ...buttonStyles(theme).primary[`&&`],
      alignItems: `center`,
      backgroundColor: `none`,
      backgroundImage: `none`,
      borderColor: `none`,
      cursor: `pointer`,
      display: `flex`,
      justifyContent: `center`,
      padding: `${theme.space[3]} ${theme.space[5]}`,
      fontSize: `${theme.fontSizes[2]} !important`,
      fontFamily: theme.fonts.body,
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

  "& label.hs-form-radio-display, & label.hs-form-checkbox-display": {
    fontSize: theme.fontSizes[2],
    color: theme.colors.grey[90],
    display: `inline-flex`,
    alignItems: `baseline`,
    margin: 0,
    "& .mktoInput": {
      marginRight: theme.space[3],
      flexShrink: 0,
    },
  },
})

/*
  By default, Marketo forms redirect to another page on submit (the page to redirect to is configured in Marketo).However, if an callback is passed into the hook, then the callback will be run instead. This is typically used when you want to hide the form and display a message, rather than redirect
*/
const showMessageOnSuccess = setShowMessage => form => {
  form.onSuccess(function() {
    setShowMessage(true)
    // Return false to prevent the submission handler continuing with its own processing
    return false
  })
}

function MarketoForm({
  className,
  formId,
  messageOnSubmit,
  wrapperCss,
  ...props
}) {
  const [showMessage, setShowMessage] = React.useState(false)
  const onSubmitCallback =
    messageOnSubmit !== undefined ? showMessageOnSuccess(setShowMessage) : null
  useMarketo({ formId, callback: onSubmitCallback })

  return (
    <div
      className={className}
      css={theme => [formCss(theme), wrapperCss]}
      {...props}
    >
      {showMessage ? (
        <Text as="div" dangerouslySetInnerHTML={{ __html: messageOnSubmit }} />
      ) : (
        <form id={`mktoForm_${formId}`} />
      )}
    </div>
  )
}

export default MarketoForm
