import React, { useContext } from 'react'

import { Box } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Tag } from 'tribe-api/interfaces'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag as TribeTag,
  TagLabel,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import { TopicsStore } from 'containers/Topic/providers/TopicProvider'

import { useResponsive } from 'hooks/useResponsive'

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
        md: 400,
      },
    },
    mobile: {
      maxH: 'auto',
      borderRadius: 0,
    },
  },
}

export interface DisplayPostTopicModalProps {
  onClose: () => void
  topics: Array<Tag> | null
  slug: string
  isOpen: boolean
}

export const DisplayPostTopicsModal = ({
  topics = [],
  slug,
  isOpen,
  onClose,
}: DisplayPostTopicModalProps) => {
  const { isPhone } = useResponsive()
  const { hideTopicsModal } = useContext(TopicsStore)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay>
        <ModalContent
          {...staticProps.modalContent.common}
          {...(isPhone && staticProps.modalContent.mobile)}
        >
          <ModalHeader color="label.primary" pt={6}>
            <Trans i18nKey="space:tags.display.title" defaults="Tags" />
          </ModalHeader>
          <ModalCloseButton color="label.primary" />
          <ModalBody overflowX="hidden" pt={2}>
            <Box>
              {topics?.map((topic: Tag) => {
                const { id, title } = topic

                return (
                  <NextLink key={id} href={`/${slug}/topics/${id}`}>
                    <Box
                      onClick={() => hideTopicsModal()}
                      cursor="pointer"
                      mb={4}
                    >
                      <TribeTag variant="solid" size="lg">
                        <TagLabel color="label.secondary">{title}</TagLabel>
                      </TribeTag>
                    </Box>
                  </NextLink>
                )
              })}
            </Box>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
