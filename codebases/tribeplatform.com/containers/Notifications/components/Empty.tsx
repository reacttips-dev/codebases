import React from 'react'

import { Flex, VStack } from '@chakra-ui/react'
import CheckLineIcon from 'remixicon-react/CheckLineIcon'

import { Icon, Text } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

const NotificationsEmpty = () => {
  const { t } = useTranslation()
  return (
    <Flex align="center" justify="center" height="70vh">
      <VStack spacing={3}>
        <Icon as={CheckLineIcon} fontSize="1.5rem"></Icon>
        <Text>{t(`notification:empty`, 'You have no new notifications.')}</Text>
      </VStack>
    </Flex>
  )
}

export default NotificationsEmpty
