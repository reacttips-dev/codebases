import React, {
  ReactNode,
  forwardRef,
  Ref,
  createContext,
  useContext,
  useState,
} from 'react'
import cx from 'classnames'
import FocusVisibleManager from '../../hooks/useFocusVisible/FocusVisibleManager'
import { HTMLProps } from '../../helpers/omitType'
import { ThemeProviderTheme } from './types'

export interface ThemeProviderProps extends HTMLProps<HTMLDivElement> {
  className?: string
  /**
   * Which theme to display the current app in.
   */
  theme: ThemeProviderTheme
  children: ReactNode
}

type ThemeContextProps = {
  theme: ThemeProviderTheme
  isCursorHidden: boolean
  setIsCursorHidden: (b: boolean) => void
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  isCursorHidden: false,
  setIsCursorHidden: () => {},
})

/**
 * ThemeProvider wraps an entire application that uses Helios One, and will add the
 * necessary CSS class names for the namespaced component CSS to work.
 */
const ThemeProvider = forwardRef(function ThemeProvider(
  props: ThemeProviderProps,
  ref: Ref<HTMLDivElement>
) {
  const { theme, children, className, ...rest } = props
  const [isCursorHidden, setIsCursorHidden] = useState(false)

  const filters = [
    {
      id: 'hds-icon-surface-110',
      matrix:
        '0.06 0   0   0   0 0   0.06  0   0   0 0   0   0.10  0   0 0   0   0   1   0',
    },
    // {
    //   we don't need this one as the icons are already at surface-100.
    //   id: 'hds-icon-surface-100',
    //   matrix: ''
    // },
    {
      id: 'hds-icon-surface-90',
      matrix:
        '0.20 0   0   0   0 0   0.20  0   0   0 0   0   0.22  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-80',
      matrix:
        '0.29 0   0   0   0 0   0.29  0   0   0 0   0   0.31  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-70',
      matrix:
        '0.38 0   0   0   0 0   0.38  0   0   0 0   0   0.40  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-60',
      matrix:
        '0.46 0   0   0   0 0   0.46  0   0   0 0   0   0.49  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-50',
      matrix:
        '0.56 0   0   0   0 0   0.56  0   0   0 0   0   0.58  0   0 0   0   0   1   0 ',
    },
    {
      id: 'hds-icon-surface-40',
      matrix:
        '0.65 0   0   0   0 0   0.65  0   0   0 0   0   0.67  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-30',
      matrix:
        '0.74 0   0   0   0 0   0.74  0   0   0 0   0   0.76  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-20',
      matrix:
        '0.84 0   0   0   0 0   0.84  0   0   0 0   0   0.85  0   0 0   0   0   1   0 ',
    },
    {
      id: 'hds-icon-surface-10',
      matrix:
        '0.92 0   0   0   0 0   0.92  0   0   0 0   0   0.92  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-5',
      matrix:
        '0.95 0   0   0   0 0   0.95  0   0   0 0   0   0.95  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-3',
      matrix:
        '0.97 0   0   0   0 0   0.97  0   0   0 0   0   0.97  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-0',
      matrix:
        '1.00 0   0   0   0 0   1.00  0   0   0 0   0   1.00  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-primary-100',
      matrix:
        '0.21 0   0   0   0 0   0.24  0   0   0 0   0   0.93  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-success-100',
      matrix:
        '0.15 0   0   0   0 0   0.73  0   0   0 0   0   0.65  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-destructive-100',
      matrix:
        '0.87 0   0   0   0 0   0.02  0   0   0 0   0   0.09  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-warning-100',
      matrix:
        '0.99 0   0   0   0 0   0.80  0   0   0 0   0   0.23  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-component-100',
      matrix:
        '0.56 0   0   0   0 0   0.20  0   0   0 0   0   0.98  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-folder-100',
      matrix:
        '0.17 0   0   0   0 0   0.80  0   0   0 0   0   0.99  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-110-dark',
      matrix:
        '1.00 0   0   0   0 0   1.00  0   0   0 0   0   1.00  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-100-dark',
      matrix:
        '1.00 0   0   0   0 0   1.00  0   0   0 0   0   1.00  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-90-dark',
      matrix:
        '0.92 0   0   0   0 0   0.92  0   0   0 0   0   0.92  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-80-dark',
      matrix:
        '0.84 0   0   0   0 0   0.84  0   0   0 0   0   0.85  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-70-dark',
      matrix:
        '0.74 0   0   0   0 0   0.74  0   0   0 0   0   0.76  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-60-dark',
      matrix:
        '0.65 0   0   0   0 0   0.65  0   0   0 0   0   0.67  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-50-dark',
      matrix:
        '0.56 0   0   0   0 0   0.56  0   0   0 0   0   0.58  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-40-dark',
      matrix:
        '0.46 0   0   0   0 0   0.46  0   0   0 0   0   0.49  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-30-dark',
      matrix:
        '0.38 0   0   0   0 0   0.38  0   0   0 0   0   0.40  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-20-dark',
      matrix:
        '0.29 0   0   0   0 0   0.29  0   0   0 0   0   0.31  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-10-dark',
      matrix:
        '0.20 0   0   0   0 0   0.20  0   0   0 0   0   0.22  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-5-dark',
      matrix:
        '0.15 0   0   0   0 0   0.15  0   0   0 0   0   0.16  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-3-dark',
      matrix:
        '0.13 0   0   0   0 0   0.13  0   0   0 0   0   0.13  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-surface-0-dark',
      matrix:
        '0.11 0   0   0   0 0   0.11  0   0   0 0   0   0.12  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-primary-100-dark',
      matrix:
        '0.23 0   0   0   0 0   0.22  0   0   0 0   0   0.91  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-success-100-dark',
      matrix:
        '0.15 0   0   0   0 0   0.73  0   0   0 0   0   0.65  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-destructive-100-dark',
      matrix:
        '0.87 0   0   0   0 0   0.02  0   0   0 0   0   0.09  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-warning-100-dark',
      matrix:
        '0.99 0   0   0   0 0   0.80  0   0   0 0   0   0.23  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-component-100-dark',
      matrix:
        '0.56 0   0   0   0 0   0.20  0   0   0 0   0   0.98  0   0 0   0   0   1   0',
    },
    {
      id: 'hds-icon-folder-100-dark',
      matrix:
        '0.17 0   0   0   0 0   0.80  0   0   0 0   0   0.99  0   0 0   0   0   1   0',
    },
  ]

  return (
    <ThemeContext.Provider value={{ theme, isCursorHidden, setIsCursorHidden }}>
      <div
        {...rest}
        ref={ref}
        className={cx('hds-theme-provider vx-x-x-SNAPSHOT', className, {
          'hds-theme-dark': theme === 'dark',
          'hds-theme-light': theme === 'light',
          'hds-global-cursor-is-active': isCursorHidden,
        })}
      >
        <FocusVisibleManager>{children}</FocusVisibleManager>
        <svg
          id="hds-icon-filters"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: '0',
          }}
        >
          <defs>
            {filters.map(f => (
              <filter id={f.id} key={f.id}>
                <feColorMatrix
                  colorInterpolationFilters="sRGB"
                  type="matrix"
                  values={f.matrix}
                />
              </filter>
            ))}
          </defs>
        </svg>
      </div>
    </ThemeContext.Provider>
  )
})

export const useThemeContext = () => useContext(ThemeContext)

export default ThemeProvider
