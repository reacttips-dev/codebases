import React from 'react'

import { FieldGroup, Input } from '../../../../Forms'

const Name = ({ hint, value, onChange, loading, ...props }) => (
  <FieldGroup label="Cardholder name" hint={hint} {...props}>
    <Input
      id="name"
      type="text"
      autoComplete="name"
      value={value}
      onChange={onChange}
      loading={loading}
      required={true}
    />
  </FieldGroup>
)

Name.defaultProps = {
  mb: 3
}

export default Name
