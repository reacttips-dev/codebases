import classnames from 'classnames';
import React from 'react';
import uuid from 'uuid/v4';
import { Button as AetherButton, Text, Icon } from '@postman/aether';
import AnalyticsService from '../../js/modules/services/AnalyticsService';
import NavigationService from '../../js/services/NavigationService';
import CurrentUserDetailsService from '../../js/services/CurrentUserDetailsService';

export default class MobileSearchBox extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSearchBlurred: true,
      isSearchInputFocused: false,
      searchQuery: ''
    };

    this.handleSearchBoxFocus = this.handleSearchBoxFocus.bind(this);
    this.handleSearchBoxBlur = this.handleSearchBoxBlur.bind(this);
    this.handleSearchInputFocus = this.handleSearchInputFocus.bind(this);
    this.handleSearchInputBlur = this.handleSearchInputBlur.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handleMobileKeyDown = this.handleMobileKeyDown.bind(this);
    this.inputRef = React.createRef();
    this.traceId = '';
    this.property = '';
  }

  handleSearchBoxFocus () {
    this.setState({
      isSearchBlurred: false
    }, () => {
      this.inputRef && this.inputRef.current.focus();
    });

    this.traceId = uuid();
    this.property = _.get(NavigationService.getRoutesForURL(NavigationService.getCurrentURL()), '0.name', '').split('.')[0];

    AnalyticsService.addEventV2AndPublish({
      category: 'search-all',
      action: 'initiate',
      label: this.property,
      traceId: this.traceId,
      value: this.props.AnalyticsConstants.OTHER,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId'),
      variantId: 'mobile'
    });
  }

  handleSearchBoxBlur () {
    this.setState({
      isSearchBlurred: true
    });
  }

  handleSearchInputFocus () {
    this.setState({
      isSearchInputFocused: true
    });
  }

  handleSearchInputBlur () {
    this.setState({
      isSearchInputFocused: false
    });
  }

  handleSearchQueryChange (e) {
    this.setState({
      searchQuery: e.target.value
    });
  }

  handleMobileKeyDown (e) {
    if (e.key === 'Enter') {
      if (this.state.searchQuery.length === 0) {
        return;
      }

      this.setState({
        isSearchBlurred: true
      });
      this.props.handleSearchPageRedirect({ q: this.state.searchQuery });
    }
  }

  render () {
    const { isHiddenOnMobile } = this.props;

    return (
      <div className={classnames('mobile-search-container', { 'is-hidden-on-mobile': isHiddenOnMobile })}>
        <div className='mobile-search-icon'>
          <AetherButton
            icon='icon-action-search-stroke'
            type='tertiary'
            onClick={this.handleSearchBoxFocus}
          />
        </div>
        <div className={classnames('mobile-search-box', { 'is-blurred': this.state.isSearchBlurred })} >
          <div className='mobile-search-input-group'>
            <div className='mobile-search-close-button'>
              <AetherButton
                icon='icon-action-close-stroke'
                type='tertiary'
                onClick={() => {
                  this.handleSearchBoxBlur();

                  AnalyticsService.addEventV2AndPublish({
                    category: 'search-all',
                    property: this.property,
                    action: 'query',
                    label: this.state.searchQuery,
                    traceId: this.traceId,
                    teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId'),
                    variantId: 'mobile'
                  });
                }}
              />
            </div>
            <div className='mobile-search-input'>
              <input
                type='search'
                className={classnames('mobile-search-input-box', { 'is-focused': this.state.isSearchInputFocused })}
                placeholder='Search for anything in all of Postman'
                onFocus={this.handleSearchInputFocus}
                onBlur={this.handleSearchInputBlur}
                onChange={this.handleSearchQueryChange}
                value={this.state.searchQuery}
                onKeyDown={this.handleMobileKeyDown}
                ref={this.inputRef}
              />
            </div>
          </div>
          <div className='mobile-search-content'>
            {this.state.searchQuery &&
              (<div className='mobile-search-section mobile-search-subtext'>
                <Text
                  type='body-medium'
                  color='content-color-secondary'
                  className='mobile-seacrh-subtext-textarea'
                >Search all workspaces, collections, APIs, teams and users for '{this.state.searchQuery}'</Text>
                <Icon
                  name='icon-descriptive-newline-stroke'
                  color='content-color-secondary'
                />
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}
