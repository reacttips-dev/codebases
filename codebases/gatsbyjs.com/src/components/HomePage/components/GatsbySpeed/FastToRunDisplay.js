import React from "react"
import { keyframes } from "@emotion/core"
import { FastToRunPicture } from "./FastToRunPicture"
import { useTrackVisibility } from "react-intersection-observer-hook"

const rootCss = theme => ({
  display: `flex`,
  height: `620px`,
  justifyContent: `flex-end`,
  marginTop: theme.space[6],
  marginBottom: `-${theme.space[9]}`,
  position: `relative`,
  width: `100%`,

  [theme.mediaQueries.desktop]: {
    justifyContent: `center`,
    marginTop: theme.space[10],
  },
})

const pictureCss = theme => ({
  position: `absolute`,
  left: `50%`,
  transform: `translateX(-100%)`,

  [theme.mediaQueries.phablet]: {
    transform: `translateX(-90%)`,
  },

  [theme.mediaQueries.desktop]: {
    left: `50%`,
    transform: `translateX(-50%)`,
  },
})

const stepsCss = theme => ({
  display: `grid`,
  width: `50%`,
  justifyContent: `center`,

  [theme.mediaQueries.desktop]: {
    gridTemplateColumns: `1fr 1fr`,
    gridColumnGap: `360px`,
    width: `auto`,
  },
})

const numberEntry = keyframes`
  50% {
    transform: scale(1.75, 1.75)
  }
  100% {
    transform: scale(1, 1)
  }
`

const stepCss = ({ theme, step, activeStep }) => [
  {
    display: `flex`,
    flexDirection: `column`,
    justifyContent: `flex-end`,
    margin: `${theme.space[8]} 0`,

    h5: {
      color: theme.colors.grey[50],
      fontWeight: theme.fontWeights.semiBold,
      position: `relative`,
      marginBottom: theme.space[4],
      textTransform: `uppercase`,

      span: {
        animation: `${numberEntry} 500ms ease forwards`,
        alignItems: `center`,
        background: theme.colors.grey[40],
        borderRadius: theme.radii[6],
        color: theme.colors.white,
        display: `none`,
        fontSize: theme.fontSizes[1],
        fontWeight: theme.fontWeights.bold,
        justifyContent: `center`,
        lineHeight: theme.space.solid,
        height: theme.space[7],
        marginRight: theme.space[3],
        position: `absolute`,
        top: `-${theme.space[9]}`,
        transform: `scale(.5, .5)`,
        transformOrigin: `center center`,
        width: theme.space[7],
      },

      a: {
        display: `none`,
      },
    },

    ul: {
      color: theme.colors.grey[50],
      fontSize: theme.fontSizes[1],
      listStyle: `none`,
      margin: 0,

      li: {
        margin: `${theme.space[2]} 0`,
      },
    },

    img: {
      fill: theme.colors.green[70],
      verticalAlign: `middle`,
    },

    [theme.mediaQueries.desktop]: {
      justifyContent: `center`,
      transform: `translateY(-8rem)`,
      paddingLeft: theme.space[8],
      margin: 0,

      h5: {
        span: {
          left: `-${theme.space[9]}`,
          top: `-${theme.space[2]}`,
        },
      },
    },
  },
  step === 2 && {
    justifyContent: `flex-start`,

    h5: {
      color: theme.colors.green[70],

      span: {
        background: theme.colors.green[40],
      },
    },

    [theme.mediaQueries.desktop]: {
      transform: `translateY(5rem)`,
    },
  },
  step === 1 &&
    activeStep > 0 && {
      h5: {
        span: {
          display: `flex`,
        },
      },
      ul: {
        color: theme.colors.grey[80],
      },
    },

  step === 2 &&
    activeStep > 1 && {
      h5: {
        span: {
          display: `flex`,
        },
      },
      ul: {
        color: theme.colors.grey[80],
      },
    },
]

export function FastToRunDisplay({ data = {} }) {
  const content = data.content.map(item => {
    return {
      id: item.id,
      html: item.body?.childMarkdownRemark?.html,
    }
  })

  const [activeStep, setActiveStep] = React.useState(0)
  const showInitialContentTimeout = React.useRef()
  const showClientContentTimeout = React.useRef()
  const hideAllContentTimeout = React.useRef()

  const showInitialContent = () => {
    showInitialContentTimeout.current = setTimeout(() => {
      setActiveStep(1)
      showClientContent()
      clearTimeout(showInitialContentTimeout.current)
    }, 1000)
  }

  const showClientContent = () => {
    showClientContentTimeout.current = setTimeout(() => {
      setActiveStep(2)
      clearTimeout(showClientContentTimeout.current)
      hideAllContent()
    }, 2000)
  }

  const hideAllContent = () => {
    hideAllContentTimeout.current = setTimeout(() => {
      setActiveStep(0)
      clearTimeout(hideAllContentTimeout.current)
      showInitialContent()
    }, 3000)
  }

  const [ref, { isVisible }] = useTrackVisibility()

  React.useEffect(() => {
    if (isVisible) {
      showInitialContentTimeout.current = showInitialContent()
    }

    return () => {
      clearTimeout(showInitialContentTimeout.current)
      clearTimeout(showClientContentTimeout.current)
      clearTimeout(hideAllContentTimeout.current)
    }
  }, [isVisible])

  return (
    <div css={rootCss} ref={ref}>
      <div css={stepsCss}>
        {content.map(({ id, html }, idx) => {
          return (
            <div
              key={id}
              css={theme => stepCss({ theme, step: idx + 1, activeStep })}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        })}
      </div>
      <div css={pictureCss}>
        {isVisible && <FastToRunPicture activeStep={activeStep} />}
      </div>
    </div>
  )
}

export default FastToRunDisplay
