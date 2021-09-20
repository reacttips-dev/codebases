
import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import ConfirmationModal from '../../components/base/common/ConfirmationModal';

@pureRender
export default class ConfirmationModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      id: null,
      meta: null,
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showConfirmationModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showConfirmationModal', this.handleOpen);
  }

  handleOpen (discardCallback) {
    this.onDiscard = discardCallback;
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.onDiscard = null;
    this.setState({ isOpen: false });
  }

  handleDiscard () {
    this.setState({ isOpen: false });
    _.isFunction(this.onDiscard) && this.onDiscard();
    this.onDiscard = null;
  }

  render () {

    return (
      <ConfirmationModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onDiscard={this.handleDiscard}
      />
    );
  }
}
