import styled from 'styled-components'

import { transition } from '../../utils/style'

const Segment = styled.rect`
  cursor: pointer;
  fill: ${props => props.color};
  ${transition('opacity')};

  &:hover {
    cursor: pointer;
  }
`
Segment.defaultProps = {
  color: 'black'
}

export default Segment
