/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
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
let Dialog;
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const Layout = require('app/scripts/views/lib/layout');
const PluginModal = require('app/scripts/views/lib/plugin-modal');
const { SidebarState } = require('app/scripts/view-models/sidebar-state');
const {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const { WindowSize } = require('app/scripts/lib/window-size');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const {
  ELEVATION_ATTR,
  registerClickOutsideHandler,
  unregisterClickOutsideHandler,
} = require('@trello/layer-manager');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const { featureFlagClient } = require('@trello/feature-flag-client');

// Modal
module.exports = Dialog = new ((function () {
  let $body = undefined;
  let $overlay = undefined;
  let $dialog = undefined;
  let $content = undefined;
  let fnOnHide = undefined;
  const Cls = class {
    constructor() {
      this.onShortcut = this.onShortcut.bind(this);
    }

    static initClass() {
      $body = null;
      $overlay = null;
      $dialog = null;
      $content = null;
      fnOnHide = null;
    }

    onShortcut() {
      this.hide();
    }

    init() {
      $body = $('body');
      $overlay = $('.window-overlay');
      $dialog = $('.window');
      $content = $dialog.find('.window-wrapper');
      $content.addClass('js-tab-parent');

      this.scrolltop = 0;
      this.isVisible = false;
      this.displayType = null;
      this.lastScroll = 0;
      this.hardToClose = true;

      // Keeps the dialog from closing by clicking outside of it.
      // See doc-init.js
      this.harderToClose = false;

      $overlay.on('scroll mousedown keydown', (e) => {
        return (this.lastScroll = Date.now());
      });

      $dialog.on('scroll', () => {
        return typeof this.onScrollInner === 'function'
          ? this.onScrollInner()
          : undefined;
      });

      this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClickOutside(event) {
      // We aren't interested in this event if the dialog is not visible
      if (!this.isVisible) {
        return;
      }

      if (featureFlagClient.get('teamplates.web.loom-integration', false)) {
        // temporarily check if we're clicking in the loom shadow dom
        if (event?.target?.id === 'loom-sdk-record-overlay-shadow-root-id') {
          return;
        }
      }

      return this.hide();
    }

    scrolledSince(ms) {
      return this.lastScroll > ms;
    }

    calcPos(maxWidth) {
      // if the dialog is visible
      // set the left position, position off the page
      // if not visible
      // set the top and left position

      // For small window size, change width to 'auto'
      // For other window sizes, use maxWidth or reset to ''
      let cssWidth;
      if (WindowSize.fSmall) {
        cssWidth = 'auto';
      } else if (maxWidth != null) {
        cssWidth = maxWidth;
      } else if (this._lastArgs != null) {
        cssWidth = this._lastArgs.maxWidth;
      }

      $dialog.css({
        width: cssWidth || '',
      });

      if (!Dialog.isVisible) {
        $dialog.show();
      }
    }

    show(args) {
      this._lastArgs = args;

      // It's possible that we're already showing another dialog, if so we need
      // to hide that one first so it'll let go of its shortcuts
      if (this.isVisible) {
        this.hide(args.isNavigating);
      }

      // hide / clear / reset stuff
      Layout.cancelEdits();
      PluginModal.close();
      SidebarState.hideUnpinnedSidebar();

      fnOnHide = args.hide;

      if (args.onScrollInner != null) {
        this.onScrollInner = args.onScrollInner;
      }

      this.scrolltop = $(window).scrollTop();

      $body.addClass('window-up');

      __guard__(currentModelManager.getCurrentBoard(), (x) =>
        x.composer.save('vis', false),
      );

      $body
        .find('.js-disable-on-dialog:not([disabled])')
        .addClass('disabled-for-dialog')
        .attr('disabled', 'disabled');

      if (args.hardToClose != null) {
        this.hardToClose = args.hardToClose;
      }

      // Set harderToClose arg or reset
      this.harderToClose = args.harderToClose || false;

      // special display types before adding to the DOM.
      if (args.displayType != null) {
        $dialog.addClass(args.displayType);
        this.displayType = args.displayType;
        this.overlayClasses = _.chain(args.displayType.split(' '))
          .map((c) => `${c}-overlay`)
          .join(' ')
          .value();
        $overlay.addClass(this.overlayClasses);
      }

      if (args.opacity != null) {
        $overlay.css('background-color', `rgba(0, 0, 0, ${args.opacity})`);
      }

      // add the close button
      $content
        .empty()
        .append(
          templates.fill(
            require('app/scripts/views/templates/dialog_close_button'),
          ),
        );

      // if we've been given a maxWidth, pass it to calcPos
      if (args.maxWidth != null) {
        this.calcPos(args.maxWidth);
      } else {
        this.calcPos('');
      }

      // Dialogs don't have a 'trigger' that we can increment our elevation from,
      // they are effectively stand-alone (they might be rendered due to a route for example).
      // Setting a hard coded elevation of '1' ensures any popovers _inside_ the dialog
      // will correctly increment their elevation to '2' in addition to allowing them to work
      // with the click outside handler.
      // We also want to ensure this elevation attribute is set _before_ we render our content,
      // so that any elements inside it can increment their elevation correctly
      $content.attr(ELEVATION_ATTR, 1);

      if (args.view) {
        this.view = args.view;

        $content.append(this.view.el);
        this.view.render();

        // NOTE: This is tricky.  If we don't explicitly call delegateEvents
        // here, then when jQuery replaced the existing content, it may have
        // removed our previous view.el from the DOM ... and if it did that
        // then all the events attached by the built-in call to delegateEvents
        // will be lost.  We restore them by calling view.delegateEvents() again
        this.view.delegateEvents();
      } else if (args.html) {
        this.view = null;
        $content.append(args.html);
      } else if (args.reactElement) {
        if (!React.isValidElement(args.reactElement)) {
          throw new Error('Dialog args.reactElement has to be a react element');
        }

        this.dr = true;
        ReactDOM.render(args.reactElement, $content[0]);
      }

      this.isVisible = true;
      this.lastScroll = 0;

      _.defer(() => {
        $dialog.css({
          height: 100000,
        });
        $overlay.scrollTop(1);
        $overlay.scrollTop(0);
        return $dialog.css({
          height: '',
        });
      });

      $dialog.find('.js-autofocus:first,.focus-dummy').focus().select();

      // events
      $dialog.find('input[type=submit]').click(function (ev) {
        Util.preventDefault(ev);
      });

      $dialog.find('.js-close-window').click(function (e) {
        if (args.onClose) {
          args.onClose();
        }
        Util.stop(e);
        Dialog.hide(null, true);
      });

      registerShortcut(this.onShortcut, {
        scope: Scope.Dialog,
        key: Key.Escape,
      });

      registerClickOutsideHandler($content[0], this.handleClickOutside);
    }

    // If isNavigating is true, then we're being hidden
    // because the user is navigating to a new page (not
    // because they clicked outside the dialog or on the
    // close button)
    hide(isNavigating = false, force = false, closePopup = false) {
      if (
        (!this.isVisible ||
          Layout.isEditing() ||
          $('.new-comment').hasClass('focus')) &&
        !force &&
        !isNavigating
      ) {
        return;
      }

      this._lastArgs = null;

      if (typeof fnOnHide === 'function') {
        fnOnHide(isNavigating);
      }
      fnOnHide = null;

      // remove special classes
      $overlay.removeClass(this.overlayClasses);
      $dialog.removeClass(this.displayType);
      this.displayType = null;

      // reset opacity
      $overlay.css('background-color', '');

      if (this.view != null) {
        this.view.remove();
        this.view = null;
      }

      if (this.dr != null) {
        ReactDOM.unmountComponentAtNode($content[0]);
        this.dr = null;
      }

      unregisterShortcut(this.onShortcut);
      $content.removeAttr(ELEVATION_ATTR);
      unregisterClickOutsideHandler($content[0], this.handleClickOutside);

      $dialog.hide();

      $body.removeClass('window-up');

      _.defer(() => {
        $(window).scrollTop(this.scrolltop);
        return (this.scrolltop = 0);
      });

      this.isVisible = false;

      $('.disabled-for-dialog').removeAttr('disabled');

      $body.trigger('dialog-hide', { closePopup });

      this.clear();
    }

    clear() {
      $content.width('');
      $content.empty();
    }

    contains(elem) {
      return $dialog.find(elem).length > 0;
    }
  };
  Cls.initClass();
  return Cls;
})())();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
