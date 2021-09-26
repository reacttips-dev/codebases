import React from 'react'

import { FieldGroup, Input } from '../../../../Forms'

const Company = ({ hint, value, onChange, loading, ...props }) => (
  <FieldGroup label="Company name" hint={hint} {...props}>
    <Input
      id="company"
      type="text"
      autoComplete="company"
      value={value}
      onChange={onChange}
      loading={loading}
    />
  </FieldGroup>
)

Company.defaultProps = {
  mb: 3
}

export default Company
