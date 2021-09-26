import React from 'react'
import countryList from 'country-list'

import { Flex, Box } from '../../../../Grid'
import { FieldGroup, Input, Select } from '../../../../Forms'

const PostcodeCountry = ({
  postcode,
  country,
  onUpdate,
  loading,
  ...props
}) => (
  <Flex>
    <Box width={1 / 2} mr={1}>
      <FieldGroup label="Postal code" {...props}>
        <Input
          id="postcode"
          type="text"
          autoComplete="postcode"
          value={postcode}
          onChange={postcode => {
            onUpdate({ postcode })
          }}
          loading={loading}
        />
      </FieldGroup>
    </Box>
    <Box width={1 / 2} ml={1}>
      <FieldGroup label="Country" {...props}>
        <Select
          name="country"
          options={[{ label: 'Select country', value: '' }].concat(
            countryList.getData().map(({ code, name }) => ({
              label: name,
              value: code
            }))
          )}
          value={country}
          onChange={country => {
            onUpdate({ country })
          }}
          loading={loading}
          required={true}
        />
      </FieldGroup>
    </Box>
  </Flex>
)

PostcodeCountry.defaultProps = {
  mb: 3
}

export default PostcodeCountry
