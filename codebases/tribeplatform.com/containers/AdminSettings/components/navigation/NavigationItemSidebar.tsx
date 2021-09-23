import React, { useCallback, useEffect } from 'react'

import { Box, Flex, HStack, Select, VStack } from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'

import { UpdateNavigationItem } from 'tribe-api'
import { NavigationItemType } from 'tribe-api/interfaces'
import {
  Icon,
  Dropdown,
  DropdownList,
  DropdownIconButton,
  DropdownItem,
  FormControl,
  Text,
  SIDEBAR_VISIBLE,
  FormlabelSecondary,
  Input,
  Checkbox,
  FormErrorMessage,
  FormLabel,
} from 'tribe-components'
import { i18n, Trans, useTranslation } from 'tribe-translation'

import { Sidebar } from 'components/Layout'

import { NavigationItemSidebarFooter } from './NavigationItemSidebarFooter'

interface NavigationItemSidebarProps {
  activeItem: (UpdateNavigationItem & { link: string }) | null
  handleBackButton: () => void
  handleItemSave: (
    value: NavigationItemFormValues,
    shouldUpdate: boolean,
  ) => void
  handleItemDelete: () => void
}

export interface NavigationItemFormValues {
  type: NavigationItemType
  text: string
  link: string
  newWindow: boolean
}

const selectOptions = [
  {
    label: i18n.t(
      'admin:sidebar.topNavigation.customize.item.form.label.typeOptions.link',
      'Link',
    ),
    value: NavigationItemType.TEXT_LINK,
    id: NavigationItemType.TEXT_LINK,
  },
  {
    label: i18n.t(
      'admin:sidebar.topNavigation.customize.item.form.label.typeOptions.primaryLink',
      'Primary Link',
    ),
    value: NavigationItemType.PRIMARY_LINK,
    id: NavigationItemType.PRIMARY_LINK,
  },
  {
    label: i18n.t(
      'admin:sidebar.topNavigation.customize.item.form.label.typeOptions.primaryButton',
      'Primary Button',
    ),
    value: NavigationItemType.PRIMARY_BUTTON,
    id: NavigationItemType.PRIMARY_BUTTON,
  },
  {
    label: i18n.t(
      'admin:sidebar.topNavigation.customize.item.form.label.typeOptions.secondaryButton',
      'Secondary Button',
    ),
    value: NavigationItemType.SECONDARY_BUTTON,
    id: NavigationItemType.SECONDARY_BUTTON,
  },
]

const handleSelectRender = ({ onChange, value }) => (
  <Select onChange={onChange} focusBorderColor="accent.base">
    {selectOptions.map(option => (
      <option
        key={option.id}
        selected={option.value === value}
        value={option.value}
      >
        {option.label}
      </option>
    ))}
  </Select>
)

export const NavigationItemSidebar = ({
  handleBackButton,
  handleItemSave,
  handleItemDelete,
  activeItem,
}: NavigationItemSidebarProps) => {
  const { t } = useTranslation()

  const { handleSubmit, control, errors, reset } = useForm<
    NavigationItemFormValues
  >({
    defaultValues: {
      text: activeItem?.text || '',
      link: activeItem?.link || '',
      newWindow: activeItem?.openInNewWindow || true,
    },
  })

  useEffect(() => {
    if (activeItem) {
      reset(activeItem)
    }
  }, [activeItem])

  const onSubmit = useCallback(values => {
    handleItemSave(values, !!activeItem)
  }, [])

  return (
    <Sidebar
      footer={
        <NavigationItemSidebarFooter
          activeItem={activeItem}
          handleClick={handleSubmit(onSubmit)}
        />
      }
    >
      <VStack
        pt={{ base: '5rem', [SIDEBAR_VISIBLE]: 8 }}
        px={{ base: 0, [SIDEBAR_VISIBLE]: 3 }}
        w="full"
        alignItems="flex-start"
        data-testid="secondary-sidebar"
      >
        <Flex w="100%" justify="space-between">
          <HStack
            ml={{ base: 8, [SIDEBAR_VISIBLE]: 0 }}
            mb={{ base: 5, [SIDEBAR_VISIBLE]: 0 }}
            onClick={handleBackButton}
            cursor="pointer"
          >
            <Icon
              mr={{ base: 3, [SIDEBAR_VISIBLE]: 0 }}
              color="label.secondary"
              as={ArrowLeftLineIcon}
            />
            <Text textStyle="medium/large" color="label.primary">
              <Trans
                i18nKey="admin:sidebar.topNavigation.customize.item.back"
                defaults="Navigation Item"
              />
            </Text>
          </HStack>
          <Dropdown placement="bottom-end" isLazy>
            <DropdownIconButton data-testid="post-options-dd" />
            <DropdownList>
              <DropdownItem onClick={handleItemDelete} icon={DeleteBinLineIcon}>
                <Trans
                  i18nKey="admin:sidebar.topNavigation.customize.item.delete"
                  defaults="Delete Item"
                />
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </Flex>

        <Box w="100%" as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack mt={6} width="100%" spacing={6} maxW="sm">
            <FormControl id="type">
              <FormLabel htmlFor="type">
                <Trans
                  i18nKey="admin:sidebar.topNavigation.customize.item.form.label.type"
                  defaults="Type"
                />
              </FormLabel>
              <Controller
                name="type"
                defaultValue={activeItem?.type || selectOptions[0].value}
                control={control}
                render={handleSelectRender}
              />
            </FormControl>

            <FormControl id="text" isInvalid={Boolean(errors?.text)}>
              <FormlabelSecondary htmlFor="text">
                <Trans
                  i18nKey="admin:sidebar.topNavigation.customize.item.form.label.text"
                  defaults="Text"
                />
              </FormlabelSecondary>
              <Controller
                as={<Input isInvalid={Boolean(errors.text)} />}
                name="text"
                control={control}
                autoCapitalize="none"
                rules={{
                  required: t(
                    'admin:sidebar.topNavigation.customize.item.form.errors.text',
                    {
                      defaultValue: 'Text is required',
                    },
                  ) as string,
                }}
              />
              <FormErrorMessage>{errors?.text?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="link" isInvalid={Boolean(errors?.link)}>
              <FormlabelSecondary htmlFor="link">
                <Trans
                  i18nKey="admin:sidebar.topNavigation.customize.item.form.label.link"
                  defaults="Link"
                />
              </FormlabelSecondary>
              <Controller
                as={<Input isInvalid={Boolean(errors.link)} />}
                name="link"
                control={control}
                autoCapitalize="none"
                rules={{
                  required: t(
                    'admin:sidebar.topNavigation.customize.item.form.errors.link',
                    {
                      defaultValue: 'Link is required',
                    },
                  ) as string,
                }}
              />
              <FormErrorMessage>{errors?.link?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="newWindow">
              <Controller
                name="newWindow"
                control={control}
                defaultValue={activeItem?.openInNewWindow}
                render={props => {
                  return (
                    <Checkbox
                      spacing="1rem"
                      onChange={e => {
                        props.onChange(e.target.checked)
                      }}
                      checked={props.value}
                      defaultIsChecked={props.value}
                    >
                      <Text textStyle="medium/medium">
                        <Trans
                          i18nKey="admin:sidebar.topNavigation.customize.item.form.label.newWindow"
                          defaults="Open in a new window"
                        />
                      </Text>
                    </Checkbox>
                  )
                }}
              />
            </FormControl>
          </VStack>
        </Box>
      </VStack>
    </Sidebar>
  )
}
