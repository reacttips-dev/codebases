import React from 'react'

import { FieldGroup, TextArea } from '../../../../Forms'

const AdditionalInfo = ({ hint, value, onChange, loading, ...props }) => (
  <FieldGroup label="Additional information" hint={hint} span={2} {...props}>
    <TextArea
      id="extras"
      type="text"
      placeholder="Company identification details"
      value={value}
      onChange={onChange}
      loading={loading}
    />
  </FieldGroup>
)
AdditionalInfo.defaultProps = {
  mb: 3
}

export default AdditionalInfo
