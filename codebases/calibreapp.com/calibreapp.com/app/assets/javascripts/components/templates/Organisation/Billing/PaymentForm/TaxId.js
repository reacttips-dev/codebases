import React from 'react'

import { FieldGroup, Input } from '../../../../Forms'

const TaxId = ({ value, onChange, loading, hint, ...props }) => (
  <FieldGroup label="Tax ID" hint={hint} {...props}>
    <Input
      id="tax_id"
      type="text"
      value={value}
      onChange={onChange}
      loading={loading}
    />
  </FieldGroup>
)

TaxId.defaultProps = {
  mb: 3
}

export default TaxId
