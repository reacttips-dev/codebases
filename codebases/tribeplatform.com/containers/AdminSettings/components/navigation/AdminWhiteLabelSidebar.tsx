import React, { useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'

import {
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarItem,
  Skeleton,
  SkeletonProvider,
  Switch,
  Text,
  UserBar,
  Divider,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { Sidebar as LayoutSidebar } from 'components/Layout'

import { BrandingSidebarFooter } from './BrandingSidebarFooter'

const staticProps = {
  whiteLabelSubtitle: {
    style: {
      display: 'block',
    },
  },
  sidebar: { base: '5rem', [SIDEBAR_VISIBLE]: 8 },
}

interface AdminWhiteLabelSidebarProps {
  enabled: boolean
  loading: boolean
  handleWhiteLabelSaveLoading: boolean
  handleWhiteLabelVisibility: (visible: boolean) => void
  handleWhiteLabelSave: (enabled: boolean) => void
}
export const AdminWhiteLabelSidebar = ({
  enabled,
  loading,
  handleWhiteLabelVisibility,
  handleWhiteLabelSave,
  handleWhiteLabelSaveLoading,
}: AdminWhiteLabelSidebarProps) => {
  const router = useRouter()
  const [isWhiteLabelEnabled, setIsWhiteLabelEnabled] = useState(enabled)
  const { t } = useTranslation()

  const { from } = router.query || {}

  const handleToggle = () => {
    handleWhiteLabelVisibility(!isWhiteLabelEnabled)
    setIsWhiteLabelEnabled(!isWhiteLabelEnabled)
  }

  const goToMainAdminSettings = () => {
    if (from) return router.push(String(from))
    return router.push('/admin/network/branding')
  }

  const handleSave = () => {
    handleWhiteLabelSave(isWhiteLabelEnabled)
  }

  return (
    <SkeletonProvider loading={loading}>
      <LayoutSidebar
        footer={
          <BrandingSidebarFooter
            handleSaveLoading={handleWhiteLabelSaveLoading}
            handleClick={handleSave}
          />
        }
      >
        <Sidebar pt={staticProps.sidebar} pb={6} data-testid="primary-sidebar">
          <SidebarItem
            data-testid="sidebar-back-button"
            onClick={goToMainAdminSettings}
            icon={ArrowLeftLineIcon}
            variant="ghost"
            mb={6}
          >
            <Text textStyle="medium/small" color="label.secondary">
              <Trans i18nKey="common.back" defaults="Back" />
            </Text>
          </SidebarItem>

          <Text textStyle="medium/large" color="label.primary">
            <Trans
              i18nKey="admin:sidebar.whiteLabel.title"
              defaults="White-Label"
            />
          </Text>

          <Divider w="auto" my={5} mx={-6} />

          <Skeleton w="100%">
            <Flex maxH="75vh" direction="column">
              <Box pb={4}>
                <Flex>
                  <UserBar
                    withPicture={false}
                    title={t(
                      'admin:sidebar.whiteLabel.display.title',
                      'Display Tribe branding',
                    )}
                    subtitle={t(
                      'admin:sidebar.whiteLabel.display.subtitle',
                      'Display a “Powered by Tribe” badge on the community navigation and email footers',
                    )}
                    subtitleProps={staticProps.whiteLabelSubtitle}
                  />
                  <Switch
                    isChecked={isWhiteLabelEnabled}
                    onChange={handleToggle}
                  />
                </Flex>
              </Box>
            </Flex>
          </Skeleton>
        </Sidebar>
      </LayoutSidebar>
    </SkeletonProvider>
  )
}
