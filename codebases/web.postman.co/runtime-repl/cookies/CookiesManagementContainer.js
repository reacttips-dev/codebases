import React, { Component } from 'react';
import sdk from 'postman-collection';
import { encodeHost } from 'postman-url-encoder/encoder';

import util from '@postman-app-monolith/renderer/js/utils/util';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import CookiesManagement from '@@runtime-repl/cookies/CookiesManagement';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import { WORKING_WITH_COOKIES_DOCS_URL, INTERCEPTOR_COOKIES_CAPTURE_URL } from '@postman-app-monolith/renderer/js/constants/AppUrlConstants';

import CookiesManagementDomainWhitelistContainer from './CookiesManagementDomainWhitelistContainer';
import Link from '../../appsdk/components/link/Link';

const YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

export default class CookiesManagementContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      domains: [],
      cookies: {},
      selectedDomain: '',
      selectedCookie: '',
      showDomainWhitelist: false,
      domainsBeingDeleted: []
    };

    this.getDomainList = this.getDomainList.bind(this);
    this.handleDomainSelect = this.handleDomainSelect.bind(this);
    this.handleCookieAdd = this.handleCookieAdd.bind(this);
    this.handleCookieSelect = this.handleCookieSelect.bind(this);
    this.handleDomainDelete = this.handleDomainDelete.bind(this);
    this.handleDomainAdd = this.handleDomainAdd.bind(this);
    this.handleCookieDelete = this.handleCookieDelete.bind(this);
    this.handleCookieChange = this.handleCookieChange.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleDomainWhitelistToggle = this.handleDomainWhitelistToggle.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.model = pm.cookieManager;
    this.getDomainList();
  }

  processCookies () {
    const cookies = {};

    _.each(this.state.domains, (domain) => {
      cookies[domain] = [];
      _.each(this.model.cookies[domain], (domainCookies) => {
        cookies[domain] = cookies[domain].concat(domainCookies);
      });
    });

    this.setState({ cookies });
  }

  getDomainList () {
    if (this.model) {
      this.setState({ domains: this.model.getDomainList() }, () => {
        this.processCookies();
      });
    }
  }

  handleDomainSelect (domain) {
    this.setState({
      selectedCookie: '',
      selectedDomain: domain
    });
  }

  handleCookieSelect (cookie = '') {
    const domain = cookie.domain[0] === '.' ? cookie.domain.slice(1) : cookie.domain;

    this.setState({
      selectedCookie: cookie || '',
      selectedDomain: domain
    });
  }

  handleDomainDelete (domain) {
    const domainsBeingDeleted = [...this.state.domainsBeingDeleted, domain];

    this.setState({ domainsBeingDeleted }, () => {
      this.model.deleteDomain(domain, (res) => {
        this.getDomainList();
        const deletedDomain = res && res.domain,
          domainsBeingDeleted = this.state.domainsBeingDeleted.filter((item) => item !== deletedDomain);

        // Remove deleted domain from list
        this.setState({ domainsBeingDeleted }, () => {
          if (res.type === 'Success') {
            pm.toasts.success(`Cookies for domain ${deletedDomain} deleted successfully.`);

            return;
          }

          if (res.type === 'RemoveCookieError') {
            pm.toasts.error(`Failed to delete cookies for domain ${deletedDomain}.`);
          }
        });
      });
    });
  }

  handleDomainAdd (domain) {
    if (domain && domain !== '') {
      const url = sdk.Url.parse(domain),
        host = url ? url.host : '',

        // Possibility is that a NON-ASCII host could come than it would get converted
        // to ASCII-equivalent URL before getting added to Cookie model.
        equivalentASCIIHost = encodeHost(host);

      if (!equivalentASCIIHost) return;
      this.model.addNewDomain(equivalentASCIIHost.toLowerCase());
      this.getDomainList();
    }
  }

  handleCookieDelete (cookie) {
    const { domain } = cookie,
      cookieName = cookie.name,
      { path } = cookie; // TODO: Samvel - why _.find(cookie, (cookiePart) => cookiePart.name === "path"); ?

    // TODO: Samvel - is this needed under any other circumstances?
    // if(pathObj && pathObj.value!="/") {
    //   path = pathObj.value;
    // }
    this.model.deleteCookie(domain, cookieName, path, (error) => {
      error && pm.logger.error(error);
      !error && this.setState({ selectedCookie: '' }, () => {
        this.processCookies();
      });
    });
  }

  handleCookieAdd (domain) {
    const dateOneYearInFuture = new Date(Date.now() + YEAR_IN_MS),
      cookieString = `Cookie_${this.props.cookieCounter}=value; Path=/; Expires=${dateOneYearInFuture}`,
      cookieObject = util._parseSingleCookieString(domain, cookieString);

    this.model.addSingleCookie(cookieObject.url, domain, cookieObject, (error) => {
      if (error) {
        return;
      }

      const newCookie = this.model.cookies[domain][cookieObject.name][0];

      this.handleCookieSelect(newCookie);
      this.props.onCookieAdd && this.props.onCookieAdd();
      this.processCookies();
    });
  }

  handleCookieChange (value) {
    const domain = this.state.selectedDomain,
      cookieObject = util._parseSingleCookieString(domain, value),
      oldCookieObject = this.state.selectedCookie;

    if (cookieObject.domain !== oldCookieObject.domain && cookieObject.domain !== `.${oldCookieObject.domain}`) {
      return this.setState({ selectedCookie: '' });
    }

    this.model.editCookie(domain, oldCookieObject, cookieObject, (error) => {
      !error && this.setState({ selectedCookie: '' }, () => {
        this.processCookies();
      });
    });
  }

  handleLinkClick () {
    openExternalLink(WORKING_WITH_COOKIES_DOCS_URL);
  }

  handleDomainWhitelistToggle () {
    this.setState((prevState) => ({
      showDomainWhitelist: !prevState.showDomainWhitelist
    }));
  }

  render () {
    return (
      this.state.showDomainWhitelist ?
        (
          <CookiesManagementDomainWhitelistContainer
            onCancel={this.handleDomainWhitelistToggle}
          />
        ) :
        (
          <div>
            <CookiesManagement
              domains={this.state.domains}
              cookies={this.state.cookies}
              onDomainAdd={this.handleDomainAdd}
              onDomainSelect={this.handleDomainSelect}
              onDomainDelete={this.handleDomainDelete}
              selectedDomain={this.state.selectedDomain}

              onCookieAdd={this.handleCookieAdd}
              onCookieSelect={this.handleCookieSelect}
              onCookieChange={this.handleCookieChange}
              onCookieDelete={this.handleCookieDelete}
              selectedCookie={this.state.selectedCookie}
              domainsBeingDeleted={this.state.domainsBeingDeleted}
            />
            <div className='cookie-management-container__footer'>
              <Button
                className='cookie-management-container__footer__button'
                type='secondary'
                onClick={this.handleDomainWhitelistToggle}
              >
              Whitelist Domains
              </Button>
              <span className='learn-more__section'>
              Learn more about&nbsp;
                <Link
                  className='pm-link'
                  to={WORKING_WITH_COOKIES_DOCS_URL}
                  target='_blank'
                >
                cookies
                </Link>
              &nbsp;and how to capture them with&nbsp;
                <Link
                  className='pm-link'
                  to={INTERCEPTOR_COOKIES_CAPTURE_URL}
                  target='_blank'
                >
                Interceptor
                </Link>
              </span>
            </div>
          </div>
        )
    );
  }
}
