import React, {Component} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import BaseModal, {ButtonPanel} from '../../modals/base/modal';
import {withPortal} from '../../modals/base/portal';
import SimpleButton from '../../buttons/base/simple';

const Detail = glamorous.div({
  marginTop: 20,
  fontSize: 12,
  fontStyle: 'italic'
});

class ErrorModal extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    detail: PropTypes.any
  };

  render() {
    const {detail, onDismiss} = this.props;
    return (
      <BaseModal title="Share Decision" width={450} onDismiss={onDismiss}>
        There was a problem sharing your decision.
        <br />
        <br />
        Please try again and let us know if you continue to have problems.
        {typeof detail === 'string' && <Detail>Reason: {detail}</Detail>}
        <ButtonPanel>
          <SimpleButton onClick={this.props.onDismiss}>OK</SimpleButton>
        </ButtonPanel>
      </BaseModal>
    );
  }
}

export default withPortal(ErrorModal);
