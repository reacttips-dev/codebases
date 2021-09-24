import React, { useState, useContext } from 'react'
import { FormattedMessage } from 'react-intl'

import ColourKey from '../../ColourKey'
import FormattedDuration from '../../FormattedDuration'
import FormattedFileSize from '../../FormattedFileSize'
import { Text, TextLink } from '../../Type'
import Table, { Td, Th } from '../../Table'
import CategoryContext from '../../CategoryContext'
import { SortButton } from '../../Button'
import { sortByString, sortByInteger } from '../../../utils/sort'

const ThirdPartySummary = ({ thirdParties, blockedThirdParties }) => {
  const { categories } = useContext(CategoryContext)

  const [sortBy, setSortBy] = useState('size')
  const [sortDirection, setSortDirection] = useState('desc')
  const sortedThirdParties = thirdParties.slice().sort((a, b) => {
    if (sortBy === 'name') {
      return sortByString(a.name, b.name, sortDirection)
    } else {
      return sortByInteger(a[sortBy], b[sortBy], sortDirection)
    }
  })

  return (
    <>
      {(thirdParties.length && (
        <Table className="qa-third-party-summary">
          <thead>
            <tr>
              {['name', 'size', 'duration'].map(attribute => (
                <Th key={attribute}>
                  <SortButton
                    attribute={attribute}
                    onUpdateSortBy={setSortBy}
                    onUpdateSortDirection={setSortDirection}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  >
                    <FormattedMessage
                      id={`thirdPartySummary.data.headings.${attribute}`}
                    />
                  </SortButton>
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedThirdParties.map((thirdParty, index) => {
              const isBlocked =
                blockedThirdParties.find(
                  blockedThirdParty =>
                    blockedThirdParty.name === thirdParty.name
                ) &&
                thirdParty.size === 0 &&
                thirdParty.duration === 0
              const category = categories.find(
                category => category.name === thirdParty.categories[0]
              )

              if (category.hidden) return null

              return (
                <tr key={index}>
                  <Td>
                    <TextLink
                      className="type-medium"
                      href={thirdParty.url}
                      opacity={`${isBlocked ? 0.5 : 1}`}
                    >
                      <ColourKey
                        backgroundColor={category.color}
                        opacity={isBlocked ? 0.5 : 1}
                      />
                      {thirdParty.name}
                    </TextLink>
                  </Td>
                  {(isBlocked && (
                    <Td colSpan="2">
                      <Text opacity={0.5}>Blocked</Text>
                    </Td>
                  )) || (
                    <>
                      <Td>
                        <div className="type-large type-dim">
                          <FormattedFileSize
                            value={thirdParty.size}
                            level="md"
                          />
                        </div>
                      </Td>
                      <Td>
                        <div className="type-large type-dim">
                          <FormattedDuration
                            value={thirdParty.duration}
                            level="md"
                          />
                        </div>
                      </Td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </Table>
      )) || (
        <Text as="p" color="grey300">
          <FormattedMessage id="testArtifact.unavailable" />
        </Text>
      )}
    </>
  )
}

ThirdPartySummary.defaultProps = {
  blockedThirdParties: [],
  thirdParties: []
}

export default ThirdPartySummary
