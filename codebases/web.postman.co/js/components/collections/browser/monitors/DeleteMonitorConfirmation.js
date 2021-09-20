import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import DeleteConfirmationModal from '../../../collections/DeleteConfirmationModal';
import AnalyticsService from '../../../../modules/services/AnalyticsService';
import MasterMonitorStore from '../../../../../monitors/stores/domain/MasterMonitorStore';

@pureRender
export default class DeleteMonitorConfirmation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      meta: {},
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDeleteMonitorModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteMonitorModal', this.handleOpen);
  }

  handleOpen (monitor, onSuccess, { origin }) {
    this.setState({
      isOpen: true,
      origin: origin,
      meta: {
        id: monitor.id,
        name: monitor.name
      }
    }, () => {
      this.onSuccess = onSuccess;
      _.invoke(this, 'keymapRef.focus');
      AnalyticsService.addEvent('monitor', 'initiate_delete', origin);
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      isDisabled: false
    }, () => {
      this.onSuccess = null;
    });
  }

  handleConfirm () {
    this.setState({ isDisabled: true });
    new MasterMonitorStore().deleteMonitorConfiguration(this.state.meta.id).then(() => {
      this.onSuccess && this.onSuccess();
      this.handleClose();

      AnalyticsService.addEvent('monitor', 'confirm_delete', this.state.origin);
    }).catch(() => {
      this.setState({ isDisabled: false });
      pm.toasts.error('Unable to delete the monitor');
    });
  }

  render () {

    return (
      <DeleteConfirmationModal
        isDisabled={this.state.isDisabled}
        preventFocusReset
        entity='MONITOR'
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        name={this.state.meta.name}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
