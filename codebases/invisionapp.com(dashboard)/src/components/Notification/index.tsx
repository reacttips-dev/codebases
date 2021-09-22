import React, { ReactNode, useEffect, useState, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import Action from '../Action'
import Text from '../../primitives/Text'

export interface NotificationProps extends HTMLProps<HTMLElement> {
  /**
   * The image/icon to be displayed in the Notification
   */
  imageNode: ReactNode
  /**
   * The title of the Notification
   */
  title: string
  /**
   * Whether the Notification is currently open.
   */
  isOpen: boolean
  /**
   * Callback that gets fired when the user clicks the primary action
   */
  onRequestPrimary: () => void
  /**
   * Callback that gets fired when the user clicks the secondary action
   */
  onRequestSecondary: () => void
  /**
   * Callback that gets fired to change the isOpen state to false. Automatically
   * gets fired on both onRequestPrimary and onRequsetSecondary
   */
  onRequestClose: () => void
  /**
   * Callback that gets fired once the Notification is open
   */
  onAfterOpen?: () => any
  /**
   * Callback that gets fired once the Notification is closed
   */
  onAfterClose?: () => any
  /**
   * The text of the primary action
   */
  primaryButton: string
  /**
   * The text of the secondary action
   */
  secondaryButton?: string
}

/**
 * Notifications are used to display ephemeral in-app messaging where a decision is required by the user.
 */
const Notification = forwardRef(function Notification(
  props: NotificationProps,
  ref: Ref<HTMLElement>
) {
  const {
    className,
    imageNode,
    title,
    children,
    isOpen,
    onRequestClose,
    onRequestPrimary,
    onRequestSecondary,
    onAfterOpen,
    onAfterClose,
    primaryButton,
    secondaryButton,
    ...rest
  } = props

  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (!isOpen) {
      onAfterClose && onAfterClose()
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
    setIsVisible(isOpen)
    onAfterOpen && onAfterOpen()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrimary() {
    onRequestPrimary && onRequestPrimary()
    onRequestClose()
  }

  function handleSecondary() {
    onRequestSecondary && onRequestSecondary()
    onRequestClose()
  }
  if (!isVisible) {
    return null
  }

  return (
    <article
      {...rest}
      ref={ref}
      className={cx('hds-notification', className, {
        'hds-notification-out': !isOpen && isVisible,
      })}
    >
      <div className="hds-notification-image">{imageNode}</div>
      <div className="hds-notification-text">
        <Text
          size="heading-12"
          color="surface-100"
          as="h3"
          className="hds-notification-title"
        >
          {title}
        </Text>
        <Text
          size="body-12"
          color="surface-80"
          as="p"
          className="hds-notification-body"
        >
          {children}
        </Text>
      </div>
      <div className="hds-notification-actions">
        <Action
          as="button"
          onClick={handlePrimary}
          className="hds-notification-primary-action hds-transition-on-hover"
        >
          {primaryButton}
        </Action>
        {secondaryButton && (
          <Action
            as="button"
            onClick={handleSecondary}
            className="hds-notification-secondary-action hds-transition-on-hover"
          >
            {secondaryButton}
          </Action>
        )}
      </div>
    </article>
  )
})

Notification.defaultProps = {
  isOpen: true,
}

export default Notification
