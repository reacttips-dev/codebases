/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const config = '@trello/config';
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const parseURL = require('url-parse');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PostMessageIO = require('@atlassian/trello-post-message-io');
const Promise = require('bluebird');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const {
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const xtend = require('xtend');
const Visibility = require('visibilityjs');

let INITIALIZE_TIMEOUT = 30000; // gives us 30 seconds to load the index iframe for a Power-Up

const IFrameIOError = makeErrorEnum('IFrameIO', [
  'Invalid',
  'NotHandled',
  'Timeout',
]);

let host = null;
const getHost = function () {
  if (host == null) {
    const id = 'iframe-io-host';
    host = document.createElement('div');
    host.id = id;
    const body = document.getElementsByTagName('body')[0];
    if (!body) {
      throw Error('no body to host iframes');
    }
    body.appendChild(host);
  }
  return host;
};

class IFrameIO {
  static initClass() {
    this.Error = IFrameIOError;
  }
  constructor(url, handlers, id, declaredCapabilities) {
    this.url = url;
    this.handlers = handlers;
    this.id = id;
    this.declaredCapabilities = declaredCapabilities;
  }

  _getIO() {
    const startTime = performance?.now?.() || Date.now();
    let iframeLoaded = false;
    let initializeCalled = false;
    let iframeLoadTime = 0;
    let initializeStartTime = 0;
    let visibilityOnLoad = false;
    let visibilityOnInitialize = false;
    if (Visibility.hidden()) {
      INITIALIZE_TIMEOUT = 60000;
    }
    return (
      this._io ??
      (this._io = new Promise((resolve) => {
        let io;
        if (!pluginValidators.isValidUrlForIframe(this.url)) {
          throw IFrameIOError.Invalid(
            `Provided iframe source not valid: ${this.url}`,
          );
        }

        const iframe = document.createElement('iframe');
        iframe.sandbox = sandboxParams;
        iframe.onload = function () {
          iframeLoaded = true;
          const loadTime = performance?.now?.() || Date.now();
          visibilityOnLoad = !Visibility.hidden();
          return (iframeLoadTime = Math.ceil(loadTime - startTime));
        };
        iframe.src = this.url;
        // see: https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-permissions-in-cross-origin-iframes
        iframe.allow = 'microphone; camera';
        this._iframeEl = iframe;

        getHost().appendChild(iframe);

        const secret = PostMessageIO.randomId(64);
        this.implementedCapabilities = [];

        return (io = new PostMessageIO({
          Promise,
          local: window,
          remote: iframe.contentWindow,
          targetOrigin: parseURL(this.url).set('pathname', '').href,
          secret,
          handlers: xtend(this.handlers, {
            initialize: (t, implementedCapabilities) => {
              initializeCalled = true;
              initializeStartTime = performance?.now?.() || Date.now();
              visibilityOnInitialize = !Visibility.hidden();
              this.implementedCapabilities = implementedCapabilities;
              const nonImplemented = _.difference(
                this.declaredCapabilities,
                implementedCapabilities,
              );
              if (nonImplemented.length > 0) {
                if (typeof console !== 'undefined' && console !== null) {
                  console.warn(
                    `Power-Up ${this.id} declares capabilities that are not implemented`,
                    nonImplemented,
                  );
                }
              }
              const nonDeclared = _.difference(
                implementedCapabilities,
                this.declaredCapabilities,
              );
              if (nonDeclared.length > 0) {
                if (typeof console !== 'undefined' && console !== null) {
                  console.warn(
                    `Power-Up ${this.id} implements capabilities that haven't been enabled`,
                    nonDeclared,
                  );
                }
              }
              return {
                locale: Auth.myLocale(),
                member: Auth.myId(),
                secret,
                version: /^build-\d+$/.test(config.clientVersion)
                  ? config.clientVersion
                  : 'unknown',
              };
            },
            ready: () => {
              const endTime = performance?.now?.() || Date.now();
              resolve(io);
              return sendPluginTrackEvent({
                idPlugin: this.id,
                idBoard: currentModelManager.getCurrentBoard()?.get('id'),
                event: {
                  action: 'initialized',
                  actionSubject: 'powerUp',
                  source: 'iframeIO',
                  attributes: {
                    elapsedMs: Math.ceil(endTime - startTime),
                    iframeLoadMs: iframeLoadTime,
                    initializeMs:
                      initializeStartTime !== 0
                        ? Math.ceil(initializeStartTime - iframeLoadTime)
                        : 0,
                    declaredCapabilities: this.declaredCapabilities.sort(),
                    implementedCapabilities: this.implementedCapabilities.sort(),
                    wasLoaded: iframeLoaded,
                    wasInitialized: initializeCalled,
                    loadVisibility: visibilityOnLoad,
                    initVisibility: visibilityOnInitialize,
                  },
                },
              });
            },
          }),
        }));
      })
        .timeout(INITIALIZE_TIMEOUT)
        .catch(Promise.TimeoutError, () => {
          const endTime = performance?.now?.() || Date.now();
          sendPluginTrackEvent({
            idPlugin: this.id,
            idBoard: currentModelManager.getCurrentBoard()?.get('id'),
            event: {
              action: 'timedOut',
              actionSubject: 'powerUp',
              source: 'iframeIO',
              attributes: {
                elapsedMs: Math.ceil(endTime - startTime),
                iframeLoadMs: iframeLoadTime,
                initializeMs:
                  initializeStartTime !== 0
                    ? Math.ceil(initializeStartTime - iframeLoadTime)
                    : 0,
                declaredCapabilities: this.declaredCapabilities.sort(),
                wasLoaded: iframeLoaded,
                wasInitialized: initializeCalled,
                loadVisibility: visibilityOnLoad,
                initVisibility: visibilityOnInitialize,
              },
            },
          });
          if (
            typeof console !== 'undefined' && console !== null
              ? console.error
              : undefined
          ) {
            console.error(
              `Error, timeout while initializing index iframe for ${this.url}. Timeout=${INITIALIZE_TIMEOUT}ms`,
            );
          }
          throw IFrameIOError.Timeout(
            `unable to initialize iframe-io in ${INITIALIZE_TIMEOUT}ms`,
          );
        }))
    );
  }

  request(command, options, timeout) {
    return this._getIO()
      .then(function (io) {
        const startTime = Date.now();
        return io
          .request(command, options)
          .timeout(timeout)
          .catch(Promise.TimeoutError, function () {
            if (console?.error) {
              console.error(
                `IFrameIO request timed out. Command=${command}, Plugin=${
                  options?.context?.plugin
                }, Elapsed=${Date.now() - startTime}`,
              );
            }
            throw IFrameIOError.Timeout(
              `${command} did not complete in ${timeout}ms`,
            );
          });
      })
      .catch(function (err) {
        throw IFrameIOError.NotHandled(
          `Request to run '${command}' failed due to error: '${err.message}'`,
        );
      });
  }

  drop() {
    return this._iframeEl?.parentNode.removeChild(this._iframeEl);
  }
}
IFrameIO.initClass();

module.exports.IFrameIO = IFrameIO;
