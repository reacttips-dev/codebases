import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Section } from '../../../../Layout'
import { Flex, Box } from '../../../../Grid'
import { Heading } from '../../../../Type'

import Form from './Form'

const Profile = ({
  orgId,
  siteId,
  loading,
  saving,
  onUpdate,
  onCancel,
  ...profile
}) => {
  const { headers, cookies, uuid, ...attributes } = profile

  return (
    <>
      <Section borderBottom="none">
        <Flex>
          <Box>
            <Heading as="h2" level="sm">
              <FormattedMessage id="site.settings.profiles.edit.title" />
            </Heading>
          </Box>
        </Flex>
      </Section>
      <Form
        key={uuid}
        orgId={orgId}
        siteId={siteId}
        onSave={onUpdate}
        onCancel={onCancel}
        loading={loading}
        saving={saving}
        headers={(headers || []).map(({ name, value }) => ({ name, value }))}
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
        {...attributes}
      />
    </>
  )
}

export default Profile
