import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import {
  ListSnapshots,
  GetSnapshotTestUrls,
  DeleteSnapshot
} from '../../../queries/SnapshotQueries.gql'

import { RemoveButton } from '../../Button'
import Export from '../../Export'
import { Flex, Box } from '../../Grid'

import { useSession } from '../../../providers/SessionProvider'

const Menu = ({
  teamId,
  siteId,
  snapshotId,
  pageUuid,
  profileUuid,
  history
}) => {
  const { can } = useSession({ teamId, siteId })
  const { data, loading } = useQuery(GetSnapshotTestUrls, {
    variables: {
      teamId,
      siteId,
      snapshotId,
      pageUuid,
      testProfileUuid: profileUuid
    }
  })

  const [deleteSnapshot] = useMutation(DeleteSnapshot, {
    onCompleted: () => {
      history.push(`/teams/${teamId}/${siteId}/snapshots`)
    }
  })

  const {
    team: {
      site: { snapshot },
      organisation: { slug: orgId }
    }
  } = data || { team: { site: {}, organisation: {} } }

  const handleDeleteSnapshot = () => {
    const promptMessage = `You are about to delete all tests (all Test Profile and Page combinations) for Snapshot #${snapshotId}. If you are sure, type "${snapshotId}" below:`

    const promptValue = window.prompt(promptMessage)

    if (promptValue == snapshotId) {
      deleteSnapshot({
        variables: {
          organisation: orgId,
          site: siteId,
          iid: String(snapshotId)
        },
        refetchQueries: [
          {
            query: ListSnapshots,
            variables: {
              teamId,
              siteId
            }
          }
        ]
      })
    }
  }

  const items = []
  if (snapshot && snapshot.test) {
    if (snapshot.test.videoUrl)
      items.push({
        action: 'video',
        url: snapshot.test.videoUrl
      })

    if (snapshot.test.lighthouseUrl)
      items.push({
        action: 'lighthouse',
        url: snapshot.test.lighthouseUrl
      })
  }

  if (loading) return null

  return (
    <Flex>
      {can('deleteSnapshots') ? (
        <Box mr="8px">
          <FormattedMessage id="snapshot.actions.remove">
            {title => (
              <RemoveButton
                data-testid="snapshotDelete"
                onClick={handleDeleteSnapshot}
                title={title}
              />
            )}
          </FormattedMessage>
        </Box>
      ) : null}
      <Box>
        <Export
          id="snapshot.export"
          actions={items.map(({ action, url }) => ({
            action,
            onClick: () => window.open(url, '_blank')
          }))}
          values={{
            site: siteId,
            snapshot: snapshotId
          }}
        />
      </Box>
    </Flex>
  )
}

export default Menu
