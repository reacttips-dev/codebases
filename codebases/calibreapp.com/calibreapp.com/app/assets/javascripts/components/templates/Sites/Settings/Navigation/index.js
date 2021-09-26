import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useRouteMatch } from 'react-router-dom'

import { TextLink } from '../../../../Type'
import { Flex, Box } from '../../../../Grid'
import { Section } from '../../../../Layout'
import Breadcrumbs from '../../../../Breadcrumbs'
import Tabs, { TabList, Tab } from '../../../../Tabs'
import { GuideButton } from '../../../../Button'

const INTEGRATIONS_URL = {
  github: '/docs/features/pull-request-reviews',
  netlify: '/docs/integrations/netlify',
  slack: '/docs/integrations/slack',
  webhook: '/docs/integrations/webhooks'
}

const LINKS = [
  {
    id: 'site.settings.general.nav',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/settings`,
    exactMatch: true,
    guide: () => null
  },
  {
    id: 'site.settings.agent.title',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/settings/agent`,
    setting: 'agent',
    exactMatch: true,
    guide: () => ({
      id: 'site.actions.guide.agent',
      url: '/docs/features/agent'
    })
  },
  {
    id: 'site.settings.authentication.title',
    to: ({ teamId, siteId }) =>
      `/teams/${teamId}/${siteId}/settings/authentication`,
    setting: 'authentication',
    exactMatch: true,
    guide: () => ({
      id: 'site.actions.guide.authentication',
      url: '/docs/get-started/authentication'
    })
  },
  {
    id: 'site.settings.pages.title',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/settings/pages`,
    setting: 'pages',
    exactMatch: false,
    guide: () => null
  },
  {
    id: 'site.settings.profiles.title',
    to: ({ teamId, siteId }) => `/teams/${teamId}/${siteId}/settings/profiles`,
    setting: 'profiles',
    exactMatch: false,
    guide: () => null
  },
  {
    id: 'site.settings.integrations.title',
    to: ({ teamId, siteId }) =>
      `/teams/${teamId}/${siteId}/settings/integrations`,
    setting: 'integrations',
    exactMatch: false,
    guide: ({ subSetting }) =>
      subSetting
        ? {
            id: `site.actions.guide.integrations.${subSetting}`,
            url: INTEGRATIONS_URL[subSetting]
          }
        : null
  }
]

const SettingsLink = ({ forceRefresh, to, id, exactMatch, ...props }) => {
  const match = useRouteMatch(to, { exact: exactMatch })
  if (forceRefresh) {
    props.href = to
  } else {
    props.to = to
  }

  return (
    <Tab
      as={TextLink}
      {...props}
      isSelected={exactMatch ? match && match.isExact : match}
    >
      <FormattedMessage id={id} />
    </Tab>
  )
}
SettingsLink.defaultProps = {
  variant: 'base',
  py: '15px'
}

const SiteSettingsNav = ({
  forceRefresh,
  teamId,
  siteId,
  setting,
  subSetting
}) => {
  const currentLink = LINKS.find(
    ({ setting: linkSetting }) => setting === linkSetting
  )
  const guide = currentLink && currentLink.guide({ setting, subSetting })

  return (
    <Box mt={3}>
      <Section>
        <Flex flexWrap={['wrap', 'nowrap']} alignItems="center">
          <Box flex={1} mb={[4, 0]}>
            <Breadcrumbs>
              <FormattedMessage id="site.settings.title" />
            </Breadcrumbs>
          </Box>
          {guide ? (
            <Box pr={1} width={[1, 'auto']}>
              <GuideButton href={guide.url}>
                <FormattedMessage id={guide.id} />
              </GuideButton>
            </Box>
          ) : null}
        </Flex>
      </Section>
      <Tabs>
        <TabList>
          {LINKS.map(
            ({ id, to, forceRefresh: linkForceRefresh, exactMatch }) => (
              <SettingsLink
                key={id}
                id={id}
                to={to({ teamId, siteId })}
                forceRefresh={linkForceRefresh || forceRefresh}
                exactMatch={exactMatch}
              />
            )
          )}
        </TabList>
      </Tabs>
      <Section p={null} />
    </Box>
  )
}

export default SiteSettingsNav
