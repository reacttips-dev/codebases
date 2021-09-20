import React, { useEffect, useRef } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import { addMilliseconds, isAfter, addYears } from 'date-fns'
import {
  ExitIntentPopup,
  IProps as IExitIntentPopupProps,
} from 'marketing-site/src/library/components/ExitIntentPopup'
import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import { transformImage } from 'marketing-site/src/transformers/elements/ContentfulImage'
import { IImage } from 'marketing-site/@types/generated/contentful'
import Cookies from 'js-cookie'

export default function ExitIntentModal({ id, children, data }: IPageBehaviorComponentProps) {
  if (
    !data.references ||
    !data.references[0] ||
    data.references[0].sys.contentType.sys.id !== 'exitIntentModal'
  ) {
    throw new Error(
      'Expected exit-intent-modal pageBehavior to reference the exit intent modal component',
    )
  }

  const [modalOpen, openModal, closeModal] = useModalOpenState()

  const delayMs = parseInt((data.configuration || {}).delay) || 2000
  const activeAfter = useRef(addMilliseconds(new Date(), delayMs))

  const dismissalCookieKey = `dismissed-${id}`
  const submissionCookieKey = `submitted-${id}`
  const viewedCookieKey = `viewed-${id}`

  // Don't show the user the same modal more than four times
  const modalViews = parseInt(Cookies.get(viewedCookieKey) || '0')
  const shouldShowModal =
    !Cookies.get(dismissalCookieKey) && !Cookies.get(submissionCookieKey) && modalViews < 4

  useEffect(() => {
    if (modalOpen || Cookies.get(dismissalCookieKey)) return

    function onMouseOut(event: MouseEvent) {
      const shouldCheck = isAfter(new Date(), activeAfter.current)
      const intendsToExit = event.clientY <= 0

      if (shouldShowModal && shouldCheck && intendsToExit) {
        const views = modalViews + 1
        Cookies.set(viewedCookieKey, views.toString(), {
          sameSite: 'lax',
          expires: addYears(new Date(), 20),
        })
        openModal()
      }
    }

    window.addEventListener('mouseout', onMouseOut)
    return () => window.removeEventListener('mouseout', onMouseOut)
  }, [dismissalCookieKey, modalOpen, openModal, viewedCookieKey, shouldShowModal, modalViews])

  function onDismiss() {
    Cookies.set(dismissalCookieKey, '1', { sameSite: 'lax', expires: addYears(new Date(), 20) })
    closeModal()
  }

  function onSubmit() {
    Cookies.set(submissionCookieKey, '1', { sameSite: 'lax', expires: addYears(new Date(), 20) })
  }

  return (
    <>
      {children}
      <ExitIntentPopup
        isOpen={modalOpen}
        onRequestClose={onDismiss}
        onSubmit={onSubmit}
        image={transformImage(data.references[0].fields.imageRef as IImage)}
        {...(data.references[0].fields as unknown as IExitIntentPopupProps)}
      />
    </>
  )
}
