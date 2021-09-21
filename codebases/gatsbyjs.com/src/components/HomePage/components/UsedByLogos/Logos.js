import * as React from "react"
import { keyframes } from "@emotion/core"
import Img from "gatsby-image"
import getAnimationsEnabled from "../../../../utils/enable-animations"
import { useTrackVisibility } from "react-intersection-observer-hook"

const scrolling = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    /* half the container + 15px margin */
    transform: translateX(calc(-50% - 15px));
  }
`

const rootCss = theme => ({
  margin: `${theme.space[4]} 0`,
  overflow: `hidden`,
  position: `relative`,

  "&::after": {
    content: `""`,
    background: `linear-gradient(to right,#fff 0,rgba(255,255,255,0.1) 10%,rgba(255,255,255,0.1) 90%,#fff 100%)`,
    position: `absolute`,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
})

const scrollContainerCss = () => [
  {
    display: "flex",
    flexWrap: "nowrap",
    animation: `${scrolling} 60s linear infinite`,
    animationPlayState: "paused",
    "div:hover > &": {
      animationPlayState: `paused`,
    },
    '[data-visible="true"] > &': {
      animationPlayState: `running`,
    },
  },
]

export function Logos({ data = {} }) {
  const [ref, { isVisible }] = useTrackVisibility()
  const logo = data.items[0]

  const shouldEnableAnimations = isVisible && getAnimationsEnabled()
  // remove placeholder
  delete logo.image.fixed.tracedSVG

  return (
    <div ref={ref} css={rootCss} data-visible={!!shouldEnableAnimations}>
      <div
        css={scrollContainerCss}
        style={{ width: logo.image.fixed.width * 2 + 30 }}
      >
        <Img
          alt={logo.alternateText}
          fixed={logo.image.fixed}
          loading="eager"
        />
        {/* We repeat the image to get the horizontal inifinite scrolling effect  */}
        <Img
          alt={logo.alternateText}
          fixed={logo.image.fixed}
          aria-hidden="true"
          css={{ marginLeft: 30 }}
        />
      </div>
    </div>
  )
}

export default Logos
