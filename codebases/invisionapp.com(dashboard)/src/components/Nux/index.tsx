import React, { useCallback, ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { Placement } from '../../types'
import Tooltip from '../Tooltip'
import Text from '../../primitives/Text'
import Box from '../Box'
import Badge from '../Badge'
import Adjacent from '../Adjacent'
import Button from '../Button'

export interface NuxProps extends HTMLProps<HTMLDivElement> {
  /**
   * The title of the Nux
   */
  title: string
  /**
   * The contents of the Nux
   */
  children: ReactNode
  /**
   * The current number of this Nux component
   */
  current: number
  /**
   * The total number of Nux components
   */
  total: number
  /**
   * The text of the primary action. If not present, the button will not appear.
   */
  primaryText?: string
  /**
   * The text of the secondary action. If not present, the button will not appear.
   */
  secondaryText?: string
  /**
   * A callback that fires when clicking the primary action
   */
  onPrimary?: (evt: React.MouseEvent<HTMLButtonElement>) => any
  /**
   * A callback that fires when clicking the secondary action
   */
  onSecondary?: (evt: React.MouseEvent<HTMLButtonElement>) => any
  /**
   * The DOM node to render the Nux into, via a React Portal.
   */
  domNode?: HTMLElement
  /**
   * Positions the Nux relative to the trigger.
   */
  placement: Placement
  /**
   * Whether the Nux is currently visible or not.
   */
  isOpen: boolean
  /**
   * Callback that controls the visibility state of the Nux
   */
  onChangeVisibility: (v: boolean) => void
  /**
   * If true, will close the Nux whenever you click outside the Nux or trigger.
   */
  canCloseOnClickOutside?: boolean
  /**
   * If true, will close the Nux when pressing the escape key.
   */
  canCloseOnEsc?: boolean
}

/**
 * Nux's are actionable Popover used to guide new users through features of the app.
 */
const Nux = forwardRef(function Nux(props: NuxProps, ref: Ref<HTMLDivElement>) {
  const {
    title,
    current,
    total,
    primaryText,
    secondaryText,
    onPrimary,
    onSecondary,
    className,
    children,
    domNode,
    placement,
    isOpen,
    onChangeVisibility,
    canCloseOnClickOutside,
    canCloseOnEsc,
    onClick,
    ...rest
  } = props

  const handlePrimary = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onPrimary && onPrimary(e)
      onChangeVisibility(false)
    },
    [onPrimary, onChangeVisibility]
  )

  const handleSecondary = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onSecondary && onSecondary(e)
      onChangeVisibility(false)
    },
    [onSecondary, onChangeVisibility]
  )

  const trigger = (
    <div className="hds-nux-trigger">
      <div className="hds-sr-only">Open the NUX dialog</div>
    </div>
  )

  return (
    <Tooltip
      {...rest}
      className={cx('hds-nux', className)}
      trigger={trigger}
      domNode={domNode}
      showOn="click"
      backgroundColor="surface-0"
      ref={ref}
    >
      <div className="hds-nux-contents">
        <Text
          size="heading-14"
          color="surface-100"
          as="h3"
          className="hds-nux-title"
        >
          {title}
        </Text>
        <Text size="body-long-14" color="surface-80" className="hds-nux-copy">
          {children}
        </Text>
        <Box flexDirection="row" justifyContent="between" alignItems="center">
          <Badge isCompact className="hds-nux-badge">
            {current} / {total}
          </Badge>
          {primaryText || secondaryText ? (
            <Adjacent spacing="12">
              {primaryText ? (
                <Button
                  type="button"
                  as="button"
                  order="secondary"
                  onClick={handleSecondary}
                  className="hds-nux-secondary-action"
                  size="24"
                >
                  {secondaryText}
                </Button>
              ) : null}
              {primaryText ? (
                <Button
                  type="button"
                  as="button"
                  order="primary"
                  onClick={handlePrimary}
                  className="hds-nux-primary-action"
                  size="24"
                >
                  {primaryText}
                </Button>
              ) : null}
            </Adjacent>
          ) : null}
        </Box>
      </div>
    </Tooltip>
  )
})

Nux.defaultProps = {
  canCloseOnClickOutside: true,
  canCloseOnEsc: true,
}

export default Nux
