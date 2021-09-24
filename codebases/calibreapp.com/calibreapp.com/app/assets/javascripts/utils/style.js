import { css, keyframes } from 'styled-components'
import { variant } from 'styled-system'

// Helper function for mobile-first development using the breakpoints from the
// grid-styled settings.
// Usage: ${breakpoint(0)` display: block;`};
export const breakpoint = index => (...args) => css`
  @media (min-width: ${props => props.theme.breakpoints[index]}) {
    ${css(...args)};
  }
`

export const transition = (attribute = 'all') =>
  `transition: ${attribute} 0.15s linear`

export const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const linkStyle = variant({ key: 'linkStyles', prop: 'variant' })
