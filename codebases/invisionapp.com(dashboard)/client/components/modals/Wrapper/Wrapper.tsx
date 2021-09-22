import styled from 'styled-components'

const Wrapper = styled.div<any>`
  width: 100%;
  max-width: 672px;
  margin: ${props => props.theme.spacing.l} auto;
  ${props => (props.centered ? 'text-align: center;' : '')};
`

export default Wrapper
