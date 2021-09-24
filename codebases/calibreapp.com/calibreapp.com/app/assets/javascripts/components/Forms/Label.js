import styled from 'styled-components'
import { color, space, typography } from 'styled-system'

const Label = styled.label`
  display: block;
  ${color}
  ${space}
  ${typography}
`
Label.defaultProps = {
  color: 'grey500',
  fontSize: 0,
  fontWeight: 600
}

export default Label
