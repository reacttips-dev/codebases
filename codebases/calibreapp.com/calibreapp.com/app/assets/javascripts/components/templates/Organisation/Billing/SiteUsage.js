import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import { SiteUsage as SiteUsageQuery } from '../../../../queries/BillingQueries.gql'

import { LoadingLine } from '../../../Loading'
import Table, { Thead, Th, Tr, Td, Tbody } from '../../../Table'
import Text from '../../../Type'
import { SortButton } from '../../../Button'
import { sortByString, sortByInteger } from '../../../../utils/sort'

const SiteUsage = ({ orgId, attributes }) => {
  const [sortBy, setSortBy] = useState(attributes[0])
  const [sortDirection, setSortDirection] = useState('asc')
  const { data, loading } = useQuery(SiteUsageQuery, {
    variables: { organisation: orgId },
    fetchPolicy: 'cache-and-network'
  })
  const { organisation } = data || {}
  const { subscription } = organisation || {}
  const { testAllocation } = subscription || {}
  const { sites } = testAllocation || {}

  const sortedSites = (sites || [])
    .map(
      ({
        site: {
          name,
          slug,
          estimatedTestsPerMonth,
          scheduleInterval,
          scheduleAnchor,
          team: siteTeam
        },
        team,
        snapshot,
        reviewSite
      }) => {
        const schedule =
          siteTeam?.slug === team?.slug && scheduleInterval
            ? scheduleInterval
            : 'off'

        return {
          name: {
            value: name,
            label:
              !slug?.length || team?.slug === siteTeam?.slug ? (
                name
              ) : (
                <FormattedMessage
                  id="organisations.usage.sites.moved"
                  values={{ name, team: siteTeam?.name || 'Team' }}
                />
              )
          },
          team: {
            value: team?.name,
            label: team?.name
          },
          schedule: {
            value: schedule,
            label: (
              <FormattedMessage
                id={`organisations.usage.sites.scheduleInterval.${schedule}`}
                values={{ anchor: scheduleAnchor }}
              />
            )
          },
          snapshot: {
            value: snapshot,
            label: (
              <>
                <FormattedNumber value={snapshot} />{' '}
                {schedule === 'off' ? null : (
                  <Text level="xs">
                    <FormattedMessage
                      id="organisations.usage.sites.estimate"
                      values={{
                        estimate: (
                          <FormattedNumber
                            value={estimatedTestsPerMonth || 0}
                          />
                        )
                      }}
                    />
                  </Text>
                )}
              </>
            )
          },
          reviewSite: {
            value: reviewSite,
            label: (
              <>
                <FormattedNumber value={reviewSite} />
              </>
            )
          }
        }
      }
    )
    .slice()
    .sort((a, b) => {
      if (['name', 'team', 'schedule'].includes(sortBy)) {
        return sortByString(a[sortBy].value, b[sortBy].value, sortDirection)
      }
      return sortByInteger(a[sortBy].value, b[sortBy].value, sortDirection)
    })

  return loading ? (
    <LoadingLine width="100%" />
  ) : (
    <Table overflow="auto">
      <Thead>
        <Tr>
          {attributes.map((attribute, index) => (
            <Th
              key={attribute}
              px={0}
              width={`${
                index === attributes.length - 1 ? 5 : 95 / attributes.length
              }%`}
              textAlign="left"
            >
              <SortButton
                attribute={attribute}
                onUpdateSortBy={setSortBy}
                onUpdateSortDirection={setSortDirection}
                sortBy={sortBy}
                sortDirection={sortDirection}
              >
                <FormattedMessage
                  id={`organisations.usage.sites.${attribute}`}
                />
              </SortButton>
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {sortedSites.length &&
          sortedSites.map((site, idx) => (
            <Tr key={idx}>
              {attributes.map((attribute, index) => (
                <Td key={`${idx}-${index}`} px={0} textAlign="left">
                  {site[attribute].label}
                </Td>
              ))}
            </Tr>
          ))}
      </Tbody>
    </Table>
  )
}

export default SiteUsage
