import React from 'react'
import { FieldGroup, Select } from '../../../../Forms'

const Location = ({ loading, locations, location, onChange, ...props }) => (
  <FieldGroup
    data-testid="agent-settings-location"
    label="Test location"
    {...props}
  >
    <Select
      name="agent_settings_location"
      options={(locations || []).map(loc => ({
        label: `${loc.emoji} ${loc.name}`,
        value: loc.tag
      }))}
      defaultValue={location}
      onChange={location => onChange({ location })}
      loading={loading || !locations}
    />
  </FieldGroup>
)

export default Location
