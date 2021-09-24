import React from 'react'
import styled from 'styled-components'

import { Flex, InlineFlex, Box } from '../Grid'
import { Strong } from '../Type'

export const FilterList = styled(InlineFlex)`
  vertical-align: top;
`

export const Filter = styled(Box)`
  appearance: none;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.grey100 : 'transparent'};
  cursor: pointer;
  outline: none;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey100};
  }

  &:first-child {
    border-left-width: 1px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  &:last-child {
    border-right-width: 1px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`
Filter.defaultProps = {
  as: 'button',
  borderColor: 'grey200',
  borderStyle: 'solid',
  borderLeftWidth: '0',
  borderRightWidth: '1px',
  borderTopWidth: '1px',
  borderBottomWidth: '1px',
  px: [2, 3],
  py: '8px'
}

const Filters = ({ title, children }) => (
  <Flex flexWrap="wrap">
    <Box mr="15px" display={['none', 'block']} mt="10px">
      <Strong>{title}</Strong>
    </Box>
    <Box flex={1}>{children}</Box>
  </Flex>
)
Filters.defaultProps = {
  title: 'Filter'
}

export { default as DeviceFilter } from './DeviceFilter'

export default Filters
