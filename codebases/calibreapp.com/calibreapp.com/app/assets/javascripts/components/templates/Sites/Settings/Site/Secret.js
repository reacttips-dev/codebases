import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Section, Lockup } from '../../../../Layout'
import { Text, TextLink, InlineCode } from '../../../../Type'
import Button from '../../../../Button'
import { Box } from '../../../../Grid'

const Secret = ({ secret, onUpdate, saving }) => {
  const confirmText = 'new secret please'
  return (
    <Section>
      <Lockup id="site.settings.general.secret">
        <Text as="p">
          Your Site secret can be used with the{' '}
          <TextLink href="/docs/automation/http-site-api">
            HTTP Site API
          </TextLink>{' '}
          to create{' '}
          <TextLink href="/docs/automation/snapshots">Snapshots</TextLink> and{' '}
          <TextLink href="/docs/automation/deploys">Deploys</TextLink>. It can
          be useful as a part of a post-deploy or post-merge hook.
        </Text>
      </Lockup>
      <InlineCode data-testid="site-secret">{secret}</InlineCode>
      <Box my={3}>
        <Text as="p">
          <FormattedMessage id="site.settings.general.secret.new" />
        </Text>
      </Box>
      <FormattedMessage
        id="site.settings.general.secret.prompt"
        values={{ confirmText }}
      >
        {message => (
          <Button
            disabled={saving}
            onClick={() => {
              const response = prompt(message)
              if (response === confirmText) {
                onUpdate()
              }
            }}
            loading={saving}
          >
            <FormattedMessage id="site.actions.new_secret" />
          </Button>
        )}
      </FormattedMessage>
    </Section>
  )
}

export default Secret
