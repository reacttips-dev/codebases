import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../js/components/base/Modals';
import { Icon, Button, Text } from '@postman/aether';
import AnalyticsService from '../../js/modules/services/AnalyticsService';

const defaultState = {
  isOpen: false,
  data: '',
  apiId: null,
  fileName: ''
};

export default class SchemaImportConfirmationModal extends Component {
  constructor (props) {
    super(props);

    this.state = defaultState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openSchemaImportConfirmationModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openSchemaImportConfirmationModal', this.handleOpen);
  }

  handleOpen (opts = {}, onSuccess, onCancel) {
    this.setState({
      isOpen: true,
      data: opts.data,
      apiId: opts.apiId,
      fileName: opts.fileName
    });

    AnalyticsService.addEventV2({
      category: 'schema',
      action: 'initiate_import_invalid_schema',
      label: 'api_define',
      entityId: opts.apiId
    });

    this.onSuccess = onSuccess;
    this.onCancel = onCancel;
  }

  handleClose () {
    this.setState(defaultState);

    this.onCancel();
  }

  handleSubmit () {
    this.onSuccess(this.state.data);

    this.setState(defaultState);

    AnalyticsService.addEventV2({
      category: 'schema',
      action: 'confirm_import_invalid_schema',
      label: 'api_define',
      entityId: this.state.apiId
    });
  }

  getFormattedFileName (fileName) {
    if (!fileName) {
      return '';
    }

    if (fileName.length > 20) {
      return fileName.substring(0, 9) + '...' + fileName.substring(fileName.length - 8);
    }

    return fileName;
  }

  render () {
    const formattedFileName = this.getFormattedFileName(this.state.fileName);

    return (
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        className='schema-import-confirmation-modal'
      >
        <ModalHeader>Import this file?</ModalHeader>
        <ModalContent className='schema-import-confirmation-modal__content'>
          <Icon
            className='schema-import-confirmation-modal__content__icon'
            name='icon-state-warning-stroke'
            color='content-color-secondary'
          />
          <Text
            type='body-medium'
            color='content-color-primary'
            className='schema-import-confirmation-modal__content__body'
          >
            <span>
              We couldn’t recognize the schema type and format for the&nbsp;
              <span title={this.state.fileName}>{formattedFileName}</span>
              &nbsp;file. Please review them after importing.
            </span>
          </Text>
        </ModalContent>
        <ModalFooter>
          <Button
            className='schema-import-confirmation-modal__footer__submit'
            type='primary'
            size='medium'
            text='Okay, Import'
            onClick={this.handleSubmit}
          />
          <Button
            type='secondary'
            size='medium'
            text='Cancel'
            onClick={this.handleClose}
          />
        </ModalFooter>
      </Modal>
    );
  }
}
