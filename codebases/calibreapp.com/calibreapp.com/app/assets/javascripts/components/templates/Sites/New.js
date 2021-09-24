import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { FieldSet, FieldGroup, Input, Checkbox, Select } from '../../Forms'
import Button, { AddButton, GuideButton } from '../../Button'
import Breadcrumbs from '../../Breadcrumbs'
import { Banner, Block, Section } from '../../Layout'
import { Box } from '../../Grid'
import { Heading, TextLink } from '../../Type'

import Location from './Settings/AgentSettings/Location'
import Schedule from './Settings/AgentSettings/Schedule'
import PageFields from './Settings/Pages/Fields'

const Pages = ({ orgId, onUpdate, onValidating }) => {
  const [pages, setPages] = useState({ 0: { name: 'Home' } })

  const updatePage = page => {
    const updatedPages = { ...pages, ...page }
    setPages(updatedPages)
    onUpdate(updatedPages)
  }

  const onAdd = () => {
    const key = `${Date.now()}${Object.keys(pages).length}`
    const updatedPages = { ...pages, [key]: {} }
    setPages(updatedPages)
  }

  const handleAddPage = event => {
    event.preventDefault()
    onAdd()
  }

  const removePage = key => {
    delete pages[key]
    setPages({ ...pages })
  }

  return (
    <>
      <PageFields
        orgId={orgId}
        onUpdate={updatePage}
        onRemove={removePage}
        onValidating={onValidating}
        pages={pages}
      />
      <AddButton onClick={handleAddPage}>Add another page</AddButton>
    </>
  )
}

const Site = ({
  orgId,
  teamId,
  loading,
  locations,
  teams,
  onCreate,
  ...initialAttributes
}) => {
  const formRef = useRef()
  const [attributes, setAttributes] = useState(initialAttributes)
  const [validating, onValidating] = useState(false)
  const { name, team, location, scheduleInterval, scheduleAnchor } = attributes

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
  }

  const handleSubmit = event => {
    event.preventDefault()
    onCreate(attributes)
  }

  return (
    <Block>
      <Banner>
        <Box flex={1} mb={[4, 0]}>
          <Breadcrumbs>
            <TextLink to={`/teams/${teamId}`}>Sites</TextLink>
            <FormattedMessage id="site.new.title" />
          </Breadcrumbs>
        </Box>
        <Box pr={1} width={[1, 'auto']}>
          <GuideButton href="/docs/get-started/guide">
            <FormattedMessage id="site.actions.guide.new" />
          </GuideButton>
        </Box>
      </Banner>

      <form onSubmit={handleSubmit} ref={formRef} data-qa="pageForm">
        <Section>
          <FieldSet mb={0}>
            <FieldGroup label="Site name">
              <Input
                data-testid="site-name"
                name="site_name"
                defaultValue={name}
                required={true}
                maxLength={120}
                onChange={name => setAttribute({ name })}
                placeholder="Your site name"
              />
            </FieldGroup>
          </FieldSet>
          <Pages
            orgId={orgId}
            onUpdate={pages => setAttribute({ pages })}
            onValidating={onValidating}
          />
        </Section>

        <Section>
          <Box mb={3}>
            <Heading level="sm">
              <FormattedMessage id="site.agentSettings.title" />
            </Heading>
          </Box>
          <FieldSet mb={0}>
            <Location
              location={location}
              locations={locations}
              onChange={setAttribute}
            />
            <Schedule
              scheduleInterval={scheduleInterval}
              scheduleAnchor={scheduleAnchor}
              onChange={scheduleAttributes =>
                setAttributes({ ...attributes, ...scheduleAttributes })
              }
            />
          </FieldSet>
        </Section>

        <Section>
          <Box mb={3}>
            <Heading level="sm">
              <FormattedMessage id="site.settings.team.title" />
            </Heading>
          </Box>

          <FieldSet mb={0}>
            <FieldGroup
              data-testid="site-team"
              labelid="site.settings.team.label"
            >
              <Select
                name="site_team"
                options={(teams || []).map(({ slug, name }) => ({
                  label: name,
                  value: slug
                }))}
                defaultValue={team}
                onChange={team => setAttribute({ team })}
                loading={loading || !teams.length || !team}
              />
            </FieldGroup>
          </FieldSet>

          <Box mb={4}>
            <FieldGroup>
              <Checkbox
                name="site_notifications"
                onChange={notifications => setAttribute({ notifications })}
              >
                <span data-qa="site-notifications">Send me&nbsp;</span>
                <TextLink href="/insights" target="_blank">
                  Insights Performance Reports
                </TextLink>
              </Checkbox>
            </FieldGroup>
          </Box>
          <Button
            disabled={validating || loading || !name || !name.length}
            type="submit"
          >
            Start tracking
          </Button>
        </Section>
      </form>
    </Block>
  )
}

export default Site
