import { Box } from '../Grid'
import styled from 'styled-components'

import { breakpoint } from '../../utils/style'

const Col = styled(Box)`
  grid-column: 1;

  ${breakpoint(0)` 
    grid-column: ${({ span }) => (span ? `span ${span}` : 'initial')};
  `};
`
Col.defaultProps = {
  mb: 4
}

export default Col
