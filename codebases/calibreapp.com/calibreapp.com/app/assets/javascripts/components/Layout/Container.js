import styled from 'styled-components'

import { Flex } from '../Grid'

const Container = styled(Flex)`
  display: ${({ display }) => display};
  // minus the primary nav height
  min-height: ${({ minHeight }) => minHeight};
`

Container.defaultProps = {
  display: 'flex',
  minHeight: 'calc(100vh - 60px)'
}

export default Container
