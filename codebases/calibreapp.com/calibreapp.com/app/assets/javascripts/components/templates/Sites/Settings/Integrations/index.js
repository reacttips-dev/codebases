import React from 'react'

import { Section, Lockup, Row, Col } from '../../../../Layout'
import { LoadingLayout } from '../../../../Loading'

import Integration from './Integration'

import {
  CalibreIconDark,
  GitHubIcon,
  SlackIcon,
  NetlifyIcon,
  ZapierIcon,
  WebhooksIcon,
  GeckoboardIcon
} from '../../../../Icon'
import { useSession } from '../../../../../providers/SessionProvider'

const Integrations = ({ teamId, siteId, loading, integrations, onDelete }) => {
  const { features } = useSession()
  const INTEGRATIONS = {
    calibre: {
      Icon: CalibreIconDark,
      description: {
        url: 'https://calibreapp.com/docs/automation/node'
      },
      cta: {
        target: '_blank',
        href: 'https://github.com/calibreapp/cli/tree/master/examples/nodejs'
      },
      actions: ['edit', 'delete']
    },
    github: {
      Icon: GitHubIcon,
      description: {
        url: ' https://calibreapp.com/docs/features/pull-request-reviews'
      },
      cta: integrations.find(({ provider }) => provider === 'github')
        ? null
        : {
            href: `/installations/github/new?state=${teamId}/${siteId}`
          },
      actions: ['edit', 'delete']
    },
    slack: {
      Icon: SlackIcon,
      description: {
        url: 'https://calibreapp.com/docs/integrations/slack'
      },
      cta: {
        to: `/teams/${teamId}/${siteId}/settings/integrations/slack/new`
      },
      actions: ['edit', 'delete']
    },
    netlify: {
      Icon: NetlifyIcon,
      description: {
        url: 'https://calibreapp.com/docs/integrations/netlify'
      },
      cta: integrations.find(({ provider }) => provider === 'netlify')
        ? null
        : {
            to: `/teams/${teamId}/${siteId}/settings/integrations/netlify/new`
          },
      actions: ['edit', 'delete']
    },
    webhook: {
      Icon: WebhooksIcon,
      description: {
        url: 'https://calibreapp.com/docs/integrations/webhooks'
      },
      cta: {
        to: `/teams/${teamId}/${siteId}/settings/integrations/webhook/new`
      },
      actions: ['edit', 'delete']
    },
    zapier: {
      Icon: ZapierIcon,
      description: {
        url: 'https://calibreapp.com/docs/integrations/zapier'
      },
      cta: {
        action: integrations.find(({ provider }) => provider === 'zapier')
          ? 'manage'
          : 'add',
        target: '_blank',
        href: 'https://zapier.com/developer/public-invite/145104/27eaface517826df8c41958dab310f30'
      },
      feature: 'zapier',
      actions: ['delete']
    },
    geckoboard: {
      Icon: GeckoboardIcon,
      description: {
        url: 'https://calibreapp.com/docs/integrations/geckoboard'
      },
      cta: {
        target: '_blank',
        href: 'https://github.com/calibreapp/geckoboard'
      },
      actions: []
    }
  }

  return (
    <>
      <Section borderBottom="none" p={null} px={4} pt={4}>
        <Lockup id="site.settings.integrations" />
      </Section>
      <Section p={null} px={4} pb={4} pt={3}>
        {loading ? (
          <Row>
            <Col span={2}>
              <LoadingLayout />
            </Col>
          </Row>
        ) : (
          Object.keys(INTEGRATIONS)
            .filter(key => {
              const feature = INTEGRATIONS[key].feature
              return feature ? features.includes(feature) : true
            })
            .map(key => {
              const providerIntegrations = integrations.filter(
                ({ provider }) => provider === key
              )
              return (
                <Integration
                  key={key}
                  teamId={teamId}
                  siteId={siteId}
                  provider={key}
                  integrations={providerIntegrations}
                  onDelete={onDelete}
                  {...(INTEGRATIONS[key] || {})}
                />
              )
            })
        )}
      </Section>
    </>
  )
}

export default Integrations
