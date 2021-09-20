/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const View = require('app/scripts/views/internal/view');
const { trackUe } = require('@trello/analytics');
const _ = require('underscore');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const TrelloEmojiPicker = require('app/scripts/views/emoji/trello-emoji-picker');
const { Analytics } = require('@trello/atlassian-analytics');
const {
  shouldFireConfetti,
} = require('app/scripts/views/card/should-fire-confetti');
const confetti = require('canvas-confetti').default;

module.exports = class ReactionSelector extends View {
  constructor(props) {
    super(props);
    this.trackWithData = this.trackWithData.bind(this);
    this.handleReactionClick = this.handleReactionClick.bind(this);
  }

  render() {
    // render the picker within the popover we selected for it
    ReactDOM.render(this.getEmojiPicker(), this.$el[0]);
    this.trackReactionClickEvents();
    return this;
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.$el[0]);
    return super.remove(...arguments);
  }

  trackWithData(verb, dirObj, prepObj, indObj, method) {
    const { category } = this.options.trackingContext;
    const actionData = JSON.stringify(
      _.omit(this.options.trackingContext, 'category'),
    );

    return trackUe(category, verb, dirObj, prepObj, indObj, method, actionData);
  }

  trackReactionClickEvents() {
    // Using these events to handle emoji mart click tracking events until
    // necessary PRs can be put into place for event handlers
    const selectors =
      '.emoji-mart, .emoji-mart-anchor, .emoji-mart-skin-swatch-selected, .emoji-mart-skin-swatches-opened .emoji-mart-skin';
    $(document)
      .off('click', selectors)
      .on('click', selectors, (e) => {
        e.stopPropagation();
        const $currentTarget = $(e.currentTarget);
        const isCategorySelector = $currentTarget.is('.emoji-mart-anchor');

        const target = (() => {
          if (isCategorySelector) {
            return 'reaction selector category button';
          } else if ($currentTarget.is('.emoji-mart-skin-swatch')) {
            return 'reaction selector skin tone button';
          } else if ($currentTarget.is('.emoji-mart-skin')) {
            return 'reaction selector skin tone menu';
          }
        })();
        if (!target) {
          return;
        }
        const method = `by clicking the ${target}`;

        const dirObj = isCategorySelector
          ? 'reaction selector category'
          : 'reaction selector skin tone menu';

        const prepObj = isCategorySelector
          ? $currentTarget.attr('title')
          : $currentTarget.is('.emoji-mart-skin')
          ? `skin-tone-${$currentTarget.data('skin')}`
          : '';

        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'icon',
          actionSubjectId: 'reactionMenuIcon',
          source: 'reactionSelectorInlineDialog',
          attributes: {
            target,
          },
          containers: {
            card: {
              id: this.options?.trackingContext?.cardId,
            },
            board: {
              id: this.options?.trackingContext?.boardId,
            },
            list: {
              id: this.options?.trackingContext?.listId,
            },
          },
        });

        return this.trackWithData('opens', dirObj, prepObj, '', method);
      });
    return $(document).on(
      'input',
      '.emoji-mart-search input',
      _.debounce((e) => {
        e.stopPropagation();
        Analytics.sendTrackEvent({
          action: 'searched',
          actionSubject: 'reaction',
          source: 'reactionSelectorInlineDialog',
          containers: {
            card: {
              id: this.options?.trackingContext?.cardId,
            },
            board: {
              id: this.options?.trackingContext?.boardId,
            },
            list: {
              id: this.options?.trackingContext?.listId,
            },
          },
        });
        return this.trackWithData(
          'searches',
          'reaction selector',
          '',
          'for emoji',
          'by typing in the reaction selector search box',
        );
      }, 1000),
    );
  }

  handleReactionClick(emoji, e) {
    const trackFn = (isAdded) => {
      if (isAdded) {
        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'reaction',
          source: 'reactionSelectorInlineDialog',
          containers: {
            card: {
              id: this.options?.trackingContext?.cardId,
            },
            list: {
              id: this.options?.trackingContext?.listId,
            },
            board: {
              id: this.options?.trackingContext?.boardId,
            },
          },
          attributes: {
            addedTo: 'comment',
            emoji: emoji.id,
            fromPile: false,
          },
        }); // reactions/reaction-piles.js
      } else {
        Analytics.sendTrackEvent({
          action: 'removed',
          actionSubject: 'reaction',
          source: 'reactionSelectorInlineDialog',
          containers: {
            card: {
              id: this.options?.trackingContext?.cardId,
            },
            list: {
              id: this.options?.trackingContext?.listId,
            },
            board: {
              id: this.options?.trackingContext?.boardId,
            },
          },
          attributes: {
            removedFrom: 'comment',
            emoji: emoji.id,
            fromPile: false,
          },
        }); // reactions/reaction-piles.js
      }

      const method = 'by picking a reaction';
      return this.trackWithData(
        isAdded ? 'adds' : 'removes',
        'reaction',
        emoji.id,
        isAdded ? 'to a comment' : 'from a comment',
        method,
      );
    };

    if (shouldFireConfetti(emoji.native)) {
      const idEmoji = emoji.unified.toUpperCase();

      if (!this.options.reactionList.findMyReaction(idEmoji)) {
        confetti({
          angle: _.random(55, 125),
          spread: _.random(50, 70),
          particleCount: _.random(40, 75),
          origin: {
            x: e.pageX / window.innerWidth,
            y: e.pageY / window.innerHeight,
          },
        });
      }
    }

    this.options.reactionList.toggleReaction(
      this.options.actionId,
      emoji,
      trackFn,
    );
    return (
      this.options.onReactionClick && this.options.onReactionClick(e, emoji)
    );
  }

  getEmojiPicker() {
    return <TrelloEmojiPicker onClick={this.handleReactionClick} />;
  }

  willBePopped() {
    $('.js-open-reactions').removeClass('active');
    $(document).off(
      'click',
      '.emoji-mart, .emoji-mart-anchor, .emoji-mart-skin-swatch-selected, .emoji-mart-skin-swatches-opened .emoji-mart-skin',
    );
    return $(document).off('input', '.emoji-mart-search input');
  }
};
