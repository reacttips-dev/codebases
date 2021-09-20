import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import CloseIcon from '@postman-app-monolith/renderer/js/components/base/Icons/CloseIcon';
import LoadingIndicator from '@postman-app-monolith/renderer/js/components/base/LoadingIndicator';
import PluralizeHelper from '@postman-app-monolith/renderer/js/utils/PluralizeHelper';
import util from '@postman-app-monolith/renderer/js/utils/util';
import { TrackedState, bindTrackedStateToComponent } from '@postman-app-monolith/renderer/js/modules/tracked-state/TrackedState';
import CookiesManagementCookiesList from './CookiesManagementCookiesList';
import CookiesManagementCookieEditor from './CookiesManagementCookieEditor';

export default class CookiesManagementDomainsListItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditorVisible: false,
      isOpen: true
    };

    this.trackedState = new TrackedState({
      editorValue: ''
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.handleDomainSelect = this.handleDomainSelect.bind(this);
    this.handleCookieAdd = this.handleCookieAdd.bind(this);
    this.handleCookieSelect = this.handleCookieSelect.bind(this);
    this.handleCookieChange = this.handleCookieChange.bind(this);
    this.handleCookieChangeCancel = this.handleCookieChangeCancel.bind(this);
    this.handleDirtyStateOnCookieChangeCancel = this.handleDirtyStateOnCookieChangeCancel.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleCookieDelete = this.handleCookieDelete.bind(this);
    this.handleDomainDelete = this.handleDomainDelete.bind(this);
  }

  getClasses () {
    return classnames({
      'cookies-management-domain-list-item': true,
      'is-selected': this.props.selectedDomain === this.props.domain
    });
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.selectedCookie !== this.props.selectedCookie && nextProps.selectedDomain === this.props.domain) {
      this.setState({
        isEditorVisible: true
      });

      this.trackedState.reset({
        editorValue: util.stringifyCookieObject(nextProps.selectedCookie)
      });
    }
  }

  handleDomainSelect () {
    // For a selected domain, if delete is already in progress, do not expand domain accordion
    if (this.props.domainsBeingDeleted && this.props.domainsBeingDeleted.includes(this.props.domain)) {
      return;
    }

    this.setState({
      isEditorVisible: false,
      isOpen: !this.state.isOpen
    });
    this.props.onDomainSelect && this.props.onDomainSelect(this.props.domain);
  }

  handleDomainDelete (e) {
    // Stop click event to propagate to list item header div. Collapse domain item on delete.
    e.stopPropagation();
    this.collapseSelectedDomain();
    this.props.onDomainDelete(this.props.domain);
  }

  collapseSelectedDomain () {
    this.setState({
      isEditorVisible: false,
      isOpen: false
    });
  }

  handleCookieAdd () {
    this.setState({ isOpen: true });
    this.props.onCookieAdd && this.props.onCookieAdd(this.props.domain);
  }

  handleCookieSelect (cookie) {
    this.setState({
      isEditorVisible: true
    });

    this.trackedState.reset({
      editorValue: util.stringifyCookieObject(cookie)
    });

    this.props.onCookieSelect && this.props.onCookieSelect(cookie);
  }

  handleCookieChange () {
    findDOMNode(this.refs.domain).focus();
    this.setState({ isEditorVisible: false });
    this.props.onCookieChange && this.props.onCookieChange(this.trackedState.get('editorValue'));
  }

  handleCookieChangeCancel () {
    findDOMNode(this.refs.domain).focus();
    this.setState({
      isEditorVisible: false
    });

    this.trackedState.reset({
      editorValue: this.props.selectedCookie
    });

    this.props.onCookieSelect && this.props.onCookieSelect();
  }

  handleDirtyStateOnCookieChangeCancel (event) {
    // Stop event propagation to prevent cookie modal from closing on escape
    event && event.stopPropagation && event.stopPropagation();

    if (this.trackedState.isDirty()) {
      pm.mediator.trigger('showConfirmationModal', this.handleCookieChangeCancel);
    } else {
      this.handleCookieChangeCancel();
    }
  }

  handleEditorChange (value) {
    this.trackedState.set({ editorValue: value });
  }

  handleCookieDelete (cookie) {
    this.setState({ isEditorVisible: false });
    this.props.onCookieDelete && this.props.onCookieDelete(cookie);
  }

  render () {
    const { domain } = this.props,
      cookieCount = _.keys(this.props.cookies).length,
      isDeleteDomainInProgress = this.props.domainsBeingDeleted &&
      this.props.domainsBeingDeleted.includes(this.props.domain);

    return (
      <div
        className={this.getClasses()}
        tabIndex='-1'
        ref='domain'
      >
        <div
          className='cookies-management-domain-list-item__header'
          onClick={this.handleDomainSelect}
        >
          <div className='cookies-management-domain-list-item__header__name'>
            {domain}
          </div>
          <div className='cookies-management-domain-list-item__header__cookie-count'>
            {cookieCount}
            {' '}
            {
              PluralizeHelper.pluralize({
                count: cookieCount,
                singular: 'cookie',
                plural: 'cookies'
              })
            }
          </div>
          {
            isDeleteDomainInProgress ? (
              <div className='cookies-management-domain-list-item__header__action-delete'>
                <LoadingIndicator />
              </div>
            ) : (
              <div className='cookies-management-domain-list-item__header__actions'>
                <CloseIcon className='cookies-management-domain-list-item__header__action--delete' onClick={this.handleDomainDelete} />
              </div>
            )
}
        </div>
        {
          this.state.isOpen && (
            <CookiesManagementCookiesList
              selectedCookie={this.props.selectedCookie}
              cookies={this.props.cookies}
              onSelect={this.handleCookieSelect}
              onDelete={this.handleCookieDelete}
              onAdd={this.handleCookieAdd}
            />
          )
}
        {
          (this.props.selectedDomain === this.props.domain) && this.state.isEditorVisible && this.props.selectedCookie !== '' && (
            <CookiesManagementCookieEditor
              value={this.trackedState.get('editorValue')}
              onChange={this.handleEditorChange}
              onSave={this.handleCookieChange}
              onCancel={this.handleCookieChangeCancel}
              onRequestCancel={this.handleDirtyStateOnCookieChangeCancel}
            />
          )
}
      </div>
    );
  }
}
