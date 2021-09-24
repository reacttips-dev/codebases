import React, { useCallback, useEffect, useState } from 'react'

import { HStack, VStack } from '@chakra-ui/react'
import produce from 'immer'

import { Space, SpaceCollection } from 'tribe-api'
import {
  Avatar,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Button,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { DraggableBox } from 'components/common/DragAndDrop'

import {
  useGetSpaceCollection,
  useOrganizeSpaceCollectionSpaces,
} from 'containers/SpaceCollection/hooks'

export interface OrganizeSpaceCollectionModalProps {
  spaceCollection?: SpaceCollection
  isOpen: boolean
  onClose: () => void
}

export const OrganizeSpaceCollectionModal: React.FC<OrganizeSpaceCollectionModalProps> = ({
  spaceCollection,
  isOpen,
  onClose,
}) => {
  const { spaces, isEmpty } = useGetSpaceCollection(spaceCollection?.id || '')
  const { organize } = useOrganizeSpaceCollectionSpaces({ spaceCollection })

  const [sortedSpaces, setSortedSpaces] = useState<Space[]>([])
  useEffect(() => {
    setSortedSpaces(spaces)
  }, [spaces])

  const onMove = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = sortedSpaces[dragIndex]
      setSortedSpaces(
        produce(sortedSpaces, draft => {
          draft[dragIndex] = draft[hoverIndex]
          draft[hoverIndex] = dragCard
        }),
      )
    },
    [sortedSpaces],
  )

  const onSave = useCallback(() => {
    const spaceIds = sortedSpaces.map(it => it.id)
    organize(spaceIds)
    onClose()
  }, [onClose, sortedSpaces])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <VStack align="start">
              <Text color="label.primary" textStyle="semibold/xlarge">
                <Trans
                  i18nKey="spaceCollection:organizeModal.title"
                  defaults="Organize spaces in the collection"
                />
              </Text>
              <Text color="label.secondary" textStyle="regular/medium">
                <Trans
                  i18nKey="spaceCollection:organizeModal.description"
                  defaults="Customize order by draging and dropping spaces"
                />
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch">
              {isEmpty && (
                <Text>
                  <Trans
                    i18nKey="spaceCollection:organizeModal.spaces.empty"
                    defaults="You don’t have spaces in this collection to organize. Please add spaces to this collection first."
                  />
                </Text>
              )}
              {sortedSpaces?.map((space, index) => (
                <DraggableBox
                  key={space.id}
                  index={index}
                  id={space.id}
                  onMove={onMove}
                >
                  <HStack>
                    <Avatar src={space?.image} size="xs" name={space?.name} />
                    <Text>{space.name}</Text>
                  </HStack>
                </DraggableBox>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack justify="flex-end" width="full">
              <Button buttonType="secondary" onClick={onClose}>
                <Trans i18nKey="common:actions.cancel" defaults="Cancel" />
              </Button>
              <Button buttonType="primary" onClick={onSave}>
                <Trans i18nKey="common:actions.save" defaults="Save" />
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
