/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');

let lazyDefaults = undefined;
let makeOpts = undefined;

class Confirm extends View {
  static initClass() {
    // We don't want to evaluate a key that's
    // explicitly specified, because it might
    // require interpolation, or it might not
    // even exist. Look, these lines line up!
    lazyDefaults = function (original, defaults) {
      const target = _.clone(original);
      for (const key of Object.keys(defaults || {})) {
        const valueFunction = defaults[key];
        if (!(key in target)) {
          target[key] = valueFunction();
        }
      }
      return target;
    };

    makeOpts = function (key, oldOpts) {
      const opts = lazyDefaults(oldOpts, {
        title() {
          return l(['confirm', key, 'title'], oldOpts.templateData);
        },
        // We are currently assuming that translations are safe HTML
        html() {
          return l(['confirm', key, 'text'], oldOpts.templateData);
        },
        confirmText() {
          return l(['confirm', key, 'confirm'], oldOpts.templateData);
        },
      });

      if ('fxCancel' in opts && !('cancelText' in opts)) {
        opts.cancelText = l(['confirm', key, 'cancel'], oldOpts.templateData);
      }

      return opts;
    };

    this.prototype._events = {
      'click .js-confirm': 'confirm',
      'click .js-cancel': 'cancel',
    };
  }

  constructor({
    model,
    text,
    html,
    elem,
    top,
    confirmText,
    confirmBtnClass,
    confirmBtnTestId,
    cancelText,
    title,
    template,
    templateData,
    data,
    fxConfirm,
    fxCancel,
    popOnClick,
    popDepth,
    maxWidth,
  }) {
    super(...arguments);
    this.model = model;
    this.elem = elem;
    this.top = top;
    this.title = title;
    this.template = template;
    this.templateData = templateData;
    this.popOnClick = popOnClick;
    this.popDepth = popDepth;
    if (this.template == null) {
      this.template = require('app/scripts/views/templates/confirm');
    }
    if (confirmBtnTestId == null) {
      confirmBtnTestId = '';
    }
    this.confirm = this._handleClick(fxConfirm);
    this.cancel = fxCancel ? this._handleClick(fxCancel) : function () {};
    this.data = _.extend(
      {
        text,
        html,
        confirmText,
        confirmBtnClass,
        confirmBtnTestId,
        cancelText,
      },
      data != null ? data : {},
    );
    if (this.templateData == null) {
      this.templateData = {};
    }
    this.maxWidth = maxWidth;

    this.delegateEvents(this._events);
  }

  static toggle(key, opts) {
    if (arguments.length === 1) {
      opts = key;
    } else {
      opts = makeOpts(key, opts);
    }

    return PopOver.toggle({
      elem: opts.elem,
      top: opts.top,
      alignRight: opts.alignRight,
      view: this,
      options: opts,
    });
  }

  static pushView(key, opts) {
    if (arguments.length === 1) {
      opts = key;
    } else {
      opts = makeOpts(key, opts);
    }

    return PopOver.pushView({
      view: this,
      options: opts,
    });
  }

  getViewTitle() {
    return this.title;
  }

  render() {
    this.$el.html(
      templates.fill(
        this.template,
        this.data,
        {},
        { member: templates.member },
      ),
    );
    setTimeout((e) => {
      this.$el.find('.js-confirm').focus();
      return 0;
    });
    return this;
  }

  _handleClick(fx) {
    return (e) => {
      Util.stop(e);

      if (this.popOnClick) {
        PopOver.popView(this.popDepth);
      } else {
        PopOver.hide();
      }

      if (typeof fx === 'function') {
        fx(e);
      }
      this.remove();
      return false;
    };
  }
}

Confirm.initClass();
module.exports = Confirm;
