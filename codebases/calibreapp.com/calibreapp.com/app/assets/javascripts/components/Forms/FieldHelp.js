import React from 'react'
import styled from 'styled-components'

import { HelpIcon } from '../Icon'
import { Box } from '../Grid'
import Tooltip from '../Tooltip'

const HelpWrapper = styled.div`
  display: inline-block;
  vertical-align: text-top;
  font-weight: bold;
`

const Help = ({ children }) => (
  <HelpWrapper>
    <Tooltip label={children}>
      <Box color="grey400">
        <HelpIcon />
      </Box>
    </Tooltip>
  </HelpWrapper>
)

export default Help
