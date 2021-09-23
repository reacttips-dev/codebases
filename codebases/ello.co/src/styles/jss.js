import { css } from 'glamor'

export { css }

export const combine = (...styles) =>
  styles.join(' ')

export const media = (query, ...styles) =>
  css({ [`@media ${query}`]: styles })

export const parent = (selector, ...styles) =>
  css({ [`${selector} &`]: styles })

export const descendent = (selector, ...styles) =>
  css({ [`& ${selector.split(',').join(',& ')}`]: styles })

export const modifier = (selector, ...styles) =>
  css({ [`&${selector}`]: styles })

export const select = (selector, ...styles) =>
  css({ [selector]: styles })

export const hover = (...styles) =>
  select('.no-touch &:hover', ...styles)

export const active = (...styles) =>
  select(':active', ...styles)

export const focus = (...styles) =>
  select(':focus', ...styles)

export const firstChild = (...styles) =>
  select(':first-child', ...styles)

export const before = (...styles) =>
  select('::before', ...styles)

export const after = (...styles) =>
  select('::after', ...styles)

export const placeholder = (...styles) =>
  select('::placeholder', ...styles)

export const disabled = (...styles) =>
  modifier('[disabled]', ...styles)

