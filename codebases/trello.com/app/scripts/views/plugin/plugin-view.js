/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const Hearsay = require('hearsay');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const Promise = require('bluebird');
const View = require('app/scripts/views/internal/view');

class PluginView extends View {
  static initClass() {
    this.prototype.handleIFrameMessage = null;
  }
  constructor() {
    super(...arguments);
    this._retained = this._retained || [];
    this._pendingPromises = this._pendingPromises || [];
    this._eventListeners = this._eventListeners || [];
  }

  _retainCallback(callback) {
    this._retained = this._retained || [];
    if (callback != null && this._retained != null) {
      callback.retain().catch((err) =>
        // this can fail for a lot of legitimate reasons due to the async nature
        // of Power-Ups so just print a warning
        typeof console !== 'undefined' && console !== null
          ? console.warn(err.message)
          : undefined,
      );
      this._retained.push(callback);
    }
    return callback;
  }

  retain(obj) {
    if (_.isFunction(obj)) {
      this._retainCallback(obj);
    } else if (_.isArray(obj)) {
      obj.forEach((item) => {
        return this.retain(item);
      });
    } else if (_.isObject(obj)) {
      this.retain(_.values(obj));
    }
  }

  cancelOnRemove(promise) {
    this._pendingPromises = this._pendingPromises || [];
    promise.cancellable();

    if (this._pendingPromises != null) {
      // You have to set the catch for CancellationError *before* adding this
      // promise to @_pendingPromises, or else when you cancel it in `remove`
      // the exception bubbles up to a parent promise (_promise0) and still
      // shows in the console and in our logs (I didn't figure out why that is,
      // looked like a bug in Bluebird).
      promise
        .then(() => {
          return (this._pendingPromises = _.without(
            this._pendingPromises,
            promise,
          ));
        })
        .catch(Promise.CancellationError, function () {});
      this._pendingPromises.push(promise);
    } else {
      promise.catch(Promise.CancellationError, function () {}).cancel();
    }
    return promise;
  }

  remove() {
    super.remove(...arguments);
    this._retained = this._retained || [];
    this._pendingPromises = this._pendingPromises || [];
    this._eventListeners = this._eventListeners || [];

    for (const promise of Array.from(this._pendingPromises)) {
      promise.cancel();
    }
    delete this._pendingPromises;

    for (const { target, type, callback } of Array.from(this._eventListeners)) {
      target.removeEventListener(type, callback);
    }
    delete this._eventListeners;

    // Remove these last, since it's possible that a promise or a callback
    // will try to use them
    for (const retained of Array.from(this._retained)) {
      retained.release().catch(function (err) {});
    } // noop, we don't care if this fails
    delete this._retained;
  }

  addEventListener(target, type, callback) {
    this._eventListeners = this._eventListeners || [];
    target.addEventListener(type, callback);
    return this._eventListeners.push({ target, type, callback });
  }

  initIFrames(board, card, ...changedSignals) {
    const $iframes = this.$el.find('iframe.plugin-iframe');

    const combinedSignal = Hearsay.combine(
      ...Array.from(
        changedSignals.concat(pluginsChangedSignal(board, card)) || [],
      ),
    );

    _.each($iframes, (iframe) => {
      let loaded = false;

      const rerender = () => {
        if (loaded) {
          iframe.contentWindow?.postMessage('render', '*');
        }
      };

      this.subscribe(combinedSignal, rerender);

      const $iframe = $(iframe);
      $iframe.addClass('iframe-loading').one(
        'load',
        this.callback((e) => {
          $iframe.removeClass('iframe-loading');

          loaded = true;
          rerender();

          if (this.handleIFrameMessage != null) {
            this.addEventListener(window, 'message', (e) => {
              if (e.source === iframe.contentWindow) {
                this.handleIFrameMessage(iframe, e.data);
              }
            });
          }
        }),
      );
    });
  }
}

PluginView.initClass();
module.exports = PluginView;
