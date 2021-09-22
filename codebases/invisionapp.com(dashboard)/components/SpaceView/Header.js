import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Text, Flex } from '@invisionapp/helios'
import Description from './Description'
import Title from './Title'
import Options from './Options'

import styles from '../../css/space/sidebar/header.css'
import { Team, Lock } from '@invisionapp/helios/icons'

import { trackEvent } from '../../utils/analytics'
import { APP_SPACE_DESCRIPTION_EDIT_CLICKED } from '../../constants/TrackingEvents'

class SpaceViewHeader extends PureComponent {
  static defaultProps = {
    space: {
      permissions: {
        addDocuments: true
      }
    }
  }

  getPublicSpaceIcon = () => {
    return (
      <div className={styles.spaceIcon} id='public-space-icon'>
        <Team size={24} />
      </div>
    )
  }

  getPrivateSpaceIcon = () => {
    return (
      <div className={styles.spaceIcon} id='private-space-icon'>
        <Lock size={24} />
      </div>
    )
  }

  handleTitleChange = (value = 'Default title') => {
    const { serverActions, space } = this.props

    const updatedSpace = {
      createdAt: space.createdAt,
      description: space.description,
      isPublic: space.isPublic,
      title: value,
      updatedAt: new Date().toISOString()
    }

    serverActions.updateSpace.request(updatedSpace, space.cuid)
  }

  renderTitle = () => {
    const { config, space } = this.props

    if (space.isLoading) {
      return <div className={styles.titleLeftLoading} />
    }

    return (
      <Text order='title' color='text-darker' className={styles.title}>
        <Title
          allowEdit={space.permissions.editSpace}
          charLimit={100}
          className={cx(styles.title, {
            [styles.readonly]: !space.permissions.editSpace,
            [styles.titleLeft]: config.spacesDescriptionEnabled
          })}
          isLoading={space.isLoading && !space.title}
          onSubmit={this.handleTitleChange}
          placeholder='Name your space'
          title={space.title}
          error={space.error}
        />
      </Text>
    )
  }

  renderVisibility = () => {
    const {
      account: {
        team: { name }
      },
      space: { isPublic }
    } = this.props

    const visibilityText = isPublic
      ? `Team members of ${name} can access`
      : 'Only invited members can access'

    return (
      <Text
        order='body'
        size='smaller'
        color='text'
        className={styles.visibilityText}
      >
        {visibilityText}
      </Text>
    )
  }

  handleVisibilityClick = () => {
    const { actions } = this.props
    actions.openManageAccessModal(true)
  }

  trackDescriptionEditEventClicked = () => {
    trackEvent(APP_SPACE_DESCRIPTION_EDIT_CLICKED, {
      spaceId: this.props.space.id,
      spaceType: this.props.space.isPublic ? 'team' : 'invite-only',
      contentState: this.props.space.description.length > 0 ? 'filled' : 'empty',
      charCount: this.props.space.description.length
    })
  }

  updateDescription = description => {
    const { serverActions, space } = this.props
    const updatedSpace = {
      createdAt: space.createdAt,
      description,
      isPublic: space.isPublic,
      title: space.title,
      updatedAt: new Date().toISOString()
    }

    serverActions.updateDescription.request(updatedSpace, space.id)
  }

  render () {
    const {
      actions,
      openModal,
      serverActions,
      space,
      config: {
        cloudflareEnabled,
        pagingEnabled
      }
    } = this.props

    return (
      <div className={styles.spaceInfo}>
        {this.renderTitle()}
        {space.isLoading ? (
          <div className={styles.visibilityLoading} />
        ) : (
          <Flex
            alignItems='center'
            justifyContent='flex-start'
            className={styles.visibility}
          >
            <div onClick={this.handleVisibilityClick} className={styles.visibilityInner}>
              {space.isPublic
                ? this.getPublicSpaceIcon()
                : this.getPrivateSpaceIcon()}
              {this.renderVisibility()}
            </div>
          </Flex>
        )}

        { (space.permissions.editSpace || space.isLoading || space.description !== '') &&
          <Description
            analyticsSetContext={actions.analyticsSetContext}
            canEdit={space.permissions.editSpace}
            description={space.description || ''}
            isDescriptionEditing={space.isDescriptionEditing}
            isDescriptionSaving={space.isDescriptionSaving}
            isLoading={(pagingEnabled && !space.description && space.isLoading) || (!pagingEnabled && (space.isLoading || (!space.description && space.isLoadingFull)))}
            onLinkClicked={actions.descriptionLinkClicked}
            placeholder='Add a description to this space'
            startDescriptionEdit={actions.startDescriptionEdit}
            stopDescriptionEdit={actions.stopDescriptionEdit}
            trackEditClickedEvent={this.trackDescriptionEditEventClicked}
            updateDescription={this.updateDescription}
          />
        }

        <Options
          actions={actions}
          cloudflareEnabled={cloudflareEnabled}
          openModal={openModal}
          pagingEnabled={pagingEnabled} // TODO: remove when pagingEnabled flag is removed
          serverActions={serverActions}
          space={space}
        />
      </div>
    )
  }
}

export default SpaceViewHeader
