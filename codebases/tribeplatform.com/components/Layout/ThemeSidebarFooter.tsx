import React from 'react'

import { HStack } from '@chakra-ui/react'

import { ThemeStatus, UpdateThemes } from 'tribe-api'
import { Button, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import useGetNetwork from 'containers/Network/useGetNetwork'

import useUpdateNetwork from 'hooks/useUpdateNetwork'

type MergedTheme = UpdateThemes['active']

const ThemeSidebarFooter = () => {
  const { network } = useGetNetwork()
  const { themeSettings, mergeThemeSettings } = useThemeSettings()
  const { updateNetwork } = useUpdateNetwork()

  let mergedTokens = themeSettings
  if (mergeThemeSettings && network?.themes?.active?.tokens) {
    mergedTokens = mergeThemeSettings(
      network?.themes?.active?.tokens,
      themeSettings,
    )
  }
  const onSave = () => {
    const mergedTheme: MergedTheme = {
      name: 'currentTheme',
      status: ThemeStatus.PUBLISHED,
      tokens: mergedTokens,
    }
    updateNetwork({
      themes: {
        active: mergedTheme,
        drafts: [],
        published: [mergedTheme],
      },
    })
  }
  return (
    <HStack
      justify="center"
      p="5"
      borderTopWidth="1px"
      borderColor="border.base"
    >
      <Button buttonType="primary" w="full" h="full" onClick={onSave}>
        <Text textStyle="medium/medium" color="label.button" py="2">
          <Trans i18nKey="admin:sidebar.theme.save" defaults="Save & Publish" />
        </Text>
      </Button>
    </HStack>
  )
}

export default ThemeSidebarFooter
