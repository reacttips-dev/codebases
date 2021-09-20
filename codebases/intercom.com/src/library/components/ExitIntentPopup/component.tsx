import classnames from 'classnames'
import { marketoFormIds } from 'marketing-site/lib/marketo'
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { MarketoFormV2 } from '../../components/MarketoFormV2'
import { CloseButton } from '../../elements/CloseButton'
import { CTALink } from '../../elements/CTALink'
import { Image } from '../../elements/Image'
import { Text } from '../../elements/Text'
import { VisuallyHidden } from '../../elements/VisuallyHidden'
import { CTATheme, getHexColorFromName, ColorName } from '../../utils'
import { IProps } from './index'
import styles from './styles.scss'

export function ExitIntentPopup({
  isOpen,
  onRequestClose,
  onSubmit,
  formHeading,
  formSubheading,
  image,
  imageHeading,
  imageSubheading,
  backgroundColor = 'Teal',
  downloadLink,
}: IProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onRequestClose()
    }
  }

  useRestorableFocus(isOpen)

  useEffect(() => {
    isOpen && containerRef.current && containerRef.current.focus()

    if (submitted) {
      onSubmit()
    }
  }, [isOpen, submitted, onSubmit])

  const bgColor = getHexColorFromName(backgroundColor)

  return (
    // eslint-disable-next-line
    <div
      className={classnames('exit-intent', `exit-intent__background-color--${ColorName[bgColor]}`, {
        'exit-intent--open': isOpen,
      })}
      onKeyDown={onKeyDown}
      ref={containerRef}
      tabIndex={-1}
    >
      <div className="exit-intent__wrapper">
        <div className="exit-intent__close">
          <CloseButton onClick={onRequestClose} />
          <VisuallyHidden>Close</VisuallyHidden>
        </div>

        <div className="exit-intent__content">
          <div className="exit-intent__form-area">
            {submitted ? (
              <>
                <p className="exit-intent__heading">
                  <Text size="lg+">Thank you for your interest!</Text>
                </p>
                <CTALink
                  arrow={false}
                  bgColor={CTATheme.BlackFill}
                  text="Get the free book"
                  url={downloadLink}
                />
              </>
            ) : (
              <>
                <MarketoFormV2
                  formId={marketoFormIds.exitIntentPopup}
                  headingText={formHeading}
                  subheadingText={formSubheading}
                  submitButtonLabel="Download now"
                  hideLabels={true}
                  onSubmit={(response) => {
                    if (response.success) {
                      setSubmitted(true)
                    }
                  }}
                />
              </>
            )}
          </div>

          <div className="exit-intent__book-description">
            <div className="exit-intent__image">
              <Image url={image.url} />
            </div>
            <div className="exit-intent__copy">
              <p className="exit-intent__heading">
                <Text size="lg+">{imageHeading}</Text>
              </p>
              {imageSubheading && (
                <p className="exit-intent__subheading">
                  <Text size="body">{imageSubheading}</Text>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  )
}

function useRestorableFocus(isOpen: boolean) {
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement
    } else {
      const previous = previouslyFocused.current

      if (previous && document.body.contains(previous)) {
        previous.focus()
      } else {
        document.body.focus()
      }
    }
  }, [isOpen])
}
