/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const parseURL = require('url-parse');

module.exports = class PowerUpSuggester {
  constructor(claimedDomains) {
    this.claimedDomains = claimedDomains;
  }

  _hasIPAddressFormat(s) {
    return /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(s);
  }

  _urlIsValid(url) {
    if (url == null) {
      return false;
    }

    const { protocol } = url;
    if (protocol !== 'http:' && protocol !== 'https:') {
      return false;
    }

    if (this._hasIPAddressFormat(url.hostname)) {
      return false;
    }

    return true;
  }

  _findClaimedPowerUpIdFromNakedDomainByHostname(hostname) {
    // We naively find the naked domain by checking if the provided
    // hostname ends with the claimed domain's TLD.

    const claimedDomains = Object.keys(this.claimedDomains);
    const nakedDomain = _.find(claimedDomains, function (claimedDomain) {
      const beginIndex = hostname.length - claimedDomain.length - 1;
      return hostname.slice(beginIndex) === `.${claimedDomain}`;
    });

    return this.claimedDomains[nakedDomain];
  }

  getPowerUpIdFromClaimedPowerUpDomains(url) {
    // Power-Ups can claim domains for unfurling. URLs to be unfurled must
    // have the following heuristics:
    //
    // a) URLs must be fully qualified and include the protocol http://
    //    or https://
    // b) URLs can contain additive sub-domains and will be matched against the
    //    claimed naked domain e.g. https://subdomain.example.com will match
    //    example.com. However, if a power-up has claimed a sub-domain, URLs
    //    containing sub-domains will not be matched against its naked domain.
    // c) URLs cannot be IP addresses as they are not domains
    // d) URLs can include a port number and is eligible for parsing e.g.
    //    https://example.com:8080 will match example.com

    const parsedURL = parseURL(url);
    if (this._urlIsValid(parsedURL)) {
      const { hostname } = parsedURL;
      if (this.claimedDomains[hostname] != null) {
        return this.claimedDomains[hostname];
      } else {
        return this._findClaimedPowerUpIdFromNakedDomainByHostname(hostname);
      }
    }
  }
};
