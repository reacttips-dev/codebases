import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SettingsCustomProxy from '@postman-app-monolith/renderer/js/components/settings/proxy/SettingsCustomProxy';
import ArtemisEmptyState from '@@runtime-repl/_common/components/ArtemisEmptyState/ArtemisEmptyState';
import { TYPES } from '@@runtime-repl/agent/AgentConstants';

const MIN_PORT = 1,
  MAX_PORT = 65535;

@observer
export default class SettingsProxyContainer extends Component {
  constructor (props) {
    super(props);

    this.handleToggleSystemProxy = this.handleToggleSystemProxy.bind(this);
    this.handleToggleProxyEnvironmentVariables = this.handleToggleProxyEnvironmentVariables.bind(this);
    this.handleSaveGlobalProxy = this.handleSaveGlobalProxy.bind(this);
    this.handleUpdateGlobalProxyProperty = this.handleUpdateGlobalProxyProperty.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.setState({
      errors: { globalProxy: {} },
      globalProxy: pm.proxyListManager.globalProxy,
      useSystemProxy: pm.settings.getSetting('useSystemProxy'),
      useProxyEnvironmentVariables: pm.settings.getSetting('useProxyEnvironmentVariables')
    });
  }

  handleToggleSystemProxy (useSystemProxy) {
    this.setState({ useSystemProxy }, () => {
      pm.settings.setSetting('useSystemProxy', useSystemProxy);
    });
  }

  handleToggleProxyEnvironmentVariables (useProxyEnvironmentVariables) {
    this.setState({ useProxyEnvironmentVariables }, () => {
      pm.settings.setSetting('useProxyEnvironmentVariables', useProxyEnvironmentVariables);
    });
  }

  handleSaveGlobalProxy () {
    const globalProxy = _.clone(this.state.globalProxy);

    if (!this.validateProxyConfig(globalProxy)) {
      return;
    }

    pm.proxyListManager.update({ globalProxy });
    pm.proxyListManager.saveToDB();
  }


  handleUpdateGlobalProxyProperty (key, value, cb) {
    const globalProxy = _.clone(this.state.globalProxy);

    globalProxy[key] = value;

    this.setState({ globalProxy }, cb);
  }

  validateProxyConfig (proxyConfig) {
    const errors = _.clone(this.state.errors),
      validHost = this.isValidHost(proxyConfig.host),
      validPort = this.isValidPort(proxyConfig.port);

    errors.globalProxy.host = validHost ? null : 'Invalid Host';
    errors.globalProxy.port = validPort ? null : 'Invalid Port';

    this.setState({ errors });

    return validHost && validPort;
  }

  isValidHost (host) {
    return !_.isEmpty(host);
  }

  isValidPort (port) {
    return _.isInteger(port) && port >= MIN_PORT && port <= MAX_PORT;
  }

  render () {
    if (_.get(pm.runtime, 'agent.stat.type') === TYPES.XHR) {
      return (
        <ArtemisEmptyState
          title='Default proxy configuration'
          message={'By default, Postman uses your browser\'s proxy configurations when sending API requests. To customize proxy configurations, use the Postman Desktop Agent.'}
          cleanUp={() => pm.mediator.trigger('closeSettingsModal')}
        />
      );
    }

    if (_.get(pm.runtime, 'agent.stat.type') === TYPES.CLOUD) {
      return (
        <ArtemisEmptyState
          title='Not applicable'
          message='Your requests are already proxied through the cloud agent. To customize proxy configurations, use the Postman Desktop Agent.'
          cleanUp={() => pm.mediator.trigger('closeSettingsModal')}
        />
      );
    }

    return (
      <SettingsCustomProxy
        errors={this.state.errors}
        globalProxy={this.state.globalProxy}
        useSystemProxy={this.state.useSystemProxy}
        useProxyEnvironmentVariables={this.state.useProxyEnvironmentVariables}
        onSaveGlobalProxy={this.handleSaveGlobalProxy}
        onToggleSystemProxy={this.handleToggleSystemProxy}
        onUpdateGlobalProxy={this.handleUpdateGlobalProxyProperty}
        onToggleProxyEnvironmentVariables={this.handleToggleProxyEnvironmentVariables}
      />
    );
  }
}
