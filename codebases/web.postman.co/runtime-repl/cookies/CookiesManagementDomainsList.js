import React, { Component } from 'react';
import { observer } from 'mobx-react';
import EmptyListMessage from '@postman-app-monolith/renderer/js/components/base/EmptyListMessage';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import CloseIcon from '@postman-app-monolith/renderer/js/components/base/Icons/CloseIcon';
import UserPreferenceService from '@postman-app-monolith/renderer/js/modules/services/UserPreferenceService';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import CookiesManagementDomainsListItem from './CookiesManagementDomainsListItem';
import { runTaggedLesson } from '../../onboarding/public/Skills';

@observer
export default class CookiesManagementDomainsList extends Component {
  constructor (props) {
    super(props);

    this.store = getStore('InterceptorInstallationUIStore');
    this.handleShowMeHow = this.handleShowMeHow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    if (!(window.SDK_PLATFORM === 'browser')) {
      UserPreferenceService.get('capturingCookiesThroughInterceptor')
        .then((data) => {
          if (data) {
            this.store.updateBannerState(false);
          }
        })
        .catch((e) => {
          pm.logger.warn('Couldn\'t get capturingCookiesThroughInterceptor variable', e);
        });
      UserPreferenceService.get('actionOnInterceptorLesson')
        .then((data) => {
          if (data) {
            this.store.updateBannerState(false);
          }
        })
        .catch((e) => {
          pm.logger.warn('Couldn\'t get actionOnInterceptorLesson variable', e);
        });
    }
  }

  handleClose () {
    UserPreferenceService.set('actionOnInterceptorLesson', true);
    this.store.updateBannerState(false);
  }

  handleShowMeHow () {
    UserPreferenceService.set('actionOnInterceptorLesson', true);
    this.store.updateBannerState(false);
    runTaggedLesson('interceptor-lesson-v3', {
      signInModalOptions: {
        type: 'interceptorCookies',
        origin: 'from_manage_cookies'
      }
    });
  }

  render () {
    const { domains } = this.props;

    return (
      <div className='cookies-management-banner-domain-list-wrapper'>
        {
        !_.isEmpty(domains) && this.store.showBanner && !(window.SDK_PLATFORM === 'browser') && (
          <div className='interceptor-bootcamp-lesson-banner'>
            <span className='interceptor-bootcamp-lesson-banner-description'>Sync cookies directly from your browser with Interceptor</span>
            <div>
              <Button
                className='interceptor-bootcamp-lesson-banner-button'
                type='text'
                onClick={this.handleShowMeHow}
              >
                Start Lesson
              </Button>
              <CloseIcon
                className='interceptor-bootcamp-lesson-banner--dismiss'
                size='xs'
                onClick={this.handleClose}
              />
            </div>
          </div>
        )
}
        <div className='cookies-management-domain-list-wrapper'>
          {
          _.isEmpty(domains) && (
            <EmptyListMessage className='cookies-management-domain-list-empty'>
              <div className='cookies-management-domain-list-empty__icon' />
            No Cookies available
              {!(window.SDK_PLATFORM === 'browser') && (
                <div className='cookies-management-interceptor-lesson'>
                  <div className='cookies-management-interceptor-lesson__text'>
                  Learn how to capture cookies using Interceptor.
                  </div>
                  <Button
                    className='interceptor-bootcamp-lesson-button'
                    type='primary'
                    onClick={this.handleShowMeHow}
                  >
                  Start Lesson
                  </Button>
                </div>
              )}
            </EmptyListMessage>
          )
}
          {
          !_.isEmpty(domains) &&
          domains.map((domain) => (
            <CookiesManagementDomainsListItem
              key={domain}
              domain={domain}
              cookies={this.props.cookies[domain]}
              selectedDomain={this.props.selectedDomain}
              onDomainSelect={this.props.onDomainSelect}
              onDomainDelete={this.props.onDomainDelete}
              selectedCookie={this.props.selectedCookie}
              onCookieAdd={this.props.onCookieAdd}
              onCookieSelect={this.props.onCookieSelect}
              onCookieChange={this.props.onCookieChange}
              onCookieDelete={this.props.onCookieDelete}
              domainsBeingDeleted={this.props.domainsBeingDeleted}
            />
          ))
        }
        </div>
      </div>
    );
  }
}

CookiesManagementDomainsList.defaultProps = { domains: [] };
