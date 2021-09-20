import React, { Component } from 'react';
import { Text, Heading } from '@postman/aether';
import ToggleSwitch from '@postman-app-monolith/renderer/js/components/base/ToggleSwitch';
import WarningButton from '@postman-app-monolith/renderer/js/components/base/WarningButton';
import ProcessedFileInput from '@@runtime-repl/_common/components/ProcessedFileInput';

export default class CACertificate extends Component {
  constructor (props) {
    super(props);

    this.state = {
      enabled: false,
      filePath: '',
      fileError: false
    };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.filePathChangeListener = this.settingChangeListener.bind(this, 'filePath');
    this.enabledChangeListener = this.settingChangeListener.bind(this, 'enabled');
  }

  UNSAFE_componentWillMount () {
    this.setState({
      enabled: pm.settings.getSetting('isCACertEnabled'),
      filePath: pm.settings.getSetting('CACertPath')
    });

    this.fileErrorCheck(pm.settings.getSetting('CACertPath'));

    pm.settings.on({
      'setSetting:isCACertEnabled': this.enabledChangeListener,
      'setSetting:CACertPath': this.filePathChangeListener
    });
  }

  componentWillUnmount () {
    pm.settings.off({
      'setSetting:isCACertEnabled': this.enabledChangeListener,
      'setSetting:CACertPath': this.filePathChangeListener
    });
  }

  UNSAFE_componentWillReceiveProps () {
    this.setState({
      enabled: pm.settings.getSetting('isCACertEnabled'),
      filePath: pm.settings.getSetting('CACertPath')
    });

    this.fileErrorCheck(pm.settings.getSetting('CACertPath'));
  }

  settingChangeListener (key, value) {
    this.setState({ [key]: value });
  }

  handleFileSelect (files) {
    const path = _.get(files, '[0].path', '');

    this.setState({ filePath: path });
    this.fileErrorCheck(path);
    pm.settings.setSetting('CACertPath', path);
  }

  handleToggle (isActive) {
    this.setState({ enabled: isActive });
    pm.settings.setSetting('isCACertEnabled', isActive);
  }

  getValueForFileInput (filePath) {
    // If path doesn't exist then return empty array
    if (!filePath) {
      return [];
    }

    // Value exist then create array with single element
    return [filePath];
  }

  fileErrorCheck (filePath) {
    if (!filePath) {
      return false;
    }

    pm.runtime
      .pathAccessible(filePath, false, (err) => {
        this.setState({ fileError: !!err });
      });
  }

  render () {
    return (
      <div className='ca-certificate-wrapper'>
        <div className='ca-certificate-wrapper__heading'>
          <Heading text='CA Certificates' type='h3' styleAs='h5' color='content-color-primary' />
          <ToggleSwitch
            className='ca-certificate-wrapper__heading__toggle'
            isActive={this.state.enabled}
            onClick={this.handleToggle}
          />
        </div>
        <div className='ca-certificate-wrapper-desc'>
          <Text type='para'>
            The file should consist of one or more trusted certificates in PEM format.
          </Text>
        </div>

        <div className={`ca-certificate__field ${this.state.enabled ? '' : 'disabled'}`}>
          <div className='ca-certificate__field__label'>
            <Text color='content-color-primary'>
              PEM file
            </Text>
            {this.state.filePath && this.state.fileError && <WarningButton tooltip='The selected PEM file is not readable, check file permissions.' />}
          </div>
          <ProcessedFileInput
            value={this.getValueForFileInput(this.state.filePath)}
            onSelect={this.handleFileSelect}
            onClear={this.handleFileSelect}
            disabled={!this.state.enabled}
          />
        </div>
      </div>
    );
  }
}
