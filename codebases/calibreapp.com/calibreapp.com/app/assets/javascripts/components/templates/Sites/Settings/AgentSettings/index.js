import React from 'react'

import Form from './Form'
import { Header, Lockup, Section } from '../../../../Layout'

const AgentSettings = ({
  orgId,
  loading,
  saving,
  locations,
  onUpdate,
  location,
  scheduleInterval,
  scheduleAnchor,
  ...siteProps
}) => {
  return (
    <>
      <Header>
        <Lockup id="site.settings.agent" link="/docs/features/agent" mb={0} />
      </Header>
      <Section>
        <Form
          orgId={orgId}
          loading={loading}
          saving={saving}
          locations={locations}
          onUpdate={onUpdate}
          location={location}
          scheduleInterval={scheduleInterval}
          scheduleAnchor={scheduleAnchor}
          {...siteProps}
        />
      </Section>
    </>
  )
}

export default AgentSettings
