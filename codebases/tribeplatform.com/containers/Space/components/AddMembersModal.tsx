import React, { ReactNode, useState, useCallback } from 'react'

import { HStack, VStack, Box, Flex, Spacer, Center } from '@chakra-ui/react'

import {
  Member,
  SearchEntity,
  Space,
  SpaceRoleType,
} from 'tribe-api/interfaces'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  UserBar,
  Text,
  Button,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownList,
  SkeletonProvider,
  Skeleton,
  SkeletonText,
  useToast,
  AutocompleteMultiple,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { useGetSearch } from 'containers/Search/hooks/useGetSearch'
import { useAddSpaceMembers } from 'containers/Space/hooks'

import { useSpace } from 'hooks/space/useSpace'
import { useDebouncedCallback } from 'hooks/useDebounce'
import useNetworkMembers from 'hooks/useNetworkMembers'
import { useResponsive } from 'hooks/useResponsive'

import { logger } from 'lib/logger'

const staticProps = {
  modalContent: {
    common: {
      bg: 'bg.base',
      maxW: {
        base: 'full',
        sm: '90vw',
        md: '2xl',
      },
      h: {
        base: 'full',
        md: 800,
      },
    },
    mobile: {
      maxH: 'auto',
      borderRadius: 0,
    },
  },
}

export interface AddMembersModalProps {
  isOpen: boolean
  onClose: () => void
  spaceSlug: Space['slug']
}

interface MemberToOption {
  id: string
  value: {
    id: string
    name: string
    tagline: string
  }
  label: string
}

const memberToOption = (member: Partial<Member>): MemberToOption => ({
  id: member.id || '',
  value: {
    id: member.id || '',
    name: member.name || '',
    tagline: member.tagline || '',
  },
  label: member.name || '',
})

const SUGGESTED_MEMBERS_LIMIT = 10

const SuggestedMembers = ({ children }: { children: ReactNode }) => (
  <>
    <Text
      textTransform="uppercase"
      textStyle="regular/xsmall"
      color="label.secondary"
      mt={6}
    >
      <Trans
        i18nKey="space:members.add_members_modal.members_label"
        defaults="Suggested"
      />
    </Text>
    <VStack align="flex-start" spacing={4} mt={5} pb={4}>
      {children}
    </VStack>
  </>
)

const AddMembersModal = ({
  isOpen,
  onClose,
  spaceSlug,
}: AddMembersModalProps) => {
  const toast = useToast()
  const { t } = useTranslation()
  const { space, loading: loadingSpace } = useSpace({
    variables: {
      slug: spaceSlug ? String(spaceSlug) : undefined,
    },
  })

  const spaceName = space?.name
  const spaceId = space?.id
  const spaceRoles = space?.roles

  const [newMembersRole, setNewMembersRole] = useState<SpaceRoleType>(
    SpaceRoleType.MEMBER,
  )
  const { addSpaceMembers } = useAddSpaceMembers()

  // @TODO - ask backend for a flag to ignore space members
  const {
    members: networkMembers,
    loading: loadingMembers,
  } = useNetworkMembers({
    variables: {
      limit: SUGGESTED_MEMBERS_LIMIT,
    },
    skip: !isOpen,
  })

  const {
    searchResults,
    getSearchResults,
    searchLoading,
    searchCount,
  } = useGetSearch()

  const membersSearchResults: Partial<Member>[] =
    searchResults?.search?.hits[0]?.hits.map(
      (hit: SearchEntity): Partial<Member> => ({
        id: hit?.entityId,
        name: hit?.title,
        profilePicture: hit?.media,
        tagline: hit?.content,
      }),
    ) || []

  const [searchTerm, setSearchTerm] = useState('')

  const hasSearchResults = !!(
    (searchResults && searchCount !== 0) ||
    searchTerm
  )

  const members = hasSearchResults ? membersSearchResults : networkMembers

  const [selectedMembers, setSelectedMembers] = useState<
    ReturnType<typeof memberToOption>[]
  >([])
  const { isPhone } = useResponsive()

  const _queryMembers = useDebouncedCallback(({ query }) => {
    setSearchTerm(query)
    try {
      getSearchResults(`${query} +for:member`)
    } catch (e) {
      logger.error('add members modal search', e)
    }
  }, 200)

  // Remove already selected members from suggested members
  const suggestedMembers =
    members?.filter(({ id }) => !selectedMembers.some(sm => sm.id === id)) || []

  const close = useCallback(() => {
    onClose()
    setSelectedMembers([])
  }, [onClose])

  const addNewMembers = useCallback(async () => {
    const role = spaceRoles?.find(
      sr => sr.name.toLowerCase() === newMembersRole,
    )

    if (!selectedMembers.length || !role) return

    try {
      await addSpaceMembers(
        spaceId,
        selectedMembers.map(({ id: memberId }) => ({
          memberId,
          roleId: role.id,
        })),
      )

      toast({
        title: t(
          'space:members.add_members_modal.notification.success',
          'New members added',
        ),
        status: 'success',
      })
      close()
    } catch (e) {
      toast({
        title: t(
          'space:members.add_members_modal.notification.error',
          "Couldn't add members",
        ),
        status: 'error',
      })
    }
  }, [
    spaceRoles,
    selectedMembers,
    newMembersRole,
    addSpaceMembers,
    spaceId,
    toast,
    t,
    close,
  ])

  const updateSelectedMembers = useCallback(
    members => {
      setSelectedMembers(members?.map(memberToOption))
    },
    [setSelectedMembers],
  )

  const loading = loadingMembers || loadingSpace || searchLoading

  return (
    <SkeletonProvider loading={loading}>
      <Modal
        isOpen={isOpen}
        onClose={close}
        size="2xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay>
          <ModalContent
            {...staticProps.modalContent.common}
            {...(isPhone && staticProps.modalContent.mobile)}
          >
            <ModalHeader color="label.primary" pt={6}>
              <Trans
                i18nKey="space:members.add_members_modal.title"
                defaults="Add to {{ name }}"
                values={{ name: spaceName }}
              />
            </ModalHeader>
            <ModalCloseButton color="label.primary" />
            <ModalBody overflowX="hidden" pt={2}>
              <Skeleton isLoaded={!loadingSpace}>
                <AutocompleteMultiple
                  placeholder={t(
                    'space:members.add_members_modal.search_placeholder',
                    'Search by name',
                  )}
                  options={suggestedMembers?.map(memberToOption)}
                  value={selectedMembers?.map(t => t.value)}
                  optionConverter={memberToOption}
                  onChange={updateSelectedMembers}
                  open={false}
                  onSearch={async query => {
                    _queryMembers({ query })
                    return []
                  }}
                />
              </Skeleton>

              {/* Mock users to show while loading */}
              {loading && (
                <SuggestedMembers>
                  {Array(SUGGESTED_MEMBERS_LIMIT)
                    .fill({})
                    .map((_obj, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Box key={index} w="full">
                        <UserBar title="" />
                      </Box>
                    ))}
                </SuggestedMembers>
              )}

              {!loading &&
                (suggestedMembers?.length > 0 ? (
                  <SuggestedMembers>
                    {suggestedMembers.map(member => {
                      const { id, tagline, name, profilePicture } = member

                      return (
                        <Box
                          key={id}
                          data-testid={`suggested-member-${id}`}
                          w="full"
                          cursor="pointer"
                          onClick={() => {
                            setSelectedMembers([
                              ...selectedMembers,
                              memberToOption(member),
                            ])
                          }}
                        >
                          <UserBar
                            title={name}
                            subtitle={tagline}
                            picture={profilePicture}
                          />
                        </Box>
                      )
                    })}
                  </SuggestedMembers>
                ) : (
                  <Flex h="90%" alignItems="center" justify="center">
                    <Text data-testid="empty-state-message">
                      {searchTerm ? (
                        <Trans
                          i18nKey="space:members.add_members_modal.no_results"
                          defaults="No results"
                        />
                      ) : (
                        <Trans
                          i18nKey="space:members.add_members_modal.search_for_suggestions"
                          defaults="Search for more suggestions"
                        />
                      )}
                    </Text>
                  </Flex>
                ))}
            </ModalBody>
            <ModalFooter borderTop="1px solid" borderColor="border.base">
              <Flex width="100%">
                <Center>
                  <SkeletonText isLoaded={!loading} noOfLines={1}>
                    <HStack align="center">
                      <Text textStyle="regular/xsmall" color="label.secondary">
                        <Trans
                          i18nKey="space:members.addMembersModal.add"
                          defaults="Add users as"
                        />
                      </Text>
                      <Dropdown>
                        <DropdownButton
                          data-testid="add-as-dropdown-toggler"
                          color="accent.base"
                          mr="auto"
                          size="xs"
                        >
                          {newMembersRole === SpaceRoleType.MEMBER ? (
                            <Trans
                              i18nKey="space:members.addMembersModal.addSpaceMembers"
                              defaults="members"
                            />
                          ) : (
                            <Trans
                              i18nKey="space:members.addMembersModal.addSpaceAdmins"
                              defaults="admins"
                            />
                          )}
                        </DropdownButton>
                        <DropdownList>
                          {spaceRoles?.map(({ id, name }) => (
                            <DropdownItem
                              key={id}
                              data-testid={`space-role-${id}`}
                              onClick={() => {
                                setNewMembersRole(
                                  name.toLowerCase() as SpaceRoleType,
                                )
                              }}
                              size="xs"
                            >
                              <Trans
                                i18nKey="space:members.addMembersModal.roles"
                                defaults="{{ name }}s"
                                values={{ name: name.toLowerCase() }}
                              />
                            </DropdownItem>
                          ))}
                        </DropdownList>
                      </Dropdown>
                    </HStack>
                  </SkeletonText>
                </Center>
                <Spacer />
                <Skeleton>
                  <Button
                    buttonType="primary"
                    data-testid="add-button"
                    onClick={addNewMembers}
                  >
                    <Trans
                      i18nKey="space:members.add_members_modal.add"
                      defaults="Add"
                    />
                  </Button>
                </Skeleton>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </SkeletonProvider>
  )
}

export default AddMembersModal
