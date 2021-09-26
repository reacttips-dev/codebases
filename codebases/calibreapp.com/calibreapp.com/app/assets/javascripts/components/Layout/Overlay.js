import styled from 'styled-components'

import { Box } from '../Grid'

const Overlay = styled(Box)`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`
Overlay.defaultProps = {
  p: 4
}

export default Overlay
