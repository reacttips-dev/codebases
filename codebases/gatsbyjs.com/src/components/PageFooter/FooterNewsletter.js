import React from "react"
import { MdSend } from "react-icons/md"
import { visuallyHiddenCss } from "../shared/styles"
import MarketoForm from "../marketing-forms/MarketoForm"

const rootCss = _theme => ({
  width: `16rem`,
  display: `flex`,
  justifyContent: `flex-end`,
  position: `relative`,
})

const formCss = theme => ({
  display: `grid`,
  gridTemplateAreas: `
  "label label"
  "input button"
  `,
  margin: 0,
  marginTop: theme.space[7],
  position: `relative`,

  [theme.mediaQueries.tablet]: {
    marginTop: 0,
  },
})

// ensure tap target size is big enough to pass Lighthouse tests
// https://web.dev/tap-targets/?utm_source=lighthouse&utm_medium=devtools#how-the-lighthouse-tap-targets-audit-fails
const labelCss = ({ theme, isInverted }) => [
  {
    gridArea: `label`,
    color: theme.colors.grey[50],
    fontSize: theme.fontSizes[0],
    marginBottom: theme.space[3],

    span: {
      display: `none`,
    },
  },
  isInverted && {
    color: theme.colors.whiteFade[60],

    "&::placeholder": {
      color: theme.colors.whiteFade[40],
    },
  },
]

const inputCss = ({ theme, isInverted }) => [
  {
    span: {
      display: `none`,
    },
    gridArea: `input`,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: theme.space[9],
    padding: `0 ${theme.space[3]}`,
    background: theme.colors.blackFade[5],
    border: 0,

    "&:focus": {
      boxShadow: `0 0 0 2px ${theme.colors.red[10]}`,
    },

    "&::placeholder": {
      color: theme.colors.grey[50],
    },

    [theme.mediaQueries.tablet]: {
      fontSize: theme.fontSizes[1],
      height: theme.space[8],
    },
  },
  isInverted && {
    background: theme.colors.whiteFade[10],
    color: theme.colors.white,

    "&::placeholder": {
      color: theme.colors.whiteFade[40],
    },
  },
]

const submitCss = theme => ({
  alignItems: "center",
  display: "inline-flex",
  justifyContent: "center",
  borderRadius: "4px",
  boxSizing: "border-box",
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  gridArea: `button`,
  height: theme.space[9],
  width: theme.space[9],
  padding: 0,
  flexShrink: 0,
  background: theme.colors.purple[60],
  border: theme.colors.purple[60],
  color: theme.colors.white,

  svg: {
    width: theme.space[6],
    height: `auto`,
  },

  [theme.mediaQueries.tablet]: {
    height: theme.space[8],
    width: theme.space[8],
  },
})

const messageCss = ({ theme, isSuccess, isFailure }) => [
  {
    background: `transparent`,
    color: theme.colors.red[50],
    display: `flex`,
    fontSize: theme.fontSizes[0],
    lineHeight: theme.lineHeights.dense,
    margin: 0,
    position: `absolute`,
    top: `4rem`,
    overflowWrap: `anywhere`,
    width: `100%`,
  },
  isSuccess && {
    background: theme.colors.green[10],
    color: theme.colors.black,
  },
  isFailure && {
    bottom: `-${theme.space[7]}`,
  },
]

export function FooterNewsletter({ isInverted, hideLabel }) {
  const [email, setEmail] = React.useState(``)
  const [successMsg, setSuccessMsg] = React.useState(null)
  const [errorMsg, setErrorMsg] = React.useState(null)
  const emailInput = React.useRef(null)

  // TODO: Look into getting the formId from Contentful
  const marketoFormId = 1139

  React.useEffect(() => {
    validateEmail()
  }, [email])

  const validateEmail = () => {
    const isValid = emailInput.current.checkValidity()
    if (email && !isValid) {
      setErrorMsg(`Please provide a valid email address.`)
      setSuccessMsg(null)
    } else {
      setErrorMsg(null)
    }
    return isValid
  }

  const handleSubmit = async evt => {
    evt.preventDefault()
    if (validateEmail()) {
      if (typeof window !== "undefined") {
        window.MktoForms2.getForm(marketoFormId)
          .vals({ Email: email })
          .onSuccess(() => {
            const localSuccessMsg =
              "Success! You have been subscribed to the Gatsby newsletter."
            setSuccessMsg(localSuccessMsg)
            setEmail(``)
            return false
          })
          .submit()
      }
    }
  }

  return (
    <>
      <div css={rootCss}>
        <form css={formCss} onSubmit={handleSubmit} noValidate>
          <label css={theme => labelCss({ theme, isInverted })} htmlFor="email">
            {hideLabel ? false : "Subscribe to our newsletter"}
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.xyz"
            value={email}
            ref={emailInput}
            onChange={e => {
              setEmail(e.target.value)
            }}
            css={theme => inputCss({ theme, isInverted })}
          />
          {errorMsg || successMsg ? (
            <p
              dangerouslySetInnerHTML={{ __html: errorMsg || successMsg }}
              css={theme =>
                messageCss({
                  theme,
                  isSuccess: successMsg,
                  isFailure: errorMsg,
                })
              }
            />
          ) : null}
          <button css={submitCss} size="S" type="submit">
            <MdSend /> <span css={visuallyHiddenCss}>Subscribe</span>
          </button>
        </form>
        <MarketoForm formId={marketoFormId} css={{ display: `none` }} />
      </div>
    </>
  )
}
