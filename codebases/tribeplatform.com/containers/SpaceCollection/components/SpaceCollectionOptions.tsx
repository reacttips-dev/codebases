import React from 'react'

import { useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import AddFillIcon from 'remixicon-react/AddFillIcon'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'
import EditBoxLineIcon from 'remixicon-react/EditBoxLineIcon'

import { hasActionPermission } from 'tribe-api'
import { SpaceCollection } from 'tribe-api/interfaces'
import {
  Dropdown,
  DropdownIconButton,
  DropdownItem,
  DropdownList,
  IconType,
} from 'tribe-components'
import { Trans } from 'tribe-translation'

import useGetNetwork from 'containers/Network/useGetNetwork'
import {
  EditSpaceCollectionModal,
  OrganizeSpaceCollectionModal,
} from 'containers/SpaceCollection/components'
import { useRemoveSpaceCollection } from 'containers/SpaceCollection/hooks'

import { DragIcon } from 'icons/svg'

type SpaceCollectionOptionsProps = {
  spaceCollection: SpaceCollection
  showAddSpace?: boolean
}

export const SpaceCollectionOptions: React.FC<SpaceCollectionOptionsProps> = ({
  spaceCollection,
  showAddSpace,
}) => {
  const router = useRouter()

  const isEmpty = spaceCollection?.spaces?.totalCount === 0

  const editModalDisclosure = useDisclosure()
  const organizeModalDisclosure = useDisclosure()
  const { remove } = useRemoveSpaceCollection(spaceCollection)

  const { network } = useGetNetwork()
  const { authorized: canAddSpace } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'addSpace',
  )
  const {
    authorized: hasRemoveSpaceCollectionPermission,
  } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'updateGroup',
  )
  const {
    authorized: hasUpdateSpaceCollectionPermission,
  } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'organizeGroupSpaces',
  )
  const { authorized: hasOrganizeGroupSpacesPermission } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'removeGroup',
  )
  const hasAnyPermissions =
    hasRemoveSpaceCollectionPermission ||
    hasUpdateSpaceCollectionPermission ||
    hasOrganizeGroupSpacesPermission
  if (!hasAnyPermissions) {
    return null
  }

  return (
    <>
      <Dropdown placement="bottom-start" isLazy>
        <DropdownIconButton
          size="xs"
          data-testid="spaceCollection-options-dd"
          height={4}
        />
        <DropdownList>
          {hasUpdateSpaceCollectionPermission && (
            <DropdownItem
              onClick={editModalDisclosure.onOpen}
              icon={EditBoxLineIcon}
            >
              <Trans i18nKey="common:actions.edit" defaults="Edit" />
            </DropdownItem>
          )}
          {canAddSpace && showAddSpace && (
            <DropdownItem
              onClick={() =>
                router.push(`/space/create?collectionId=${spaceCollection?.id}`)
              }
              icon={AddFillIcon}
            >
              <Trans
                i18nKey="common:space.sidebar.create"
                defaults="New space"
              />
            </DropdownItem>
          )}
          {hasOrganizeGroupSpacesPermission && !isEmpty && (
            <DropdownItem
              onClick={organizeModalDisclosure.onOpen}
              icon={DragIcon as IconType}
            >
              <Trans
                i18nKey="spaceCollection:actions.organize"
                defaults="Organize"
              />
            </DropdownItem>
          )}
          {hasRemoveSpaceCollectionPermission && (
            <DropdownItem onClick={remove} icon={DeleteBinLineIcon} danger>
              <Trans i18nKey="common:actions.delete" defaults="Delete" />
            </DropdownItem>
          )}
        </DropdownList>
      </Dropdown>
      {hasUpdateSpaceCollectionPermission && editModalDisclosure.isOpen && (
        <EditSpaceCollectionModal
          spaceCollection={spaceCollection}
          onClose={editModalDisclosure.onClose}
          isOpen={editModalDisclosure.isOpen}
        />
      )}
      {hasOrganizeGroupSpacesPermission && organizeModalDisclosure.isOpen && (
        <OrganizeSpaceCollectionModal
          spaceCollection={spaceCollection}
          onClose={organizeModalDisclosure.onClose}
          isOpen={organizeModalDisclosure.isOpen}
        />
      )}
    </>
  )
}
