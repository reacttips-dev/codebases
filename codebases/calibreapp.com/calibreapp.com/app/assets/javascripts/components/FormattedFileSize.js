import React from 'react'
import PropTypes from 'prop-types'
import { filesize } from 'humanize'

import { Value, Unit } from './Metric'

export const fileSize = inputValue => {
  const fileSizeParts = filesize(inputValue).split(' ')
  const value = fileSizeParts[0]
  const unit = fileSizeParts[1]

  return { value, unit }
}

const FormattedFileSize = ({ value: inputValue, level }) => {
  const { value, unit } = fileSize(inputValue)

  return (
    <>
      <Value level={level}>{value}</Value>
      <Unit> {unit}</Unit>
    </>
  )
}

FormattedFileSize.propTypes = {
  value: PropTypes.number
}

export default FormattedFileSize
