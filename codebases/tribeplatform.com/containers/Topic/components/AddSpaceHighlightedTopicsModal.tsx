import React, { ReactNode, useState, useCallback } from 'react'

import { HStack, VStack, Box, Flex } from '@chakra-ui/react'
import AddLineIcon from 'remixicon-react/AddLineIcon'

import {
  Tag,
  HighlightedTag,
  HighlightedTagType,
  Space,
} from 'tribe-api/interfaces'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  Text,
  Button,
  SkeletonProvider,
  Tag as TribeTag,
  TagLeftIcon,
  TagLabel,
  AutocompleteMultiple,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { useUpdateSpaceHighlightedTopics } from 'containers/Space/hooks/useUpdateSpaceHighlightedTopics'

import { useDebouncedCallback } from 'hooks/useDebounce'
import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'

import Truthy from 'utils/truthy'

import { useGetSpaceTopics } from '../../Space/hooks/useGetSpaceTopics'
import { TopicsLoading } from './TopicsLoading'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type TagWithOptionalId = PartialBy<Tag, 'id'>

const staticProps = {
  modalContent: {
    common: {
      bg: 'bg.base',
      maxW: {
        base: 'full',
        sm: '90vw',
        md: 'md',
      },
      h: {
        base: 'full',
        md: 800,
      },
    },
    mobile: {
      maxH: 'auto',
      borderRadius: 0,
    },
  },
}

export interface AddSpaceHighlightedTopicsModalProps {
  onClose: () => void
  spaceId: Space['id']
  spaceSlug: Space['slug']
  initialTopics: Array<HighlightedTag>
  onSaveCallback: () => void
}

const topicToOption = (topic: Tag) => {
  if (!topic) return

  return {
    id: topic.id,
    value: topic,
    label: topic.title || '',
  }
}

const topicToTag = (topic: HighlightedTag): TagWithOptionalId => ({
  ...topic,
  __typename: 'Tag',
  id: topic.tag?.id,
  slug: topic.tag?.slug || topic.text || '',
  title: topic.text || '',
})

const SuggestedTopicsComponent = ({ children }: { children: ReactNode }) => (
  <>
    <Text
      textTransform="uppercase"
      textStyle="regular/xsmall"
      color="label.secondary"
      mt={6}
    >
      <Trans
        i18nKey="space:highlightedTags.edit.suggested"
        defaults="Space Tags"
      />
    </Text>
    <VStack align="flex-start" spacing={4} mt={2} pb={2}>
      {children}
    </VStack>
  </>
)

export const AddSpaceHighlightedTopicsModal = ({
  initialTopics = [],
  onClose,
  spaceId,
  spaceSlug,
  onSaveCallback,
}: AddSpaceHighlightedTopicsModalProps) => {
  const { t } = useTranslation()

  const {
    query: queryTopics,
    topics,
    loading: loadingTopics,
  } = useGetSpaceTopics({ limit: 10, spaceId })

  const [currentQuery, setCurrentQuery] = useState('')

  const initialTopicsToOption = initialTopics.map(topicToTag).map(topicToOption)

  const [selectedTopics, setSelectedTopics] = useState<
    ReturnType<typeof topicToOption>[]
  >(initialTopicsToOption)

  const { updateSpaceHighlightedTopics } = useUpdateSpaceHighlightedTopics({
    spaceId,
    spaceSlug,
  })

  const { isPhone } = useResponsive()

  const _queryTopics = useDebouncedCallback(query => {
    try {
      if (queryTopics) queryTopics(query)
    } catch (e) {
      logger.error('space tags search', e)
    }
  }, 200)

  const suggestedTopics =
    topics?.filter(
      ({ title }) => !selectedTopics.some(sm => sm?.label === title),
    ) || []

  const updatePostTopics = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedTopics: Array<{
      type: HighlightedTagType.TOPIC
      text: string
      tagId: string
    }> = []

    selectedTopics.forEach(topic => {
      if (topic?.id) {
        mappedTopics.push({
          type: HighlightedTagType.TOPIC,
          text: topic?.label,
          tagId: topic?.id,
        })
      }
    })

    updateSpaceHighlightedTopics({
      highlightedTags: mappedTopics,
    })
    onSaveCallback()
  }, [onSaveCallback, selectedTopics, updateSpaceHighlightedTopics])

  const updateSelectedTopics = useCallback(
    topics => {
      setSelectedTopics(topics.map(topicToOption))
    },
    [setSelectedTopics],
  )

  const isTagAlreadyAdded = selectedTopics?.some(
    topic => topic?.label === currentQuery,
  )

  return (
    <SkeletonProvider loading={loadingTopics}>
      <Modal
        isOpen
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent
            {...staticProps.modalContent.common}
            {...(isPhone && staticProps.modalContent.mobile)}
          >
            <ModalHeader color="label.primary" pt={6}>
              <Flex justify="center">
                <Trans
                  i18nKey="space:highlightedTags.edit.modalTitle"
                  defaults="Highlighted Tags"
                />
              </Flex>
            </ModalHeader>
            <ModalCloseButton color="label.primary" />
            <ModalBody overflowX="hidden" pt={2}>
              <AutocompleteMultiple
                placeholder={t(
                  'space:highlightedTags.edit.placeholder',
                  'Search for a tag',
                )}
                options={suggestedTopics.map(topicToOption).filter(Truthy)}
                value={selectedTopics.map(t => t?.value).filter(Truthy)}
                optionConverter={topicToOption}
                onChange={updateSelectedTopics}
                open={false}
                onSearch={async query => {
                  setCurrentQuery(query)
                  _queryTopics({ query })
                  return []
                }}
              />
              {loadingTopics && <TopicsLoading />}
              {!loadingTopics && suggestedTopics?.length > 0 && (
                <SuggestedTopicsComponent>
                  {suggestedTopics.map((topic: Tag) => {
                    const { id, title } = topic

                    return (
                      <Box
                        key={id}
                        data-testid={`topic-${id}`}
                        w="full"
                        cursor="pointer"
                        onClick={() => {
                          setSelectedTopics([
                            ...selectedTopics,
                            topicToOption(topic),
                          ])
                        }}
                      >
                        <TribeTag variant="solid" size="lg">
                          <TagLeftIcon w="16px" h="16px" as={AddLineIcon} />
                          <TagLabel>{title}</TagLabel>
                        </TribeTag>
                      </Box>
                    )
                  })}
                </SuggestedTopicsComponent>
              )}

              {!loadingTopics &&
                suggestedTopics?.length === 0 &&
                currentQuery !== '' && (
                  <Flex h="30%" alignItems="center" justify="center">
                    <HStack>
                      {!isTagAlreadyAdded && (
                        <Flex h="90%" alignItems="center" justify="center">
                          <Text>
                            <Trans
                              i18nKey="space:highlightedTags.edit.noResults"
                              defaults="No results"
                            />
                          </Text>
                        </Flex>
                      )}
                    </HStack>
                  </Flex>
                )}
            </ModalBody>
            <ModalFooter borderTop="1px solid" borderColor="border.base">
              <Flex justifyItems="flex-end">
                <Button
                  buttonType="primary"
                  data-testid="add-button"
                  onClick={updatePostTopics}
                >
                  <Trans
                    i18nKey="space:highlightedTags.edit.update"
                    defaults="Update"
                  />
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </SkeletonProvider>
  )
}
