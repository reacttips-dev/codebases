import React from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Flex } from '../../Grid'
import CopyableText from '../../CopyableText'
import Feedback from '../Feedback'
import { FieldGroup, FieldSet } from '../../Forms'
import { Strong, Text } from '../../Type'

const Confirmation = ({ apiToken, tokenName, returnToUrl }) => {
  return (
    <>
      <FieldSet ml={4} mt={4} mb={0} mr={4}>
        <FieldGroup span={2}>
          <Text>
            <FormattedMessage
              id={'apiToken.confirmation.description'}
              values={{
                tokenName: (
                  <Strong>
                    <FormattedMessage
                      id="apiToken.confirmation.tokenName"
                      values={{ token: tokenName }}
                    />
                  </Strong>
                )
              }}
            />
          </Text>
        </FieldGroup>
      </FieldSet>

      <Flex flexWrap={['wrap', 'nowrap']} alignItems="center" ml={4} mb={2}>
        <CopyableText prompt="Copy token" text={apiToken} layout={'button'}>
          {apiToken}
        </CopyableText>
      </Flex>

      <FieldSet mb={0} ml={2}>
        <FieldGroup span={2} mb={0}>
          <Feedback
            type="warning"
            duration={0}
            message={
              <FormattedMessage
                id={'apiToken.confirmation.warning'}
                values={{
                  bold: (
                    <Strong color={'yellow500'}>
                      <FormattedMessage id="apiToken.confirmation.warningBold" />
                    </Strong>
                  )
                }}
              />
            }
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0} ml={4} mt={2}>
        <FieldGroup span={2}>
          <Button to={returnToUrl} type="button" variant="primary">
            <FormattedMessage id="apiToken.confirmation.done" />
          </Button>
        </FieldGroup>
      </FieldSet>
    </>
  )
}

export default Confirmation
