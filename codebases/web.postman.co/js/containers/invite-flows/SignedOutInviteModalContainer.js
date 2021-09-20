import React, { Component } from 'react';
import InviteSignedOutModal from '../../components/invite-flows/InviteSignedOutModal';

export default class SignedOutInviteModalContainer extends Component {
  constructor (props) {
    super(props);
    this.state = { isOpen: false };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('openInviteSignoutModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openInviteSignoutModal', this.handleOpen);
  }

  handleOpen () {
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }


  getCustomStyles () {
    return {
      maxHeight: '90vh',
      marginTop: '7vh'
    };
  }

  render () {

    return (
      <InviteSignedOutModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
      />
    );
  }
}
