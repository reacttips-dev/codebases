import React from 'react'
import PropTypes from 'prop-types'

import Radio from './Radio'

class RadioButtonGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      groupName: `radioButtonGroup-${+new Date()}`
    }
  }

  render() {
    const { className, onChange, items, checked } = this.props
    const { groupName } = this.state

    return (
      <div>
        {items.map((item, i) => {
          return (
            <div key={i} className="m--b1">
              <Radio
                group={groupName}
                checked={item.value === checked}
                className={className}
                onChange={onChange}
                value={item.value}
                label={item.label}
                previewImage={item.previewImage}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

RadioButtonGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.isRequired
    })
  ).isRequired
}

export default RadioButtonGroup
