import React from 'react'

import { Lockup, Section } from '../../../../Layout'

import Cookies from '../../../Cookies'

const AgentSettings = ({ loading, saving, onUpdate, cookies }) => {
  return (
    <>
      <Section>
        <Lockup id="site.settings.profiles.cookies" mb={0} />
        <Cookies
          loading={loading}
          saving={saving}
          cookies={(cookies || []).map(
            ({ name, value, domain, path, secure, httpOnly }) => ({
              name,
              value,
              domain,
              path,
              secure,
              httpOnly
            })
          )}
          onUpdate={onUpdate}
          buttonVariant="primary"
        />
      </Section>
    </>
  )
}

export default AgentSettings
