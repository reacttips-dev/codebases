/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Dialog = require('app/scripts/views/lib/dialog');
const {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} = require('@trello/keybindings');
const PluginModalView = require('app/scripts/views/plugin/plugin-modal-view');
const { SidebarState } = require('app/scripts/view-models/sidebar-state');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  registerClickOutsideHandler,
  unregisterClickOutsideHandler,
  ELEVATION_ATTR,
  getHighestVisibleElevation,
} = require('@trello/layer-manager');

module.exports = new ((function () {
  const Cls = class {
    constructor() {
      this.onShortcut = this.onShortcut.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    static initClass() {
      this.modalView = null;
    }

    onShortcut() {
      this.close();
    }

    handleClickOutside() {
      return this.close();
    }

    isOpen() {
      return this.modalView != null;
    }

    update(content) {
      if (this.modalView == null) {
        if (typeof console !== 'undefined' && console !== null) {
          console.warn('Warning: No modal open');
        }
        return;
      } else if (content.idPlugin !== this.modalView.content.idPlugin) {
        if (typeof console !== 'undefined' && console !== null) {
          console.warn('Can not update modal you did not open');
        }
        return;
      }

      return this.modalView.update(content);
    }

    open(args) {
      const { model, content } = args;

      PopOver.hide();
      SidebarState.hideUnpinnedSidebar();
      if (Dialog.isVisible) {
        Dialog.hide(true);
      }

      this.close();

      this.modalView = new PluginModalView({
        model,
        content,
        fxClose: this.close.bind(this),
      });

      $('.pop-over').before(this.modalView.render().el);

      registerShortcut(this.onShortcut, {
        scope: Scope.Dialog,
        key: Key.Escape,
      });

      // Register an 'outside click' handler that takes elevations into account and increment the elevation
      // of the modal
      const $chromeContent = $('.js-plugin-chrome-content');
      const elevation = getHighestVisibleElevation() + 1;
      $chromeContent.attr(ELEVATION_ATTR, elevation);
      registerClickOutsideHandler($chromeContent[0], this.handleClickOutside);
    }

    close() {
      if (this.isOpen()) {
        unregisterShortcut(this.onShortcut);

        // Unregister the click outside handler and clear the elevation attribute
        const $chromeContent = $('.js-plugin-chrome-content');
        $chromeContent.removeAttr(ELEVATION_ATTR);
        unregisterClickOutsideHandler(
          $chromeContent[0],
          this.handleClickOutside,
        );

        this.modalView.close();
        this.modalView = null;
      }
    }
  };
  Cls.initClass();
  return Cls;
})())();
