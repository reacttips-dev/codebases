import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../Grid'
import { Heading, Text } from '../Type'
import { breakpoint } from '../../utils/style'

const Wrapper = styled(Flex)`
  height: calc(100vh - 60px - 48px - 40px - ${({ offsets }) => offsets[0]}px);
  ${breakpoint(0)`
    height: calc(100vh - 60px - 48px - 40px - ${({ offsets }) => offsets[1]}px);
  `};
`

const BlankSlate = ({ id, children, values, ...props }) => (
  <Wrapper textAlign="center" flexDirection="column" {...props}>
    <Box m="auto" px={3}>
      <Box mb={2}>
        <Heading as="h2" level="md">
          <FormattedMessage id={`${id}.blankSlate.title`} />
        </Heading>
      </Box>
      {children || (
        <Box maxWidth={550}>
          <Text level="sm">
            <FormattedMessage
              id={`${id}.blankSlate.description`}
              values={values}
            />
          </Text>
        </Box>
      )}
    </Box>
  </Wrapper>
)

BlankSlate.defaultProps = {
  offsets: [140, 86]
}

export default BlankSlate
