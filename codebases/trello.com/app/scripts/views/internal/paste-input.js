/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { trelloClipboard } = require('app/scripts/lib/trello-clipboard');
const _ = require('underscore');
const {
  getPasted,
} = require('app/scripts/views/internal/data-transfer/normalize');
const { triggerList } = require('app/scripts/lib/util/event/trigger-list');

module.exports = new ((function () {
  const Cls = class {
    static initClass() {
      this.prototype.precedence = {
        list: 4,
        card: 5,
        dialog: 10,
      };
    }
    constructor() {
      this.paste = this.paste.bind(this);
      this._handlers = {};

      $(document).on('paste', this.paste);
      trelloClipboard.on('pasteImage', (image) => {
        return this.triggerPasted('files', [image]);
      });
    }

    addHandler(target, { scope, precedence }) {
      if (precedence == null) {
        precedence = this.precedence[scope];
      }
      if (precedence == null) {
        precedence = this.precedence.default;
      }

      if (this._handlers[scope] == null) {
        this._handlers[scope] = {};
      }
      this._handlers[scope] = {
        target,
        scope,
        precedence,
      };
    }

    removeHandler(target) {
      return (() => {
        const result = [];
        for (const scope in this._handlers) {
          const { target: hTarget } = this._handlers[scope];
          if (target === hTarget) {
            result.push(delete this._handlers[scope]);
          }
        }
        return result;
      })();
    }

    _sortedHandlers() {
      return _.sortBy(_.values(this._handlers), (h) => -h.precedence);
    }

    paste(e) {
      getPasted(e.originalEvent).then((pasted) => {
        if (_.isEmpty(pasted)) {
          return;
        }

        if (
          (pasted.text || pasted.url) &&
          ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
        ) {
          // If they're pasting text into an input of some kind, just let the
          // default handling happen … unless it's the trello clipboard trying to
          // intercept the paste, in which case it's okay to handle it
          if (!trelloClipboard.isClipboard(e.target)) {
            return;
          }
        }

        // Some applications (like PowerPoint and OneNote) will put several
        // different types on the clipboard when you copy. If there is some text,
        // assume they want that (and not a picture of the text).
        for (const type of ['url', 'text', 'files']) {
          if (pasted[type]) {
            this.triggerPasted(type, pasted[type]);
            break;
          }
        }
      });
    }

    triggerPasted(type, detail) {
      const elements = _.compact(
        this._sortedHandlers().map((handler) =>
          handler.target != null ? handler.target.el : undefined,
        ),
      );
      return triggerList(elements, `pasteinput:${type}`, { detail });
    }
  };
  Cls.initClass();
  return Cls;
})())();
