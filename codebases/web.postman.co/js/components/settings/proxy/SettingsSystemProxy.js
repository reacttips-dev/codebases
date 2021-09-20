import React, { Component } from 'react';
import Text from '../../base/Text';
import classnames from 'classnames';
import { Checkbox, Input } from '../../base/Inputs';
import { Button } from '../../base/Buttons';
import PasswordInput from '../../base/PasswordInput';
import { TrackedState, bindTrackedStateToComponent } from '../../../modules/tracked-state/TrackedState';
import AnalyticsService from '../../../modules/services/AnalyticsService';

/**
 * This component is used for proxy settings which are applied by default for Postman internal requests
 * i.e. sync, login, updates etc. These are picked up from the system proxy settings. This is not related
 * to the proxy settings used for request sending flow.
 *
 * DO NOT add any logic related to proxy configuration for request sending flow.
 */
export default class SettingsSystemProxy extends Component {
  constructor (props) {
    super(props);

    let proxyConfig = pm.cloudProxyHandler.proxyConfig;

    this.trackedState = new TrackedState({
      isAuthNeeded: Boolean(proxyConfig && proxyConfig.auth),
      username: _.get(proxyConfig, 'auth.username') || '',
      password: _.get(proxyConfig, 'auth.password') || ''
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.handleProxyAuthUsernameChange = this.handleProxyAuthPropertyChange.bind(this, 'username');
    this.handleProxyAuthPasswordChange = this.handleProxyAuthPropertyChange.bind(this, 'password');
    this.handleProxyAuthSubmit = this.handleProxyAuthSubmit.bind(this);
    this.handleAuthNeededChange = this.handleAuthNeededChange.bind(this);
  }

  handleProxyAuthPropertyChange (key, value) {
    this.trackedState.set({
      [key]: value
    });
  }

  handleProxyAuthSubmit () {
    let authNeeded = this.trackedState.get('isAuthNeeded');

    AnalyticsService.addEventV2({
      category: 'app_proxy_config',
      action: authNeeded ? 'auth_updated' : 'auth_removed',
      label: 'settings_modal'
    });

    if (!authNeeded) {
      pm.cloudProxyHandler.handleProxyAuthSubmit({});
      return;
    }

    pm.cloudProxyHandler.handleProxyAuthSubmit({ username: this.trackedState.get('username'), password: this.trackedState.get('password') });
  }

  handleAuthNeededChange () {
    let prevState = this.trackedState.get('isAuthNeeded');

    this.trackedState.set({ isAuthNeeded: !prevState });
  }

  render () {
    let isAuthNeeded = this.trackedState.get('isAuthNeeded'),
        submitBtnClassname = classnames({
          'submit-btn': true,
          'auth-enabled': isAuthNeeded
        });

    return (
      <div className='settings-system-proxy'>
        <div className='item-header'>
          <h4 className='item-title'>
            <Text value='Default Proxy Configuration' type='heading-h5' />
          </h4>
        </div>
        <div>
        <Text value={'Postman uses the system\'s proxy configurations by default to connect to any online services, or to send API requests.'} type='body-medium' />
        </div>
        <div className='settings-system-proxy-auth'>
          <div className='settings-system-proxy-auth-checkbox'>
            <Checkbox
              checked={isAuthNeeded}
              onChange={this.handleAuthNeededChange}
            />
            <span>This proxy requires authentication</span>
          </div>
          {
            isAuthNeeded &&
            <div className='settings-system-proxy-group'>
              <div className='settings-system-proxy-group-row proxy-username'>
                <span className='row-label'>
                  Username
                </span>
                <div className='row-values'>
                  <Input
                    inputStyle='box'
                    value={this.trackedState.get('username')}
                    placeholder='Username'
                    onChange={this.handleProxyAuthUsernameChange}
                  />
                </div>
              </div>

              <div className='settings-system-proxy-group-row proxy-password'>
                <span className='row-label'>
                  Password
                </span>
                <div className='row-values'>
                  <PasswordInput
                    className='proxy-password-input'
                    value={this.trackedState.get('password')}
                    inputStyle='box'
                    placeholder='Password'
                    onChange={this.handleProxyAuthPasswordChange}
                  />
                </div>
              </div>
            </div>
          }
          {
                this.trackedState.isDirty() &&
                <div className='settings-system-proxy-group-row proxy-buttons'>
                  <div className={submitBtnClassname}>
                    <Button
                      className='submit-button'
                      type='primary'
                      onClick={this.handleProxyAuthSubmit}
                    >Save and restart Postman</Button>
                  </div>
                </div>
              }
        </div>
      </div>
    );
  }
}
