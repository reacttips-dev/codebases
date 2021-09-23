import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const SVGComponent = ({ children, ...rest }) =>
  (<svg {...rest}>
    {children}
  </svg>)
SVGComponent.propTypes = {
  children: PropTypes.node.isRequired,
}

export const SVGIcon = ({ children, className, onClick }) =>
  (<SVGComponent
    className={classNames(className, 'SVGIcon')}
    onClick={onClick}
    width="20"
    height="20"
  >
    {children}
  </SVGComponent>)
SVGIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}
SVGIcon.defaultProps = {
  onClick: null,
}

export const SVGBox = ({ children, className, height, size, width }) =>
  (<SVGComponent
    className={classNames(className, 'SVGBox')}
    width={width || size}
    height={height || size}
  >
    {children}
  </SVGComponent>)
SVGBox.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  height: PropTypes.string,
  size: PropTypes.string,
  width: PropTypes.string,
}
SVGBox.defaultProps = {
  height: null,
  size: '40',
  width: null,
}

