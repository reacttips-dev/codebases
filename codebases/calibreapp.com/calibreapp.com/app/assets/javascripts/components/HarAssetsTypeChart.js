import React, { useContext } from 'react'
import { filesize } from 'humanize'
import { FormattedMessage } from 'react-intl'

import convertRequestToAssetClassification from '../utils/request-asset-type-classification'
import { Text } from './Type'
import HorizontalBarChart from './Chart/HorizontalBarChart'
import Legend from './Chart/Legend'
import CategoryContext from './CategoryContext'

import { harColors } from '../theme'

const HarAssetsTypeChart = ({ entries, error }) => {
  const { categories, setCategories } = useContext(CategoryContext)
  const toggleCategory = name => {
    const updatedCategories = categories.map(category => {
      if (category.name === name) category.hidden = !category.hidden
      return category
    })
    setCategories(updatedCategories)
  }

  const total = entries.reduce(
    (last, current) => {
      const category = categories.find(
        category => current.assetClassification === category.name
      )
      if (category && category.hidden) return last

      return {
        count: last.count + 1,
        transferSize: last.transferSize + (current.response._transferSize || 0),
        uncompressedSize:
          last.uncompressedSize + (current.response.content.size || 0)
      }
    },
    { count: 0, transferSize: 0, uncompressedSize: 0 }
  )

  const groupedRequests = categories.map(({ name, hidden }) => {
    let group = entries.filter(
      e =>
        convertRequestToAssetClassification(e.response.content.mimeType) == name
    )
    const transferSize = group.reduce((last, current) => {
      return last + (current.response._transferSize || 0)
    }, 0)
    const percentageOfTotalTransfer = (transferSize / total.transferSize) * 100

    const label =
      percentageOfTotalTransfer > 10
        ? `${name}: ${filesize(transferSize)}`
        : percentageOfTotalTransfer > 5
        ? name
        : ' '

    return {
      name,
      hidden,
      value: transferSize,
      formatted: filesize(transferSize),
      scaled: percentageOfTotalTransfer,
      label,
      color: harColors[name],
      onClick: () => toggleCategory(name)
    }
  })

  return (
    <div className="page-section">
      <div className="row">
        <div className="col-xs-12 col-md-3">
          <h2 className="type-medium">Asset transferred by type</h2>
        </div>
        <div className="col-xs-12 col-md-9 end-md m--b1">
          <Legend series={groupedRequests} />
        </div>
      </div>
      {(error && (
        <Text as="p" color="grey300">
          <FormattedMessage id="testArtifact.error" values={{ error }} />
        </Text>
      )) ||
        (groupedRequests.length && (
          <>
            <HorizontalBarChart segments={groupedRequests} />
            <div className="graph graph--grouped-bar">
              <div className="graph__caption graph__caption--centered">
                <span className="graph__caption__em">
                  {' '}
                  {total.count} requests,{' '}
                </span>
                totalling
                <span className="graph__caption__em">
                  {' '}
                  {filesize(total.transferSize)} of transfer.
                </span>
                <span className="graph__caption__em">
                  {' '}
                  {filesize(total.uncompressedSize)} uncompressed.
                </span>
              </div>
            </div>
          </>
        )) || (
          <Text as="p" color="grey300">
            <FormattedMessage id="testArtifact.unavailable" />
          </Text>
        )}
    </div>
  )
}

export default HarAssetsTypeChart
