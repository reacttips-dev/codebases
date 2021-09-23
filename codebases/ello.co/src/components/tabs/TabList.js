// TODO: There are only 3 of these at one time but still...
/* eslint-disable react/jsx-no-bind */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'

function isActive(tab, activePath) {
  if (!tab.activePattern) {
    return tab.to === activePath
  }
  return tab.activePattern.test(activePath)
}

export const TabListLinks = ({ activePath, className, onTabClick, tabClasses, tabs }) =>
  (<nav className={classNames(className, 'TabListLinks')}>
    {tabs.map((tab) => {
      if (tab.kind === 'divider') {
        return <span key="TabDivider" className="TabDivider" />
      }
      return (
        <Link
          className={classNames(tabClasses, 'TabLink', { isActive: isActive(tab, activePath) })}
          key={`TabLink_${tab.to}`}
          onClick={onTabClick ? () => { onTabClick({ type: tab.type }) } : null}
          to={tab.to}
        >
          {tab.children}
        </Link>
      )
    })}
  </nav>)
TabListLinks.propTypes = {
  activePath: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onTabClick: PropTypes.func,
  tabClasses: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
}
TabListLinks.defaultProps = {
  onTabClick: null,
}

// -------------------------------------

export const TabListButtons = ({ activeType, className, onTabClick, tabClasses, tabs }) =>
  (<nav className={classNames(className, 'TabListButtons')}>
    {tabs.map(tab =>
      (<button
        className={classNames(tabClasses, 'TabButton', { isActive: tab.type === activeType })}
        key={`TabButton_${tab.type}`}
        onClick={() => { onTabClick({ type: tab.type }) }}
        type="button"
      >
        {tab.children}
      </button>),
    )}
  </nav>)
TabListButtons.propTypes = {
  activeType: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onTabClick: PropTypes.func,
  tabClasses: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
}
TabListButtons.defaultProps = {
  onTabClick: null,
}

