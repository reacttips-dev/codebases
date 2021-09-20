import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SettingsSystemProxy from './SettingsSystemProxy';
import SettingsGlobalProxy from './SettingsGlobalProxy';

export default class SettingsCustomProxy extends Component {
  render () {
    return (
      <div className='settings-custom-proxy'>
        {
          (window.SDK_PLATFORM !== 'browser') &&
            <div>
              <SettingsSystemProxy />
              <div className='divider' />
            </div>
        }
        <SettingsGlobalProxy
          useSystemProxy={this.props.useSystemProxy}
          onToggleSystemProxy={this.props.onToggleSystemProxy}
          useProxyEnvironmentVariables={this.props.useProxyEnvironmentVariables}
          onToggleProxyEnvironmentVariables={this.props.onToggleProxyEnvironmentVariables}
          proxy={this.props.globalProxy}
          errors={this.props.errors.globalProxy}
          onSave={this.props.onSaveGlobalProxy}
          onUpdate={this.props.onUpdateGlobalProxy}
        />
      </div>
    );

  }
}

SettingsCustomProxy.propTypes = {
  globalProxy: PropTypes.object.isRequired,
  onSaveGlobalProxy: PropTypes.func.isRequired,
  onToggleSystemProxy: PropTypes.func.isRequired,
  onUpdateGlobalProxy: PropTypes.func.isRequired,
  useSystemProxy: PropTypes.bool.isRequired
};

SettingsCustomProxy.defaultProps = {
  onSaveGlobalProxy: _.noop,
  onToggleSystemProxy: _.noop,
  onUpdateGlobalProxy: _.noop,
  errors: { globalProxy: {} },
  useSystemProxy: true
};
