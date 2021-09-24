import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../Grid'
import { Heading, Text } from '../../Type'

const Wrapper = styled(Flex)`
  height: calc(100vh - 60px - 48px - 15px);
`

const NotFound = ({ id, children, ...props }) => (
  <Wrapper textAlign="center" flexDirection="column" {...props}>
    <Box m="auto" px={3}>
      <Box mb={2}>
        <Heading as="h2" level="md">
          <FormattedMessage id={`${id}.notFound.title`} />
        </Heading>
      </Box>
      {children || (
        <Text level="sm">
          <FormattedMessage id={`${id}.notFound.description`} />
        </Text>
      )}
    </Box>
  </Wrapper>
)

NotFound.defaultProps = {
  id: 'app'
}

export default NotFound
