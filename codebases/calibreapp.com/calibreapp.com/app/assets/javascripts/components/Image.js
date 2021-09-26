import styled from 'styled-components'
import { border, width } from 'styled-system'

const Image = styled.img({}, border, width)
Image.propTypes = {
  ...border.propTypes,
  ...width.propTypes
}

export default Image
