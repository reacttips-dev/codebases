import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../../Button'
import { Flex, Box } from '../../../Grid'

import Form from './Form'

const AddMembers = ({ orgId, teamId, loading, onSave }) => {
  const [modified, setModified] = useState(false)
  const [members, setMembers] = useState([])

  const setAttribute = members => {
    setMembers(members.map(({ uuid }) => uuid))
    setModified(true)
  }

  const handleSubmit = event => {
    event.preventDefault()
    onSave({ members })
  }

  return (
    <>
      <Form
        onUpdate={members => setAttribute(members)}
        teamId={teamId}
        orgId={orgId}
        loading={loading}
      />

      <form onSubmit={handleSubmit} data-qa="newMembersForm">
        <Flex pb={4} mt={4}>
          <Box order={2}>
            <Button
              data-testid="members-submit"
              disabled={!modified || loading}
              onClick={handleSubmit}
            >
              <FormattedMessage id="team.members.add.actions.save" />
            </Button>
          </Box>
          <Box mr={2} order={1}>
            <Button
              type="button"
              data-testid="team-cancel"
              to={`/teams/${teamId}/team`}
              variant="tertiary"
            >
              <FormattedMessage id="team.members.add.actions.cancel" />
            </Button>
          </Box>
        </Flex>
      </form>
    </>
  )
}

export default AddMembers
