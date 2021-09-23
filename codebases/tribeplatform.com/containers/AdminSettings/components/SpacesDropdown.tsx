import React, { useCallback, useEffect, useState } from 'react'

import { Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ArrowDropDownLineIcon from 'remixicon-react/ArrowDropDownLineIcon'
import SearchLineIcon from 'remixicon-react/SearchLineIcon'

import { Maybe, Media } from 'tribe-api/interfaces'
import {
  Avatar,
  Button,
  ButtonProps,
  Divider,
  Icon,
  ImagePickerDropdown,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SIDEBAR_VISIBLE,
  Skeleton,
  SkeletonCircle,
  StyledDropdownItem,
  Text,
  useDebounce,
} from 'tribe-components'
import { useTribeFeature, Features } from 'tribe-feature-flag'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'
import useGetSpaces from 'containers/Space/useGetSpaces'

import { useSpace } from 'hooks/space/useSpace'

export const SettingsTypeButton = ({
  icon,
  name,
}: {
  icon: Maybe<Media> | undefined
  name: string
}) => {
  const { isEnabled: isImagePickerDropdownEnabled } = useTribeFeature(
    Features.ImagePickerDropdown,
  )

  return (
    <HStack maxW="calc(100% - 24px)" data-testid="settings-dropdown-button">
      {icon && isImagePickerDropdownEnabled ? (
        <Skeleton height={6} width={6}>
          <ImagePickerDropdown
            emojiSize="sm"
            image={icon}
            imageBoxSize={6}
            isDisabled
          />
        </Skeleton>
      ) : (
        <SkeletonCircle size="6">
          <Avatar
            name={name}
            size="sm"
            src={icon}
            variant={icon ? 'logo' : 'avatar'}
          />
        </SkeletonCircle>
      )}
      <Skeleton maxW="80%" textAlign="left" flexGrow={1}>
        <Text textStyle="medium/medium" ellipsis>
          {name}
        </Text>
      </Skeleton>
    </HStack>
  )
}

const staticProps = {
  dropdownButton: {
    justifyContent: 'space-between',
    my: { base: 0, [SIDEBAR_VISIBLE]: 6 },
    py: 2,
    px: { base: 6, [SIDEBAR_VISIBLE]: 2 },
    borderTopRadius: { base: 0, [SIDEBAR_VISIBLE]: 'base' },
    borderBottomRadius: { base: 0, [SIDEBAR_VISIBLE]: 'base' },
    h: 'auto',
    variant: 'outline',
    w: 'full',
    position: { base: 'fixed', [SIDEBAR_VISIBLE]: 'relative' },
    bottom: { base: 0, [SIDEBAR_VISIBLE]: 'auto' },
    left: { base: 0, [SIDEBAR_VISIBLE]: 'auto' },
    iconSpacing: { base: 2, [SIDEBAR_VISIBLE]: 2 },
    rightIcon: <Icon as={ArrowDropDownLineIcon} w={4} />,
  } as ButtonProps,
}

const SPACES_LIMIT = 5

export const SpacesDropdown = () => {
  const { network } = useGetNetwork()
  const router = useRouter()
  const { query, push } = router || {}

  const spaceSlug = query['space-slug']

  const { space } = useSpace({
    variables: {
      slug: spaceSlug ? String(spaceSlug) : null,
    },
    skip: !spaceSlug,
  })

  const [spacesSearch, setSpacesSearch] = useState('')
  const debouncedSearch = useDebounce(spacesSearch)

  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(!isOpen)
  const close = useCallback(() => {
    setSpacesSearch?.('')
    setIsOpen?.(false)
  }, [])

  useEffect(() => {
    router?.events?.on('routeChangeComplete', close)

    return () => {
      router?.events?.off('routeChangeComplete', close)
    }
  }, [close, router])

  const goTo = useCallback(
    (settingType?: string | null, slug?: string) => {
      let href

      if (settingType === 'network') {
        href = '/admin/network/settings'
      } else {
        href = `/admin/space/${slug}${
          query?.section ? `/${query?.section}` : '/settings'
        }`
      }

      push(href, undefined, { shallow: true })
    },
    [push, query?.section],
  )

  const {
    spaces,
    query: spacesQuery,
    searchResult: spacesSearchResult,
  } = useGetSpaces({ limit: SPACES_LIMIT })

  useEffect(() => {
    if (debouncedSearch || spacesSearchResult) {
      spacesQuery?.({ limit: SPACES_LIMIT, query: debouncedSearch })
    }
  }, [spacesSearchResult, debouncedSearch, spacesQuery])

  return (
    <Box zIndex="dropdown">
      {/* @TODO - Implement mobile full page view. */}
      <Popover isOpen={isOpen} onClose={close} isLazy placement="bottom-end">
        <PopoverTrigger>
          <Button {...staticProps.dropdownButton} onClick={open}>
            <SettingsTypeButton
              icon={(space ? space?.image : network?.favicon) || undefined}
              name={space ? space?.name : network?.name}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="xs">
          <Box overflowY="auto" maxHeight="xl" p={2}>
            <StyledDropdownItem
              data-testid="sidebar-dropdown-network-link"
              onClick={() => goTo('network')}
            >
              <SettingsTypeButton
                icon={network?.favicon}
                name={network?.name}
              />
            </StyledDropdownItem>

            <Divider my="2" color="border.lite" />

            <InputGroup mb="2">
              <InputLeftElement h="full">
                <Icon h="4" w="4" color="label.secondary" as={SearchLineIcon} />
              </InputLeftElement>
              <Input
                style={{
                  paddingLeft: '2.2rem',
                  height: '2.6rem',
                }}
                data-testid="sidebar-dropdown-search-input"
                size="lg"
                value={spacesSearch}
                onChange={e => setSpacesSearch(e.target.value)}
              />
            </InputGroup>

            {spaces.length > 0 ? (
              spaces.map(({ slug, name, image }) => (
                <StyledDropdownItem
                  data-testid={`sidebar-dropdown-space-${slug}-link`}
                  key={slug}
                  onClick={() => goTo(null, slug)}
                >
                  <Avatar src={image} name={name} size="sm" />
                  <Text
                    ml={2}
                    color="label.primary"
                    textStyle="medium/medium"
                    ellipsis
                  >
                    {name}
                  </Text>
                </StyledDropdownItem>
              ))
            ) : (
              <Text
                ml="2"
                py="2"
                textStyle="regular/medium"
                color="label.primary"
              >
                <Trans
                  i18nKey="admin:sidebar.spaces.notFound"
                  defaults="No spaces found"
                />
              </Text>
            )}
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
