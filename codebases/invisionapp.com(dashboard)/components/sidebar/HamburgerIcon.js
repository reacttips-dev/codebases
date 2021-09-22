import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { IconButton } from '@invisionapp/helios-one-web'

import styles from './css/hamburger-icon.css'

let isMounted = false

export default class HamburgerIcon extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired
  }

  state = {
    disableTransitions: false
  }

  componentDidMount () {
    isMounted = true
  }

  componentDidUpdate (prevProps) {
    if (this.props.teamSettingsOpen && !prevProps.teamSettingsOpen) {
      this.setState({ disableTransitions: true })
    } else if (!this.props.teamSettingsOpen && !prevProps.teamSettingsOpen && this.state.disableTransitions) {
      setTimeout(() => {
        if (isMounted && this.state.disableTransitions) {
          this.setState({ disableTransitions: false })
        }
      }, 400)
    }
  }

  componentWillUnmount () {
    isMounted = false
  }

  render () {
    const { open, teamSettingsOpen, toggleSidebar } = this.props
    const { disableTransitions } = this.state

    return (
      <IconButton
        className={cx(styles.root, {
          [styles.disableTransitions]: disableTransitions,
          [styles.teamSettingsOpen]: teamSettingsOpen,
          [styles.active]: open
        })}
        as='a'
        onClick={toggleSidebar}
        size='32'>
        <div className={styles.lineWrapper} />
        <div className={styles.lineWrapper} />
        <div className={styles.lineWrapper} />
      </IconButton>
    )
  }
}
