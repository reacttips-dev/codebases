import styled from 'styled-components'

import { Box } from '../Grid'

const Header = styled(Box)`
  background-color: white;
`
Header.defaultProps = {
  px: 4,
  pt: 4,
  mb: -4
}

export default Header
