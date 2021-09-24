import React from 'react'

import { Lockup, Section } from '../../../../Layout'

import Headers from '../../../Headers'

const AgentSettings = ({ loading, saving, onUpdate, headers }) => {
  return (
    <>
      <Section>
        <Lockup id="site.settings.profiles.headers" mb={0} />
        <Headers
          loading={loading}
          saving={saving}
          headers={(headers || []).map(({ name, value }) => ({ name, value }))}
          onUpdate={onUpdate}
          buttonVariant="primary"
        />
      </Section>
    </>
  )
}

export default AgentSettings
