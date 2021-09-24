import React from 'react'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'

import { Box } from '../../../Grid'
import { Text } from '../../../Type'
import { Section } from '../../../Layout'
import Button from '../../../Button'
import { LoadingLine, LoadingButton } from '../../../Loading'

import PlanSummary from '../PlanSummary'
import SubscriptionNotification from '../../Sites/SubscriptionNotification'

const Subscription = ({
  slug,
  status,
  plan,
  testPack,
  userPack,
  periodEndAt,
  history
}) => (
  <Section>
    <Box>
      {status ? (
        (['canceled', 'trial_expired', 'trial_canceled', 'past_due'].includes(
          status
        ) && (
          <SubscriptionNotification
            plan={plan}
            status={status}
            periodEndAt={periodEndAt}
            slug={slug}
            isAdmin={true}
          />
        )) || (
          <PlanSummary
            status={status}
            {...plan}
            periodEndAt={periodEndAt}
            testPack={testPack}
            userPack={userPack}
          />
        )
      ) : (
        <LoadingLine />
      )}
    </Box>

    <Box my={3}>
      {status ? (
        plan.tagged.includes('enterprise') ? (
          <>
            <Text as="p" mb={3}>
              <FormattedMessage id="organisations.plan.summary.contact" />
            </Text>
            <Button
              as="a"
              href="mailto:hello@calibreapp.com"
              variant="tertiary"
            >
              <FormattedMessage id={`organisations.plan.actions.contact`} />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => history.push(`/organisations/${slug}/billing/plan`)}
          >
            <FormattedMessage
              id={`organisations.plan.actions.${
                status === 'active' ? 'change' : 'choose'
              }`}
            />
          </Button>
        )
      ) : (
        <LoadingButton href="plan" />
      )}
    </Box>
  </Section>
)

export default withRouter(Subscription)
