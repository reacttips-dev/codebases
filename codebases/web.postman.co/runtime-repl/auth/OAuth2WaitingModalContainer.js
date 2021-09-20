
import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import OAuth2WaitingModal from './OAuth2WaitingModal';

@pureRender
export default class OAuth2WaitingModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showTokenWaitingModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showTokenWaitingModal', this.handleOpen);
  }

  handleOpen (handleTokenSelect, handleRetry) {
    this.handleTokenSelect = handleTokenSelect || _.noop;
    this.handleRetry = handleRetry || _.noop;
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });

    // Cancel any incomplete token generation process
    pm.oAuth2Manager.cancelOAuth2RequestToken();
  }

  render () {
    return (
      <OAuth2WaitingModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onRetry={this.handleRetry}
        handleTokenSelect={this.handleTokenSelect}
      />
    );
  }
}
