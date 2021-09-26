import React from 'react'

import { FieldGroup, Input } from '../../../../Forms'

const Address = ({ loading, address, onUpdate, ...props }) => (
  <>
    <FieldGroup label="Address" {...props}>
      <Input
        id="address"
        type="text"
        placeholder="Street address"
        autoComplete="address"
        value={address}
        onChange={address => {
          onUpdate({ address })
        }}
        loading={loading}
        required={true}
      />
    </FieldGroup>
  </>
)

Address.defaultProps = {
  mb: 3
}

export default Address
