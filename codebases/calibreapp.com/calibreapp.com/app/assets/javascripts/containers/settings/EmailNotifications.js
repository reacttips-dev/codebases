import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useQuery, useMutation } from '@apollo/client'

import {
  Get,
  SiteEventSubscriptionToggle,
  UpdateEventSubscriptions
} from '../../queries/EmailPreferencesQuery.gql'

import { List, ListItem } from '../../components/List'
import Favicon from '../../components/Favicon'
import Checkbox from '../../components/Checkbox'

import { Banner, Section, Lockup } from '../../components/Layout'
import Breadcrumbs from '../../components/Breadcrumbs'
import { Flex, Box } from '../../components/Grid'

import PageTitle from '../../components/PageTitle'

const HIDDEN_EVENT_TYPES = ['new_team']
const HIDDEN_SITE_EVENT_TYPES = ['initial_snapshot']

const EmailNotifications = () => {
  const { data } = useQuery(Get, {
    fetchPolicy: 'cache-and-network'
  })
  const {
    currentUser: { memberships, siteEventSubscriptions, eventSubscriptions },
    siteEvents,
    events
  } = data || { currentUser: {} }

  const [siteEventSubscriptionToggle] = useMutation(
    SiteEventSubscriptionToggle,
    {
      update(cache, { data }) {
        const { currentUser } = cache.readQuery({
          query: Get
        })
        const updatedUser = { ...currentUser }
        updatedUser.siteEventSubscriptions = data.siteEventSubscriptionToggle
        cache.writeQuery({
          query: Get,
          data: { currentUser: updatedUser }
        })
      }
    }
  )

  const [updateEventSubscriptions] = useMutation(UpdateEventSubscriptions, {
    update(cache, { data }) {
      const { currentUser } = cache.readQuery({
        query: Get
      })
      const updatedUser = { ...currentUser }
      updatedUser.eventSubscriptions =
        data?.updateUserSettings?.eventSubscriptions
      cache.writeQuery({
        query: Get,
        data: { currentUser: updatedUser }
      })
    }
  })

  const handleUpdateEventSubscriptions = event => {
    let events = eventSubscriptions.map(({ value }) => value)
    if (events.find(eventType => eventType === event)) {
      events = events.filter(eventType => eventType !== event)
    } else {
      events = events.concat(event)
    }
    updateEventSubscriptions({ variables: { eventSubscriptions: events } })
  }

  let sites = []
  memberships?.forEach(({ teams }) => {
    teams.forEach(({ sitesList }) => {
      sites = sites.concat(sitesList.edges.map(({ node }) => node))
    })
  })

  let eventTypes = (events?.enumValues || [])
    .map(({ name }) => name)
    .filter(name => !HIDDEN_EVENT_TYPES.includes(name))

  let siteEventTypes = (siteEvents?.enumValues || [])
    .map(({ name }) => name)
    .filter(name => !HIDDEN_SITE_EVENT_TYPES.includes(name))

  return (
    <>
      <PageTitle id="you.settings.emailNotifications.title" />
      <Banner>
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <FormattedMessage id="you.settings.emailNotifications.heading" />
          </Breadcrumbs>
        </Box>
      </Banner>

      <Section>
        <Lockup id="you.settings.emailNotifications.teamNotifications" mb={0} />
        <Flex>
          {eventTypes.map(eventType => (
            <Box key={`event_subscriptions.${eventType}.description`}>
              <FormattedMessage
                id={`event_subscriptions.${eventType}.description`}
              >
                {label => (
                  <Checkbox
                    id={eventType}
                    label={label[0]}
                    value={eventType}
                    checked={
                      !!eventSubscriptions.find(
                        ({ value }) => eventType === value
                      )
                    }
                    onChange={handleUpdateEventSubscriptions}
                  />
                )}
              </FormattedMessage>
            </Box>
          ))}
        </Flex>
      </Section>

      <Section>
        <Lockup id="you.settings.emailNotifications.siteNotifications" mb={0} />
        <List>
          {sites.map(({ name, slug, page }) => (
            <ListItem
              preview={page && <Favicon title={name} src={page.favicon} />}
              title={name}
              key={`emailNotifications-${slug}`}
              actions={siteEventTypes.map(eventType => (
                <FormattedMessage
                  key={`site_event_subscriptions.${eventType}`}
                  id={`site_event_subscriptions.${eventType}`}
                >
                  {label => (
                    <Checkbox
                      id={`${slug}-${eventType}`}
                      label={label[0]}
                      value={slug}
                      checked={
                        !!siteEventSubscriptions.find(
                          siteSub =>
                            siteSub.site.slug === slug &&
                            siteSub.eventType === eventType
                        )
                      }
                      onChange={e => {
                        siteEventSubscriptionToggle({
                          variables: { site: e, eventType }
                        })
                      }}
                    />
                  )}
                </FormattedMessage>
              ))}
            />
          ))}
        </List>
      </Section>
    </>
  )
}

export default EmailNotifications
