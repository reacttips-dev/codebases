import styled from 'styled-components'

import { Box } from '../Grid'
import { Row } from '../Layout'

const Elements = styled(Row)``
Elements.defaultProps = {
  gridColumnGap: '15px',
  gridTemplateColumns: [
    'minmax(0, 1fr)',
    'minmax(0, 1fr)  minmax(0, 1fr)',
    'minmax(0, 1fr) minmax(0, 1fr)'
  ]
}

export const Element = styled(Box)``
Element.defaultProps = {
  borderColor: 'grey200',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '3px'
}

export default Elements
