import { autorun } from 'mobx';
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { PageService } from '../../../appsdk/services/PageService';
import { SCRATCHPAD } from '../../common/constants/pages';

export default class EmptyOverlay extends Component {

  constructor () {
    super();

    this.state = {
      isOpen: false
    };

    this.overlayRoot = document.getElementById('overlay-root');

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    pm.mediator.on('openEmptyOverlay', this.handleOpen, this);
    pm.mediator.on('closeEmptyOverlay', this.handleClose, this);

    autorun(() => {
      if (PageService.activePage !== SCRATCHPAD) {
        this.handleClose();
      }
    });
  }

  handleOpen () {
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }

  componentWillUnmount () {
    pm.mediator.off('openEmptyOverlay', this.handleOpen);
    pm.mediator.off('closeEmptyOverlay', this.handleClose);
  }


  render () {
    if (!this.state.isOpen) {
      return null;
    }
    return (
     createPortal(<div className='empty-overlay' />, this.overlayRoot));
  }
}
