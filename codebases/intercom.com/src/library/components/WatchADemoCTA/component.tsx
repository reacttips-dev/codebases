import classnames from 'classnames'
import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import { ModalSize } from 'marketing-site/src/components/common/Modal'
import { MarketoFormV2 } from 'marketing-site/src/library/components/MarketoFormV2'
import { CloseButton } from 'marketing-site/src/library/elements/CloseButton'
import { CTAButton } from 'marketing-site/src/library/elements/CTAButton'
import { ModalWithPersistedState } from 'marketing-site/src/library/elements/ModalWithPersistedState'
import { AnalyticsEvent, ColorName as themeNames } from 'marketing-site/src/library/utils'
import React from 'react'
import { IProps } from './index'
import styles from './styles.scss'

export function WatchADemoCTA({
  label,
  modalSize,
  bgColor,
  ctaColorTheme,
  overlayBackgroundColor,
  marketoForm,
  image,
}: IProps) {
  const size = image ? '800px' : ModalSize[modalSize]
  const [modalOpen, openModal, closeModal] = useModalOpenState()

  const formWrapperClassnames = classnames('watch-demo-form-wrapper', {
    [`watch-demo-form-wrapper--${themeNames[bgColor]}`]: bgColor,
    ['watch-demo-form-wrapper--with-image']: image,
  })

  async function handleClickCta() {
    openModal()
  }

  function handleCloseButton() {
    closeModal()
    const analyticsEvent = new AnalyticsEvent({
      action: 'clicked',
      object: 'demo_chooser_modal',
      context: 'modal_closed',
    })
    analyticsEvent.setPlaceFromPath(window.location.pathname)
    analyticsEvent.send()
  }

  return (
    <div className="watch-demo-wrapper" data-testid="watch-a-demo-cta">
      <CTAButton text={label} bgColor={ctaColorTheme} onClick={handleClickCta} arrow={false} />
      <ModalWithPersistedState
        isOpen={modalOpen}
        onRequestClose={closeModal}
        showCloseIcon={false}
        size={size}
        overlayBackgroundColor={overlayBackgroundColor}
        backgroundColor="transparent"
        className={image ? 'watch-demo-with-image' : ''}
      >
        <div className={formWrapperClassnames}>
          <span className="close-button watch-demo-close-button">
            <CloseButton onClick={handleCloseButton} />
          </span>
          {image ? (
            <>
              <div className="watch-demo-image-wrapper">
                <div className="watch-demo-image">
                  <img src={image} alt="Demo" className="modal-image" />
                </div>
              </div>
              <div className="watch-demo-content-wrapper">
                <div className="watch-demo-content">
                  {marketoForm && (
                    <MarketoFormV2
                      {...marketoForm}
                      hideLabels={true}
                      redirectUrl="/pricing"
                      emailSubmissionSource="signup-intent"
                    />
                  )}
                  <p>You’ll select your trial plan next</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {marketoForm && (
                <MarketoFormV2
                  {...marketoForm}
                  hideLabels={true}
                  redirectUrl="/pricing"
                  emailSubmissionSource="signup-intent"
                />
              )}
              <p>You’ll select your trial plan next</p>
            </>
          )}
        </div>
      </ModalWithPersistedState>
      <style jsx>{styles}</style>
    </div>
  )
}
