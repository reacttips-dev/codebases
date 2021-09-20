import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import DeleteConfirmationModal from '../../../collections/DeleteConfirmationModal';
import AnalyticsService from '../../../../modules/services/AnalyticsService';
import dispatchUserAction from '../../../../modules/pipelines/user-action';
import { createEvent } from '../../../../modules/model-event';
import TabService from '../../../../../appsdk/workbench/TabService';
import { deleteMock } from '../../../../../mocks/services/MockService';

@pureRender
export default class DeleteMockConfirmation extends Component {
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
    pm.mediator.on('showDeleteMockModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteMockModal', this.handleOpen);
  }

  handleOpen (mock, onSuccess, { origin, traceId }) {
    this.model = mock;
    this.setState({
      isOpen: true,
      origin: origin,
      traceId: traceId,
      meta: {
        id: mock.id,
        name: mock.name
      }
    }, () => {
      this.onSuccess = onSuccess;
      _.invoke(this, 'keymapRef.focus');

      AnalyticsService.addEventV2({
        category: 'mock',
        action: 'initiate_delete',
        label: origin,
        entityId: mock.id,
        traceId: traceId
      });
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

    AnalyticsService.addEventV2({
      category: 'mock',
      action: 'submit_delete',
      label: this.state.origin,
      entityId: this.state.meta.id,
      traceId: this.state.traceId
    });

    deleteMock(this.state.meta.id)
    .then(() => {
      this.onSuccess && this.onSuccess();

      // Close the tab if mock is open inside of it
      TabService.closeByRoute('mock/:mockId', { mockId: this.state.meta.id });

      this.handleClose();

      pm.toasts.success('Mock deleted');

      AnalyticsService.addEventV2({
        category: 'mock',
        action: 'confirm_delete',
        label: this.state.origin,
        entityId: this.state.meta.id,
        traceId: this.state.traceId
      });
    })
    .catch(() => {
      this.setState({ isDisabled: false });

      AnalyticsService.addEventV2({
        category: 'mock',
        action: 'failure_delete',
        label: this.state.origin,
        entityId: this.state.meta.id,
        traceId: this.state.traceId
      });

      pm.toasts.error('Unable to delete the mock');
    });
  }

  render () {
    return (
      <DeleteConfirmationModal
        isDisabled={this.state.isDisabled}
        preventFocusReset
        entity={'MOCK'}
        isOpen={this.state.isOpen}
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        name='this mock'
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
