import React, { useState } from 'react'

import { Box, VStack } from '@chakra-ui/react'

import { Button, Text } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import CookieConsentPreferencesModal from 'containers/Apps/components/CookieConsent/CookieConsentPreferencesModal'

const DisabledEmbed = () => {
  const { t } = useTranslation()
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false)
  return (
    <Box background="bg.secondary" p={10} mt={3}>
      <VStack spacing={4}>
        <Text textStyle="regular/large">
          {t(
            'common:post.embed.disabled',
            'This embeded item requires specific cookies to be enabled',
          )}
        </Text>
        <Button buttonType="primary" onClick={() => setIsPrefModalOpen(true)}>
          {t('common:post.embed.managePref', 'Manage preferences')}
        </Button>
      </VStack>
      <CookieConsentPreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
      />
    </Box>
  )
}

export default DisabledEmbed
