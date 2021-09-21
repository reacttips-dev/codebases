import React from "react"
import { contentPositionerCss, visuallyHiddenCss } from "../../../shared/styles"
import { TestimonialsNav } from "./TestimonialsNav"
import { TestimonialsControls } from "./TestimonialsControls"
import Testimonial from "./Testimonial"
import Heading from "components/CustomPageLayout/components/Heading"
import { normalizeData } from "../../../CustomPageLayout"

const rootCss = theme => [
  contentPositionerCss({ theme }),
  {
    display: `flex`,
    flexDirection: `column`,
  },
]

const headingCss = theme => ({
  fontSize: theme.fontSizes[2],
  letterSpacing: theme.letterSpacings.tracked,
  textAlign: `center`,
})

const itemsCss = _theme => ({
  alignItems: `center`,
  display: `flex`,
  listStyle: `none`,
  margin: 0,
  overflow: `hidden`,
})

export function Testimonials({ data = {} }) {
  const { Heading: headerContent, Testimonial: items } = normalizeData(data)
  const [activeItem, setActiveItem] = React.useState(0)
  const [firstTouchX, setFirstTouchX] = React.useState()
  const [lastTouchX, setLastTouchX] = React.useState()

  const prevIsDisabled = activeItem === 0
  const nextIsDisabled = activeItem === items.length - 1

  const prevItem = () => {
    if (prevIsDisabled) {
      return
    }

    const scrollTop = document.documentElement.scrollTop
    setTimeout(() => {
      setActiveItem(activeItem - 1)
      window.scrollTo(0, scrollTop)
    }, 0)
  }

  const nextItem = () => {
    if (nextIsDisabled) {
      return
    }

    const scrollTop = document.documentElement.scrollTop
    setTimeout(() => {
      setActiveItem(activeItem + 1)
      window.scrollTo(0, scrollTop)
    }, 0)
  }

  const onTouchStartHandler = e => {
    const currentTouchX = e.touches[0].clientX
    setFirstTouchX(currentTouchX)
  }

  const onTouchMoveHandler = e => {
    const currentTouchX = e.touches[0].clientX
    setLastTouchX(currentTouchX)
  }

  const onTouchEndHandler = _e => {
    if (!firstTouchX || !lastTouchX) {
      return null
    }

    if (firstTouchX < lastTouchX) {
      prevItem()
    } else if (firstTouchX > lastTouchX) {
      nextItem()
    }

    setFirstTouchX(null)
    setLastTouchX(null)
  }

  return (
    <section
      css={rootCss}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      onTouchStart={onTouchStartHandler}
    >
      <Heading
        data={{ tag: "h2", ...headerContent }}
        css={headingCss}
        variant="LIGHT"
      />

      <ul css={itemsCss}>
        {items.map((item, idx) => {
          const { id, data } = item
          return (
            <Testimonial
              key={id}
              data={data}
              activeItem={activeItem}
              position={idx}
            />
          )
        })}
      </ul>

      <TestimonialsControls
        prevItem={prevItem}
        nextItem={nextItem}
        prevIsDisabled={prevIsDisabled}
        nextIsDisabled={nextIsDisabled}
      />

      <TestimonialsNav
        items={items}
        activeItem={activeItem}
        onClickItem={setActiveItem}
      />

      <div aria-live="polite" aria-atomic="true" css={visuallyHiddenCss}>
        Item {activeItem + 1} of {items.length}
      </div>
    </section>
  )
}

export default Testimonials
