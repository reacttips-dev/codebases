var _ = require('lodash'),
    urlParse = require('url-parse');

/*
  Utility functions for url operations common to browser and node environments
*/
module.exports = {
  /**
   * converts a url like string to a sanitized valid URL
   *
   * @param {string} url
   *
   * @return {string}
   */
  ensureProperUrl: function ensureProperUrl (url) {
    url = url.trim();
    var HTTP_PROTOCOL = 'http://',
        HTTPS_PROTOCOL = 'https://';

    if (url.indexOf(HTTP_PROTOCOL) !== 0 && url.indexOf(HTTPS_PROTOCOL) !== 0) {
      url = HTTP_PROTOCOL + url;
    }

    return url.trim();
  },

  /**
   * Returns a parsed url from a string
   * @param {string} url
   *
   * @return {URL}
   */
  getURLProps: function getURLProps (url) {
    let urlInstance;

    try {
      // browser
      urlInstance = new URL(url);
    }
    catch (e) {
      urlInstance = urlParse(url);
    }
    finally {
      return urlInstance;
    }
  },

  /**
   * Returns a stringifided url params from object
   * @param {object} params
   *
   * @return {String}
   */
  getStringifiedQueryParams: function getStringifiedQueryParams (params = {}) {
    if (!_.isObject(params) || _.isEmpty(params)) {
      return '';
    }
    let paramKeys = _.keys(params);
    return (
      _.chain(paramKeys)
       .map((key) => {
         return key + '=' + params[key];
       })
       .join('&')
       .value()
    );
  },

  /**
   * Returns a string for the query params. Clone of the dashboard utility for the same. Added to provide support for
   * params having array value and for filtering out undefined values. Example:
   * { result: ['success', 'failure', 'abort']} -> '?result=success&result=failure&result=abort'
   *
   * @param {object} params
   *
   * @returns {string}
   */
  populateParams: function populateParams (params) {
    let query = [];

    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (Array.isArray(value)) {
        return query.push(value.map((v) => {
          return `${key}=${v}`;
        }).join('&'));
      }

      if (value) {
        query.push(`${key}=${value}`);
      }
    });

    return '?' + query.join('&');
  },

  /**
   * Method will add the given params to URL, replace any existing param value with the new param value, and return the final formatted URL
   * @param {String} url
   * @param {Object} params Query params to add to above Url
   */
  addParamsToUrl: function addParamsToUrl (url, params = {}) {
    if (_.isEmpty(url) || !_.isObject(params)) {
      return url;
    }

    let urlInstance = urlParse(url, true);

    urlInstance.query = _.merge(urlInstance.query, params);

    return urlInstance.toString();
  }

};
