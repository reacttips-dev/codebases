import React from 'react'
import { format, parseISO } from 'date-fns'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'

import { Delete, Edit } from '../../../Actions'
import Tooltip from '../../../Tooltip'
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

const AccessToken = ({
  attributes,
  uuid,
  organisation,
  displayName,
  displayTeam,
  isExpired,
  expiresAt,
  lastUsedAt,
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
          <Td disabled={disabled}>
            {disabled ? (
              <FormattedMessage id="apiToken.expired" />
            ) : (
              formatExpiryDate(expiresAt)
            )}
          </Td>
          <Td disabled={disabled}>{formatExpiryDate(lastUsedAt)}</Td>
          <Td textAlign="right" alignItems="center">
            <Edit
              label={'Edit'}
              to={`/you/settings/tokens/${uuid}/edit`}
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
                      onRevoke({ uuid, organisation: organisation?.slug })
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

export default AccessToken
