import React, { useCallback, useEffect, useState } from 'react'

import { HStack, Flex, VStack } from '@chakra-ui/react'

import { SpaceQuery } from 'tribe-api'
import { ActionPermissions, HighlightedTag } from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import { Button, Card, Text, Tag, TagLabel, useToast } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { AddSpaceHighlightedTopicsModal } from 'containers/Topic/components/AddSpaceHighlightedTopicsModal'

import { logger } from 'lib/logger'

export interface HighlightedTopicsWidgetProps {
  space: SpaceQuery['space']
  onFilterChange: (filterId: string | null) => void
  onFilterClear: () => void
}

export const HighlightedTopicsWidget: React.FC<HighlightedTopicsWidgetProps> = ({
  space,
  onFilterChange,
  onFilterClear,
}) => {
  const permissions = space?.authMemberProps?.permissions as ActionPermissions[]

  const { authorized: canUpdateSpaceHighlightedTopics } = hasActionPermission(
    permissions || [],
    'updateSpaceHighlightedTopics',
  )
  const [showTopicsModal, setShowTopicsModal] = useState(false)

  const toast = useToast()
  const { t } = useTranslation()

  const [highlightedTopicId, setHighlightedTopicId] = useState<string | null>(
    null,
  )

  const handleTagClick = (highlightedTopic: Partial<HighlightedTag>) => {
    const topicId = highlightedTopic?.tag?.id || ''
    if (!topicId) {
      logger.error(
        'Highlighted topic is empty for',
        highlightedTopic,
        'space id: ',
        space?.id,
      )
      toast({
        title: t('common:error', 'Error'),
        status: 'error',
      })
      return
    }

    setHighlightedTopicId(topicId)
    onFilterChange(topicId)
  }

  const shouldDisplay =
    (space?.highlightedTags && space?.highlightedTags?.length > 0) ||
    canUpdateSpaceHighlightedTopics

  const handleFilterClear = useCallback(() => {
    setHighlightedTopicId(null)
    onFilterClear()
  }, [onFilterClear])

  // Clear highlighted topics every time there is a change in space.
  useEffect(() => {
    handleFilterClear()
  }, [space?.id])

  const handleTopicsUpdate = () => {
    setShowTopicsModal(false)
  }

  const handleModalShow = () => {
    setShowTopicsModal(true)
  }

  if (!shouldDisplay) return null

  return (
    <>
      <Card>
        <VStack spacing="5" align="left">
          <Flex
            justify="space-between"
            pt={1}
            pb={5}
            px={6}
            ml={-6}
            mr={-6}
            borderBottom="1px"
            borderColor="border.lite"
          >
            <HStack>
              <Text textStyle="medium/large">
                <Trans
                  i18nKey="space:highlightedTags.title"
                  defaults="Highlighted Tags"
                />
              </Text>
            </HStack>

            {highlightedTopicId && (
              <Text
                cursor="pointer"
                color="accent.base"
                textStyle="medium/small"
                onClick={handleFilterClear}
              >
                <Trans i18nKey="space:highlightedTags.clear" defaults="Clear" />
              </Text>
            )}
          </Flex>

          <HStack>
            <Flex wrap="wrap">
              {space?.highlightedTags &&
                space.highlightedTags.map(highlightedTopic => {
                  return (
                    <Tag
                      cursor="pointer"
                      mb={3}
                      mr={2}
                      key={`${highlightedTopic?.tag?.id}-${highlightedTopic?.text}`}
                      size="md"
                      onClick={() =>
                        handleTagClick(
                          highlightedTopic as Partial<HighlightedTag>,
                        )
                      }
                      bg={
                        highlightedTopic?.tag?.id === highlightedTopicId
                          ? 'highlight'
                          : 'bg.secondary'
                      }
                    >
                      <TagLabel
                        color={
                          highlightedTopic?.tag?.id === highlightedTopicId
                            ? 'label.primary'
                            : 'label.secondary'
                        }
                      >
                        {highlightedTopic?.text}
                      </TagLabel>
                    </Tag>
                  )
                })}
            </Flex>
            {(space?.highlightedTags?.length === 0 ||
              space?.highlightedTags === null) && (
              <Text color="secondary" textStyle="regular/medium">
                <Trans
                  i18nKey="space:highlightedTags.description"
                  defaults="Set up highlighted tags that members can click on to filter the content displayed in this tab."
                />
              </Text>
            )}
          </HStack>

          {canUpdateSpaceHighlightedTopics && (
            <Button onClick={handleModalShow} variant="solid">
              <Trans
                i18nKey="space:highlightedTags.editTitle"
                defaults="Edit Highlighted Tags"
              />
            </Button>
          )}
        </VStack>
      </Card>
      {showTopicsModal && (
        <AddSpaceHighlightedTopicsModal
          onSaveCallback={handleTopicsUpdate}
          onClose={() => setShowTopicsModal(false)}
          spaceId={space?.id}
          spaceSlug={space?.slug}
          initialTopics={(space?.highlightedTags as HighlightedTag[]) || []}
        />
      )}
    </>
  )
}
