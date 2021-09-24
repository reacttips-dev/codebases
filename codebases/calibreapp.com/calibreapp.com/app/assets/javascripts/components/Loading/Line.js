import React from 'react'

import { Box } from '../Grid'

const Line = props => <Box {...props}> </Box>

Line.defaultProps = {
  backgroundColor: 'grey50',
  borderRadius: 3,
  height: 24,
  width: '300px',
  maxWidth: '100%'
}

export default Line
