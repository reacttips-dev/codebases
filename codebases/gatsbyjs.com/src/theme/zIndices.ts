export type ZIndexToken =
  | `background`
  | `base`
  | `dropdowns`
  | `toasts`
  | `modals`
  | `a11yIndicators`

export type ZIndices = Record<ZIndexToken, number>

const zIndices: ZIndices = {
  background: 0,
  base: 1,
  dropdowns: 10,
  toasts: 100,
  modals: 1000,
  a11yIndicators: 10000,
}

export default zIndices
