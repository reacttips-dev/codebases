import React from 'react'

import ChatSmileLineIcon from 'remixicon-react/ChatSmileLineIcon'

import { SidebarItem } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { UserHelpModal } from 'components/UserImport'

import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'

const MODAL_ID = 'user-help'

export const SideBarHelpButton = () => {
  const { close, open, isOpen } = useSpaceModal(MODAL_ID)

  return (
    <>
      <SidebarItem
        data-testid="user-help-member-button"
        icon={ChatSmileLineIcon}
        onClick={open}
        variant="ghost"
        as="span"
      >
        <Trans
          i18nKey="common.space.sidebar.help"
          defaults="Help & Community"
        />
      </SidebarItem>

      <UserHelpModal isOpen={isOpen} onClose={close} />
    </>
  )
}
