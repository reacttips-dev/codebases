import React, { Component } from 'react';
import CloseIcon from '@postman-app-monolith/renderer/js/components/base/Icons/CloseIcon';

export default class CookiesManagementDomainWhitelistListItem extends Component {
  constructor (props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
  }

  onDelete () {
    this.props.onDelete && this.props.onDelete(this.props.domain);
  }

  render () {
    return (
      <div className='cookies-management-domain-whitelist-list-item'>
        <div className='cookies-management-domain-whitelist-list-item__name' title={this.props.domain}>
          {this.props.domain}
        </div>
        <div className='cookies-management-domain-whitelist-list-item__action'>
          <CloseIcon
            className='cookies-management-domain-list-item__header__action--delete'
            size='xs'
            style='tertiary'
            onClick={this.onDelete}
          />
        </div>
      </div>
    );
  }
}
