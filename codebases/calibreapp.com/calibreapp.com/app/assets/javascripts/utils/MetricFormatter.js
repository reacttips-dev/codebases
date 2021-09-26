import React from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'
import { filesize, numberFormat } from 'humanize'

import { Text } from '../components/Type'
import { Value, Unit } from '../components/Metric'

const FormattedDuration = React.lazy(() =>
  import('../components/FormattedDuration')
)
const FormattedFileSize = React.lazy(() =>
  import('../components/FormattedFileSize')
)
const FormattedPerformanceGrade = React.lazy(() =>
  import('../components/FormattedPerformanceGrade')
)

const RichFormatter = props => {
  const { value, formatter, grading } = props

  if (value === null || value === undefined) return <Unit>—</Unit>

  switch (formatter) {
    case 'trust':
      return (
        <Value {...props}>
          <FormattedNumber value={value || 0} maximumFractionDigits={2} />
        </Value>
      )
    case 'gradeScore':
      return <FormattedPerformanceGrade {...props} />
    case 'fileSize':
      return <FormattedFileSize {...props} />
    case 'humanDuration':
      return <FormattedDuration {...props} />
    case 'milliunit':
      return (
        <Value {...props} variant={grading}>
          <FormattedNumber value={value ? value / 1000 : 0} />
        </Value>
      )
    default:
      return (
        <Text as="span">
          No called <pre>{formatter}</pre> exists
        </Text>
      )
  }
}

RichFormatter.propTypes = {
  value: PropTypes.number,
  level: PropTypes.string,
  formatter: PropTypes.oneOf([
    'trust',
    'gradeScore',
    'fileSize',
    'humanDuration',
    'milliunit'
  ]).isRequired,
  grading: PropTypes.oneOf(['ungraded', 'poor', 'average', 'good'])
}

RichFormatter.defaultProps = {
  level: 'sm'
}

/* eslint-disable no-case-declarations */
const PlainFormatter = ({ number, formatter }) => {
  switch (formatter) {
    case 'trust':
      return numberFormat(number, 0)
    case 'gradeScore':
      return numberFormat(number, 0)
    case 'fileSize':
      return filesize(number)
    case 'humanDuration':
      const duration = parseInt(number)

      if (duration > 100000) {
        return `${(duration / 1000 / 60 / 60).toFixed(1)} hrs`
      } else if (duration > 60000) {
        return `${(duration / 1000 / 60).toFixed(2)} mins`
      } else if (duration > 1000) {
        return `${(duration / 1000).toFixed(2)} sec`
      } else if (duration < 1 && duration !== 0) {
        return `${duration.toFixed(2)} ms`
      } else {
        return `${duration} ms`
      }
    case 'milliunit':
      return number ? number / 1000 : number
  }
}

const InputUnits = function ({ formatter }) {
  switch (formatter) {
    case 'fileSize':
      return 'kb'
    case 'humanDuration':
      return 'sec'
    default:
      return ''
  }
}

const InputValue = ({ value, formatter }) => {
  switch (formatter) {
    case 'fileSize':
      return (value / 1024.0).toFixed(2)
    case 'humanDuration':
      return (value / 1000.0).toFixed(2)
    case 'milliunit':
      return (value / 1000.0).toFixed(2)
    default:
      return value
  }
}

const AbsoluteValue = ({ value, formatter }) => {
  switch (formatter) {
    case 'fileSize':
      return value * 1024.0
    case 'humanDuration':
      return value * 1000.0
    case 'milliunit':
      return value * 1000.0
    default:
      return parseInt(value, 10)
  }
}

/* eslint-enable no-case-declarations */
export { RichFormatter, PlainFormatter, InputUnits, InputValue, AbsoluteValue }
