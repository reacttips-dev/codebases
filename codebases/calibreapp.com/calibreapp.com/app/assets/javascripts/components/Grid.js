import styled from 'styled-components'
import { Flex as FlexGrid, Box as BoxGrid } from '@rebass/grid'
import {
  color,
  border,
  fontSize,
  space,
  textAlign,
  width,
  grid,
  variant,
  boxShadow
} from 'styled-system'

const gridStyle = variant({ key: 'gridStyles', prop: 'variant' })

export const Flex = styled(FlexGrid)`
  ${border}
  ${textAlign}
  ${grid}
  ${({ height }) => height && `height: ${height};`}
  ${gridStyle}
`

Flex.propTypes = {
  ...border.propTypes,
  ...color.propTypes,
  ...fontSize.propTypes,
  ...space.propTypes,
  ...textAlign.propTypes,
  ...width.propTypes
}

export const Box = styled(BoxGrid)`
  ${border}
  ${color}
  ${textAlign}
  ${grid}
  ${({ height }) => height && `height: ${height};`}
  ${gridStyle}
  ${boxShadow}
`

Box.propTypes = {
  ...border.propTypes,
  ...color.propTypes,
  ...fontSize.propTypes,
  ...space.propTypes,
  ...textAlign.propTypes,
  ...width.propTypes,
  ...boxShadow.propTypes
}

export const InlineFlex = styled(Flex)`
  display: inline-flex;
`

export const InlineBox = styled(Box)`
  display: inline-block;
`
