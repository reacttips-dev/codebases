import React from 'react'

import { Section, Lockup } from '../../../../Layout'
import { Text, TextLink, InlineCode } from '../../../../Type'

const Slug = ({ slug }) => (
  <Section>
    <Lockup id="site.settings.general.slug">
      <Text as="p">
        Your Site slug can be used with our{' '}
        <TextLink href="/docs/automation/cli">CLI</TextLink>,{' '}
        <TextLink href="/docs/automation/node">Node.JS API</TextLink> or{' '}
        <TextLink href="/docs/automation/http-site-api">HTTP Site API</TextLink>
        .
      </Text>
    </Lockup>
    <InlineCode>{slug}</InlineCode>
  </Section>
)

export default Slug
