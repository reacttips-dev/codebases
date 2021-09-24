import React from 'react'

import { Box, HStack, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import NextLink from 'next/link'

import { PlanName } from 'tribe-api'
import { Emoji, Link, Progress, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import { getEmoji } from 'containers/AdminSettings/containers/network/billing/utils/plan.utils'
import useGetNetwork from 'containers/Network/useGetNetwork'

import { enumI18nPlanName } from 'utils/enums'

dayjs.extend(relativeTime)
const DAYS_BEFORE_PLAN_BOX_IN_SIDEBAR = 14

export const SidebarPlanBar = () => {
  const { network } = useGetNetwork()

  const plan = network?.subscriptionPlan
  const trial = plan?.trial

  if (trial && plan?.endDate) {
    const trialDurationInDays = dayjs(plan.endDate).diff(
      dayjs(plan?.startDate),
      'day',
    )
    const trialLeftInDays = Math.max(
      0,
      dayjs(plan?.endDate).diff(dayjs().add(-1, 'day'), 'day'),
    )
    const percentage =
      trialDurationInDays === 0 ? 0 : trialLeftInDays / trialDurationInDays

    if (trialLeftInDays > DAYS_BEFORE_PLAN_BOX_IN_SIDEBAR) {
      return null
    }

    return (
      <PlanBarCard>
        <VStack align="stretch">
          <HStack justifyContent="space-between">
            <HStack>
              <Emoji src={getEmoji(plan.name)} size="2xs" />
              <Text color="label.secondary" textStyle="medium/small">
                <Trans
                  i18nKey="admin:billing.plan.trial.title"
                  defaults="{{ plan }} trial"
                  values={{ plan: enumI18nPlanName(plan.name) }}
                />
              </Text>
            </HStack>
            <Text color="label.secondary" textStyle="medium/small">
              <Trans
                i18nKey="admin:billing.plan.expiresIn"
                defaults="{{ count }} left"
                values={{ count: dayjs(plan?.endDate).fromNow(true) }}
              />
            </Text>
          </HStack>

          <Progress value={100 * percentage} size="sm" />

          <NextLink href="/admin/network/billing" passHref>
            <Link color="accent.base">
              <Trans
                i18nKey="admin:billing.plan.upgradeNow"
                defaults="Upgrade now"
              />
            </Link>
          </NextLink>
        </VStack>
      </PlanBarCard>
    )
  }

  return plan ? (
    <PlanBarCard>
      <HStack spacing={4}>
        <Box
          alignItems="center"
          backgroundColor="bg.secondary"
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          h={8}
          w={8}
        >
          <Emoji src={getEmoji(plan.name)} size="2xs" />
        </Box>
        <VStack align="left" spacing={1}>
          <Text color="label.secondary" textStyle="medium/small">
            <Trans
              i18nKey="admin:billing.plan.planName"
              defaults="{{ plan }} plan"
              values={{ plan: enumI18nPlanName(plan.name) }}
            />
          </Text>
          <NextLink href="/admin/network/billing" passHref>
            <Link color="accent.base">
              {plan?.name === PlanName.BASIC ? (
                <Trans
                  i18nKey="admin:billing.plan.viewUpgradeOptions"
                  defaults="View upgrade options"
                />
              ) : (
                <Trans
                  i18nKey="admin:billing.plan.viewDetails"
                  defaults="View plan details"
                />
              )}
            </Link>
          </NextLink>
        </VStack>
      </HStack>
    </PlanBarCard>
  ) : null
}

const PlanBarCard = ({ children }) => (
  <Box
    alignItems="center"
    border="1px"
    borderColor="border.lite"
    borderRadius="md"
    p={4}
    width="full"
  >
    {children}
  </Box>
)
