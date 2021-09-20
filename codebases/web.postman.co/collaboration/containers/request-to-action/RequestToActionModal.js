import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Label } from '@postman/aether';
import { TrackedState, bindTrackedStateToComponent } from '../../../js/modules/tracked-state/TrackedState';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '../../../js/components/base/Modals';
import { Button } from '../../../js/components/base/Buttons';
import TextArea from '../../../js/components/base/TextArea';

const defaultObjectForStateTracking = { notes: '' },
  stateTrackingProperties = Object.keys(defaultObjectForStateTracking),
  DEFAULT_TEXT = {
    title: 'Request Approval to Perform Action',
    message: 'This modal can be used to request an action to be performed by another user who has the permission to do so.',
    placeholder: 'Write a short note on why you\'d like for them to perform this action.'
  },
  CHARACTER_LIMIT = 500;

@observer
export default class RequestToActionModal extends Component {
  constructor (props) {
    super(props);

    this.state = { isOpen: false };

    this.trackedState = new TrackedState(defaultObjectForStateTracking);
    bindTrackedStateToComponent(this.trackedState, this);

    this.validate = this.validate.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDirtyStateOnClose = this.handleDirtyStateOnClose.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openRequestToActionModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openRequestToActionModal', this.handleClose);
  }

  handleOpen (options) {
    const {
      model, modelId, action,
      title, message, placeholder,
      submitText, onSubmit, onCancel
    } = options;

    this.model = model;
    this.modelId = modelId;
    this.action = action;
    this.submitText = submitText;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;

    this.setState({
      isOpen: true,
      title,
      message,
      placeholder
    });
  }

  handleClose () {
    if (this.state.isOpen) {
      this.trackedState.reset(defaultObjectForStateTracking);

      this.model = this.modelId = this.action = this.onSubmit = this.onCancel = null;

      this.setState({ isOpen: false });
    }
  }

  handleChange (field, value) {
    if (stateTrackingProperties.includes(field)) {
      this.trackedState.set({ [field]: value });
    } else {
      this.setState({ [field]: value });
    }
  }

  handleCancel () {
    _.isFunction(this.onCancel) && this.onCancel();

    this.handleDirtyStateOnClose();
  }

  async handleSubmit () {
    const notes = this.trackedState.get('notes');

    _.isFunction(this.onSubmit) && this.onSubmit(notes);

    this.handleClose();
  }

  handleDirtyStateOnClose () {
    this.trackedState.isDirty()
      ? pm.mediator.trigger('showConfirmationModal', this.handleClose)
      : this.handleClose();
  }

  validate () {
    return _.get(this.trackedState.get('notes'), 'length', 0) > CHARACTER_LIMIT;
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        className='request-to-action-modal'
        onRequestClose={this.handleCancel}
      >
        <ModalHeader>
          {this.state.title || DEFAULT_TEXT['title']}
        </ModalHeader>

        <ModalContent>
          <p>{this.state.message || DEFAULT_TEXT['message']}</p>

          <Label type='primary' text='Add a note' />

          <TextArea
            rows='3'
            onChange={(value) => this.handleChange('notes', value)}
            placeholder={this.state.placeholder || DEFAULT_TEXT['placeholder']}
          />

          <span className={classnames({ 'counter': true, 'counter-error': this.validate() })}>
            {_.get(this.trackedState.get('notes'), 'length', 0)}/{CHARACTER_LIMIT}
          </span>
        </ModalContent>

        <ModalFooter>
          <Button
            size='small'
            type='primary'
            disabled={this.validate()}
            onClick={this.handleSubmit}
          >
            {this.submitText || 'Send Request'}
          </Button>
          <Button
            size='small'
            type='secondary'
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
