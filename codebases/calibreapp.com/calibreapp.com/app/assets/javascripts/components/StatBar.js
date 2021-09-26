import React from 'react'
import PropTypes from 'prop-types'

import Stat from './Stat'
import { Box } from './Grid'

class StatBar extends React.Component {
  render() {
    const { items, ...props } = this.props
    return (
      <div className="stat-bar">
        {items.map((item, i) => (
          <Box key={i} width={[1 / 2, 1 / 4]}>
            <Stat item={item} {...props} />
          </Box>
        ))}
      </div>
    )
  }
}

StatBar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      metric: PropTypes.node.isRequired,
      previous: PropTypes.node,
      difference: PropTypes.node,
      changePercentage: PropTypes.number,
      helpSource: PropTypes.string
    })
  ).isRequired
}

StatBar.defaultProps = {
  items: [],
  level: 'lg',
  labelProp: 'label'
}

export default StatBar
