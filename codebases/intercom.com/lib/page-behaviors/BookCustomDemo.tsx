import React, { useEffect, useRef, useState } from 'react'
import { IPageBehaviorComponentProps } from './PageBehaviors'
import styles from 'marketing-site/src/library/styles/pages/book-custom-demo.scss'
import { captureException } from '../sentry'

export default function BookCustomDemo({ children }: IPageBehaviorComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isMessengerOpen, setIsMessengerOpen] = useState<boolean>(false)
  const [isOnShowHookRegistered, setOnShowHookRegistered] = useState<boolean>(false)

  // fires the custombot by clicking a hidden button
  useEffect(() => {
    if (buttonRef?.current && !isMessengerOpen) {
      const button = buttonRef.current
      let timeout: NodeJS.Timeout
      const triggerCustomBot = () => {
        try {
          if (window.Intercom) {
            if (!isOnShowHookRegistered) {
              window.Intercom('onShow', () => setIsMessengerOpen(true))
              setOnShowHookRegistered(true)
            }
            if (!isMessengerOpen) {
              button.click()
            }
          }
        } catch (error) {
          captureException(error)
        } finally {
          if (!isMessengerOpen) {
            timeout = setTimeout(triggerCustomBot, 1000)
          }
        }
      }
      triggerCustomBot()
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [buttonRef, isMessengerOpen, isOnShowHookRegistered])

  return (
    <>
      {children}
      <button
        type="button"
        className="hidden"
        data-custom-bot="chat-with-us"
        data-talk-to-sales
        ref={buttonRef}
      />
      <style jsx>{styles}</style>
    </>
  )
}
