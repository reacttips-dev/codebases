// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Browser = require('@trello/browser');
const { getKey, isArrow, Key } = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');

// Mixin
const AutoInsertionView = {
  checkInsert(e) {
    const key = getKey(e);

    if (PopOver.isVisible && !Browser.isTouch()) {
      if (
        (e.shiftKey && [Key.ArrowUp, Key.ArrowDown].includes(key)) ||
        (e.altKey && [Key.ArrowUp, Key.ArrowDown].includes(key))
      ) {
        return;
      } else if (key === Key.Escape) {
        Util.stop(e);
        PopOver.hide();
        return;
      } else {
        const autoCompleters = [
          {
            listClass: '.js-available-members',
            itemClass: '.js-select-member',
          },
          { listClass: '.js-available-emoji', itemClass: '.js-select-emoji' },
          { listClass: '.js-card-list', itemClass: '.js-select-card' },
        ];

        for (const { listClass, itemClass } of Array.from(autoCompleters)) {
          let $available = $('.pop-over').find(listClass);
          if ($available.length > 0) {
            if ([Key.Enter, Key.Tab].includes(key)) {
              Util.stop(e);
              // Make sure we've updated the list with everything we've typed
              if ($available.find('.item:first').hasClass('selected')) {
                this.keyAutoMention(e);
                // This might cause the list to re-write, so we have to get the
                // items back out of the DOM
                $available = $('.pop-over').find(listClass);
              }

              $available
                .find(`.item.selected:first ${itemClass}`)
                .first()
                .click();

              PopOver.hide();
              return false;
            } else if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
              Util.stop(e);
              Util.navMenuList($available, '.item', key);
              return false;
            }
          }
        }
      }
    }
  },

  keyAutoMention(e) {
    if (!Browser.isTouch()) {
      if (isArrow(getKey(e)) || getKey(e) === Key.Enter) {
        return;
      }

      if (getKey(e) === Key.Escape) {
        if (PopOver.isVisible) {
          Util.stop(e);
        }
        return;
      }

      const word = Util.getWordFromCaret(this.getTextInput());

      if (new RegExp(`^@\\S`).test(word.str.substring(0, 2))) {
        // Because the function that determines who to show is
        // locked up in the view, we need to load the view first
        // to determine if there is anything to show in the popover.
        // We won't show it if there isn't anybody that matches.

        return this.getAutoMentionerView('input').then((view) => {
          if (
            view.filterMentionablesForMatches(
              word.str.substring(1).toLowerCase(),
            ).length === 0
          ) {
            PopOver.hide();
            return;
          }

          PopOver.show({
            elem: this.getMentionTarget(),
            view,
            keepEdits: true,
          });

          if (!this.getTextInput().is(':focus')) {
            this.getTextInput().focus();
          }
        });
      } else if (/^:[a-z0-9_]+$/.test(word.str)) {
        const emojiView = this.getEmojiCompleterView('input');

        PopOver.show({
          elem: this.getEmojiTarget(),
          view: emojiView,
          keepEdits: true,
        });

        if (!this.getTextInput().is(':focus')) {
          this.getTextInput().focus();
        }
        return;
      }

      return this.setTimeout(() => PopOver.hide(), 5);
    }
  },
};

module.exports = AutoInsertionView;
