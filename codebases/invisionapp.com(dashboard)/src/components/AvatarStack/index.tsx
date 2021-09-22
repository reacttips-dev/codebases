import React, { useCallback, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Avatar, { AvatarProps } from '../Avatar'
import Tooltip from '../Tooltip'
import Action from '../Action'
import Text from '../../primitives/Text'
import { Size } from '../../types'

export interface AvatarStackProps
  extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The list of Avatars to display in the stack.
   */
  avatars: Omit<AvatarProps, 'size'>[]
  /**
   * If true, the avatars will appear closer together, useful for smaller UI spaces
   */
  isCompressed: boolean
  /**
   * The dimension of the Avatars to display
   */
  size: Size
  /**
   * The HTML node to render the Dialog in, via a React Portal.
   */
  domNode?: Element
  /**
   * Changes the maximum height of the excess user avatar Tooltip
   */
  tooltipMaxHeight?: number
  /**
   * The total number of users, useful if you are lazy loading extra avatars.
   */
  totalAvatars?: number
}

/**
 * AvatarStacks display a collection of avatars, usually used to indicate presence within a document or space.
 */
const AvatarStack = forwardRef(function AvatarStack(
  props: AvatarStackProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    avatars,
    isCompressed,
    className,
    size,
    domNode,
    tooltipMaxHeight = 120,
    totalAvatars,
    ...rest
  } = props
  const [first, second, third, fourth, ...others] = avatars

  const renderFinalAvatar = useCallback(() => {
    if (!fourth) {
      return null
    }
    if (!others.length) {
      return <Avatar {...fourth} size={size} />
    }
    const combined = [fourth, ...others]
    const newLength = combined.length
    const totalExcessVisible = newLength === 6 ? 6 : 5
    const compressedCombined = combined.slice(0, totalExcessVisible)
    const otherNames = newLength - totalExcessVisible
    const triggerText = totalAvatars ? totalAvatars - 3 : newLength
    const trigger = (
      <Text
        size={size === '24' ? 'label-10' : 'label-12'}
        color="surface-100"
        className={cx('hds-avatar-stack-excess', {
          [`hds-h-${size}`]: size,
          [`hds-w-${size}`]: size,
        })}
      >
        +{triggerText}
      </Text>
    )
    return (
      <Tooltip
        className={cx('hds-avatar-stack-tooltip', {
          [`hds-h-${size}`]: size,
          [`hds-w-${size}`]: size,
        })}
        placement="bottom-center"
        showOn={isCompressed ? 'hover' : 'click'}
        domNode={domNode}
        trigger={trigger}
        maxHeight={isCompressed ? 160 : tooltipMaxHeight}
        backgroundColor="surface-0"
      >
        {isCompressed ? (
          <>
            {compressedCombined.map((c: AvatarProps) => {
              return (
                <Text
                  key={c.alt || c.name}
                  size="body-13"
                  color="surface-100"
                  className="hds-avatar-stack-compressed-excess-user"
                >
                  {c.alt}
                </Text>
              )
            })}
            {otherNames > 0 ? (
              <Text
                size="body-13"
                color="surface-100"
                className="hds-avatar-stack-compressed-excess-user"
              >
                and {otherNames} others
              </Text>
            ) : null}
          </>
        ) : (
          combined.map((c: AvatarProps, i: number) => {
            const { onClick, isIdle, ...restOfC } = c
            if (isCompressed) {
              return (
                <Text
                  size="body-13"
                  color="surface-100"
                  className="hds-avatar-stack-compressed-excess-user"
                >
                  {c.alt}
                </Text>
              )
            }
            const contents = (
              <>
                <Avatar
                  {...restOfC}
                  isIdle={isIdle}
                  withTooltip={false}
                  size="24"
                  src={c.src}
                  alt={c.alt}
                />
                <Text
                  size="body-13"
                  color={isIdle ? 'surface-70' : 'surface-100'}
                >
                  {c.alt}
                </Text>
              </>
            )
            if (isIdle) {
              return (
                <div
                  key={`${c.alt}-${i}`}
                  className="hds-avatar-stack-excess-user-is-inert"
                >
                  {contents}
                </div>
              )
            }
            return (
              <Action
                as="button"
                key={`${c.alt}-${i}`}
                className="hds-avatar-stack-excess-user"
                onClick={onClick}
                role="button"
              >
                {contents}
              </Action>
            )
          })
        )}
      </Tooltip>
    )
  }, [
    fourth,
    others,
    size,
    domNode,
    tooltipMaxHeight,
    isCompressed,
    totalAvatars,
  ])

  const generateWidth = useCallback(() => {
    const margin = isCompressed ? -4 : 4
    const avatarSize = parseInt(size, 10)
    const factor = avatars.length > 3 ? 4 : avatars.length
    return factor * avatarSize + (factor - 1) * margin
  }, [size, avatars, isCompressed])

  const generatePosition = useCallback(
    (i: number) => {
      const margin = isCompressed ? -4 : 4
      const avatarSize = parseInt(size, 10)
      const left = avatarSize * i + margin * i
      return {
        top: 0,
        left,
      }
    },
    [size, isCompressed]
  )

  const width = generateWidth()

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-avatar-stack', className, {
        'hds-avatar-stack-is-compressed': isCompressed,
      })}
      style={{
        width,
        height: parseInt(size, 10),
      }}
    >
      <div
        className="hds-avatar-stack-inner"
        style={{ width, height: parseInt(size, 10) }}
      >
        {first && <Avatar {...first} size={size} style={generatePosition(0)} />}
        {second && (
          <Avatar {...second} size={size} style={generatePosition(1)} />
        )}
        {third && <Avatar {...third} size={size} style={generatePosition(2)} />}
        {renderFinalAvatar()}
      </div>
    </div>
  )
})

AvatarStack.defaultProps = {
  size: '32',
  tooltipMaxHeight: 120,
}

export default AvatarStack
