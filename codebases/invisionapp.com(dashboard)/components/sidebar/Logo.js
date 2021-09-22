import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Icon, Box, Action, IconButton } from '@invisionapp/helios-one-web'

import HamburgerIcon from './HamburgerIcon'

import styles from './css/logo.css'

class Logo extends Component {
  static propTypes = {
    linkClicked: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    teamSettingsOpen: PropTypes.any,
    toggleSidebar: PropTypes.func.isRequired,
    toggleCondensedSidebar: PropTypes.func.isRequired
  }

  handleClick = () => {
    return this.props.linkClicked('/')
  }

  render () {
    const { open, teamSettingsOpen, toggleCondensedSidebar, isCondensed, isHovered } = this.props
    return (
      <Box
        className={cx(styles.root, {
          [styles.open]: open,
          [styles.rootCondensed]: isCondensed,
          [styles.rootHovered]: isHovered
        })}
        alignItems='center'
        justifyContent='start'
      >

        <Action
          as='a'
          href='/'
          data-app-shell-behavior='prevent-default'
          onClick={this.handleClick}
          className={cx(styles.logo, {
            [styles.teamSettingsOpen]: teamSettingsOpen
          })}
        >
          <Icon
            name='Logo'
            size='32'
            color='surface-100'
            aria-label='The InVision logo. Click here to go back to the homepage.'
          />
        </Action>
        <HamburgerIcon {...this.props} />

        <div className={cx(styles.sidebarToggle, {
          [styles.hideUi]: isCondensed && !isHovered,
          [styles.delayShowUi]: isHovered && isCondensed,
          [styles.showUi]: isHovered && !isCondensed
        })}>
          <IconButton
            as='button'
            onClick={toggleCondensedSidebar}
            size='32'
          >
            <Icon className={cx({
              [styles.iconIsCondensed]: isCondensed
            })} name='ShrinkSidebar' color='surface-100' size='24' aria-label='Shrink the sidebar down' />
          </IconButton>
        </div>
      </Box>
    )
  }
}

export default Logo
