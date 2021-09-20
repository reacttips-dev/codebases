import React, { PureComponent } from 'react';
import CookiesManagementDomainWhitelistListItem from './CookiesManagementDomainWhitelistListItem';


export default class CookiesManagementDomainWhitelistList extends PureComponent {
  render () {
    const { whitelistedDomains } = this.props;

    if (_.isEmpty(whitelistedDomains)) {
      return (
        <div className='cookies-management-domain-whitelist-list__empty'>
          <span>No domains in whitelist</span>
        </div>
      );
    }

    return (
      <div className='cookies-management-domain-whitelist-list'>
        {
          _.map(whitelistedDomains, (domain) => (
            <CookiesManagementDomainWhitelistListItem
              key={domain}
              domain={domain}
              onDelete={this.props.onDelete}
            />
          ))
        }
      </div>
    );
  }
}
