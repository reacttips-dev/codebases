import React from 'react'

import { HStack } from '@chakra-ui/layout'
import EditBoxLineIcon from 'remixicon-react/EditBoxLineIcon'

import {
  Avatar,
  Card,
  Icon,
  IconButton,
  Text,
  useResponsive,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useAuthMember from 'hooks/useAuthMember'

const ComposerCard = (props: { onClick: () => void }) => {
  const { authUser } = useAuthMember()
  const { isPhone } = useResponsive()
  const { t } = useTranslation()

  return isPhone ? (
    <IconButton
      icon={<Icon as={EditBoxLineIcon} width="20px" height="20px" />}
      aria-label={t('post:new.placeholder', 'What’s on your mind?')}
      buttonType="primary"
      borderRadius="full"
      position="fixed"
      bottom={6}
      zIndex="sticky"
      right={6}
      w={14}
      h={14}
      onClick={props.onClick}
      data-testid="composer-toggler"
    />
  ) : (
    <Card
      style={{ cursor: 'pointer' }}
      onClick={props.onClick}
      bg="bg.base"
      p={0}
      px={0}
      py={0}
      data-testid="composer-toggler"
    >
      <HStack p={3}>
        {authUser && (
          <Avatar
            name={authUser.displayName || authUser.name}
            src={authUser?.profilePicture}
          />
        )}
        <Text
          fontSize="md"
          color="label.secondary"
          data-testid="composer-post-title"
        >
          <Trans
            i18nKey="post:new.placeholder"
            defaults="What’s on your mind?"
          />
        </Text>
      </HStack>
    </Card>
  )
}

export default ComposerCard
