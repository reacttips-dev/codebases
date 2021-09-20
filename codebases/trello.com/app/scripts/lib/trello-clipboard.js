/* eslint-disable
    eqeqeq,
    no-empty,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('@trello/backbone');
const { TrelloStorage } = require('@trello/storage');
const { dataUriToBlob } = require('app/scripts/lib/util/url/data-uri-to-blob');
const {
  getTypes,
} = require('app/scripts/views/internal/data-transfer/normalize');
const {
  selectElementContents,
} = require('app/scripts/lib/util/selection/select-element-contents');
const { getKey, Key } = require('@trello/keybindings');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');

const showClipboardAlert = function (eventType) {
  Alerts.show('card-copied-to-clipboard', 'info', 'trello-clipboard', 5000);

  const me = Auth.me();
  // Only show the instructional alert if they haven't completed a copy/move via pasting.
  if (me && !me.isDismissed(`pasteAlert-${eventType}Card`)) {
    // Set a timeout to let the initial Flag resolve animations first.
    setTimeout(() => {
      Alerts.show(
        `paste-to-${eventType}`,
        'info',
        'trello-clipboard-paste',
        5000,
      );
    }, 2000);
  }
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class TrelloClipboard {
  constructor() {
    this.value = '';
    this.isPaused = false;

    $(document).on('keydown', (e) => {
      if (this.isPaused) return;
      const key = getKey(e);

      // Only do this if there's something to be put on the clipboard, and it
      // looks like they're starting a copy shortcut
      if (!this.value || !(e.ctrlKey || e.metaKey)) {
        return;
      }

      if ($(e.target).is('#clipboard')) {
        if (key === Key.c) {
          // If a new copy happens, they haven't cut anymore
          this.clearCut();

          showClipboardAlert('copy');
        }
        return;
      }

      if ($(e.target).is('input:visible,textarea:visible')) {
        return;
      }

      // Abort if it looks like they've selected some text (maybe they're trying
      // to copy out a bit of the description or something)
      if (
        __guard__(
          typeof window.getSelection === 'function'
            ? window.getSelection()
            : undefined,
          (x) => x.toString(),
        )
      ) {
        return;
      }

      if (
        document.selection != null
          ? document.selection.createRange().text
          : undefined
      ) {
        return;
      }

      return _.defer(() => {
        const $clipboardContainer = $('#clipboard-container');
        $clipboardContainer.empty().show();
        $('<div id="clipboard" contenteditable="true"></div>')
          .text(this.value)
          .appendTo($clipboardContainer)
          .focus()
          .select();
        return selectElementContents(document.getElementById('clipboard'));
      });
    });

    $(document).on('keyup', (e) => {
      if (this.isPaused) return;
      if (this.isClipboard(e.target)) {
        const newValue = $('#clipboard').text();
        if (newValue === '') {
          // They must have used the cut shortcut
          this.setCut(this.value);
          showClipboardAlert('move');
        }
      }

      return this.checkForPastedImage();
    });

    $(document).on('paste', (e) => {
      if (this.isPaused) return;
      if (!_.isEmpty(getTypes(e.originalEvent.clipboardData))) {
        this.cancelPasteImage();
      }
      // If they pasted something, they aren't cutting anymore ... but let
      // all the other paste handlers run first, so they can check isCut()
      return (this.clearCutTimeout = setTimeout(
        this.clearCut.bind(this),
        1000,
      ));
    });
  }

  set(value) {
    this.value = value;
    const $clipboard = $('#clipboard');
    if ($clipboard.length) {
      $clipboard.text(this.value).focus().select();
      return selectElementContents(document.getElementById('clipboard'));
    }
  }

  setCut(value) {
    try {
      if (this.clearCutTimeout != null) {
        clearTimeout(this.clearCutTimeout);
        this.clearCutTimeout = null;
      }
      TrelloStorage.set('cut', value);
    } catch (error) {}
  }

  getCut() {
    try {
      return TrelloStorage.get('cut');
    } catch (error) {}
    return null;
  }

  clearCut() {
    try {
      TrelloStorage.unset('cut');
      this.clearCutTimeout = null;
    } catch (error) {}
  }

  isCut(value) {
    return value === this.getCut();
  }

  isClipboard(element) {
    return element.id === 'clipboard';
  }

  clear() {
    return $('#clipboard-container').empty().hide();
  }

  checkForPastedImage() {
    clearTimeout(this.pasteImageTimeout);

    // We have to yield so the image actually shows up in the clipboard
    return (this.pasteImageTimeout = setTimeout(() => {
      const $pastedImage = $('#clipboard-container').find('img');
      this.clear();
      if ($pastedImage.length > 0) {
        const src = $pastedImage.attr('src');
        // Firefox helpfully uses data: URIs that we can work with, unlike
        // Safari which is currently using useless the "fake-webkit-url"
        // protocol
        if (/^data:/.test(src)) {
          this.trigger('pasteImage', dataUriToBlob(src));
          return;
        }
      }
    }, 1));
  }

  cancelPasteImage() {
    clearTimeout(this.pasteImageTimeout);
    return this.clear();
  }

  pauseShortcuts() {
    this.isPaused = true;
  }

  resumeShortcuts() {
    this.isPaused = false;
  }
}

_.extend(TrelloClipboard.prototype, Backbone.Events);

module.exports.trelloClipboard = new TrelloClipboard();
