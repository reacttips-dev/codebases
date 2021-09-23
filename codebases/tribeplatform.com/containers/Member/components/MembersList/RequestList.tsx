import React, { useMemo } from 'react'

import { VStack } from '@chakra-ui/react'

import { SpaceJoinRequest } from 'tribe-api/interfaces'
import { Text, TableColumn, TableWrapper } from 'tribe-components'
import { Trans } from 'tribe-translation'

import {
  getRequestTableConfig,
  RequestTableConfigProps,
} from './requestTableConfig'

interface RequestListProps extends Partial<RequestTableConfigProps> {
  spaceJoinRequests: Array<SpaceJoinRequest>
  totalCount: number
}

export const RequestList = ({
  spaceJoinRequests,
  loading,
  ownerId,
  totalCount,
  overwriteColumns,
}: RequestListProps) => {
  const columns = useMemo(
    () =>
      getRequestTableConfig({
        ownerId,
        loading,
        overwriteColumns,
      }),
    [ownerId, loading, overwriteColumns],
  )

  return (
    <TableWrapper
      data={spaceJoinRequests}
      columns={columns as TableColumn<any>[]}
      total={totalCount}
      showColumnsFilter={false}
      loading={loading}
      hasTab
      showHeaders={false}
      skeletonRowCount={8}
      emptyStateComponent={
        <VStack pt={0} py={10}>
          <Text color="label.primary" textStyle="medium/medium">
            <Trans key="member:list.noRequest.title" defaults="No requests" />
          </Text>
          <Text color="label.secondary" textStyle="medium/small">
            <Trans
              key="member:list.noRequest.description"
              defaults="No pending requests to review, you're all set."
            />
          </Text>
        </VStack>
      }
    />
  )
}

export default RequestList
