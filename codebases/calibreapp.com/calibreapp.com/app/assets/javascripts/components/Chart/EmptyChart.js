import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from '../Type'
import { Flex, Box } from '../Grid'
import Loader from '../Loader'

const Row = styled(Flex)`
  background: white;
  left: 0;
  height: 60px;
  margin-top: ${({ margin }) => margin.top / 2}px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
`
const EmptyChart = ({ loading, label, margin }) => {
  return (
    <Row alignItems="center" margin={margin}>
      <Box flex={1} fontSize={1} textAlign="center">
        {loading ? (
          <Loader size="small" />
        ) : (
          label || (
            <Text level="xs" color="grey300" as="em">
              <FormattedMessage id="charts.no_data" />
            </Text>
          )
        )}
      </Box>
    </Row>
  )
}
EmptyChart.defaultProps = {
  margin: {}
}

EmptyChart.propTypes = {
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  })
}

export default EmptyChart
