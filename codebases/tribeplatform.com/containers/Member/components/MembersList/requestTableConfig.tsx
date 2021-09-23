import React from 'react'

import { HStack } from '@chakra-ui/react'

import { Member, SpaceJoinRequest } from 'tribe-api/interfaces'
import { UserBar, Button, useToast, TableColumn } from 'tribe-components'
import { useTranslation, Trans } from 'tribe-translation'

import { guessNameFromEmail } from 'utils/extractor.utils'

import useRespondSpaceJoinRequest from '../../../Space/hooks/useRespondSpaceJoinRequest'

export enum Settings {
  GENERAL = 'General',
  MEMBERS = 'Members',
}

export interface RequestTableConfigProps {
  handleInvite?: (input) => void
  loading?: boolean

  // Space owner or network owner (createdBy) id
  ownerId?: Member['id']

  overwriteColumns?: {
    [columnId: string]: Partial<TableColumn<SpaceJoinRequest>>
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

const getMember = spaceJoinRequest => {
  return spaceJoinRequest.member
}

export const getRequestTableConfig = ({
  overwriteColumns,
}: RequestTableConfigProps): TableColumn<SpaceJoinRequest>[] => [
  {
    id: 'name',
    getColumnProps: () => ({
      flexGrow: 1,
      flexBasis: '40%',
      overflow: 'hidden',
    }),
    customCell: ({ original }) => {
      const member = getMember(original)
      return (
        <UserBar
          size="lg"
          title={member?.name || guessNameFromEmail(member?.email || '')}
          titleProps={titleProps}
          subtitle={member?.tagline}
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
    customCell: ({ original }: { original: SpaceJoinRequest }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { decline, approve } = useRespondSpaceJoinRequest(original)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const toast = useToast()
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { t } = useTranslation()

      return (
        <HStack justifyContent="flex-end">
          <Button
            buttonType="primary"
            onClick={() => {
              toast({
                title: t('space:members.approve', {
                  defaultValue: 'You have successfully approved this member.',
                }),
              })
              approve()
            }}
            data-testid={`accept-button-${original?.member?.id}`}
          >
            <Trans i18nKey="space:button.approve" defaults="Approve" />
          </Button>
          <Button
            onClick={() => {
              toast({
                title: t('space:members.decline', {
                  defaultValue: 'You have declined this member.',
                }),
              })
              decline()
            }}
            data-testid={`decline-button-${original?.member?.id}`}
          >
            <Trans i18nKey="space:button.decline" defaults="Decline" />
          </Button>
        </HStack>
      )
    },
    ...overwriteColumns?.actions,
  },
]
