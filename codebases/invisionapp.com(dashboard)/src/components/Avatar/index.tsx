/* eslint-disable react/prop-types */
import React, { ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import getInitials from '../../helpers/getInitials'
import getForegroundColor from '../../helpers/getForegroundColor'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'

import Text from '../../primitives/Text'
import Icon from '../../primitives/Icon'
import Tooltip from '../Tooltip'
import { Size } from '../../types'
import { IconName } from '../../primitives/Icon/types'
import { AvatarRoundedness } from './types'

export interface AvatarProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The URL for the Avatar image.
   */
  src?: string
  /**
   * The size of the Avatar
   */
  size?: Size
  /**
   * If true, will display an activity indicator in the bottom right hand corner.
   */
  withActivityIndicator?: boolean
  /**
   * If true, a following ring will be added around the Avatar.
   */
  isFollowing?: boolean
  /**
   * If true, a presenting icon will be present within the Avatar.
   */
  isPresenting?: boolean
  /**
   * Change the default icon when presenting
   */
  isPresentingIconName?: IconName
  /**
   * The color that the activity indicator, and following ring will take.
   */
  activityIndicatorColor?: string
  /**
   * A callback to allow a user to update the `isFollowing` prop on click of the Avatar.
   */
  onClick?: () => any
  /**
   * If true, the Avatar will have dropped opacity to indicate that the Avatar is idle in a document.
   */
  isIdle?: boolean
  /**
   * If true, will show a Tooltip
   */
  withTooltip?: boolean
  /**
   * The content of the Tooltip, if one is visible
   */
  tooltipContentNode?: ReactNode
  /**
   * The HTML node to render the Dialog in, via a React Portal.
   */
  domNode?: Element
  /**
   * Changes the roundedness of the Avatar. Use "rounded" when displaying a
   * team Avatar, and "circled" when displaying a user Avatar.
   */
  roundedness?: AvatarRoundedness
}

/**
 * Avatars are used to identify a user or a team.
 */
const Avatar = forwardRef(function Avatar(
  props: AvatarProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    src,
    size,
    className,
    alt,
    withActivityIndicator,
    isFollowing,
    activityIndicatorColor,
    withTooltip,
    tooltipContentNode,
    isIdle,
    onClick,
    style,
    domNode,
    isPresenting,
    isPresentingIconName,
    roundedness,
    ...rest
  } = props

  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)

  const followingColor = isFollowing ? activityIndicatorColor : 'transparent'

  const avatar = (
    <Text
      {...rest}
      ref={ref}
      as={!isIdle && onClick ? 'button' : 'div'}
      role={!isIdle && onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      size={size === '24' ? 'label-10' : 'label-12'}
      color="surface-100"
      className={cx('hds-avatar', className, {
        [`hds-h-${size}`]: size,
        [`hds-w-${size}`]: size,
        'hds-avatar-is-presenting': isPresenting,
        'hds-focus-visible': focusVisible,
      })}
      onClick={!isIdle ? onClick : undefined}
      onFocus={onFocus}
      onBlur={onBlur}
      style={withTooltip ? undefined : { ...style }}
    >
      <div
        className={cx('hds-avatar-inner', {
          'hds-radii-5': roundedness === 'rounded',
          'hds-radii-circled': roundedness === 'circled',
          [`hds-h-${size}`]: size,
          [`hds-w-${size}`]: size,
          [`hds-avatar-inner-${size}`]: size,
          [`hds-avatar-mask-${size}`]:
            !isIdle && withActivityIndicator && !isFollowing,
          'hds-avatar-inner-is-following': isFollowing,
          'hds-avatar-is-idle': isIdle,
        })}
      >
        {src ? (
          <img src={src} alt={alt} width={size} height={size} />
        ) : (
          <span className="hds-avatar-initials">{getInitials(alt)}</span>
        )}
      </div>
      <div
        aria-hidden="true"
        className="hds-avatar-following"
        style={{
          boxShadow: `0 0 0 2px ${followingColor}`,
        }}
      />
      <span
        className={cx('hds-avatar-ai', {
          'hds-avatar-ai-visible':
            !isIdle && withActivityIndicator && !isFollowing,
        })}
        style={{ backgroundColor: activityIndicatorColor }}
      />
      {isPresenting ? (
        <div
          className="hds-avatar-is-presenting-dot"
          style={{ backgroundColor: activityIndicatorColor }}
        >
          <Icon
            name={isPresentingIconName || 'ArrowRight'}
            className={cx({
              'hds-avatar-is-presenting-icon-16':
                !isPresentingIconName || isPresentingIconName === 'ArrowRight',
              'hds-avatar-is-presenting-icon-24':
                isPresentingIconName && isPresentingIconName !== 'ArrowRight',
            })}
            size="16"
            color={
              activityIndicatorColor
                ? getForegroundColor(activityIndicatorColor)
                : 'constants-white'
            }
            isDecorative
          />
        </div>
      ) : null}
    </Text>
  )
  if (withTooltip) {
    return (
      <Tooltip
        style={style}
        domNode={domNode}
        showOn="hover"
        trigger={avatar}
        tabIndex={-1}
      >
        {tooltipContentNode}
      </Tooltip>
    )
  }
  return avatar
})

Avatar.defaultProps = {
  size: '32',
  isPresentingIconName: 'ArrowRight',
  roundedness: 'circled',
}

export default Avatar
