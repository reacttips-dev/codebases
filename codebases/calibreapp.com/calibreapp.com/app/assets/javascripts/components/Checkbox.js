import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Checkbox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      checked: props.defaultChecked || props.checked
    }

    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle(event) {
    const checked = event.target.checked
    this.setState({ checked: checked })
    if (this.props.onChange) this.props.onChange(event.target.value)
  }

  render() {
    const classes = classnames(
      'checkbox',
      {
        active: this.state.checked
      },
      this.props.className
    )

    return (
      <label className={classes}>
        {this.props.beforeInput}
        <input
          type="checkbox"
          defaultChecked={this.props.defaultChecked}
          checked={this.props.checked}
          onChange={this.handleToggle}
          name={this.props.name}
          value={this.props.value}
          ref={this.props.inputRef}
          id={this.props.id}
        />
        {this.props.label}
      </label>
    )
  }
}

Checkbox.propTypes = {
  beforeInput: PropTypes.func,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func
}

export default Checkbox
