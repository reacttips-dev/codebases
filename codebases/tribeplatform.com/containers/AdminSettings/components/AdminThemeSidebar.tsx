import React, { useState } from 'react'

import { VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import {
  ColorInput,
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarItem,
  SkeletonProvider,
  Text,
  ThemeToken,
  Divider,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import useGetNetwork from 'containers/Network/useGetNetwork'

const defaultSidebarFields = {
  'accent.base': {
    label: (
      <Trans
        i18nKey="admin:sidebar.theme.primaryColor"
        defaults="Primary color"
      />
    ),
    visible: false,
  },
  'bg.secondary': {
    label: (
      <Trans
        i18nKey="admin:sidebar.theme.secondaryBackgroundColor"
        defaults="Secondary"
      />
    ),
    visible: false,
  },
  'bg.base': {
    label: (
      <Trans
        i18nKey="admin:sidebar.theme.backgroundColor"
        defaults="Background"
      />
    ),
    visible: false,
  },
  'label.primary': {
    label: <Trans i18nKey="admin:sidebar.theme.textColor" defaults="Text" />,
    visible: false,
  },
}

function AdminThemeSidebar() {
  const router = useRouter()
  const { loading: loadingNetwork } = useGetNetwork()
  const [sidebarFields, setSidebarFields] = useState(defaultSidebarFields)
  const {
    themeSettings,
    updateThemeSettings: setThemeSettings,
  } = useThemeSettings()

  const { from } = router.query || {}

  const goToMainAdminSettings = () => {
    if (from) return router.push(String(from))
    return router.push('/admin/network/branding')
  }

  const selectColorPicker = (tokenKey: string) => {
    hideAllColorPickers()
    const updatedSidebarFields = {
      ...sidebarFields,
      [tokenKey]: { ...sidebarFields[tokenKey], visible: true },
    }
    return setSidebarFields(updatedSidebarFields)
  }

  const updateColorHex = (selectedIndex: number, hex: string) => {
    const updatedColorPickerStates = themeSettings.colors?.map(
      (colorPicker, i) => {
        if (i === selectedIndex) {
          return { ...colorPicker, value: hex }
        }
        return colorPicker
      },
    )
    if (setThemeSettings)
      setThemeSettings({
        colors: updatedColorPickerStates,
      })
  }

  const hideAllColorPickers = () => {
    const updateSidebarFields = { ...sidebarFields }
    Object.keys(sidebarFields).forEach(fieldKey => {
      updateSidebarFields[fieldKey].visible = false
    })
    return setSidebarFields(updateSidebarFields)
  }

  return (
    <SkeletonProvider loading={loadingNetwork}>
      <Sidebar
        pt={{ base: '5rem', [SIDEBAR_VISIBLE]: 8 }}
        pb={6}
        overflow="visible"
      >
        <SidebarItem
          data-testid="sidebar-back-button"
          onClick={goToMainAdminSettings}
          icon={ArrowLeftLineIcon}
          variant="ghost"
          mb={6}
        >
          <Text textStyle="medium/small" color="label.secondary">
            <Trans i18nKey="admin:sidebar.theme.back" defaults="Back" />
          </Text>
        </SidebarItem>

        <Text textStyle="medium/large" color="label.primary">
          <Trans i18nKey="admin:sidebar.theme.colors" defaults="Colors" />
        </Text>

        <Divider w="auto" my={5} mx={-6} />

        <VStack align="stretch" spacing={8}>
          {themeSettings.colors?.map(
            (colorPicker: ThemeToken, selectedIndex) => (
              <ColorInput
                // eslint-disable-next-line react/no-array-index-key
                key={selectedIndex}
                colorPicker={colorPicker}
                isColorPickerVisible={sidebarFields[colorPicker.key].visible}
                onClickColorPicker={() => selectColorPicker(colorPicker.key)}
                onChangeColor={hex => updateColorHex(selectedIndex, hex)}
                onClickOutside={hideAllColorPickers}
                label={sidebarFields[colorPicker.key].label}
              />
            ),
          )}
        </VStack>
      </Sidebar>
    </SkeletonProvider>
  )
}

export default AdminThemeSidebar
