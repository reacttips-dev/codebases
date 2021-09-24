import styled from 'styled-components'

const TextButton = styled.button`
  border: none;
  background: none;
  color: ${props => props.theme.colors.grey400};
  cursor: pointer;
  display: inline-block;
  outline: none;
  padding: 0;
  position: relative;
  text-decoration: none;

  &:hover,
  &:active {
    color: ${props => props.theme.colors.grey500};
  }
`

export default TextButton
