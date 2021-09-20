import React from 'react';

import { Button } from '../base/Buttons';
import classnames from 'classnames';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../base/Modals';
import { Input } from '../base/Inputs';
import LoadingIndicator from '../base/LoadingIndicator';
import { getStore } from '../../stores/get-store';
import { isUsernameInvalid } from '../../utils/publicProfileValidation';

const descriptionText = 'You need a public profile to perform actions in public workspaces. Update and review the following details before making your profile visible to everyone.',
  confirmCTAText = 'Make Profile Public';

export default class UpdateUserProfileModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showModal: false,
      username: null,
      name: null,
      isProfileUpdating: false
    };

    this.descText = descriptionText;
    this.confirmCTAText = confirmCTAText;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.getNameErrorMessage = this.getNameErrorMessage.bind(this);
    this.getUserNameErrorMessage = this.getUserNameErrorMessage.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showUpdateUserProfileModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showUpdateUserProfileModal', this.handleOpen);
  }

  handleOpen (props) {
    this.descText = _.get(props, 'description') ? props.description : this.descText;
    this.confirmCTAText = _.get(props, 'confirmCTAText') ? props.confirmCTAText : this.confirmCTAText;
    this.onComplete = props && props.onComplete;
    this.onCancel = props && props.onCancel;

    const currentUserStore = getStore('CurrentUserStore');

    this.setState({
      showModal: true,
      username: currentUserStore.username,
      name: currentUserStore.name
    });
  }

  getUserNameErrorMessage () {
    return isUsernameInvalid(this.state.username);
  }

  getNameErrorMessage () {
    if (!this.state.name || !this.state.name.length) {
      return 'Empty name not allowed';
    }

    return null;
  }

  handleSubmit () {
    const currentUserStore = getStore('CurrentUserStore');

    this.setState({ isProfileUpdating: true });

    currentUserStore.updateCurrentUser({
      realname: this.state.name,
      username: this.state.username,
      isPublic: true,
      email: currentUserStore.email // TODO: this needs to be removed once GOD server endpoint starts supporting this update call without email
    }).then(() => {
      typeof this.onComplete === 'function' && this.onComplete();
      pm.toasts.success('You can now perform actions in public workspaces.', {
        title: 'Public profile enabled',
        noIcon: true
      });

      this.handleClose();
    }).catch((err) => {
      pm.toasts.error(_.get(err, 'message') || 'Couldn\'t enable public profile due to some error.');
    }).finally(() => {
      this.setState({ isProfileUpdating: false });
    });
  }

  handleInput (inputName, value) {
    this.setState({ [inputName]: value });
  }

  /**
   * handles closing of modal
   * and reset the state when closed
   */
  handleClose () {
    this.onComplete = null;
    this.onCancel = null;
    this.descText = descriptionText;
    this.confirmCTAText = confirmCTAText;

    this.setState({
      showModal: false,
      username: null,
      name: null
    });
  }

  handleCancel () {
    // Fire the consumer provided callback to notify that this action was canceled by the user
    typeof this.onCancel === 'function' && this.onCancel();

    this.handleClose();
  }

  getCustomOverlayStyles () {
    return {
      zIndex: 120
    };
  }

  render () {
    const isPublishDisabled = this.getUserNameErrorMessage() || !this.state.name;

    return (
      <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.handleCancel}
        customOverlayStyles={this.getCustomOverlayStyles()}
      >
        <ModalHeader className='update-user-profile-modal-header'>
          Make your profile public
        </ModalHeader>
        <ModalContent className='update-user-profile-modal-container'>
          <div className='update-user-profile-modal-container__text'>
            {this.descText}
          </div>
          <div className='update-user-profile-modal-container__input-name'>
            <div className='label'>Name</div>
            <Input
              inputStyle='box'
              type='text'
              value={this.state.name}
              onChange={(value) => { this.handleInput('name', value); }}
            />
            <span className={classnames({ 'is-visible': isPublishDisabled }, 'update-user-profile-modal-container__input-name__error')}>
              {this.getNameErrorMessage()}
            </span>
          </div>
          <div className='update-user-profile-modal-container__input-username'>
            <div className='label'>Username</div>
            <Input
              inputStyle='box'
              type='text'
              value={this.state.username}
              onChange={(value) => { this.handleInput('username', value); }}
            />
            <span className={classnames({ 'is-visible': isPublishDisabled }, 'update-user-profile-modal-container__input-username__error')}>
              {this.getUserNameErrorMessage()}
            </span>
          </div>
          <div className='update-user-profile-modal-container__info'>
            Your username can be used to sign in and helps identify you. Your public URL will be:
            <span className='profile-link'> {`${window.postman_explore_url}/${this.state.username}`}</span>
          </div>
        </ModalContent>
        <ModalFooter className='update-user-profile-modal-footer'>
          <div className='update-user-profile-modal-container__actions'>
            <Button
              type='secondary'
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              onClick={this.handleSubmit}
              disabled={isPublishDisabled}
              className='update-user-profile-modal-container__submit-btn'
            >
              {this.state.isProfileUpdating ? <LoadingIndicator /> : this.confirmCTAText}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}
