import React, { useState, useEffect } from 'react'
import { IProps } from './index'
import styles from './styles.scss'
import { Text } from '../Text'

function isPartiallyInViewport(elem: HTMLElement) {
  const bounding = elem.getBoundingClientRect()
  const height = elem.clientHeight
  const treshold = 100
  return (
    (bounding.top < height && bounding.top > treshold) ||
    (bounding.bottom < window.innerHeight && bounding.bottom > treshold)
  )
}

export function JumpLink(props: IProps) {
  const { text, elementToScrollTo, container } = props
  const icon = (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="#6AFDEF" />
      <svg viewBox="-11 3 35 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.92336 12.9281C7.36528 12.9281 7.65989 12.8279 7.9545 12.5272L8.69103 11.7255L9.13295 11.0239L10.9006 9.01959C10.9006 9.01959 10.9006 8.91937 11.0479 8.91937L11.3425 8.31807L11.9318 7.81698L12.0791 7.71676L12.521 7.01524L13.1102 6.41393L13.8467 5.71241C14.1413 5.41175 13.994 4.91067 13.5521 4.71023C13.1102 4.5098 12.3737 4.5098 12.0791 4.91067L11.3425 5.61219L10.606 6.41393L10.1641 7.11545L9.57486 7.51633L9.42756 7.61654L8.98564 8.31807L8.10181 9.32024V8.81916V8.71894L7.9545 8.01741V7.31589V7.21567V6.41393L8.10181 4.71023L7.9545 2.40522L8.10181 1.60348V0.801741C8.10181 0.300653 7.65989 -4.39603e-08 7.07067 -4.80458e-08C6.48145 -5.21313e-08 5.89222 0.300653 5.89222 0.701524V1.40305L5.74492 2.20479V2.30501L5.89222 4.61001L5.74492 6.2135V6.31371V7.11545L5.74492 8.01741C5.74492 8.11763 5.74492 8.11763 5.74492 8.21785L5.89222 8.91937V9.42046L4.41917 7.71676L3.82995 7.01524L3.24072 6.31371C3.24072 6.31371 3.24072 6.2135 3.09342 6.2135L2.5042 5.61219L2.06228 4.91067C1.76767 4.5098 1.03114 4.40958 0.589222 4.61001C0.147305 4.81045 0 5.01088 0 5.31154C0 5.41175 9.53674e-07 5.51197 0.147306 5.71241L0.736528 6.41393L1.32575 7.01524L1.91497 7.71676L2.5042 8.31807L3.53534 9.72111L4.12456 10.4226L5.303 11.7255L5.74492 12.2266C5.74492 12.427 6.03953 12.5272 6.18684 12.6274C6.48145 12.8279 6.62875 12.9281 6.92336 12.9281Z"
          fill="black"
        />
      </svg>
    </svg>
  )

  const scrollToElement = (identifier: string) => {
    document.querySelectorAll(identifier)[0].scrollIntoView(true)
  }

  const [hidden, setHidden] = useState(!!container)

  useEffect(() => {
    const visibilityListener = () => {
      if (container) {
        setHidden(!isPartiallyInViewport(container))
      } else {
        setHidden(window.scrollY >= 650)
      }
    }
    window.addEventListener('scroll', visibilityListener)

    return () => window.removeEventListener('scroll', visibilityListener)
  }, [container])

  return (
    // eslint-disable-next-line
    <div
      className={`jump-link jump-link__bounce ${
        hidden ? 'jump-link__hidden' : 'jump-link__visible'
      }`}
      onClick={() => scrollToElement(elementToScrollTo)}
    >
      {icon}
      <div className="jump-link__text">
        <Text size={'caption+'}>{text}</Text>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}
