import React from 'react'
import { isAfter, subDays, formatDistanceToNow, parseISO } from 'date-fns'

import Table, { Th, Tr, Tbody, Td } from '../../../../Table'
import { Flex, Box } from '../../../../Grid'
import { Checkbox } from '../../../../Forms'
import { LoadingTable } from '../../../../Loading'

const formatLastSeen = date => {
  if (!date) return `No longer present`
  const parsedDate = parseISO(date)

  let startOfDay = new Date()
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  if (parsedDate >= startOfDay) return 'Today'

  if (isAfter(subDays(new Date(), 90), parsedDate)) return `No longer present`

  return `${formatDistanceToNow(parsedDate)} ago`
}

const ThirdParties = ({
  loading,
  thirdParties,
  blockedThirdParties,
  onUpdate
}) => {
  return (
    <>
      {loading ? (
        <LoadingTable p={0} label="Third Party" />
      ) : (
        !thirdParties.length || (
          <Table bleed={0}>
            <thead>
              <Tr>
                <Th>Third party</Th>
                <Th textAlign="right">Last detected</Th>
              </Tr>
            </thead>
            <Tbody>
              {thirdParties.map(({ thirdParty, lastSeen }, index) => (
                <Tr key={index}>
                  <Td px={null} pr={3} colSpan={2} py="15px">
                    <Checkbox
                      id={thirdParty.name}
                      name={thirdParty.name}
                      defaultChecked={(blockedThirdParties || []).find(
                        blockedThirdParty =>
                          blockedThirdParty.name === thirdParty.name
                      )}
                      value={thirdParty.name}
                      onChange={() => onUpdate(thirdParty)}
                    >
                      <Flex as="span" width={1}>
                        <Box
                          as="span"
                          flex={1}
                          data-qa={`thirdParty:${thirdParty.name}`}
                        >
                          {thirdParty.name}
                        </Box>
                        <Box as="span">{formatLastSeen(lastSeen)}</Box>
                      </Flex>
                    </Checkbox>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )
      )}
    </>
  )
}

export default ThirdParties
