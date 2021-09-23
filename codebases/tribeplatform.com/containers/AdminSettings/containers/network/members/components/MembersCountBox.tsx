import React from 'react'

import { Flex, GridItemProps, HStack, Skeleton } from '@chakra-ui/react'

import { Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { UpgradeTouchpointLink } from 'components/common/UpgradeTouchpointLink'

import useGetNetwork from 'containers/Network/useGetNetwork'

import { getLimitTreshold } from 'hooks/useMemberCapacity'

type MembersCountBoxProps = Pick<GridItemProps, 'gridArea'>

export const MembersCountBox: React.FC<MembersCountBoxProps> = ({
  gridArea,
}) => {
  const { loading: isNetworkLoading, network } = useGetNetwork()
  const { memberCapacity, memberCapacityDeclared, subscriptionPlan } =
    network || {}

  if (isNetworkLoading) {
    return (
      <Skeleton gridArea={gridArea} width={44} height={8} placeSelf="center" />
    )
  }

  if (
    (subscriptionPlan &&
      memberCapacityDeclared / memberCapacity <
        getLimitTreshold(subscriptionPlan)) ||
    typeof memberCapacity === 'undefined' ||
    typeof memberCapacityDeclared === 'undefined'
  ) {
    return null
  }

  return (
    <Flex
      alignItems="center"
      borderColor="border.base"
      borderRadius="base"
      borderWidth="1px"
      gridArea={gridArea}
      minHeight={8}
      justifyContent="center"
      placeSelf="center"
      px={3}
      py={1}
      width="max-content"
      maxWidth="100%"
    >
      <HStack spacing={2} maxWidth="100%">
        <Text textStyle="regular/small" color="label.primary">
          <Trans
            i18nKey="member:memberCapacityCount"
            defaults="{{ activeMembers, numberWithCommas }} / {{ count, numberWithCommas }} members"
            values={{
              activeMembers: memberCapacityDeclared || 0,
              count: memberCapacity || 1,
            }}
          />
        </Text>

        <Text textStyle="regular/small" color="label.primary">
          •
        </Text>

        <UpgradeTouchpointLink />
      </HStack>
    </Flex>
  )
}
