import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import classNames from 'classnames'

class InlineNav extends React.Component {
  render() {
    const currentPath = `${this.props.location.pathname}${this.props.location.search}`

    return (
      <nav className="inline-nav">
        <ul className="bare-list list">
          {this.props.items.map((item, i) => {
            const classes = classNames('list__item', {
              active:
                item.path.replace(/\/$/, '') === currentPath.replace(/\/$/, '')
            })

            return (
              <li key={i} className={classes}>
                <Link to={item.path} className="link">
                  {item.label}
                  {item.meta ? item.meta : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}

InlineNav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
}

export default withRouter(InlineNav)
