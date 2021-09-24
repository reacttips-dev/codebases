import React from 'react'

import { HStack } from '@chakra-ui/react'

import { Button, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

interface BrandingSidebarFooterProps {
  handleClick: () => void
  handleSaveLoading: boolean
}
export const BrandingSidebarFooter = ({
  handleClick,
  handleSaveLoading,
}: BrandingSidebarFooterProps) => (
  <HStack justify="center" p="5" borderTopWidth="1px" borderColor="border.base">
    <Button
      disabled={handleSaveLoading}
      isLoading={handleSaveLoading}
      onClick={() => handleClick()}
      buttonType="primary"
      w="full"
      h="full"
      data-testid="cta-button"
    >
      <Text textStyle="medium/medium" color="label.button" py="2">
        <Trans i18nKey="admin:sidebar.footer.update" defaults="Update" />
      </Text>
    </Button>
  </HStack>
)
