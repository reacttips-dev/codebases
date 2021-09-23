import React from 'react'

import { GridItemProps } from '@chakra-ui/react'
import UserAddLineIcon from 'remixicon-react/UserAddLineIcon'

import { Button, Icon, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { UserImportModal } from 'components/UserImport'

import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'

const MODAL_ID = 'user-import'

type InviteMembersButtonProps = Pick<GridItemProps, 'gridArea'>

export const InviteMembersButton: React.FC<InviteMembersButtonProps> = ({
  gridArea,
}) => {
  const { close, open, isOpen } = useSpaceModal(MODAL_ID)

  return (
    <>
      <Button
        gridArea={gridArea}
        onClick={open}
        data-testid="user-import-invite-button"
        leftIcon={<Icon as={UserAddLineIcon} />}
        buttonType="primary"
        size="sm"
      >
        <Text textStyle="regular/medium" color="label.button">
          <Trans
            i18nKey="common:space.sidebar.invite"
            defaults="Invite people"
          />
        </Text>
      </Button>

      {isOpen && <UserImportModal isOpen={isOpen} onClose={close} />}
    </>
  )
}
