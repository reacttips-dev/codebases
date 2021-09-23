import React from 'react'

import { HStack } from '@chakra-ui/react'
import MailSendLineIcon from 'remixicon-react/MailSendLineIcon'

import { MemberInvitation } from 'tribe-api/interfaces'
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  DropdownIconButton,
  UserBar,
  TableColumn,
} from 'tribe-components'
import { i18n, Trans } from 'tribe-translation'

import { guessNameFromEmail } from 'utils/extractor.utils'

export enum Settings {
  GENERAL = 'General',
  MEMBERS = 'Members',
}

export interface InviteTableConfigProps {
  handleInvite?: (input) => void
  overwriteColumns?: {
    [columnId: string]: Partial<TableColumn<MemberInvitation>>
  }
}

const titleProps = {
  ellipsis: true,
  style: {
    textStyle: 'medium/medium',
  },
}

const subtitleProps = {
  ellipsis: true,
  style: {
    textStyle: 'regular/small',
  },
}

export const getInviteTableConfig = ({
  overwriteColumns,
  handleInvite,
}: InviteTableConfigProps): TableColumn<MemberInvitation>[] => [
  {
    id: 'name',
    title: i18n.t('common:name', 'Name'),
    getTitleProps: () => ({
      textStyle: 'medium/medium',
      color: 'label.secondary',
    }),
    getColumnProps: () => ({
      flexGrow: 1,
      flexBasis: '40%',
      overflow: 'hidden',
    }),
    customCell: ({ original }) => {
      const memberInvitation = original
      return (
        <UserBar
          size="lg"
          title={
            memberInvitation?.inviteeName ||
            guessNameFromEmail(memberInvitation?.inviteeEmail || '')
          }
          titleProps={titleProps}
          subtitle={memberInvitation?.inviteeEmail}
          subtitleProps={subtitleProps}
        />
      )
    },
    ...overwriteColumns?.name,
  },
  {
    id: 'actions',
    isFilterable: false,
    getColumnProps: () => ({
      flexGrow: 1,
      flexShrink: 1,
    }),
    customCell: ({ original }) => {
      const memberInvitation = original
      return (
        <HStack justifyContent="flex-end">
          <Dropdown>
            <DropdownIconButton
              px={0}
              data-testid={`options-button-${memberInvitation?.id}`}
            />
            <DropdownList>
              <DropdownItem
                data-testid={`options-invite-button-${memberInvitation?.id}`}
                icon={MailSendLineIcon}
                onClick={() =>
                  handleInvite?.({
                    input: {
                      invitees: {
                        email: memberInvitation?.inviteeEmail,
                        name:
                          memberInvitation?.inviteeName ||
                          guessNameFromEmail(memberInvitation?.inviteeEmail),
                      },
                    },
                  })
                }
              >
                <Trans
                  i18nKey="member:list.sendInvite"
                  defaults="Resend invite"
                />
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </HStack>
      )
    },
    ...overwriteColumns?.actions,
  },
]
