/* global COURSERA_APP_VERSION, COURSERA_APP_NAME */

/**
 * This file exposes RESTful functions that override jQuery AJAX functionality to:
 *  - create and clear CSRF tokens
 *  - show loading and loaded messages during requests
 *  - provide support for PATCH via the HTTP method override header
 *  Usage example:
 *    Coursera.api = API('api/');
 *  You can also pass in options, see the DEFAULTS hash for the possibilities.
 *
 */

import $ from 'jquery';

import _ from 'underscore';
import Cookie from 'js/lib/cookie';
import language from 'js/lib/language';
import pathUtil from 'js/lib/path';
import LucidJS from 'js/vendor/lucid.v2-7-0';

// Count of total inflight XmlHttpRequests. We set the CSRF cookie at the start of the first request, but don't
// change it for new requests if others are still in flight because Safari gets confused and sends the wrong
// cookies. When this count reaches 0, we clear the CSRF Cookie.
let globalActiveAjaxCount = 0;

const DEFAULTS = Object.freeze({
  type: 'normal',
  'csrf.token': 'X-CSRFToken',
  'csrf.cookie': 'csrftoken',
  'csrf.path': null,
  'csrf.domain': null,
  'csrf.secure': true,
  'csrf2.token_header': 'X-CSRF2-Token',
  'csrf2.cookie_name_header': 'X-CSRF2-Cookie',
  'csrf2.cookie_prefix': 'csrf2_token_',
  'csrf3.token_header': 'X-CSRF3-Token',
  'csrf3.cookie_name': 'CSRF3-Token',
  'r2.app_name_header': 'X-Coursera-Application',
  'r2.app_version_header': 'X-Coursera-Version',
  'emulate.patch': true,
  'emulate.put': false,
  'emulate.delete': false,
  'custom.header.name': null,
  'custom.header.value': null,
});

const _private = {
  csrfGet() {
    // If there is an existing CSRF cookie, there must be an inflight AJAX request (see globalActiveAjaxCount),
    // so we leave that cookie to avoid confusing Safari and have it send the wrong cookie with previous AJAX calls.
    // Otherwise, generate a new CSRF.
    const token = Cookie.get(this.options['csrf.cookie']);
    if (token) {
      return token;
    } else {
      return _private.csrfSet.call(this, _private.csrfMake());
    }
  },

  csrfClear() {
    Cookie.remove(this.options['csrf.cookie'], {
      secure: this.options['csrf.secure'],
      path: this.options['csrf.path'],
      domain: this.options['csrf.domain'],
    });
  },

  csrfSet(token) {
    Cookie.set(this.options['csrf.cookie'], token, {
      secure: this.options['csrf.secure'],
      path: this.options['csrf.path'],
      domain: this.options['csrf.domain'],
      expires: new Date(new Date().getTime() + 60000),
    });
    return token;
  },

  csrfMake(length = 24, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const output = [];

    for (let i = 0; i < length; i += 1) {
      output.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    return output.join('');
  },

  csrf2SetUp(ajaxOptions) {
    if (ajaxOptions.type === 'GET') {
      return {};
    }

    const cookieName = this.options['csrf2.cookie_prefix'] + _private.csrfMake(8);
    const token = _private.csrfMake();

    Cookie.set(cookieName, token, {
      secure: this.options['csrf.secure'],
      path: this.options['csrf.path'],
      domain: this.options['csrf.domain'],
      expires: new Date(new Date().getTime() + 60000),
    });

    ajaxOptions.headers[this.options['csrf2.cookie_name_header']] = cookieName;
    ajaxOptions.headers[this.options['csrf2.token_header']] = token;
  },

  csrf2TearDown(ajaxHeaders) {
    const cookieName = ajaxHeaders[this.options['csrf2.cookie_name_header']];
    if (cookieName) {
      Cookie.remove(cookieName, {
        secure: this.options['csrf.secure'],
        path: this.options['csrf.path'],
        domain: this.options['csrf.domain'],
      });
    }
  },

  invoke(path, _options) {
    const options = Object.assign({}, _options) || {};
    let url;
    if (path.indexOf('http') !== 0) {
      url = pathUtil.join(this.root, path);
    } else {
      url = path;
    }

    this.trigger('before', url, options);

    const params = options.type === 'GET' ? options.data : null;
    const remove = function (e, item) {
      this.remove(item.options.id);
    };

    const message = options.message || {};
    const codes = message.codes ? _.keys(message.codes) : [];
    const asyncMessage = this.options.message;
    const self = this;
    delete options.message;

    // For non-GET requests, decide how to format the data for the server
    // We convert to JSON if the API type is 'rest' and the AJAX call options
    // didnt set processData to true.
    if (options.type !== 'GET' && _.isUndefined(options.processData) && this.options.type === 'rest') {
      options.contentType = 'application/json; charset=utf-8';
      options.processData = false;
      options.data = JSON.stringify(options.data);
    }

    options.beforeSend = function () {
      globalActiveAjaxCount += 1;
    };

    const jqXHR = $.ajax(url, options);

    // does this api support showing messages?
    if (asyncMessage) {
      // a message to display on load
      if (message.waiting) {
        const waitID = asyncMessage.add($('<div>').append(message.waiting).addClass('waiting'), {
          delay: 100,
        });
        jqXHR.always(function (response, textStatus) {
          asyncMessage.remove(waitID);
        });
      }

      // a message to display on success
      if (message.success || (message.codes && _.min(codes) < 300)) {
        jqXHR.done(function (response, textStatus) {
          if (message.codes && message.codes[response.status]) {
            asyncMessage.add($('<div>').append(message.codes[response.status]).addClass('success'), {
              timeout: 500,
            });
          } else if (message.success) {
            asyncMessage.add($('<div>').append(message.success).addClass('success'), {
              timeout: 500,
            });
          }
        });
      }

      // a message to display on error
      if (message.error || message.timeout || (message.codes && _.max(codes) >= 300)) {
        jqXHR.fail(function (response, textStatus) {
          if (message.timeout && textStatus === 'timeout') {
            asyncMessage.add($('<div>').append(message.timeout).addClass('error'), {
              events: {
                click: remove,
              },
            });
          } else if (message.codes && message.codes[response.status]) {
            asyncMessage.add($('<div>').append(message.codes[response.status]).addClass('error'), {
              events: {
                click: remove,
              },
            });
          } else if (message.error) {
            asyncMessage.add($('<div>').append(message.error).addClass('error'), {
              events: {
                click: remove,
              },
            });
          }
        });
      }
    }

    const start = new Date().getTime();

    self.trigger('send', {
      xhr: jqXHR,
      url,
    });

    jqXHR.always(function () {
      globalActiveAjaxCount -= 1;
      if (globalActiveAjaxCount === 0) {
        _private.csrfClear.call(self);
      }

      _private.csrf2TearDown.call(self, options.headers || {});

      self.trigger('always', {
        xhr: jqXHR,
        url,
        params,
        method: options.type,
        timing: new Date().getTime() - start,
      });
    });

    jqXHR.fail(function () {
      self.trigger('fail', {
        xhr: jqXHR,
        url,
        method: options.type,
        params,
      });
    });

    return jqXHR;
  },

  restify(method, _options) {
    const options = Object.assign(
      {
        data: {},
        headers: { 'Accept-Language': language.getIetfLanguageTag() },
      },
      _options
    );

    switch (method) {
      case 'POST':
        options.type = 'POST';
        break;

      case 'PATCH':
        if (this.options['emulate.patch']) {
          options.type = 'POST';
          options.headers['X-HTTP-Method-Override'] = 'PATCH';
        } else {
          options.type = 'PATCH';
        }

        break;

      case 'PUT':
        if (this.options['emulate.put']) {
          options.type = 'POST';
          options.headers['X-HTTP-Method-Override'] = 'PUT';
        } else {
          options.type = 'PUT';
        }

        break;

      case 'DELETE':
        if (this.options['emulate.delete']) {
          options.type = 'POST';
          options.headers['X-HTTP-Method-Override'] = 'DELETE';
        } else {
          options.type = 'DELETE';
        }

        break;

      default:
        options.type = 'GET';
        break;
    }

    if (options.type !== 'GET') {
      options.headers[this.options['csrf.token']] = _private.csrfGet.call(this);

      _private.csrf2SetUp.call(this, options);

      const csrf3Token = Cookie.get(this.options['csrf3.cookie_name']);
      if (csrf3Token) {
        options.headers[this.options['csrf3.token_header']] = csrf3Token;
      }
    }

    if (this.options['custom.header.name']) {
      options.headers[this.options['custom.header.name']] = this.options['custom.header.value'];
    }

    const r2AppName = COURSERA_APP_NAME;
    const r2AppVersion = COURSERA_APP_VERSION;
    if (r2AppName) {
      options.headers[this.options['r2.app_name_header']] = r2AppName;
    }
    if (r2AppVersion) {
      options.headers[this.options['r2.app_version_header']] = r2AppVersion;
    }
    return options;
  },
};

const Api = function (root, apiConfig) {
  this.root = root;
  this.options = Object.assign({}, DEFAULTS, apiConfig);
  LucidJS.emitter(this);
};

Api.prototype.customize = function (apiConfig) {
  this.options = Object.assign(this.options, apiConfig);
  return this;
};

// options include any $.ajax options you would normally include
// just be aware that this library takes care of csrf headers, GET/POST types, X-HTTP-METHOD-OVERRIDE, and converting data to json
//
// if the api object was instatiated with the asyncMessage, you can optionally turn on global messages for any of your ajax calls
// you can include a message object with the following optional options
//
// message.waiting -> a string/html, selector or jquery element that will be inserted into the main asyncMessage box on the page
//    it will dissapear once the ajax call returns
//
// message.error -> a string/html, selector or jquery element that will be inserted into the main asyncMessage box
//    it triggers on a failed ajax call and will dissapear once the user clicks on it
//
// message.success -> a string/html, selector or jquery element that will be inserted into the main asyncMessage box
//    it triggers on a successful ajax call will dissapear after a 500ms timeout
//
// message[200->500] -> a string/html, selector or jquery element that will be inserted into the main asyncMessage box
//    it triggers when that status code is returned by the ajax call, and 200->300 disappears on timeout and >400 disappears on click

Api.prototype.get = function (path, options) {
  return _private.invoke.call(this, path, _private.restify.call(this, 'GET', options));
};

Api.prototype.patch = function (path, options) {
  return _private.invoke.call(this, path, _private.restify.call(this, 'PATCH', options));
};

Api.prototype.delete = function (path, options) {
  return _private.invoke.call(this, path, _private.restify.call(this, 'DELETE', options));
};

Api.prototype.post = function (path, options) {
  return _private.invoke.call(this, path, _private.restify.call(this, 'POST', options));
};

Api.prototype.put = function (path, options) {
  return _private.invoke.call(this, path, _private.restify.call(this, 'PUT', options));
};

export default function (root, apiConfig) {
  return new Api(root, apiConfig);
}
