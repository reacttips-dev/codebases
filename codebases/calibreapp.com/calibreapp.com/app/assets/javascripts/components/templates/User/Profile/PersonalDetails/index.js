import React from 'react'
import { FormattedMessage } from 'react-intl'

import Avatar from '../../../../Avatar'
import { Lockup } from '../../../../Layout'
import { Flex, Box } from '../../../../Grid'
import { Text, Strong } from '../../../../Type'

import FeedbackBlock from '../../../../FeedbackBlock'
import useFeedback from '../../../../../hooks/useFeedback'
import { useSession } from '../../../../../providers/SessionProvider'

import Form from './form'

const PersonalDetails = () => {
  const { currentUser, membership, memberships } = useSession()
  const { feedback, clearFeedback } = useFeedback()
  const { role } = membership || memberships[0] || { role: 'member' }

  return (
    <>
      <Lockup id="you.settings.profile.personalDetails" mb={0} />

      {feedback && feedback.location === 'userProfile' && (
        <Box mb={4}>
          <FeedbackBlock onDismiss={() => clearFeedback()} {...feedback}>
            {feedback.message}
          </FeedbackBlock>
        </Box>
      )}

      <Flex alignItems="center" mb={4}>
        <Box mr={3}>
          <Avatar
            size="large"
            name={currentUser.name}
            url={currentUser.avatar}
            variant={`${role}Link`}
          />
        </Box>
        {currentUser.authMethod == 'password' ? (
          <Box>
            <Text>
              <FormattedMessage id="you.settings.profile.personalDetails.avatarHelp" />
            </Text>
          </Box>
        ) : (
          <Box mr={3}>
            <Strong as="p">{currentUser.name}</Strong>
            <Text>{currentUser.email}</Text>
          </Box>
        )}
      </Flex>

      <Box mb={4}>
        {currentUser.authMethod == 'password' && (
          <Form name={currentUser.name} email={currentUser.email} />
        )}
      </Box>
    </>
  )
}

export default PersonalDetails
