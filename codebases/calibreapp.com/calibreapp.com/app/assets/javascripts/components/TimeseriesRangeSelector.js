import React from 'react'
import PropTypes from 'prop-types'

class TimeseriesRangeSelector extends React.Component {
  onChange(e) {
    const value = e.target.value
    this.props.onChange.call(this, value)
  }

  render() {
    return this.props.range.map((range, idx) => {
      return [
        <label key={idx} className="m--r1">
          <input
            type="radio"
            name="TimeseriesRangeSelector"
            value={range.value}
            onChange={this.onChange.bind(this)}
            checked={range.value === this.props.currentValue}
            style={{ marginRight: '3px' }}
          />{' '}
          <span className="type-dim type-small">{range.label}</span>
        </label>
      ]
    })
  }
}

TimeseriesRangeSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentValue: PropTypes.string.isRequired,
  range: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
}

export default TimeseriesRangeSelector
