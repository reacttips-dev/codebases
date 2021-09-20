import React, { Component } from 'react';
import CookiesManagementDomainsList from './CookiesManagementDomainsList';
import CookiesManagementAddDomain from './CookiesManagementAddDomain';

// eslint-disable-next-line react/prefer-stateless-function
export default class CookiesManagement extends Component {
  render () {
    return (
      <div className='cookies-management-wrapper'>
        <CookiesManagementAddDomain
          onDomainAdd={this.props.onDomainAdd}
          domains={this.props.domains}
        />

        <div className='cookies-management-container'>
          <CookiesManagementDomainsList
            domains={this.props.domains}
            cookies={this.props.cookies}
            selectedDomain={this.props.selectedDomain}
            selectedCookie={this.props.selectedCookie}
            onDomainSelect={this.props.onDomainSelect}
            onDomainDelete={this.props.onDomainDelete}
            onCookieAdd={this.props.onCookieAdd}
            onCookieSelect={this.props.onCookieSelect}
            onCookieChange={this.props.onCookieChange}
            onCookieDelete={this.props.onCookieDelete}
            domainsBeingDeleted={this.props.domainsBeingDeleted}
          />
        </div>
      </div>
    );
  }
}
