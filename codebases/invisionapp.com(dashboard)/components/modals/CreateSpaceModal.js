import React from 'react'
import { Button, Alert, Stack } from '@invisionapp/helios-one-web'

import cx from 'classnames'
import NameInput from './NameInput'
import SelectOptions from './SelectOptions'
import sanitizeName from '../../utils/sanitizeName'
import { APP_SPACE_OPENED } from '../../constants/tracking-events'

import styles from '../sidebar/css/create-space-modal.css'
import animationStyles from '../sidebar/css/modal-animations.css'

class CreateSpace extends React.Component {
  changeVisibility (isPublic) {
    this.setState({
      isPublic
    })
  }

  handleSpaceNameChange (updatedSpaceName) {
    this.setState({
      spaceName: sanitizeName(updatedSpaceName)
    })
  }

  handleCreateSpace () {
    this.props.serverActions.createSpace.request(
      sanitizeName(this.state.spaceName),
      this.state.isPublic,
      this.props.account.team.id,
      this.props.account.user.id
    )
  }

  constructor (props) {
    super(props)

    this.state = {
      isPublic: true,
      spaceName: ''
    }

    this.changeVisibility = this.changeVisibility.bind(this)
    this.handleSpaceNameChange = this.handleSpaceNameChange.bind(this)
    this.handleCreateSpace = this.handleCreateSpace.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (!this.props.open && prevProps.open) {
      this.setState({
        isPublic: true,
        spaceName: ''
      })
    }

    // Take the user to the new space and fire the analytics for the space opened
    if (this.props.createdSpaceData && !prevProps.createdSpaceData) {
      const { cuid, isPublic } = this.props.createdSpaceData

      const trackedEvent = {
        spaceId: cuid,
        spaceType: isPublic ? 'team' : 'invite-only',
        spaceContext: 'auto_nav'
      }

      this.props.handleTrackEvent(APP_SPACE_OPENED, trackedEvent)
    }
  }

  render () {
    const { config, willClose } = this.props

    return (
      <Stack spacing='24' className={styles.root} justifyContent='center'>
        {(this.props.error) && (
          <div className={styles.error}>
            <Alert
              className={styles.alertMessage}
              isDismissable
              order='destructive'
            >
              {this.props.error}
            </Alert>
          </div>
        )}
        <div className={cx(!willClose ? animationStyles.slideIn : animationStyles.slideOut, styles.nameInputField)}>
          <NameInput
            handleSpaceNameChange={this.handleSpaceNameChange}
            handleCreateSpace={this.handleCreateSpace}
            spaceName={this.state.spaceName}
            title='Create new space'
            placeholder='Name your space'
          />
        </div>

        {config.canChangeSpaceVisibility &&
          <div className={cx(!willClose ? animationStyles.slideIn : animationStyles.slideOut, styles.selectSpaceVisibility)}>
            <SelectOptions
              teamName={this.props.account.team.name}
              isPublic={this.state.isPublic}
              changeVisibility={this.changeVisibility}
            />
          </div>
        }

        <div className={cx(styles.createButton, !willClose ? animationStyles.slideIn : animationStyles.slideOut)}>
          <Button
            order='primary'
            size='40'
            disabled={this.state.spaceName.length === 0 || this.props.isCreating}
            onClick={this.handleCreateSpace}
          >
            {!this.props.isCreating && 'Create'}
            {this.props.isCreating && 'Creating Space...'}
          </Button>
        </div>
      </Stack>
    )
  }
}

export default CreateSpace
