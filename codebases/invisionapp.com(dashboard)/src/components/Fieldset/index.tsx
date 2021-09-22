import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import { Spacing } from '../../types'

export interface FieldsetProps extends HTMLProps<HTMLFieldSetElement> {
  /**
   * The spacing between each form element.
   */
  spacing?: Spacing
  /**
   * Used to describe the group of form elements. Especially useful for those using
   * assistive technologies.
   */
  legend: string
  /**
   * Determines whether the legend is visible on screen. If false, will still be
   * rendered, but only visible to screen-readers.
   */
  isLegendVisible?: boolean
}

/**
 * Fieldests house a collection of form fields, whilst also helping standardize layout.
 */
const Fieldset = forwardRef(function Fieldset(
  props: FieldsetProps,
  ref: Ref<HTMLFieldSetElement>
) {
  const {
    spacing = '16',
    legend,
    isLegendVisible,
    className,
    children,
    ...rest
  } = props

  const shouldHaveNegativeMargin = spacing && !isLegendVisible
  return (
    <fieldset
      {...rest}
      ref={ref}
      className={cx('hds-fieldset', className, {
        [`hds-space-y-${spacing}`]: spacing,
      })}
      style={
        shouldHaveNegativeMargin
          ? {
              marginTop: `${parseInt(spacing, 10) * -1}px`,
            }
          : undefined
      }
    >
      <Text
        as="legend"
        className={cx('hds-fieldset-legend', {
          'hds-sr-only': !isLegendVisible,
        })}
        color="surface-100"
        size="heading-18"
      >
        {legend}
      </Text>
      {children}
    </fieldset>
  )
})

Fieldset.defaultProps = {
  spacing: '16',
}

export default Fieldset
