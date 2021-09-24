import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BaseModal, {ButtonPanel} from '../../../../shared/library/modals/base/modal';
import {withPortal} from '../../../../shared/library/modals/base/portal';
import SimpleButton from '../../../../shared/library/buttons/base/simple.jsx';

export class ErrorModal extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    message: PropTypes.string
  };

  render() {
    const {onDismiss, message} = this.props;
    return (
      <BaseModal title="Confirm" width="500" onDismiss={onDismiss}>
        {message}
        <ButtonPanel>
          <SimpleButton onClick={onDismiss}>Ok</SimpleButton>
        </ButtonPanel>
      </BaseModal>
    );
  }
}

export default withPortal(ErrorModal);
