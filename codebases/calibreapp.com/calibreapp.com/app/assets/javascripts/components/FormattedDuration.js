import React from 'react'
import PropTypes from 'prop-types'

import { Value, Unit } from './Metric'

export const duration = inputValue => {
  const duration = parseFloat(inputValue)
  const absolute = Math.abs(duration)

  if (!absolute || absolute == -1) {
    return {
      value: null,
      unit: null
    }
  }

  if (absolute > 600000) {
    return {
      value: (duration / 1000 / 60 / 60).toFixed(1),
      unit: 'hrs'
    }
  } else if (absolute > 60000) {
    return {
      value: (duration / 1000 / 60).toFixed(2),
      unit: 'mins'
    }
  } else if (absolute > 1000) {
    return {
      value: (duration / 1000).toFixed(2),
      unit: 'sec'
    }
  } else if (absolute < 1 && absolute !== 0) {
    return {
      value: duration.toFixed(2),
      unit: 'ms'
    }
  } else {
    return {
      value: parseInt(duration),
      unit: 'ms'
    }
  }
}

const FormattedDuration = ({ value: inputValue, level, grading }) => {
  const { value, unit } = duration(inputValue)

  if (!value || !unit) return <Unit>—</Unit>

  return (
    <>
      <Value level={level} variant={grading}>
        {value}
      </Value>
      <Unit> {unit}</Unit>
    </>
  )
}

FormattedDuration.propTypes = {
  value: PropTypes.number,
  grading: PropTypes.oneOf(['poor', 'average', 'good'])
}

export default FormattedDuration
