import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Teams } from '../../../../../queries/SiteQueries.gql'

import { Section, Lockup } from '../../../../Layout'
import Button from '../../../../Button'
import { FieldSet, FieldGroup, Select } from '../../../../Forms'

const Team = ({ teamId, onUpdate, saving }) => {
  const [team, setTeam] = useState(teamId)
  const { data } = useQuery(Teams, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network'
  })
  const { team: teamData } = data || {}
  const { organisation } = teamData || {}
  const {
    teamsList: { edges }
  } = organisation || { teamsList: { edges: [] } }

  const teams = (edges || []).map(({ node }) => node)

  const handleSubmit = event => {
    event.preventDefault()
    onUpdate(team)
  }

  return (
    <Section>
      <Lockup id="site.settings.general.team" mb={0} link="/docs" />
      <form onSubmit={handleSubmit} data-qa="siteTeamForm">
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
              onChange={setTeam}
              loading={!teams.length || !team}
            />
          </FieldGroup>
        </FieldSet>
        <Button
          disabled={!team || team === teamId}
          type="submit"
          loading={saving}
        >
          <FormattedMessage id="site.settings.general.team.save" />
        </Button>
      </form>
    </Section>
  )
}

export default Team
