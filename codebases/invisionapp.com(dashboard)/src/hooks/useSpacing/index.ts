import { useMemo } from 'react'
import { Spacing } from '../../types'

export interface UseSpacingProps {
  type: 'margin' | 'padding'
  all?: Spacing
  x?: Spacing
  y?: Spacing
  top?: Spacing
  right?: Spacing
  bottom?: Spacing
  left?: Spacing
}

function useSpacing(props: UseSpacingProps) {
  const { type, all, x, y, left, right, bottom, top } = props
  const spacing = useMemo(() => {
    const prefix = (v: string) => `var(--hds-spacing-${v})`
    const allV = all
      ? {
          [type]: prefix(all),
        }
      : {}
    const topV = top
      ? {
          [`${type}Top`]: prefix(top),
        }
      : {}
    const rightV = right
      ? {
          [`${type}Right`]: prefix(right),
        }
      : {}
    const bottomV = bottom
      ? {
          [`${type}Bottom`]: prefix(bottom),
        }
      : {}
    const leftV = left
      ? {
          [`${type}Left`]: prefix(left),
        }
      : {}
    const xV = x
      ? {
          [`${type}Left`]: prefix(x),
          [`${type}Right`]: prefix(x),
        }
      : {}
    const yV = y
      ? {
          [`${type}Top`]: prefix(y),
          [`${type}Bottom`]: prefix(y),
        }
      : {}
    return {
      ...allV,
      ...xV,
      ...yV,
      ...topV,
      ...rightV,
      ...bottomV,
      ...leftV,
    }
  }, [all, top, right, bottom, left, x, y, type])

  return spacing
}

export default useSpacing
