import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import LoadingIndicator from '../base/LoadingIndicator';
import { Checkbox } from '../base/Inputs';
import WarningIcon from '../base/Icons/WarningIcon';
import SpannerIcon from '../base/Icons/SpannerIcon';

export default class UserSignOutModal extends Component {
  constructor (props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.toggleSignoutCheck = this.toggleSignoutCheck.bind(this);
    this.renderModalContent = this.renderModalContent.bind(this);
  }

  handleClose () {
    this.props.onClose && this.props.onClose();
  }

  handleConfirm () {
    this.props.onConfirm && this.props.onConfirm();
  }

  toggleSignoutCheck () {
    this.props.toggleSignoutCheck && this.props.toggleSignoutCheck();
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  renderModalContent () {
    let isLoading = this.props.isLoading,
        isSomethingWrong = !isLoading && this.props.showWarning;

    if (isLoading) {
      return (
        <div className='sign-out-loading--container--text'>
          <span className='sign-out-loading--text'>Checking for unsaved changes...</span>
          <LoadingIndicator className='sign-out-loading-wrapper' />
        </div>
      );
    }

    else if (isSomethingWrong) {
      return (
        <div className='sign-out-warning-container-wrapper'>
          <div className='sign-out-warning-container'>
            <span className='sign-out-warning--header'>
              <WarningIcon className='sign-out-warning--warning-icon' />
              You have unsaved changes
            </span>
            <br />
            <div className='sign-out-warning--text'>
              <span>You will lose your unsaved changes if you sign out now.
              To save your changes, follow these steps:</span>
              <ul className='sign-out-warning--list'>
                <li>Export your data from <SpannerIcon className='sign-out-settings-icon' size='xs' /> &gt; Settings &gt; Data to create a backup</li>
                <li>Ensure you have a working internet connection</li>
                <li>Quit the app (be sure to stay signed in)</li>
                <li>Re-open the app again</li>
              </ul>
              {' '}
            </div>
          </div>
          <span>
            <Checkbox
              className='sign-out-warning--checkbox'
              checked={this.props.acceptForceSignout}
              onChange={this.toggleSignoutCheck}
              disabled={this.props.isSigningOut}
            />
            <span className='sign-out-warning--checkbox-text'> Sign out without saving my changes</span>
          </span>
        </div>
      );
    }

    // nothing is wrong with data, allow signout
    else {
      return 'Signing out removes your synced history, collections and environments from local storage. You can access them again by signing back in anytime';
    }
  }

  render () {
    let disableSignout = this.props.isSigningOut || this.props.isLoading || (this.props.showWarning && !this.props.acceptForceSignout);

    return (
      <Modal
        isOpen={this.props.isOpen}
        className='user-signout-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>SIGN OUT OF POSTMAN</ModalHeader>
        <ModalContent>
          <div className='user-signout-modal-message'>
            {this.renderModalContent()}
          </div>
        </ModalContent>
          <ModalFooter>
            <Button
              type='secondary'
              onClick={this.handleClose}
              disabled={this.props.isSigningOut}
            >Cancel</Button>
            <Button
              type='primary'
              onClick={this.handleConfirm}
              disabled={disableSignout}
            >
              {this.props.isSigningOut ? <LoadingIndicator /> : 'Sign out and remove local data'}
            </Button>
          </ModalFooter>
      </Modal>
    );
  }
}

UserSignOutModal.defaultProps = { isLoading: false, isSigningOut: false };
