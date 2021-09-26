import React from 'react'
import styled from 'styled-components'

import { Box } from '../Grid'

const StyledHelpIcon = styled(Box)``
StyledHelpIcon.defaultProps = {
  backgroundColor: 'grey100',
  borderRadius: '50%',
  size: '18px',
  lineHeight: '18px',
  fontSize: '14px',
  textAlign: 'center'
}

const HelpIcon = props => <StyledHelpIcon {...props}>?</StyledHelpIcon>

export default HelpIcon
