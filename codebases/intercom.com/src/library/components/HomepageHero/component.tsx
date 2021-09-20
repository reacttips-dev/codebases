/* eslint react/destructuring-assignment: 0 */
import React, { useRef, useEffect, useState } from 'react'
import classnames from 'classnames'
import { IProps } from './index'
import { Text } from '../../elements/Text'
import { Color, mq, useWindowSize } from '../../utils'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import caret from '../../images/caret.svg'
import heroAnimationDesktop from './Hero_Desktop_v4.json'
import heroAnimationMobile from './Hero_Mobile_v4.json'

const ANIMATION_REMOVAL_DELAY_MS = 3000
const CARET_THRESHOLD = 60
const LAUNCHER_CROSSFADE_DURATION_MS = 2000

export function HomepageHero({ renderEmailForm, isMobile, headline, headline2 }: IProps) {
  const windowSize = useWindowSize()
  const selfRef = useRef<HTMLDivElement>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [offsetTop, setOffsetTop] = useState<number>(-1)
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false)
  const [shouldShowCaret, setShouldShowCaret] = useState<boolean>(false)

  const heroAnimation = isMobile ? heroAnimationMobile : heroAnimationDesktop
  const completedInitialRender = offsetTop > -1
  const headline2Classes = classnames('headline2', 'fade-up', 'content-item', {
    visible: completedInitialRender,
  })
  const emailFormClasses = classnames('email-form', 'fade-up', {
    visible: completedInitialRender,
  })
  const animationContainerClasses = classnames('animation-container', {
    hidden: animationCompleted,
  })
  const caretClasses = classnames('caret-container', { visible: shouldShowCaret })

  const conditionalWindowHeight = () => (windowSize.height ? `${windowSize.height}px` : '100vh')

  const lottieOnComplete = () => {
    setTimeout(() => {
      setAnimationCompleted(true)
    }, ANIMATION_REMOVAL_DELAY_MS)
  }

  const scrollToNext = () => {
    let position = window.innerHeight - CARET_THRESHOLD
    if (selfRef.current !== null) {
      position = offsetTop + selfRef.current.offsetHeight - CARET_THRESHOLD
    }
    window.scrollTo({ top: position, behavior: 'smooth' })
    setShouldShowCaret(false)
  }

  useEffect(() => {
    if (selfRef.current !== null) {
      const boundingRect = selfRef.current.getBoundingClientRect()
      if (window.innerHeight - boundingRect.bottom <= CARET_THRESHOLD) {
        setShouldShowCaret(true)
      }
      setOffsetTop(selfRef.current.offsetTop)
    }
  }, [selfRef, windowSize])

  useEffect(() => {
    if (offsetTop >= 0 && !animationCompleted && lottieRef.current !== null) {
      lottieRef.current.play()
    }
  }, [offsetTop, lottieRef, animationCompleted])

  return (
    <div ref={selfRef} className="hero-wrapper">
      <div className="hero">
        <div className="content">
          <h1 className="headline content-item">
            <Text size="heading">{headline}</Text>
          </h1>
          {headline2 && (
            <h1 className={headline2Classes}>
              <Text size="heading">{headline2}</Text>
            </h1>
          )}
        </div>
        {renderEmailForm && <div className={emailFormClasses}>{renderEmailForm()}</div>}
      </div>
      <div className={`${animationContainerClasses}`} id="homepage-hero-animation-container">
        <Lottie
          lottieRef={lottieRef}
          animationData={heroAnimation}
          loop={false}
          autoplay={false}
          onComplete={lottieOnComplete}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      {/* eslint-disable-next-line */}
      <div className={caretClasses} onClick={scrollToNext}>
        <img className="caret bounce" src={caret} alt="" />
      </div>
      <style jsx>
        {`
          .hero-wrapper {
            display: grid;
            grid-template-columns: [left-gutter] 1fr [content] 12fr [right-gutter] 1fr;
            position: relative;
            height: calc(${conditionalWindowHeight()} - ${offsetTop}px);
            width: 100vw;
            padding: 0 0;
          }
          .hero {
            grid-column: content;
            position: relative;
            z-index: 2;
            margin-top: 5vh;
            display: flex;
            flex-direction: column;
            align-content: center;
            justify-items: center;
            text-align: center;
          }
          .content {
            display: flex;
            flex-direction: column;
            width: 100%;
            text-align: center;
            justify-items: center;
            align-content: center;
            position: relative;
            margin-bottom: 3vh;
          }
          .content-item {
            width: 100%;
            margin: 0 auto;
          }
          .headline {
            color: ${Color.Blue};
          }
          .headline2 {
            transition-delay: 2000ms;
          }
          .email-form {
            width: 100%;
            transition-delay: 3000ms;
          }
          .animation-container {
            position: absolute;
            bottom: 0;
            width: 100vw;
            transition: opacity ${LAUNCHER_CROSSFADE_DURATION_MS}ms ease;
          }
          .animation-container.hidden {
            opacity: 0;
          }
          .animation-container > :global(div) {
            height: 100%;
            width: 100%;
          }
          .fade-up {
            opacity: 0;
            transition-property: opacity, transform;
            transition-duration: 1s;
            transform: translateY(100px);
          }
          .fade-up.visible {
            opacity: 1;
            transform: none;
          }
          .caret-container {
            opacity: 0;
            z-index: 3;
            position: absolute;
            bottom: 20px;
            left: 50%;
            width: 60px;
            height: 60px;
            transform: translateX(-50%);
            transition-delay: 5s;
          }
          .caret {
            position: absolute;
            bottom: 0;
            left: 10px;
            animation-duration: 4s;
            animation-iteration-count: infinite;
            transform-origin: bottom;
          }
          .visible {
            opacity: 1;
          }
          @media (${mq.tablet}) {
            .hero-wrapper {
              padding: 0;
              max-height: 703px;
            }
            .content {
              max-width: 925px;
              margin: 3vh auto;
            }
            .headline2 {
              transition-delay: 2000ms;
            }
            .email-form {
              margin: 3vh auto;
              max-width: 500px;
              transition-delay: 3500ms;
            }
          }
          @media (${mq.desktop}) {
            .animation-container > :global(div) {
              max-width: 1920px;
              margin: 0 auto;
            }
          }
          .bounce {
            animation-name: bounce;
            animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
          }
          @keyframes bounce {
            0% {
              transform: scale(1, 1) translateY(0);
            }
            10% {
              transform: scale(1.1, 0.9) translateY(0);
            }
            30% {
              transform: scale(0.9, 1.1) translateY(-30px);
            }
            50% {
              transform: scale(1.05, 0.95) translateY(0);
            }
            57% {
              transform: scale(1, 1) translateY(-7px);
            }
            64% {
              transform: scale(1, 1) translateY(0);
            }
            100% {
              transform: scale(1, 1) translateY(0);
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          #intercom-container,
          .intercom-lightweight-app {
            opacity: ${animationCompleted ? 1 : 0};
            transition-delay: 1s;
            transition: opacity ${LAUNCHER_CROSSFADE_DURATION_MS}ms ease;
          }
        `}
      </style>
    </div>
  )
}
