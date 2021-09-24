import React, { useContext } from 'react'
import { filesize } from 'humanize'
import { FormattedMessage } from 'react-intl'

import HorizontalBarChart from '../../Chart/HorizontalBarChart'
import Legend from '../../Chart/Legend'
import CategoryContext from '../../CategoryContext'

const ThirdPartyCategories = ({ thirdParties }) => {
  const { categories, setCategories } = useContext(CategoryContext)

  const toggleCategory = name => {
    const updatedCategories = categories.map(category => {
      if (category.name === name) category.hidden = !category.hidden
      return category
    })
    setCategories(updatedCategories)
  }

  const total = thirdParties.reduce((last, current) => {
    const category = categories.find(
      category => current.categories[0] === category.name
    )
    const value = category.hidden ? 0 : current.size
    return last + value
  }, 0)

  const segments = categories
    .map(category => {
      const categoryThirdParties = thirdParties.filter(
        thirdParty => category.name === thirdParty.categories[0]
      )
      const transferSize = categoryThirdParties.reduce((last, current) => {
        return last + (current.size || 0)
      }, 0)
      const percentageOfTotalTransfer = (transferSize / total) * 100

      const label =
        percentageOfTotalTransfer > 10
          ? `${category.name}: ${filesize(transferSize)}`
          : percentageOfTotalTransfer > 5
          ? category.name
          : ' '

      return {
        ...category,
        value: transferSize,
        formatted: filesize(transferSize),
        scaled: percentageOfTotalTransfer,
        color: category.color,
        label,
        onClick: () => toggleCategory(category.name)
      }
    })
    .sort((a, b) => b.value - a.value)

  return (
    <>
      <div className="row">
        <div className="col-xs-12 col-md-3">
          <h2 className="type-medium">
            <FormattedMessage id="thirdPartyCategories.title" />
          </h2>
        </div>
        <div className="col-xs-12 col-md-9 end-md m--b1">
          <Legend series={segments} />
        </div>
      </div>
      <HorizontalBarChart segments={segments} />
    </>
  )
}

export default ThirdPartyCategories
