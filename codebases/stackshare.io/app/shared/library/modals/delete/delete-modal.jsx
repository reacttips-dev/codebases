import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import BaseModal, {ButtonPanel} from '../base/modal';
import {withPortal} from '../base/portal';
import SimpleButton from '../../buttons/base/simple.jsx';
import CancelButton from '../../buttons/base/cancel.jsx';

export class DeleteModal extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    onSubmit: PropTypes.func,
    onConfirmationDismiss: PropTypes.func,
    objectType: PropTypes.string,
    objectId: PropTypes.string
  };

  state = {
    error: false,
    deleting: false,
    confirm: false
  };

  handleSubmit = async () => {
    const {onSubmit, objectId, onDismiss, onConfirmationDismiss} = this.props;
    this.setState({deleting: true});
    try {
      const {data} = await onSubmit(objectId);
      if (data && !onConfirmationDismiss) {
        onDismiss();
      } else if (data && onConfirmationDismiss) {
        this.setState({confirm: true, deleting: false});
      } else {
        this.setState({error: true, deleting: false});
      }
    } catch (err) {
      this.setState({error: true, deleting: false});
    }
  };

  render() {
    const {onDismiss, objectType, onConfirmationDismiss} = this.props;
    const {error, deleting, confirm} = this.state;
    const content = !confirm
      ? `Are you sure you want to delete your ${objectType}?`
      : `Your ${objectType} has been deleted.`;
    const errorMsg = `There was a problem deleting ${objectType}`;
    return (
      <BaseModal title="Confirm" onDismiss={!confirm ? onDismiss : onConfirmationDismiss}>
        {!error && content}
        {error && errorMsg}
        <ButtonPanel>
          {deleting ? (
            <SimpleButton>Deleting...</SimpleButton>
          ) : (
            <React.Fragment>
              {!confirm ? (
                <React.Fragment>
                  <CancelButton onClick={onDismiss}>Cancel</CancelButton>
                  <SimpleButton onClick={error ? onDismiss : this.handleSubmit}>
                    {error ? 'Ok' : 'Yes, Delete'}
                  </SimpleButton>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <SimpleButton onClick={onConfirmationDismiss}>Ok</SimpleButton>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </ButtonPanel>
      </BaseModal>
    );
  }
}

export default compose(withPortal)(DeleteModal);
