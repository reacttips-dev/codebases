import React, { forwardRef, Ref, useMemo } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { SurfaceColor, Spacing } from '../../types'

export interface RuleProps extends HTMLProps<HTMLHRElement> {
  /**
   * Adjusts the color of the Rule
   */
  color?: SurfaceColor
  /**
   * Adjusts the vertical margin above the Rule
   */
  spacing?: Spacing
  /**
   * If true, uses a vertical Rule
   */
  isVertical?: boolean
  /**
   * How wide, or high, the Rule is. If `vertical` is `true`, then percentage-based values may
   * produce unexpected results, unless the Rule is positioned absolutely.
   */
  length?: string
}

/**
 * Rules are horizontal or vertical rules for dividing content
 */
const Rule = forwardRef(function Rule(
  props: RuleProps,
  ref: Ref<HTMLHRElement>
) {
  const {
    color,
    spacing,
    isVertical,
    length,
    className,
    style,
    ...rest
  } = props

  const innerStyle = useMemo(() => {
    const dimension = {
      [isVertical ? 'height' : 'width']: length,
    }
    if (!spacing) {
      return dimension
    }
    const margins = isVertical
      ? {
          marginLeft: `var(--hds-spacing-${spacing})`,
          marginRight: `var(--hds-spacing-${spacing})`,
        }
      : {
          marginTop: `var(--hds-spacing-${spacing})`,
          marginBottom: `var(--hds-spacing-${spacing})`,
        }
    return {
      ...dimension,
      ...margins,
    }
  }, [length, isVertical, spacing])
  return (
    <hr
      {...rest}
      ref={ref}
      className={cx('hds-rule', className, {
        'hds-rule-is-vertical': isVertical,
        [`hds-border-${color}`]: color,
      })}
      style={{
        ...innerStyle,
        ...style,
      }}
    />
  )
})

Rule.defaultProps = {
  color: 'surface-50',
  length: '100%',
}

export default Rule
