import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from './Grid'

import { Heading, Text } from './Type'

const Container = styled(Flex)`
  min-height: 100vh;
`
Container.defaultProps = {
  flexWrap: 'wrap',
  alignItems: 'center',
  textAlign: 'center'
}

const Error = ({ title, message, children, ...rest }) => (
  <Container {...rest}>
    <Box m="auto">
      <Box width={1}>
        <Heading>{title || 'There was an error loading the page'}</Heading>
      </Box>
      {!message || (
        <Box mt={3}>
          <Text>{message}</Text>
        </Box>
      )}
      {!children || <Box mt={3}>{children}</Box>}
    </Box>
  </Container>
)

export default Error
