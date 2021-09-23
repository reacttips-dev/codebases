import React, { useCallback, useEffect, useReducer, useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'
import produce from 'immer'
import { useRouter } from 'next/router'
import AddLineIcon from 'remixicon-react/AddLineIcon'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'

import { UpdateNavigationItem } from 'tribe-api/interfaces'
import {
  Icon,
  Sidebar,
  SIDEBAR_VISIBLE,
  SidebarItem,
  Skeleton,
  SkeletonProvider,
  Switch,
  Text,
  UserBar,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { DraggableBox } from 'components/common/DragAndDrop'
import { Sidebar as LayoutSidebar } from 'components/Layout'

import {
  INITIAL_TOP_NAVIGATION_STATE,
  TopNavigationActions,
  topNavigationReducer,
} from '../../utils/TopNavigationReducer'
import { BrandingSidebarFooter } from './BrandingSidebarFooter'
import {
  NavigationItemFormValues,
  NavigationItemSidebar,
} from './NavigationItemSidebar'

interface AdminTopNavigationSidebarProps {
  enabled: boolean
  loading: boolean
  handleNavigationSaveLoading: boolean
  handleNavigationVisibility: (enabled: boolean) => void
  updatePreviewItems: (items: Array<UpdateNavigationItem>) => void
  handleNavigationSave: () => void
  initialItems: Array<UpdateNavigationItem>
}
export const AdminTopNavigationSidebar = ({
  enabled,
  loading,
  handleNavigationVisibility,
  handleNavigationSave,
  updatePreviewItems,
  handleNavigationSaveLoading,
  initialItems = [],
}: AdminTopNavigationSidebarProps) => {
  const router = useRouter()
  const [isNavEnabled, setIsNavEnabled] = useState(enabled)
  const { t } = useTranslation()
  const [store, dispatch] = useReducer(topNavigationReducer, {
    ...INITIAL_TOP_NAVIGATION_STATE,
    items: initialItems,
  })

  const { from } = router.query || {}

  const handleNavEnabledToggle = () => {
    handleNavigationVisibility(!isNavEnabled)
    setIsNavEnabled(!isNavEnabled)
  }

  const handleNavItemMove = (dragIndex: number, hoverIndex: number) => {
    const dragCard = store?.items[dragIndex]
    dispatch({
      type: TopNavigationActions.reorderNavItems,
      payload: produce(store?.items, draft => {
        draft[dragIndex] = draft[hoverIndex]
        draft[hoverIndex] = dragCard
      }),
    })
  }

  useEffect(() => {
    updatePreviewItems(store?.items)
  }, [store?.items, updatePreviewItems])

  const goToMainAdminSettings = () => {
    if (from) return router.push(String(from))
    return router.push('/admin/network/branding')
  }

  const handleNavItemClose = () => {
    dispatch({ type: TopNavigationActions.hideNavItem })
  }

  const handleNavItemDelete = () => {
    dispatch({ type: TopNavigationActions.deleteNavItem })
  }

  const handleNavItemSave = useCallback(
    (value: NavigationItemFormValues, update = false) => {
      const { type, text, link, newWindow } = value
      const navItem: UpdateNavigationItem = {
        type,
        text,
        link,
        openInNewWindow: newWindow,
      }
      if (update) {
        dispatch({
          type: TopNavigationActions.updateNavItemComplete,
          payload: navItem,
        })
      } else {
        dispatch({ type: TopNavigationActions.addNavItem, payload: navItem })
      }
    },
    [],
  )

  const handleSave = () => {
    handleNavigationSave()
  }

  const handleAddItem = () => {
    dispatch({ type: TopNavigationActions.showNewNavItem })
  }

  const handleUpdateItem = (index: number) => {
    const item = store?.items[index]
    dispatch({
      type: TopNavigationActions.updateNavItemInit,
      payload: { index, item },
    })
  }

  if (!store?.displayMainSidebar) {
    return (
      <NavigationItemSidebar
        handleBackButton={handleNavItemClose}
        handleItemSave={handleNavItemSave}
        handleItemDelete={handleNavItemDelete}
        activeItem={store?.activeItem}
      />
    )
  }

  return (
    <SkeletonProvider loading={loading}>
      <LayoutSidebar
        footer={
          <BrandingSidebarFooter
            handleSaveLoading={handleNavigationSaveLoading}
            handleClick={handleSave}
          />
        }
      >
        <Sidebar
          pt={{ base: '5rem', [SIDEBAR_VISIBLE]: 8 }}
          pb={6}
          data-testid="primary-sidebar"
        >
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

          <Skeleton w="100%">
            <Flex maxH="75vh" direction="column">
              <Box pb={4} borderBottom="1px" borderBottomColor="border.lite">
                <Flex align="center">
                  <UserBar
                    withPicture={false}
                    title={t(
                      'admin:sidebar.topNavigation.display.title',
                      'Top Navigation',
                    )}
                    subtitle={t(
                      'admin:sidebar.topNavigation.display.description',
                      {
                        defaultValue: 'Header for your community',
                      },
                    )}
                  />
                  <Switch
                    isChecked={isNavEnabled}
                    onChange={handleNavEnabledToggle}
                  />
                </Flex>
              </Box>

              <Box flex="1" mt={3} overflow="auto">
                <UserBar
                  withPicture={false}
                  title={t('admin:sidebar.topNavigation.customize.title', {
                    defaultValue: 'Navigation items',
                  })}
                  subtitle={t(
                    'admin:sidebar.topNavigation.customize.description',
                    {
                      defaultValue: 'Customize the navigation items',
                    },
                  )}
                />

                {store?.items?.map(
                  (item: UpdateNavigationItem, index: number) => (
                    <DraggableBox
                      mt={4}
                      borderColor="border.lite"
                      overflow="hidden"
                      borderRadius="0"
                      py={2}
                      key={item?.text}
                      index={index}
                      id={item?.text}
                      onMove={handleNavItemMove}
                    >
                      <Flex
                        ml={0}
                        w="100%"
                        align="center"
                        justify="space-between"
                        onClick={() => handleUpdateItem(index)}
                        cursor="pointer"
                      >
                        <Text
                          maxW="150px"
                          isTruncated
                          textStyle="medium/medium"
                        >
                          {item?.text}
                        </Text>
                        <Icon
                          as={ArrowRightSLineIcon}
                          boxSize={5}
                          color="label.secondary"
                        />
                      </Flex>
                    </DraggableBox>
                  ),
                )}
                <Flex
                  align="center"
                  justify="start"
                  my={4}
                  py={2}
                  px={2}
                  border="1px"
                  borderColor="border.lite"
                  onClick={handleAddItem}
                  cursor="pointer"
                >
                  <Flex
                    h="20px"
                    w="20px"
                    borderRadius="base"
                    align="center"
                    justify="center"
                    mr={2}
                    backgroundColor="bg.secondary"
                  >
                    <AddLineIcon size="16" />
                  </Flex>

                  <Text color="label.secondary" textStyle="regular/medium">
                    <Trans
                      i18nKey="admin:sidebar.topNavigation.customize.add"
                      defaults="Add"
                    />
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Skeleton>
        </Sidebar>
      </LayoutSidebar>
    </SkeletonProvider>
  )
}
