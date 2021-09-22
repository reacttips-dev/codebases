import React, { Component } from 'react'
import { IconButton, Icon } from '@invisionapp/helios-one-web'

import { APP_SIDEBAR_LINK_CLICKED } from '../../constants/tracking-events'
import styles from './css/add-space-action-button.css'

class AddSpaceButton extends Component {
  handleCreateSpace = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.handleTrackEvent(APP_SIDEBAR_LINK_CLICKED, {
      link_clicked: 'create_space_header'
    })

    this.props.showCreateSpaceModal()
  };

  render () {
    return (
      <IconButton
        aria-label='Create a Space'
        className={styles.addSpaceButton}
        as='button'
        data-app-shell-behavior='prevent-default'
        onClick={this.handleCreateSpace}
        size='32'
      >
        <div className={styles.addIcon}>
          <Icon name='Add' color='surface-100' size='24' />
        </div>
      </IconButton>
    )
  }
}

export default AddSpaceButton
