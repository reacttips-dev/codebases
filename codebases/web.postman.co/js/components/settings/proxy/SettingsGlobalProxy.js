import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Heading } from '@postman/aether';
import { Input, Checkbox } from '../../base/Inputs';
import InfoButton from '../../base/InfoButton';
import TextArea from '../../base/TextArea';
import ToggleSwitch from '../../base/ToggleSwitch';
import { openExternalLink } from '../../../external-navigation/ExternalNavigationService';
import classnames from 'classnames';
import PasswordInput from '../../base/PasswordInput';
import Link from '../../../../appsdk/components/link/Link';

const proxyDocLink = 'https://go.pstmn.io/proxy-doc',

  propsToSave = {
    httpProxy: true,
    httpsProxy: true,
    disabled: true,
    authenticate: true
  };

export default class SettingsGlobalProxy extends Component {
  constructor (props) {
    super(props);

    this.handleOnSave = this.handleOnSave.bind(this);

    this.handleProxyDisableChange = this.handleProxyPropertyChange.bind(this, 'disabled');
    this.handleHttpProtocolChange = this.handleProtocolChange.bind(this, 'httpProxy');
    this.handleHttpsProtocolChange = this.handleProtocolChange.bind(this, 'httpsProxy');

    this.handleProxyHostChange = this.handleProxyPropertyChange.bind(this, 'host');
    this.handleProxyPortChange = this.handleProxyPropertyChange.bind(this, 'port');

    this.handleProxyAuthEnableChange = this.handleProxyPropertyChange.bind(this, 'authenticate');
    this.handleProxyAuthUsernameChange = this.handleProxyPropertyChange.bind(this, 'username');
    this.handleProxyAuthPasswordChange = this.handleProxyPropertyChange.bind(this, 'password');

    this.handleProxyBypassChange = this.handleProxyPropertyChange.bind(this, 'bypass');
  }

  handleProxyDocumentation () {
    openExternalLink(proxyDocLink);
  }

  handleOnSave () {
    this.props.onSave();
  }

  handleProxyPropertyChange (key, value) {
    var finalValue = value;

    if (key === 'port') {
      finalValue = parseInt(value, 10);
    }
    else if (key === 'disabled') {
      finalValue = !value;
    }

    // @note: don't update local storage on input (e.g, host, port) onChange
    this.props.onUpdate(key, finalValue, () => {
      if (propsToSave[key]) {
        this.handleOnSave();
      }
    });
  }

  handleProtocolChange (prop, change) {
    let { httpProxy, httpsProxy } = this.props.proxy;

    if (prop === 'httpProxy') {
      httpProxy = change;
    }
    else {
      httpsProxy = change;
    }

    // both can't be turned off
    if (!httpProxy && !httpsProxy) {
      return;
    }

    this.handleProxyPropertyChange(prop, change);
  }

  render () {
    let { useSystemProxy, useProxyEnvironmentVariables } = this.props,
        proxy = this.props.proxy || {},
        disabled = proxy.disabled,
        hostError = this.props.errors.host,
        portError = this.props.errors.port,
        proxyVarsClassName = classnames({
          'proxy-environment-variables': true,
          disabled: !useSystemProxy
        }),
        proxyAuthClassName = classnames({
          'settings-global-proxy-group': true,
          secondary: true,
          disabled: !proxy.authenticate || disabled
        }),
        proxyBypassClassName = classnames({
          'settings-global-proxy-group': true,
          secondary: true,
          disabled: disabled
        });

    return (
      <div className='settings-global-proxy'>
        <Heading
          className='item-title'
          text='Proxy configurations for sending requests'
          type='h3'
          styleAs='h5'
          color='content-color-primary'
        />
        <div className='settings-global-proxy-desc'>
            <Text type='para'>
              Specify a proxy setting to act as an intermediary for requests sent through the Builder in Postman. These configurations do not apply to any Postman services.{' '}
              <Link
                className='learn-more-button'
                onClick={this.handleProxyDocumentation}
              >
                <Text type='link-primary' isExternal>
                  Learn more about using a custom proxy
                </Text>
              </Link>
            </Text>
        </div>

        <div className='settings-global-use-system-proxy'>
          <Checkbox
            checked={useSystemProxy}
            onChange={this.props.onToggleSystemProxy}
          />
          <Text type='body-medium' color='content-color-primary'>
            Use the system proxy
          </Text>
        </div>
        <div className={proxyVarsClassName}>
          <Checkbox
            checked={Boolean(useProxyEnvironmentVariables)}
            disabled={!useSystemProxy}
            onChange={this.props.onToggleProxyEnvironmentVariables}
          />
          <Text type='body-medium' color='content-color-primary'>
            Respect HTTP_PROXY, HTTPS_PROXY, and NO_PROXY environment variables.
          </Text>
        </div>
        <div className='settings-custom-proxy-conf'>
          <Checkbox
            checked={!disabled}
            onChange={this.handleProxyDisableChange}
          />
          <Text type='body-medium' color='content-color-primary'>
            Add a custom proxy configuration
          </Text>
        </div>

        <div className='settings-global-proxy-config'>
          <div className={'settings-global-proxy-group ' + (disabled ? 'disabled' : '')}>
            <div className='settings-global-proxy-group-row'>
              <span className='row-label'>
                <Text type='body-medium' color='content-color-primary'>Proxy Type</Text>
              </span>
              <div className='row-values'>
                <div className='row-value protocol-http'>
                  <Checkbox
                    checked={Boolean(proxy.httpProxy)}
                    disabled={disabled}
                    onChange={this.handleHttpProtocolChange}
                  />
                  <Text type='body-medium' color='content-color-primary'>HTTP</Text>
                </div>

                <div className='row-value protocol-https'>
                  <Checkbox
                    checked={Boolean(proxy.httpsProxy)}
                    disabled={disabled}
                    onChange={this.handleHttpsProtocolChange}
                  />
                  <Text type='body-medium' color='content-color-primary'>HTTPS</Text>
                </div>
              </div>
            </div>

            <div className='settings-global-proxy-group-row'>
              <span className='row-label'>
                <Text type='body-medium' color='content-color-primary'>
                  Proxy Server
                </Text>
              </span>
              <div className='row-values'>
                <div className='proxy-server-host'>
                  <Input
                    disabled={disabled}
                    error={hostError}
                    inputStyle='box'
                    placeholder='127.0.0.1'
                    value={proxy.host || ''}
                    onBlur={this.handleOnSave}
                    onChange={this.handleProxyHostChange}
                  />
                </div>
                :
                <div className='proxy-server-port'>
                  <Input
                    disabled={disabled}
                    error={portError}
                    inputStyle='box'
                    placeholder='8080'
                    type='number'
                    value={proxy.port}
                    onBlur={this.handleOnSave}
                    onChange={this.handleProxyPortChange}
                  />
                </div>
              </div>
            </div>

            <div className='settings-global-proxy-group-row proxy-authenticate'>
                <span className='row-label'>
                  <Text type='body-medium' color='content-color-primary'>Proxy Auth</Text>
                  <InfoButton
                    tooltip='Uses Basic Authentication method'
                  />
                </span>
                <div className='row-values'>
                  <ToggleSwitch
                    isActive={proxy.authenticate}
                    disabled={disabled}
                    onClick={this.handleProxyAuthEnableChange}
                  />
                </div>
            </div>
          </div>

          <div className={proxyAuthClassName}>
            <div className='settings-global-proxy-group-row proxy-username'>
              <span className='row-label'>
                <Text type='body-medium' color='content-color-primary'>
                  Username
                </Text>
              </span>
              <div className='row-values'>
                <Input
                  disabled={!proxy.authenticate || disabled}
                  inputStyle='box'
                  value={proxy.username}
                  placeholder='Username'
                  onBlur={this.handleOnSave}
                  onChange={this.handleProxyAuthUsernameChange}
                />
              </div>
            </div>

            <div className='settings-global-proxy-group-row proxy-password'>
              <span className='row-label'>
                <Text type='body-medium' color='content-color-primary'>Password</Text>
              </span>
              <div className='row-values'>
                <PasswordInput
                  className='proxy-password-input'
                  disabled={!proxy.authenticate || disabled}
                  inputStyle='box'
                  placeholder='Password'
                  value={proxy.password}
                  onBlur={this.handleOnSave}
                  onChange={this.handleProxyAuthPasswordChange}
                />
              </div>
            </div>
          </div>

          <div className={proxyBypassClassName}>
            <div className='settings-global-proxy-group-row proxy-bypass'>
              <span className='row-label'>
                <Text type='body-medium' color='content-color-primary'>Proxy Bypass</Text>
              </span>
              <div className='row-values'>
                <TextArea
                  className='proxy-bypass-list'
                  rows='2'
                  value={proxy.bypass || ''}
                  disabled={disabled}
                  onBlur={this.handleOnSave}
                  onChange={this.handleProxyBypassChange}
                  placeholder='Enter comma separated hosts to bypass proxy settings. Example: 127.0.0.1, localhost, *.example.com'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


SettingsGlobalProxy.propTypes = {
  onToggleSystemProxy: PropTypes.func.isRequired,
  useSystemProxy: PropTypes.bool.isRequired,
  proxy: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

SettingsGlobalProxy.defaultProps = {
  useSystemProxy: true,
  onToggleSystemProxy: _.noop,
  errors: {},
  onSave: _.noop,
  onUpdate: _.noop
};
