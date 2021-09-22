import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Dropdown, Button, Icon } from '@invisionapp/helios-one-web'

import styles from '../../../css/modals/select-option.css'

const OPTIONS_PUBLIC = 'All members of $team can access this space'
const OPTIONS_PRIVATE = 'Only people invited can access this space'

export default class SelectOptions extends Component {
  static propTypes = {
    actions: PropTypes.object,
    member: PropTypes.object,
    teamName: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.setToPublic = this.setToPublic.bind(this)
    this.setToPrivate = this.setToPrivate.bind(this)

    this.state = {
      isOpen: false
    }
  }

  setSpacePublic (isPublic) {
    this.props.actions.setSpacePermission(isPublic)
  }

  setToPublic () {
    this.setSpacePublic(true)
  }

  setToPrivate () {
    this.setSpacePublic(false)
  }

  handleChangeVisibility = (v) => {
    this.setState({
      isOpen: v
    })
  }

  render () {
    const { isPublic } = this.props.createModal
    const selectedDescription = isPublic
      ? OPTIONS_PUBLIC.replace('$team', this.props.teamName)
      : OPTIONS_PRIVATE
    const selectedIcon = isPublic
      ? <Icon name='Team' size='24' color='surface-100' alt='' className={styles.iconTeam} />
      : <Icon name='Lock' size='24' color='surface-100' alt='' className={styles.iconLock} />

    const menuItems = [
      {
        iconNode: (<Icon name='Team' size='24' color='surface-100' alt='' className={styles.iconTeam} />),
        label: OPTIONS_PUBLIC.replace('$team', this.props.teamName),
        onClick: this.setToPublic,
        isSelected: isPublic,
        type: 'item'
      },
      {
        iconNode: (<Icon name='Lock' size='24' color='surface-100' alt='' className={styles.iconLock} />),
        label: OPTIONS_PRIVATE,
        onClick: this.setToPrivate,
        isSelected: !isPublic,
        type: 'item'
      }
    ]

    return (
      <Dropdown
        placement='bottom-center'
        className={styles.dropdownContainer}
        items={menuItems}
        isOpen={this.state.isOpen}
        onChangeVisibility={this.handleChangeVisibility}
        triggerNode={(
          <Button size='48' as='div' order='secondary' className={styles.triggerContainer}>
            <div>
              {selectedIcon}
            </div>
            <div className={styles.detailsContainer}>
              <span className={styles.itemTitle}>
                {selectedDescription}
              </span>
            </div>
            <Icon className={styles.triggerIcon} name={this.state.isOpen ? 'NavigateUp' : 'NavigateDown'} size='24' color='surface-100' isDecorative />
          </Button>
        )}
        width={600}
      />
    )
  }
}
