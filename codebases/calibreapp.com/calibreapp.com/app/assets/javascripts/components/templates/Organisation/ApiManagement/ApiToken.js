import React from 'react'
import { format, parseISO } from 'date-fns'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'

import { Delete, Edit } from '../../../Actions'
import Avatar from '../../../Avatar'
import Tooltip from '../../../Tooltip'
import { Flex } from '../../../Grid'
import { Td, Tr } from '../../../Table'

const NameCell = styled.div`
  max-width: 700px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const formatExpiryDate = date => {
  if (!date) return `Never`

  const parsedDate = parseISO(date)

  return `${format(parsedDate, 'MMM do y')}`
}

const ApiToken = ({
  attributes,
  uuid,
  displayTeam,
  displayName,
  creator,
  isExpired,
  expiresAt,
  displayType,
  orgId,
  onRevoke
}) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: false,
    rootMargin: '50% 0% 50%'
  })
  const disabled = isExpired
  return (
    <Tr key={`apiKey-${uuid}`} ref={inViewRef}>
      {inView ? (
        <>
          <Td py="15px">
            <Tooltip label={displayName}>
              <NameCell>{displayName}</NameCell>
            </Tooltip>
          </Td>
          {attributes.includes('displayTeam') ? (
            <Td disabled={disabled}>{displayTeam}</Td>
          ) : null}
          {attributes.includes('displayType') ? (
            <Td disabled={disabled}>{displayType}</Td>
          ) : null}
          <Td disabled={disabled}>
            {creator ? (
              <Flex as="span" alignItems="center">
                <Flex as="span" mr="8px">
                  <Avatar
                    size="small"
                    name={creator.name}
                    url={creator.avatar}
                    variant={creator.membership?.role}
                  />
                </Flex>
                {creator.displayName}
              </Flex>
            ) : (
              <FormattedMessage id="apiToken.defaultUser" />
            )}
          </Td>
          <Td disabled={disabled}>
            {disabled ? (
              <FormattedMessage id="apiToken.expired" />
            ) : (
              formatExpiryDate(expiresAt)
            )}
          </Td>
          <Td textAlign="right" alignItems="center">
            <Edit
              label={'Edit'}
              to={`/organisations/${orgId}/api/${uuid}/edit`}
              mr="15px"
            />

            <FormattedMessage
              id="apiToken.revokePrompt"
              values={{ confirmText: displayName }}
            >
              {message => (
                <Delete
                  p="0px"
                  label={'Revoke'}
                  onClick={() => {
                    const response = prompt(message)
                    if (response === displayName) {
                      onRevoke(uuid)
                    }
                  }}
                />
              )}
            </FormattedMessage>
          </Td>
        </>
      ) : (
        <Td colSpan="4" py="27px"></Td>
      )}
    </Tr>
  )
}

export default ApiToken
