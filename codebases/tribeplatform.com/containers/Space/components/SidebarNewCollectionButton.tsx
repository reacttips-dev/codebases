import React from 'react'

import AddFillIcon from 'remixicon-react/AddFillIcon'

import { SidebarItem } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'
import { EditSpaceCollectionModal } from 'containers/SpaceCollection/components'

export const SidebarNewCollectionButton = () => {
  const { close, open, isOpen } = useSpaceModal('new-collection')

  return (
    <>
      <SidebarItem
        data-testid="sidebar-new-collection-button"
        icon={AddFillIcon}
        onClick={open}
        variant="ghost"
        as="span"
      >
        <Trans
          i18nKey="spaceCollection:sidebar.create"
          defaults="New collection"
        />
      </SidebarItem>

      {isOpen && <EditSpaceCollectionModal onClose={close} isOpen={isOpen} />}
    </>
  )
}
