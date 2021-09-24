import React from 'react'
import styled from 'styled-components'

import { Flex, Box } from '../Grid'

const IconWrapper = styled(Box)``
IconWrapper.defaultProps = {
  ...Box.defaultProps,
  backgroundColor: 'blue50',
  borderColor: 'blue200',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '50%',
  color: 'blue400',
  fontSize: '16px',
  fontWeight: 500,
  width: '24px',
  height: '24px',
  mr: '10px',
  pt: '1px',
  lineHeight: '20px',
  textAlign: 'center'
}

const ListItem = ({ index, children }) => (
  <Flex alignItems="center" mb="12px">
    <IconWrapper>{index + 1}</IconWrapper>
    <Box flex={1}>{children}</Box>
  </Flex>
)

const OrderedList = ({ children }) =>
  React.Children.toArray(children).map((child, index) => (
    <ListItem key={index} index={index}>
      {child}
    </ListItem>
  ))

export default OrderedList
