import React from 'react'

import { HStack } from '@chakra-ui/react'

import { UpdateNavigationItem } from 'tribe-api/interfaces'
import { Button, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

interface NavigationItemSidebarFooterProps {
  handleClick: () => void
  activeItem: UpdateNavigationItem | null
}
export const NavigationItemSidebarFooter = ({
  handleClick,
  activeItem,
}: NavigationItemSidebarFooterProps) => {
  return (
    <HStack
      justify="center"
      p="5"
      borderTopWidth="1px"
      borderColor="border.base"
    >
      <Button onClick={handleClick} buttonType="primary" w="full" h="full">
        <Text textStyle="medium/medium" color="label.button" py="2">
          {!activeItem ? (
            <Trans
              i18nKey="admin:sidebar.topNavigation.customize.item.add"
              defaults="Add"
            />
          ) : (
            <Trans
              i18nKey="admin:sidebar.topNavigation.customize.item.update"
              defaults="Update"
            />
          )}
        </Text>
      </Button>
    </HStack>
  )
}
