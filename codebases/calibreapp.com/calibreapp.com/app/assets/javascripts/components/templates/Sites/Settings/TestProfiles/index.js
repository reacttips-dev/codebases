import React, { Suspense, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../../../Grid'
import { Section } from '../../../../Layout'
import Button from '../../../../Button'
import { Text, Heading } from '../../../../Type'
import { Reorder, Edit, Delete } from '../../../../Actions'
import MetadataList from '../../../../MetadataList'
import { LoadingLayout } from '../../../../Loading'
import {
  ResourceList,
  ResourceItem,
  ResourceBody,
  ResourceActions,
  ResourceTitle
} from '../../../../ResourceList'

import profileMetadata from '../../../../../utils/profileMetadata'

const FeedbackBlock = React.lazy(() => import('../../../../FeedbackBlock'))

const Profiles = ({
  loading,
  teamId,
  siteId,
  profiles: initialProfiles,
  onDelete,
  onUpdatePosition,
  profileLimit
}) => {
  const confirmText = 'DELETE'
  const [profiles, setProfiles] = useState([...initialProfiles])

  const onReorder = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const [removed] = profiles.splice(result.source.index, 1)
    profiles.splice(result.destination.index, 0, removed)

    setProfiles(profiles)
    onUpdatePosition({
      profile: removed.uuid,
      position: result.destination.index + 1
    })
  }

  useEffect(() => {
    if (initialProfiles.length != profiles.length)
      return setProfiles([...initialProfiles])

    initialProfiles.forEach(initialProfile => {
      const profile = profiles.find(p => p.uuid === initialProfile.uuid)
      if (!profile) {
        return setProfiles([...initialProfiles])
      }
    })
  }, [initialProfiles])

  const reachedTestProfileLimit =
    profiles.filter(({ deleted }) => !deleted).length >= profileLimit

  return (
    <>
      <Section borderBottom="none">
        {!reachedTestProfileLimit || (
          <Suspense fallback={<div />}>
            <FeedbackBlock type="warning" mb={4}>
              Upgrade your plan to create more Test Profiles for this Site.
              Check <a href="/pricing">our pricing</a> for more information.
            </FeedbackBlock>
          </Suspense>
        )}
        <Flex alignItems="center" flexWrap={['wrap', 'nowrap']}>
          <Box mr={4} mb={[2, 0]}>
            <Heading as="h2" level="sm">
              <FormattedMessage id="site.settings.profiles.title" />
            </Heading>
          </Box>
          <Box ml="auto" order={[2, 3]} mb={[2, 0]}>
            <Button
              to={`/teams/${teamId}/${siteId}/settings/profiles/new`}
              disabled={reachedTestProfileLimit}
            >
              <FormattedMessage id="site.settings.profiles.actions.add" />
            </Button>
          </Box>
        </Flex>
      </Section>
      {profiles.length ? (
        <ResourceList onReorder={onReorder}>
          {profiles
            .filter(({ deleted }) => !deleted)
            .map(({ uuid, name, ...props }, index) => (
              <ResourceItem key={uuid} id={uuid} index={index}>
                {provided => (
                  <>
                    <ResourceBody>
                      <ResourceTitle>{name}</ResourceTitle>
                      <MetadataList items={profileMetadata(props)} />
                    </ResourceBody>
                    <ResourceActions>
                      <Box mr={4}>
                        <Reorder {...provided.dragHandleProps} />
                      </Box>
                      <Box>
                        <Edit
                          to={`/teams/${teamId}/${siteId}/settings/profiles/${uuid}/edit`}
                        />
                      </Box>
                      {profiles.length <= 1 || (
                        <Box ml={4}>
                          <FormattedMessage
                            id="site.settings.profiles.delete.prompt"
                            values={{ confirmText }}
                          >
                            {message => (
                              <Delete
                                onClick={() => {
                                  const response = prompt(message)
                                  if (response === confirmText) {
                                    onDelete({ uuid })
                                  }
                                }}
                              />
                            )}
                          </FormattedMessage>
                        </Box>
                      )}
                    </ResourceActions>
                  </>
                )}
              </ResourceItem>
            ))}
        </ResourceList>
      ) : loading ? (
        <Section>
          <LoadingLayout />
        </Section>
      ) : (
        <Section>
          <Text>
            <FormattedMessage id="profiles.empty" />
          </Text>
        </Section>
      )}
    </>
  )
}

export default Profiles
