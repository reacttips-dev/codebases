import React, { useMemo } from 'react'

import { MemberInvitation } from 'tribe-api/interfaces'
import { TableWrapper } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import {
  getInviteTableConfig,
  InviteTableConfigProps,
} from './inviteTableConfig'

interface MemberInvitationsListProps extends Partial<InviteTableConfigProps> {
  fetchMore?: () => void
  hasNextPage?: boolean
  loading?: boolean
  memberInvitations: Array<MemberInvitation>
  onSearch?: ({ query }: { query: string }) => void
  searchResult?: boolean
  totalCount: number
}

export const InvitedList = ({
  memberInvitations,
  loading,
  fetchMore,
  totalCount,
  hasNextPage,
  overwriteColumns,
  onSearch,
  handleInvite,
  searchResult,
}: MemberInvitationsListProps) => {
  const { t } = useTranslation()

  const columns = useMemo(
    () =>
      getInviteTableConfig({
        handleInvite,
        overwriteColumns,
      }),
    [handleInvite, overwriteColumns],
  )

  return (
    <TableWrapper
      data={memberInvitations}
      columns={columns}
      hasMore={hasNextPage}
      total={totalCount}
      fetchMore={fetchMore}
      showColumnsFilter={false}
      loading={loading}
      searchResult={searchResult}
      onSearch={onSearch}
      searchPlaceholder={t(
        'member:invitations.search',
        'Search invitations...',
      )}
      hasTab
      skeletonRowCount={8}
    />
  )
}

export default InvitedList
