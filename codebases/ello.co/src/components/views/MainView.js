import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const MainView = ({ children, className }) =>
  (<main className={classNames(className, 'MainView')} role="main">
    {children}
  </main>)

MainView.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
}

export default MainView

