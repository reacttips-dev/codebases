import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GlobalNavigation from '@invisionapp/global-navigation'
import { AvatarStack, Button, Dropdown, IconButton, Spaced } from '@invisionapp/helios'
import { More, Share } from '@invisionapp/helios/icons'
import memoizeOne from 'memoize-one'

import styles from '../../css/space/sidebar/options.css'
import _sortMembersAvatars from '../../utils/avatars'

// Prevents re-render of avatars when <SpaceViewOptions /> renders, this component was giving us trouble as of @invisionapp/helios@5.17.0
const sortMembersAvatars = memoizeOne(_sortMembersAvatars)

export default class SpaceViewOptions extends Component {
  static propTypes = {
    actions: PropTypes.object,
    cloudflareEnabled: PropTypes.bool,
    openModal: PropTypes.string,
    space: PropTypes.object
  }

  state = {
    shareDialogVisible: false
  }

  shareRoot = React.createRef()

  componentDidMount () {
    document.addEventListener('click', this.handleClickOutside, true)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  deleteSpace = () => {
    const { actions, space } = this.props

    actions.toggleDeleteModal({
      type: 'space',
      cuid: space.id
    })
  }

  handleClickOutside = e => {
    if (!this.state.shareDialogVisible || !this.shareRoot || !this.shareRoot.current) {
      return
    }

    if (
      !this.shareRoot.current.contains(e.target) &&
      !e.target.dataset.portalDropdownLink &&
      document.documentElement.className.indexOf('modal__no-scroll') === -1) {
      e.stopPropagation()
      e.preventDefault()

      this.setState({
        shareDialogVisible: false
      })
    }
  }

  handleGlobalNavigationChanges = (e) => {
    switch (e.type) {
      case 'MANAGE_ACCESS_MODAL':
        if (!e.data.accessModalOpen) {
          this.props.actions.openManageAccessModal(false)
        }
        break

      case 'SPACE_ACCESS_UPDATED':
        this.props.actions.updateAccessManagement({
          response: {
            data: {
              cuid: this.props.space.cuid,
              ...e.data
            }
          }
        })
        break

      default:
    }
  }

  leaveSpace = () => {
    const { serverActions, space } = this.props
    serverActions.leaveSpace.request(space.id, space.isPublic)
  }

  toggleShareDialog = e => {
    e.stopPropagation()
    e.preventDefault()

    this.setState({
      shareDialogVisible: !this.state.shareDialogVisible
    })
  }

  render () {
    const { cloudflareEnabled, pagingEnabled, space } = this.props
    const avatars = sortMembersAvatars(space.members, cloudflareEnabled, pagingEnabled)

    if (space.isLoading || !space.id) {
      return (
        <div className={styles.loading}>
          <div className={styles.loadingButton} />
          <div className={styles.loadingAvatar}>
            <AvatarStack
              color='light'
              avatars={Array(2).fill([{ name: '' }])}
              limit='4'
            />
          </div>
          <div className={styles.loadingAvatar}>
            <More size='24' fill='text-dark-mode' />
          </div>
        </div>
      )
    }

    let dropdownItems = []
    if (space.permissions.deleteSpace) {
      dropdownItems.push({
        destructive: true,
        label: 'Delete Space',
        onClick: this.deleteSpace,
        type: 'item'
      })
    } else if (space.permissions.leaveSpace) {
      dropdownItems.push({
        destructive: true,
        label: 'Leave Space',
        onClick: this.leaveSpace,
        type: 'item'
      })
    }

    return (
      <div className={styles.root}>
        <Spaced right='xs'>
          <Button
            onClick={this.toggleShareDialog}
            order='primary-alt'
            role='button'>
            <Share size={20} fill='white' />
            Share
          </Button>
        </Spaced>

        { avatars.length > 0 &&
          <Spaced right='xs'>
            <AvatarStack
              avatars={avatars}
              color='dark'
              excessCutoff='10'
              limit='4'
              tooltipPlacement='top'
              totalPeople={avatars.length}
              withTooltip
            />
          </Spaced>
        }

        { dropdownItems.length > 0 &&
          <Dropdown
            closeOnClick
            items={dropdownItems}
            placement='bottom'
            align='left'
            trigger={(
              <IconButton withTooltip={false}>
                <More size='24' />
              </IconButton>
            )}
            unstyledTrigger
          />
        }

        <div className={styles.shareDialogWrap} ref={this.shareRoot}>
          <GlobalNavigation
            isDocument
            documentType={'space'}
            documentID={space.id}
            context={'space'}
            onChange={this.handleGlobalNavigationChanges}
            openModal={this.props.openModal === 'ManageAccess' ? 'ManageAccess' : ''}
            shareDialogOnly
            viewSpace
            shareDialogProps={{
              type: 'space',
              id: space.id,
              visible: this.state.shareDialogVisible,
              shareDialogWebURL: '/share-dialog-web-v7',
              position: {
                top: 42,
                right: 'auto',
                left: 0,
                bottom: 'auto'
              }
            }}
          />
        </div>
      </div>
    )
  }
}
