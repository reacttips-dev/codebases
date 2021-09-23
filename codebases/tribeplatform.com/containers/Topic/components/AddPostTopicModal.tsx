import React, { ReactNode, useEffect, useState, useCallback } from 'react'

import { HStack, VStack, Box, Flex } from '@chakra-ui/react'
import AddLineIcon from 'remixicon-react/AddLineIcon'

import { Tag } from 'tribe-api/interfaces'
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
  CloseButton,
  AutocompleteMultiple,
  Tag as TribeTag,
  TagLeftIcon,
  TagLabel,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { useDebouncedCallback } from 'hooks/useDebounce'
import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'

import Truthy from 'utils/truthy'

import { useGetSpaceTopics } from '../../Space/hooks/useGetSpaceTopics'
import { TopicsLoading } from './TopicsLoading'

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
      fullSizeOniPhone: true,
      alignSelf: 'flex-start',
    },
  },
}

export interface AddPostTopicModalProps {
  isOpen: boolean
  onClose: () => void
  spaceId: string
  onSaveCallback: (topics: Array<Partial<Tag>>) => void
  initialTopics: Array<Tag> | null
}

const topicToOption = (topic: Tag) => {
  if (!topic) return

  return {
    id: topic.id || Date.now(),
    value: topic,
    label: topic.title || '',
  }
}

const SuggestedTopicsComponent = ({ children }: { children: ReactNode }) => (
  <>
    <Text
      textTransform="uppercase"
      textStyle="regular/xsmall"
      color="label.secondary"
      mt={6}
    >
      <Trans i18nKey="space:tags.post.suggested" defaults="Suggested" />
    </Text>
    <VStack align="flex-start" spacing={4} mt={2} pb={2}>
      {children}
    </VStack>
  </>
)

export const AddPostTopicModal = ({
  initialTopics = [],
  isOpen,
  onClose,
  spaceId,
  onSaveCallback,
}: AddPostTopicModalProps) => {
  const { t } = useTranslation()

  const {
    query: queryTopics,
    topics,
    loading: loadingTopics,
  } = useGetSpaceTopics({ limit: 10, spaceId })

  const [currentQuery, setCurrentQuery] = useState('')

  const initialTopicsToOption = initialTopics?.map(topicToOption)

  const [selectedTopics, setSelectedTopics] = useState<
    ReturnType<typeof topicToOption>[]
  >(initialTopicsToOption || [])

  const { isPhone, mobileHeader } = useResponsive()

  useEffect(() => {
    if (isOpen) {
      mobileHeader.setLeft(
        <CloseButton
          size="sm"
          w={10}
          h={10}
          onClick={onClose}
          background="bg.secondary"
          borderRadius="base"
        />,
      )

      mobileHeader.setRight(null)
    }
  }, [isOpen])

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

  const handleTopicCreate = useCallback(() => {
    //   Create the topic
    setSelectedTopics([
      ...selectedTopics,
      topicToOption({
        __typename: 'Tag',
        description: null,
        slug: '',
        title: currentQuery,
        //  Temporary id
        id: String(Date.now()),
      }),
    ])
    setCurrentQuery('')
  }, [currentQuery])

  const updatePostTopics = useCallback(() => {
    const mappedTopics = selectedTopics.map(topic => {
      return { id: String(topic?.id), title: topic?.label }
    })
    onSaveCallback(mappedTopics)
  }, [selectedTopics, onSaveCallback])

  const updateSelectedTopics = useCallback(
    topics => {
      setSelectedTopics(topics.map(topicToOption))
    },
    [setSelectedTopics],
  )

  const isTagAlreadyAdded = selectedTopics?.some(
    topic => topic?.label === currentQuery,
  )

  const isTagAlreadySuggested = suggestedTopics?.some(
    topic => topic?.title === currentQuery,
  )

  // const loading = loadingMembers || loadingSpaceRoles

  return (
    <SkeletonProvider loading={loadingTopics}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent
            {...staticProps.modalContent.common}
            {...(isPhone && staticProps.modalContent.mobile)}
            fullSizeOniPhone
          >
            <ModalHeader color="label.primary" pt={6}>
              <Flex justify="center">
                <Trans i18nKey="space:tags.post.add.title" defaults="Add Tag" />
              </Flex>
            </ModalHeader>
            <ModalCloseButton color="label.primary" />
            <ModalBody overflowX="hidden" pt={2}>
              <AutocompleteMultiple
                placeholder={t(
                  'space:tags.post.add.placeholder',
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
                clearOnAdd
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
                          <TagLeftIcon w={4} h={4} as={AddLineIcon} />
                          <TagLabel>{title}</TagLabel>
                        </TribeTag>
                      </Box>
                    )
                  })}
                </SuggestedTopicsComponent>
              )}

              {!loadingTopics && !isTagAlreadySuggested && currentQuery !== '' && (
                <Flex h="30%" alignItems="center" justify="center">
                  <HStack>
                    {!isTagAlreadyAdded && (
                      <Text>
                        <Trans
                          i18nKey="space:tags.post.create"
                          defaults="Create tag:"
                        />
                      </Text>
                    )}

                    {isTagAlreadyAdded && (
                      <Text>
                        <Trans
                          i18nKey="space:tags.post.present"
                          defaults="Tag has been already added to the post."
                        />
                      </Text>
                    )}

                    {!isTagAlreadyAdded && (
                      <TribeTag
                        cursor="pointer"
                        onClick={handleTopicCreate}
                        variant="solid"
                        size="lg"
                      >
                        <TagLeftIcon w="16px" h="16px" as={AddLineIcon} />
                        <TagLabel>{currentQuery}</TagLabel>
                      </TribeTag>
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
                    i18nKey="space:tags.post.add.buttonText"
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
