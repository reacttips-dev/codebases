import React from 'react'

import { Checkbox, Element } from '../Forms'
import { Box } from '../Grid'
import { Text } from '../Type'

const CheckboxCard = ({ uuid, description, label, checked, checkboxClick }) => {
  return (
    <Element backgroundColor={checked ? 'grey50' : 'white'} height={'100%'}>
      <Box p={3}>
        <Checkbox
          id={uuid}
          name={uuid}
          checked={checked}
          onChange={() => {
            checkboxClick(uuid)
          }}
        >
          <Box>
            <span data-qa={`profile-${uuid}`}>{label}</span>
            <Text as="div" level="xs" color="grey300" mt={1}>
              {description}
            </Text>
          </Box>
        </Checkbox>
      </Box>
    </Element>
  )
}

export default CheckboxCard
