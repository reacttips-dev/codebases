import React, { Component } from 'react';
import { Input } from '@postman-app-monolith/renderer/js/components/base/Inputs';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import Text from '@postman-app-monolith/renderer/js/components/base/Text';
import PasswordInput from '@postman-app-monolith/renderer/js/components/base/PasswordInput';
import ProcessedFileInput from '@@runtime-repl/_common/components/ProcessedFileInput';
import { CERTIFICATES_DOC } from '@postman-app-monolith/renderer/js/constants/AppUrlConstants';

export default class AddCertificate extends Component {
  handleFileSelect (field, files) {
    this.props.onChange(field, _.get(files, '[0].path', ''));
  }

  openCertificatesDocumentation () {
    pm.app.openExternalLink(CERTIFICATES_DOC);
  }

  getValueForFileInput (filePath) {
    // If path doesn't exist then return empty array
    if (!filePath) {
      return [];
    }

    // Value exist then create array with single element
    return [filePath];
  }

  render () {
    return (
      <div className='add-certificate-wrapper'>
        <div className='add-certificate__heading'>
          {/* @todo: replace this with actual breadcrumb. (breadcrumb component was not generic
          enough for reuse.) */}
          <span className='breadcrumbs' onClick={this.props.onCancel}>
            <Text value='Client Certificates' type='heading-h5' />
          </span>
          <Text value='Add Certificate' type='heading-h5' />
        </div>
        <div className='add-certificate__fields'>
          <div className='add-certificate__field'>
            <div className='add-certificate__field__label'>
              <Text value='Host' type='body-medium' />
            </div>
            <div className='add-certificate__field__value'>
              <div className='add-certificate__field__tag'>
                <Text value='https://' type='body-medium' />
              </div>
              <Input
                className='add-certificate__field__input add-certificate__field__input--url'
                inputStyle='box'
                type='text'
                value={this.props.hostname}
                placeholder='getpostman.com'
                onChange={this.props.onChange.bind(this, 'hostname')}
              />
              <div className='add-certificate__field__divider'>:</div>
              <Input
                className='add-certificate__field__input add-certificate__field__input--port'
                inputStyle='box'
                type='text'
                value={this.props.port}
                placeholder='443'
                onChange={this.props.onChange.bind(this, 'port')}
              />
            </div>
          </div>
          <div className='add-certificate__field add-certificate__field-crt'>
            <div className='add-certificate__field__label'>
              <Text value='CRT file' type='body-medium' />
            </div>
            <div className='add-certificate__field__value'>
              <ProcessedFileInput
                value={this.getValueForFileInput(this.props.pemPath)}
                onSelect={this.handleFileSelect.bind(this, 'pemPath')}
                onClear={this.handleFileSelect.bind(this, 'pemPath')}
              />
            </div>
          </div>
          <div className='add-certificate__field add-certificate__field-key'>
            <div className='add-certificate__field__label'>
              <Text value='KEY file' type='body-medium' />
            </div>
            <div className='add-certificate__field__value'>
              <ProcessedFileInput
                value={this.getValueForFileInput(this.props.keyPath)}
                onSelect={this.handleFileSelect.bind(this, 'keyPath')}
                onClear={this.handleFileSelect.bind(this, 'keyPath')}
              />
            </div>
          </div>
          <div className='add-certificate__field add-certificate__field-pfx'>
            <div className='add-certificate__field__label'>
              <Text value='PFX file' type='body-medium' />
            </div>
            <div className='add-certificate__field__value'>
              <ProcessedFileInput
                value={this.getValueForFileInput(this.props.pfxPath)}
                onSelect={this.handleFileSelect.bind(this, 'pfxPath')}
                onClear={this.handleFileSelect.bind(this, 'pfxPath')}
              />
            </div>
          </div>
          <div className='add-certificate__field add-certificate__field-passphrase'>
            <div className='add-certificate__field__label'>
              <Text value='Passphrase' type='body-medium' />
            </div>
            <div className='add-certificate__field__value'>
              <PasswordInput
                className='add-certificate__field__input'
                inputStyle='box'
                value={this.props.passphrase}
                onChange={this.props.onChange.bind(this, 'passphrase')}
              />
            </div>
          </div>
        </div>
        <div className='add-certificate__controls'>
          <Button
            type='primary'
            size='small'
            onClick={this.props.onSubmit}
          >
            Add
          </Button>
          <Button
            size='small'
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>
        </div>

        <Button
          className='learn-more-button'
          type='text'
          onClick={this.openCertificatesDocumentation}
        >
          Learn more about working with certificates at our Learning Center.
        </Button>
      </div>
    );
  }
}
