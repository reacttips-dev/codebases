import React from 'react'

import { Box, Stack, VStack } from '@chakra-ui/react'
import { useIntercom } from 'react-use-intercom'
import BookOpenLineIcon from 'remixicon-react/BookOpenLineIcon'
import Share from 'remixicon-react/Chat1LineIcon'
import Fire from 'remixicon-react/FireFillIcon'
import MagicLine from 'remixicon-react/MagicLineIcon'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Divider,
  Button,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import ExternalLink from './ExternalLink'

export interface UserHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UserHelpModal = ({ isOpen, onClose }) => {
  const { showNewMessages } = useIntercom()
  const onClick = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).Intercom) {
        showNewMessages()
      } else {
        window.open('mailto:success@tribe.so', '_blank')
      }
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      trapFocus={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader data-testid="user-help-modal-header">
            <Trans
              i18nKey="common:userhelp.modal.title"
              defaults="Help & Community"
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack alignItems="flex-start" divider={<Divider />}>
              <ExternalLink
                href="https://community.tribe.so/knowledge-base-2-0/"
                title={
                  <Trans
                    i18nKey="common.userhelp.knowledge.title"
                    defaults="Knowledge Base"
                  />
                }
                linkIcon={BookOpenLineIcon}
                description={
                  <Trans
                    i18nKey="common.userhelp.knowledge.descript"
                    defaults="Learn everything there is to know about Tribe"
                  />
                }
              />

              <ExternalLink
                href="https://community.tribe.so/"
                title={
                  <Trans
                    i18nKey="common.userhelp.ask.title"
                    defaults="Ask the Community"
                  />
                }
                linkIcon={Fire}
                description={
                  <Trans
                    i18nKey="common.userhelp.ask.descript"
                    defaults="Find answers, ask questions and help others in our community"
                  />
                }
              />

              <ExternalLink
                href="https://community.tribe.so/whats-new"
                title={
                  <Trans
                    i18nKey="common.userhelp.whatsNew.title"
                    defaults="What’s New?"
                  />
                }
                linkIcon={MagicLine}
                description={
                  <Trans
                    i18nKey="common.userhelp.whatsNew.descript"
                    defaults="Discover Tribe’s newest features and enhancements"
                  />
                }
              />

              {/* <ExternalLink
                href="https://tribe.so/blog/"
                title={
                  <Trans i18nKey="common.userhelp.blog.title" defaults="Blog" />
                }
                linkIcon={Blog}
                description={
                  <Trans
                    i18nKey="common.userhelp.blog.descript"
                    defaults="Guides and learning materials for community professionals"
                  />
                }
              /> */}

              <ExternalLink
                href="https://community.tribe.so/tribe-2-feedback"
                title={
                  <Trans
                    i18nKey="common.userhelp.feedback.title"
                    defaults="Share feedback"
                  />
                }
                linkIcon={Share}
                description={
                  <Trans
                    i18nKey="common.userhelp.feedback.descript"
                    defaults="Share your feedback and feature requests with the community"
                  />
                }
              />
            </VStack>

            <Stack spacing="2" my="4">
              <Text alignItems="center" textStyle="medium/medium">
                <Trans
                  i18nKey="common.userhelp.manual.help"
                  defaults="Still can’t find what you’re looking for?"
                />
              </Text>

              <Text
                ml="2.51"
                textStyle="regular/small"
                color="label.secondary"
                lineHeight="18px"
              >
                <Trans
                  i18nKey="userhelp.manual.intercom"
                  defaults="Our team’s always available for a chat. Let us know how we can help."
                />
              </Text>
            </Stack>
            <Box>
              <Button buttonType="primary" size="md" onClick={onClick}>
                <Trans
                  i18nKey="userhelp.intercom.send"
                  defaults="Chat with us"
                  color="accent.base"
                />
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}
