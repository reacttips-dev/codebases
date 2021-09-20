import React, { Component } from 'react';
import { Input } from '@postman-app-monolith/renderer/js/components/base/Inputs';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import UserPreferenceService from '@postman-app-monolith/renderer/js/modules/services/UserPreferenceService';

const keyMap = { submit: 'enter' };

export default class CookiesManagementAddDomain extends Component {
  constructor (props) {
    super(props);

    this.state = { domain: '' };

    this.handleDomainAdd = this.handleDomainAdd.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);

    if (!(window.SDK_PLATFORM === 'browser')) {
      UserPreferenceService.get('capturingCookiesThroughInterceptor')
        .catch((e) => {
          pm.logger.warn('Couldn\'t get capturingCookiesThroughInterceptor variable', e);
        });

      UserPreferenceService.get('actionOnInterceptorLesson')
        .catch((e) => {
          pm.logger.warn('Couldn\'t get actionOnInterceptorLesson variable', e);
        });
    }
  }

  UNSAFE_componentWillReceiveProps () {
    this.state.domain !== '' && this.setState({ domain: '' });
  }

  getKeyMapHandlers () {
    return { submit: this.handleDomainAdd };
  }

  handleDomainChange (value) {
    this.setState({ domain: value });
  }

  handleDomainAdd () {
    this.props.onDomainAdd && this.props.onDomainAdd(this.state.domain);
    this.setState({ domain: '' });
  }

  render () {
    return (
      <React.Fragment>
        <div className='cookies-management-cookie-preview-container'>
          <div className='cookies-management-cookie-domain-preview-input-domain'>
            <KeyMaps keyMap={keyMap} handlers={this.getKeyMapHandlers()}>
              <Input
                inputStyle='box'
                placeholder='Type a domain name'
                onChange={this.handleDomainChange}
                value={this.state.domain}
              />
            </KeyMaps>
            <Button
              type='primary'
              tooltip='Add domain'
              size='small'
              className='cookies-management-cookie-action-button'
              onClick={this.handleDomainAdd}
            >
              Add
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
