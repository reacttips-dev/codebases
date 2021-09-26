import styled from 'styled-components'

import { Box } from '../Grid'

const Main = styled(Box)`
  position: relative;
  background: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 ${({ theme }) => theme.colors.greyOutline};
  // minus the primary nav height, secondary nav height, offset, container margin
  min-height: calc(100vh - 60px - 48px - ${({ offset }) => offset}px - 40px);
`
Main.defaultProps = {
  m: 3,
  offset: 0
}

export default Main
