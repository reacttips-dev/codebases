import styled from 'styled-components'

import { Box } from '../Grid'

const Section = styled(Box)`
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`
Section.defaultProps = {
  backgroundColor: 'white',
  borderBottom: '1px solid',
  borderBottomColor: 'grey100',
  p: 4
}

export default Section
