import styled from 'styled-components'

import { Box } from '../Grid'

const Row = styled(Box)`
  display: grid;
  overflow-x: auto;
`
Row.defaultProps = {
  gridColumnGap: 4,
  gridTemplateColumns: [
    'minmax(0, 1fr)',
    'minmax(0, 1fr)',
    'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)'
  ]
}

export default Row
