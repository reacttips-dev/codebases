/* eslint-disable eqeqeq */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let AjaxQueue;
import $ from 'jquery';
import { showFlag } from '@trello/nachos/experimental-flags';
import Alerts from 'app/scripts/views/lib/alerts';
import { memberId } from '@trello/session-cookie';
import _ from 'underscore';
import { l } from 'app/scripts/lib/localize';
import { randomNumber } from './randomNumber';

export const ajaxQueue = (AjaxQueue = new (class {
  constructor() {
    this._msBackoff = 100;
    this._msBackoffMin = 100;
    this._nTriesLeft = 12;
    this._nTriesMax = 12;
    this._retrying = false;
    this._stopped = false;
    this._maxLength = 10;

    this._queue = [];
    this._queueIdSeq = 0;
  }

  uniqueReqId() {
    return `${memberId}-${randomNumber()}`;
  }

  hasQueue() {
    return this._queue.length > 0;
  }
  inQueue(req) {
    return _.find(this._queue, (r) => r.queueId === req.queueId);
  }
  removeFromQueue(req) {
    return (this._queue = _.filter(
      this._queue,
      (r) => r.queueId !== req.queueId,
    ));
  }
  addToQueue(req) {
    if (this._queue.length + 1 > this._maxLength) {
      return;
    }
    this._queue.push(req);
    return this.showRetrying();
  }

  success(req) {
    if (this.inQueue(req)) {
      this.removeFromQueue(req);
      this._retrying = false;
      this._msBackoff = this._msBackoffMin;
      this._nTriesLeft = this._nTriesMax;
      return this.retryNext();
    }
  }

  retryableError(reqIn) {
    const req = _.clone(reqIn);
    if (AjaxQueue.inQueue(req)) {
      this._retrying = false;
    } else {
      AjaxQueue.addToQueue(req);
    }
    return this.retryNext();
  }

  serverAlreadySaw(req) {
    if (this.inQueue(req)) {
      this.removeFromQueue(req);
      return this.retryNext();
    }
  }

  retryNext() {
    if (this._stopped) {
      return;
    }
    if (!this.hasQueue()) {
      this.hideRetrying();
      return;
    }
    this.showRetrying();
    if (this._retrying) {
      return;
    }
    this._retrying = true;
    const req = this._queue[0];
    if (this._nTriesLeft > 0) {
      req.headers = {
        ...req.headers,
        'X-Trello-ReqId': this.uniqueReqId(),
      };
      setTimeout(() => $.ajax(req), this._msBackoff);
      this._msBackoff *= 2;
      return --this._nTriesLeft;
    } else {
      this._stopped = true;
      return this.showOutOfRetries();
    }
  }

  showError(msg) {
    showFlag({
      id: 'AjaxQueueFail',
      title: msg,
      appearance: 'error',
      actions: [
        {
          content: l('alerts.reload page'),
          onClick: () => window.location.reload(),
          type: 'button',
        },
      ],
      isUndismissable: true,
    });
  }

  showRealError(xhr, textStatus, err) {
    this.hideRetrying();
    this.showError(l('alerts.changes not saved'));
  }

  showOutOfRetries() {
    this.hideRetrying();
    this.showError(l('alerts.timed out'));
  }

  showRetrying() {
    return Alerts.show('retrying', 'error', 'AjaxQueueRetry');
  }

  hideRetrying() {
    return Alerts.hide('AjaxQueueRetry');
  }

  showSending() {
    return Alerts.show('sending', 'warning', 'AjaxQueueSending');
  }

  hideSending() {
    return Alerts.hide('AjaxQueueSending');
  }

  showUploading(status) {
    return Alerts.show(status, 'info', 'AjaxQueueUpload');
  }

  hideUploading() {
    return Alerts.hide('AjaxQueueUpload');
  }

  ajax(reqIn) {
    const req = _.clone(reqIn);

    if (this._stopped) {
      return;
    }

    if (/^put$/i.test(req.type)) {
      // TRELP-2192: match server timeout for large put requests
      if (req.timeout == null) {
        req.timeout = 120000;
      }
    } else {
      if (req.timeout == null) {
        req.timeout = 32000;
      }
    }

    if (req.showSendingAfter == null) {
      req.showSendingAfter = 3000;
    }
    req.queueId = this._queueIdSeq++;
    if (req.headers == null) {
      req.headers = {};
    }
    req.headers['X-Trello-ReqId'] = this.uniqueReqId();

    req.oldSuccess = req.success;
    req.oldError = req.error;
    req.ourComplete = req.complete;
    delete req.complete;

    const { modelCache } = req;
    delete req.modelCache;

    const retry = req.retry != null ? req.retry : true;
    delete req.retry;

    let completed = false;
    let isUpload = false;

    const lockIndex =
      modelCache != null ? modelCache.lock('AjaxQueue.ajax') : undefined;

    req.success = function (...args) {
      AjaxQueue.hideSending();
      AjaxQueue.hideUploading();
      completed = true;
      AjaxQueue.success(this);
      if (typeof this.oldSuccess === 'function') {
        this.oldSuccess(...Array.from(args || []));
      }
      if (typeof this.ourComplete === 'function') {
        this.ourComplete();
      }
      return modelCache != null ? modelCache.unlock(lockIndex) : undefined;
    };

    req.error = function (...args) {
      AjaxQueue.hideSending();
      AjaxQueue.hideUploading();
      completed = true;
      const [xhr] = Array.from(args);
      if (retry && [0, 408, 500].includes(xhr.status)) {
        return AjaxQueue.retryableError(this);
        // For the moment, treat 412 just the same as other errors
        //else if xhr.status in [412]
        //  # We already sent this reqId, response must have been lost or server crashed
        //  AjaxQueue.serverAlreadySaw(@)
        //  @oldError?(args...)
      } else {
        const defaultErrorHandler = function () {
          AjaxQueue._stopped = true;
          return AjaxQueue.showRealError(...Array.from(args || []));
        };

        if (_.isFunction(this.oldError)) {
          this.oldError(...Array.from(args), defaultErrorHandler);
        } else {
          defaultErrorHandler();
        }

        if (typeof this.ourComplete === 'function') {
          this.ourComplete();
        }
        return modelCache != null ? modelCache.unlock(lockIndex) : undefined;
      }
    };

    if (/^post$/i.test(req.type)) {
      const isLongUpload = (evt) =>
        evt.lengthComputable && evt.total > 64 * 1024;

      req.xhr = () => {
        const xhr = new XMLHttpRequest();
        const { upload } = xhr;
        if (upload != null) {
          upload.addEventListener('progress', (evt) => {
            if (!isLongUpload(evt)) {
              return;
            }
            isUpload = true;

            const percentString =
              Math.round((100 * evt.loaded) / evt.total).toString() + '%';
            return this.showUploading(['uploading', { percentString }]);
          });

          upload.addEventListener('load', (evt) => {
            if (!isUpload) {
              return;
            }
            return this.showUploading('processing upload');
          });
        }

        return xhr;
      };
    }

    if (this.hasQueue()) {
      // We currently have a request in retry, so add this to the queue
      AjaxQueue.addToQueue(req);
    } else {
      // Nothing in the queue, so allow the parallel request
      if (req.showSendingAfter >= 0) {
        setTimeout(() => {
          if (!completed && !isUpload) {
            return AjaxQueue.showSending();
          }
        }, req.showSendingAfter);
      }
      this.send(req);
    }
  }

  send(req) {
    return $.ajax(req);
  }
})());
