import React from "react"
import { Link } from "gatsby-interface"
import Img from "gatsby-image"

const TRANSITION_TIME = 500

const rootCss = ({ theme, activeItem }) => ({
  alignItems: `center`,
  display: `flex`,
  justifyContent: `center`,
  margin: 0,
  padding: `${theme.space[10]} ${theme.space[5]}`,
  transform: `translateX(-${activeItem * 100}%)`,
  width: `100%`,
  flexShrink: 0,
  transition: `transform ${TRANSITION_TIME}ms ${theme.transitions.curve.default}`,
})

const innerCss = ({ isActive }) => [
  {
    alignItems: `center`,
    display: `flex`,
    flexDirection: `column`,
    maxWidth: `42rem`,
    visibility: `hidden`,
  },
  isActive && {
    visibility: `visible`,
  },
]

const quoteCss = theme => ({
  border: 0,
  color: theme.colors.grey[90],
  fontSize: theme.fontSizes[2],
  margin: 0,
  padding: 0,
  textAlign: `center`,

  [theme.mediaQueries.desktop]: {
    fontSize: theme.fontSizes[4],
  },
})

const logoCss = theme => ({
  marginBottom: theme.space[8],
  opacity: 0.8,
})

const footerCss = theme => ({
  alignItems: `center`,
  display: `flex`,
  justifyContent: `center`,
  marginTop: theme.space[9],
})

const authorCss = ({ theme, hasPhoto }) => [
  {
    alignItems: `center`,
    color: theme.colors.grey[70],
    display: `flex`,
    flexDirection: `column`,
    fontSize: theme.fontSizes[3],
    fontWeight: theme.fontWeights.semiBold,
    maxWidth: `20rem`,
  },
  hasPhoto && {
    alignItems: `flex-start`,
  },
]

const noteCss = theme => ({
  fontSize: theme.fontSizes[1],
  fontWeight: theme.fontWeights.body,
  color: theme.colors.grey[50],
  lineHeight: theme.lineHeights.dense,
  textAlign: `left`,

  "&:first-of-type": {
    marginTop: theme.space[2],
  },
})

const photoCss = theme => ({
  marginRight: theme.space[5],
})

export function Testimonial({ data = {}, activeItem, position }) {
  const {
    quote: rawQuote,
    author,
    jobTitle,
    company,
    url,
    photo: rawPhoto,
    logo: rawLogo,
  } = data
  const quote = rawQuote?.childMarkdownRemark?.html
  const photo = rawPhoto?.fixed
  const logo = rawLogo?.file

  const [isActive, setIsActive] = React.useState()

  React.useEffect(() => {
    let timeout

    if (position === activeItem) {
      setIsActive(true)
    } else {
      timeout = setTimeout(() => {
        // we don't want the item to disapear imidiately after it's deactivated,
        // so we make it inivisbile only after the transition time, when it's already hidden
        // by container overflow: hidden
        setIsActive(false)
      }, TRANSITION_TIME)
    }

    return () => timeout && clearTimeout(timeout)
  }, [activeItem, position])
  return (
    <li css={theme => rootCss({ theme, isActive, activeItem })}>
      <div css={theme => innerCss({ theme, isActive })}>
        {logo && (
          <img
            src={logo.url}
            {...logo.details.image}
            alt=""
            loading="lazy"
            css={logoCss}
          />
        )}
        <blockquote css={quoteCss}>
          <div dangerouslySetInnerHTML={{ __html: quote }} />
          <footer css={footerCss}>
            {photo && (
              <span>
                <Img fixed={photo} alt={author} css={photoCss} />
              </span>
            )}
            <div css={theme => authorCss({ theme, hasPhoto: !!photo })}>
              {url ? (
                <Link href={url} variant="SIMPLE">
                  {author}
                </Link>
              ) : (
                author
              )}
              {jobTitle && (
                <span
                  css={noteCss}
                  dangerouslySetInnerHTML={{ __html: jobTitle }}
                />
              )}
              {company && (
                <span
                  css={noteCss}
                  dangerouslySetInnerHTML={{ __html: company }}
                />
              )}
            </div>
          </footer>
        </blockquote>
      </div>
    </li>
  )
}

export default Testimonial
