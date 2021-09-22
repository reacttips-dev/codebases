import * as React from "react"
import { ThemeCss } from "gatsby-interface"
import { visuallyHiddenCss } from "../styles/a11y"

const triggerCss: ThemeCss = theme => [
  visuallyHiddenCss,
  {
    position: `fixed`,
    zIndex: 9999999,
    top: theme.space[7],
    left: theme.space[7],
    padding: theme.space[5],
    borderRadius: theme.radii[2],
    background: theme.colors.white,
    color: theme.colors.purple[50],
    fontWeight: theme.fontWeights.semiBold,
    boxShadow: theme.shadows.floating,
    textDecoration: `none`,

    "&:focus": {
      width: `auto`,
      height: `auto`,
      clip: `auto`,
    },
  },
]

const SKIP_TARGET_ID = `gatsby-skip-here`

export const SkipNavTrigger = ({
  children = `Skip to content`,
}: {
  children?: React.ReactNode
}) => {
  const [hasAValidTarget, setHasAValidTarget] = React.useState(false)

  React.useLayoutEffect(() => {
    const target = document.querySelector(`#${SKIP_TARGET_ID}`)

    if (!!target !== hasAValidTarget) {
      setHasAValidTarget(!!target)
    }
  })

  // If we've rendered the trigger, but there is no target available, we don't
  // want to show the trigger. Doing so would just be frustrating, since it
  // wouldn't skip anything.
  if (!hasAValidTarget) {
    return null
  }

  return (
    <a href={`#${SKIP_TARGET_ID}`} css={triggerCss}>
      {children}
    </a>
  )
}

export const SkipNavTarget = () => (
  <div id={SKIP_TARGET_ID} style={{ contain: `none` }} />
)
