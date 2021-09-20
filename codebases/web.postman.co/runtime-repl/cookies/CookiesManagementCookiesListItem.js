import React, { Component } from 'react';
import classes from 'classnames';
import CloseIcon from '@postman-app-monolith/renderer/js/components/base/Icons/CloseIcon';

export default class CookiesManagementCookiesListItem extends Component {
  constructor (props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  isSelected (selectedCookie, cookie) {
    return (
      (selectedCookie.domain === cookie.domain) &&
      (selectedCookie.name === cookie.name) &&
      (selectedCookie.path === cookie.path)
    );
  }

  getClasses () {
    return classes(
      'cookies-management-cookies-list-item',
      { 'is-selected': this.isSelected(this.props.selectedCookie, this.props.cookie) }
    );
  }

  handleDelete (e) {
    e && e.stopPropagation();
    this.props.onDelete && this.props.onDelete(this.props.cookie);
  }

  render () {
    return (
      <div
        className={this.getClasses()}
        onClick={this.props.onSelect.bind(this, this.props.cookie)}
      >
        <div className='cookies-management-cookies-list-item__name'>{ this.props.cookie.name }</div>
        <div
          className='cookies-management-cookies-list-item__remove'
          onClick={this.handleDelete}
        >
          <CloseIcon className='cookies-management-cookies-list-item__remove-icon' />
        </div>
      </div>
    );
  }
}
