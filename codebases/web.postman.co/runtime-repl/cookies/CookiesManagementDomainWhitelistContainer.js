import React, { Component } from 'react';
import { COOKIE_JAR_DOCS } from '@postman-app-monolith/renderer/js/constants/AppUrlConstants';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { Input } from '@postman-app-monolith/renderer/js/components/base/Inputs';
import LeftArrowIcon from '@postman-app-monolith/renderer/js/components/base/Icons/LeftArrowIcon';
import { Text } from '@postman/aether';
import CookiesManagementDomainWhitelistList from './CookiesManagementDomainWhitelistList';
import CookieService from './CookieService';
import Link from '../../appsdk/components/link/Link';

export default class CookiesManagementDomainWhitelistContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      domain: '',
      whitelistedDomains: []
    };
    this.handleDomainAdd = this.handleDomainAdd.bind(this);
    this.handleDomainDelete = this.handleDomainDelete.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);
  }

  componentDidMount () {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ whitelistedDomains: CookieService.getWhitelistedDomains() });
  }

  handleDomainAdd () {
    if (CookieService.addWhitelistDomain(this.state.domain)) {
      this.setState((prevState) => ({
        domain: '',
        whitelistedDomains: _.concat(prevState.whitelistedDomains, [_.trim(_.toLower(this.state.domain))])
      }));
    }
  }

  handleDomainDelete (domainToDelete) {
    if (CookieService.deleteWhitelistDomain(domainToDelete)) {
      this.setState((prevState) => ({
        whitelistedDomains: _.filter(prevState.whitelistedDomains, (domain) => domain !== domainToDelete)
      }));
    }
  }

  handleDomainChange (value) {
    this.setState({ domain: value });
  }

  render () {
    return (
      <div>
        <div
          className='cookie-management-container-domain-whitelist__back'
          onClick={this.props.onCancel}
        >
          <div className='cookie-management-container-domain-whitelist__back__icon'>
            <LeftArrowIcon
              style='secondary'
              size='xs'
            />
          </div>
          <div className='cookie-management-container-domain-whitelist__back__text'>
            <Text type='strong'>Back to cookies</Text>
          </div>
        </div>
        <div className='cookies-management-domain-whitelist-container'>
          <div className='cookies-management-domain-whitelist-container__heading'>
            <h3>Whitelist Domains</h3>
          </div>
          <div>
            <Text type='body-medium' color='content-color-primary'>
              Add a domain to the whitelist to allow cookies for that domain to be accessed in scripts.
            </Text>
            <br />
            <Text type='body-medium' color='content-color-primary'>
              Learn more about&nbsp;
            </Text>
            <Link to={COOKIE_JAR_DOCS} target='_blank'>
              <Text type='link-primary'>
                accessing cookies in scripts
              </Text>
            </Link>
          </div>
          <div className='cookies-management-domain-whitelist-container__add-domain'>
            <Input
              inputStyle='box'
              placeholder='Add a domain to the whitelist'
              onChange={this.handleDomainChange}
              value={this.state.domain}
              className='cookies-management-domain-whitelist-container__input'
              onEnter={this.handleDomainAdd}
            />
            <Button
              type='secondary'
              className='cookies-management-domain-whitelist-container__add-button'
              onClick={this.handleDomainAdd}
            >
              Add
            </Button>
          </div>
          <CookiesManagementDomainWhitelistList
            onDelete={this.handleDomainDelete}
            whitelistedDomains={this.state.whitelistedDomains}
          />
        </div>
      </div>
    );
  }
}
