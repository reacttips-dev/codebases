import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from '../../Type'
import { Flex, Box } from '../../Grid'
import { LoadingIcon } from '../../Icon'

const Incomplete = ({ status }) => (
  <div className="page-section">
    <Flex alignItems="center" textAlign="center">
      <Box mt="25vh" mb={3} mx="auto">
        {['scheduled', 'verifying', 'running', 'processing'].includes(
          status
        ) && <LoadingIcon height="30px" width="50px" />}
      </Box>
    </Flex>
    <Flex alignItems="center" textAlign="center">
      <Box width={1}>
        <h2 className="type-medium">
          <FormattedMessage id={`test.${status}.title`} />
        </h2>
        <Text as="p" color="grey300">
          <FormattedMessage id={`test.${status}.message`} />
        </Text>
      </Box>
    </Flex>
  </div>
)

Incomplete.propTypes = {
  status: PropTypes.oneOf([
    'scheduled',
    'running',
    'processing',
    'verifying',
    'failed',
    'not_found'
  ]).isRequired
}

export default Incomplete
