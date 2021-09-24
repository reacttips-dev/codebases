import React from 'react'

import { Flex, Box } from '../../../../Grid'
import { FieldGroup, Input } from '../../../../Forms'

const CityState = ({ city, state, onUpdate, loading, ...props }) => (
  <Flex>
    <Box width={1 / 2} mr={1}>
      <FieldGroup label="City" {...props}>
        <Input
          id="city"
          type="text"
          placeholder="City"
          autoComplete="city"
          value={city}
          onChange={city => {
            onUpdate({ city })
          }}
          loading={loading}
          required={true}
        />
      </FieldGroup>
    </Box>
    <Box width={1 / 2} ml={1}>
      <FieldGroup label="State" {...props}>
        <Input
          id="state"
          type="text"
          placeholder="State"
          autoComplete="state"
          value={state}
          onChange={state => {
            onUpdate({ state })
          }}
          loading={loading}
        />
      </FieldGroup>
    </Box>
  </Flex>
)

CityState.defaultProps = {
  mb: 3
}

export default CityState
