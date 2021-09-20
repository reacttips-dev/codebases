import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import OpenExternalLinkModal from './OpenExternalLinkModal';

@pureRender
export default class OpenExternalLinkModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      url: '',
      cb: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showExternalNavigationModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showExternalNavigationModal', this.handleOpen);
  }

  handleOpen (href, callback) {
    this.setState({
      isOpen: true,
      url: href,
      cb: callback
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      url: '',
      cb: null });
  }

  handleConfirm () {
    this.state.cb && _.isFunction(this.state.cb) && this.state.cb(true);
    this.handleClose();
  }

  render () {
    return (
      <OpenExternalLinkModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onConfirm={this.handleConfirm}
        url={this.state.url}
      />
    );
  }
}
