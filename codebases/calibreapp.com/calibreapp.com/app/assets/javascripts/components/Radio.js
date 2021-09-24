import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Text } from './Type'

class Radio extends React.Component {
  constructor(props) {
    super(props)

    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle(event) {
    this.props.onChange(event.target.value)
  }

  get previewImage() {
    if (this.props.previewImage)
      return (
        <img
          src={this.props.previewImage}
          width="45"
          className="preview-image m--r1"
        />
      )
    return null
  }

  render() {
    const classes = classnames(
      'checkbox',
      {
        active: this.props.checked
      },
      this.props.className
    )

    return (
      <label className={classes}>
        <input
          name={this.props.group}
          type="radio"
          checked={this.props.checked}
          onChange={this.handleToggle}
          value={this.props.value}
        />
        {this.previewImage}
        {this.props.checked ? (
          <Text fontSize="sm" fontWeight="2" color="blue300">
            {this.props.label}
          </Text>
        ) : (
          <Text fontSize="sm" color="blue300">
            {this.props.label}
          </Text>
        )}
      </label>
    )
  }
}

Radio.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired
}

export default Radio
