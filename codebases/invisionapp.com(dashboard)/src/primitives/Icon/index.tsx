import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { IconColor, IconName } from './types'
import { IconSize } from '../../types'
import { useThemeContext } from '../../components/ThemeProvider'

export interface IconProps extends Omit<HTMLProps<HTMLImageElement>, 'size'> {
  /**
   * The name of the Icon to display
   */
  name: IconName
  /**
   * The color the icon will have.
   */
  color: IconColor
  /**
   * The size, in pixels, of the icon.
   */
  size: IconSize
  /**
   * If true, adds attributes to the SVG element to make it not visible to screen readers.
   */
  isDecorative?: boolean
  /**
   * For a11y purposes.
   */
  'aria-label'?: string
}

const filterBlocklist = ['SketchColored', 'FigmaColored']
const lightStyleBlocklist = ['surface-100', 'constants-black']
const darkStyleBlocklist = ['constants-black']

const Icon = forwardRef(function Icon(
  props: IconProps,
  ref: Ref<HTMLImageElement>
) {
  const {
    color,
    children,
    size,
    'aria-label': ariaLabel,
    crossOrigin,
    className,
    name,
    isDecorative,
    alt,
    ...rest
  } = props
  const { theme } = useThemeContext()

  const suffix = theme === 'dark' ? '-dark' : ''

  const hasUrl = color !== 'constants-white'

  const styleBlocklist =
    theme === 'dark' ? darkStyleBlocklist : lightStyleBlocklist

  const shouldFilter = !filterBlocklist.includes(name)

  const shouldStyle = !styleBlocklist.includes(color)

  const filterString = `invert(100%) brightness(3) ${
    hasUrl ? `url(#hds-icon-${color}${suffix})` : ''
  }`

  const a11yProps = isDecorative
    ? {
        'aria-hidden': true,
      }
    : {
        role: 'img',
      }

  return (
    <img
      {...rest}
      ref={ref}
      className={cx('hds-icon', className)}
      width={size}
      height={size}
      aria-label={ariaLabel}
      alt={alt || ''}
      {...a11yProps}
      src={`https://static.invisionapp-cdn.com/global/icons/${name}.svg`}
      style={
        shouldStyle && shouldFilter
          ? {
              filter: filterString,
            }
          : undefined
      }
    />
  )
})

Icon.defaultProps = {
  size: '24',
  color: 'surface-100',
  isDecorative: false,
  'aria-label': '',
}

export default Icon
