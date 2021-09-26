import React from 'react'

import { FieldGroup, Input } from '../../../../Forms'

const Email = ({ hint, value, onChange, loading, ...props }) => (
  <FieldGroup label="Billing email" hint={hint} {...props}>
    <Input
      id="email"
      type="email"
      placeholder="Email"
      autoComplete="email"
      value={value}
      onChange={onChange}
      loading={loading}
      required={true}
    />
  </FieldGroup>
)

Email.defaultProps = {
  mb: 3
}

export default Email
