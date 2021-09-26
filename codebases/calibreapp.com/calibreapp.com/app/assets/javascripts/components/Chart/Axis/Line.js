import PropTypes from 'prop-types'
import styled from 'styled-components'

const Line = styled.line`
  stroke: ${props => props.color || props.theme.colors.grey200};
  stroke-width: ${props => props.strokeWidth}px;
`
Line.defaultProps = {
  strokeWidth: 1
}

Line.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.number
}

export default Line
