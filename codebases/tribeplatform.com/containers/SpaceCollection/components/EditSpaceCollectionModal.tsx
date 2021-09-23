import React, { useCallback } from 'react'

import { VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { SpaceCollection } from 'tribe-api'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import {
  useCreateSpaceCollection,
  useUpdateSpaceCollection,
} from 'containers/SpaceCollection/hooks'

import {
  EditSpaceCollectionForm,
  EditSpaceCollectionFormInput,
} from './EditSpaceCollectionForm'

export interface EditCollectionModalProps {
  spaceCollection?: SpaceCollection
  isOpen: boolean
  onClose: () => void
}

export const EditSpaceCollectionModal: React.FC<EditCollectionModalProps> = ({
  spaceCollection,
  isOpen,
  onClose,
}) => {
  const { create } = useCreateSpaceCollection()
  const { update } = useUpdateSpaceCollection({
    spaceCollection,
  })
  const router = useRouter()

  const onSubmit = useCallback(
    async (variables: EditSpaceCollectionFormInput) => {
      if (spaceCollection) {
        update({
          ...variables,
        })
      } else {
        const result = await create({
          ...variables,
        })

        if (result) {
          await router.push(`/collection/${result?.id}`)
        }
      }
      onClose()
    },
    [update, create, spaceCollection, onClose, router],
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {spaceCollection ? (
              <VStack align="start">
                <Text color="label.primary" textStyle="semibold/xlarge">
                  <Trans
                    i18nKey="spaceCollection:editModal.title"
                    defaults="Edit collection"
                  />
                </Text>
                <Text color="label.secondary" textStyle="regular/medium">
                  <Trans
                    i18nKey="spaceCollection:editModal.description"
                    defaults="A collection is a group of spaces"
                  />
                </Text>
              </VStack>
            ) : (
              <VStack align="start">
                <Text color="label.primary" textStyle="semibold/xlarge">
                  <Trans
                    i18nKey="spaceCollection:createModal.title"
                    defaults="Create collection"
                  />
                </Text>
                <Text color="label.secondary" textStyle="regular/medium">
                  <Trans
                    i18nKey="spaceCollection:createModal.description"
                    defaults="A collection is a group of spaces"
                  />
                </Text>
              </VStack>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditSpaceCollectionForm
              defaultValues={spaceCollection}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
