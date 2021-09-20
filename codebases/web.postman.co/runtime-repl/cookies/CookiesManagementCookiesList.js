import React, { PureComponent } from 'react';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import CookiesManagementCookiesListItem from './CookiesManagementCookiesListItem';

export default class CookiesManagementCookiesList extends PureComponent {
  render () {
    const { cookies } = this.props;

    return (
      <div className='cookies-management-cookies-list-wrapper'>
        {
          !_.isEmpty(cookies) && cookies.map((cookie, index) => (
            <CookiesManagementCookiesListItem
              key={index}
              cookie={cookie}
              onSelect={this.props.onSelect}
              onDelete={this.props.onDelete}
              selectedCookie={this.props.selectedCookie}
            />
          ))
        }
        <Button
          type='primary'
          size='small'
          className='cookies-management-cookies__actions--add'
          onClick={this.props.onAdd}
        >
          + Add Cookie
        </Button>
      </div>
    );
  }
}

CookiesManagementCookiesList.defaultProps = { selectedDomainCookiesList: [] };
