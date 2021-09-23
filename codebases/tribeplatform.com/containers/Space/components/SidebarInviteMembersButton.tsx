import React from 'react'

import UserAddLineIcon from 'remixicon-react/UserAddLineIcon'

import { SidebarItem } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { UserImportModal } from 'components/UserImport'

import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'

const MODAL_ID = 'user-import'

export const SidebarInviteMembersButton = () => {
  const { close, open, isOpen } = useSpaceModal(MODAL_ID)

  return (
    <>
      <SidebarItem
        data-testid="sidebar-invite-member-button"
        icon={UserAddLineIcon}
        onClick={open}
        variant="ghost"
        as="span"
      >
        <Trans i18nKey="common:space.sidebar.invite" defaults="Invite people" />
      </SidebarItem>

      {isOpen && <UserImportModal isOpen={isOpen} onClose={close} />}
    </>
  )
}
