import styled from 'styled-components'
import { typography } from 'styled-system'

import { InlineBox } from '../Grid'

const Item = styled(InlineBox)`
  ${typography}
  &:last-of-type {
    margin-right: 0;
  }
`
Item.defaultProps = {
  as: 'li',
  mr: '15px',
  lineHeight: 1
}

export default Item
