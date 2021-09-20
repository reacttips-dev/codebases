/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const { l } = require('app/scripts/lib/localize');
const { ModelCache } = require('app/scripts/db/model-cache');
const ModelCacheListener = require('app/scripts/views/internal/model-cache-listener');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const t = require('app/scripts/views/internal/recup-with-helpers')('reactions');
const { trackUe } = require('@trello/analytics');
const Tooltip = require('app/scripts/views/lib/tooltip');
const { Emoji } = require('app/src/components/Emoji/Emoji');
const React = require('react');
const ReactionIcon = require('app/scripts/views/reactions/reaction-icon');
const ReactionSelector = require('app/scripts/views/reactions/reaction-selector');
const ReactionTooltip = require('app/scripts/views/reactions/reaction-tooltip');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const {
  shouldFireConfetti,
} = require('app/scripts/views/card/should-fire-confetti');
const confetti = require('canvas-confetti').default;
class ReactionPiles extends React.Component {
  static initClass() {
    this.prototype.displayName = 'ReactionPiles';

    this.prototype.render = t.renderable(function () {
      const { canReact, renderReactIconWithBorder } = this.props;

      const reactionPiles = this.mapReactionListToPiles();

      return t.div(
        '.reaction-piles',
        {
          class: t.classify({
            'reaction-piles-empty': !reactionPiles.length,
            disabled: !canReact,
          }),
        },
        () => {
          for (const { reaction, count, mine } of Array.from(reactionPiles)) {
            t.div(
              '.reaction-pile-item',
              {
                class: t.classify({ 'my-reaction': mine }),
                'data-reaction': reaction,
              },
              () => {
                t.addElement(
                  <Emoji
                    emoji={reaction}
                    onClick={this.handleEmojiClick}
                    onOver={this.handleEmojiOver}
                    onLeave={this.hideReactionTooltip}
                  />,
                );
                return t.span('.reaction-pile-count', function () {
                  return t.text(count > 99 ? '99+' : count);
                });
              },
            );
          }
          if (reactionPiles.length || renderReactIconWithBorder) {
            return this.renderReactIcon();
          } else {
            return this.renderInlineReactIcon();
          }
        },
      );
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      reactionSelectorOpen: false,
      reactionList: this.props.reactionList,
    };

    this.toggleReaction = this.toggleReaction.bind(this);
    this.showReactionTooltip = this.showReactionTooltip.bind(this);
    this.handleEmojiClick = this.handleEmojiClick.bind(this);
    this.handleEmojiOver = this.handleEmojiOver.bind(this);
    this.openReactionSelector = this.openReactionSelector.bind(this);
    this.renderInlineReactIcon = this.renderInlineReactIcon.bind(this);

    this._listen();
  }

  _listen() {
    this._alertEvent('uniqueReactionLimit', 'unique-reaction-limit-exceeded');
    this._alertEvent('totalReactionLimit', 'total-reaction-limit-exceeded');
    this._alertEvent('addReactionError', 'add-reaction-error');
    this._alertEvent('removeReactionError', 'remove-reaction-error');

    this.props.modelListener(
      this.props.reactionList,
      'add remove reset',
      () => {
        this.props.onReactionChanged && this.props.onReactionChanged();
        return this.setState({ reactionList: this.props.reactionList });
      },
    );

    return this.props.modelListener(
      this.props.reactionList,
      'add remove reset',
      () => {
        return this.setState({ reactionList: this.props.reactionList });
      },
    );
  }

  _alertEvent(eventName, message) {
    return this.props.modelListener(
      this.props.reactionList,
      eventName,
      (limit) => {
        const text = limit
          ? t.l(message, {
              number: limit.disableAt,
              heart: '❤',
            })
          : t.l(message);
        Alerts.showLiteralText(text, 'error', 'reaction-piles', 3000);
      },
    );
  }

  trackWithData(verb, dirObj, prepObj, indObj, method) {
    const { category } = this.props.trackingContext;
    const actionData = JSON.stringify(
      _.omit(this.props.trackingContext, 'category'),
    );

    return trackUe(category, verb, dirObj, prepObj, indObj, method, actionData);
  }

  toggleReaction(emoji, e) {
    Util.stop(e);

    if (!this.props.canReact) {
      return;
    }

    const trackFn = (isAdded) => {
      if (isAdded) {
        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'reaction',
          source: 'reactionSelectorInlineDialog',
          containers: {
            card: {
              id: this.props?.trackingContext?.cardId,
            },
            list: {
              id: this.props?.trackingContext?.listId,
            },
            board: {
              id: this.props?.trackingContext?.boardId,
            },
          },
          attributes: {
            addedTo: 'comment',
            fromPile: true,
          },
        });
      } else {
        Analytics.sendTrackEvent({
          action: 'removed',
          actionSubject: 'reaction',
          source: 'reactionSelectorInlineDialog',
          containers: {
            card: {
              id: this.props?.trackingContext?.cardId,
            },
            list: {
              id: this.props?.trackingContext?.listId,
            },
            board: {
              id: this.props?.trackingContext?.boardId,
            },
          },
          attributes: {
            removedFrom: 'comment',
            fromPile: true,
          },
        });
      }

      const method = 'by clicking the pile';
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

      if (!this.props.reactionList.findMyReaction(idEmoji)) {
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

    return this.props.reactionList.toggleReaction(
      this.props.actionId,
      emoji,
      trackFn,
    );
  }

  showReactionTooltip(emoji, e) {
    const $btn = $(e.currentTarget);
    const reaction = emoji.colons;

    let currentUserReacted = false;
    // Get all the reactions for the current hover
    let names = this.props.reactionList
      .chain()
      .filter((model) => model.toEmojiMart().colons === reaction)
      .omit(function (testReaction) {
        const isCurrentUser = testReaction.get('idMember') === Auth.myId();
        if (isCurrentUser) {
          currentUserReacted = true;
        }
        return isCurrentUser;
      })
      .map((testReaction) =>
        ModelCache.get('Member', testReaction.get('idMember'))?.get('fullName'),
      )
      .compact()
      .value();

    if (currentUserReacted) {
      names = [l('You'), ...Array.from(names)];
    }

    const tooltipHtml = new ReactionTooltip({ names, reaction });

    return Tooltip.show(tooltipHtml, $btn, false, Tooltip.STYLE.MENU);
  }

  hideReactionTooltip() {
    return Tooltip.hide();
  }

  mapReactionListToPiles() {
    return this.props.reactionList
      .chain()
      .groupBy((reaction) => reaction.toEmojiMart().colons)
      .pairs()
      .map(function (...args) {
        const [emoji, entries] = Array.from(args[0]);
        return {
          reaction: emoji,
          count: entries.length,
          mine: _.any(
            entries,
            (reaction) => reaction.get('idMember') === Auth.myId(),
          ),
        };
      })
      .value();
  }

  handleEmojiClick(emoji, e) {
    this.hideReactionTooltip();
    this.toggleReaction(emoji, e);
    return this.props.onEmojiClick && this.props.onEmojiClick(emoji, e);
  }

  handleEmojiOver(emoji, e) {
    this.showReactionTooltip(emoji, e);
    return this.props.onEmojiOver && this.props.onEmojiOver(emoji, e);
  }

  openReactionSelector(e) {
    this.shouldSuppressTracking = false;
    const $currentTarget = $(e.currentTarget);
    Util.stop(e);

    this.setState({ reactionSelectorOpen: true });

    const method = `by clicking the picker button ${
      $currentTarget.parents('.inline-add-reaction').length > 0
        ? 'inline'
        : 'next to reactions'
    }`;

    if (this.state.reactionSelectorOpen) {
      this.shouldSuppressTracking = true;
      PopOver.popView();
      this.setState({ reactionSelectorOpen: false });
      if (this.sendGASEvent) {
        Analytics.sendClosedComponentEvent({
          componentType: 'inlineDialog',
          componentName: 'reactionSelectorInlineDialog',
          source: 'cardDetailScreen',
          attributes: {
            method: 'clicked picker button',
          },
          containers: {
            card: {
              id: this.props?.trackingContext?.cardId,
            },
            list: {
              id: this.props?.trackingContext?.listId,
            },
            board: {
              id: this.props?.trackingContext?.boardId,
            },
          },
        });
      }
      this.trackWithData('closes', 'reaction selector', '', '', method);
      return;
    }

    if (this.sendGASEvent) {
      Analytics.sendScreenEvent({
        name: 'reactionSelectorInlineDialog',
        containers: {
          card: {
            id: this.props?.trackingContext?.cardId,
          },
          list: {
            id: this.props?.trackingContext?.listId,
          },
          board: {
            id: this.props?.trackingContext?.boardId,
          },
        },
      });
    }
    this.trackWithData('opens', 'reaction selector', '', '', method);

    const reactionSelectorSettings = {
      actionId: this.props.actionId,
      reactionList: this.props.reactionList,
      trackingContext: this.props.trackingContext,
      onReactionClick: (event, emoji) => {
        Util.stop(event);
        this.shouldSuppressTracking = true;
        this.setState({ reactionSelectorOpen: false });
        return PopOver.popView();
      },
    };

    return PopOver.show({
      elem: $(e.currentTarget),
      hideHeader: true,
      displayType: 'mod-reaction-selector',
      view: new ReactionSelector(reactionSelectorSettings),
      showImmediately: true,
      hidden: () => {
        return _.defer(() => {
          this.setState({ reactionSelectorOpen: false });
          if (!this.shouldSuppressTracking) {
            if (this.sendGASEvent) {
              Analytics.sendClosedComponentEvent({
                componentType: 'inlineDialog',
                componentName: 'reactionSelectorInlineDialog',
                source: 'cardDetailScreen',
                attributes: {
                  method: 'clicked outside the inline dialog',
                },
                containers: {
                  card: {
                    id: this.props?.trackingContext?.cardId,
                  },
                  list: {
                    id: this.props?.trackingContext?.listId,
                  },
                  board: {
                    id: this.props?.trackingContext?.boardId,
                  },
                },
              });
            }
            return this.trackWithData(
              'closes',
              'reaction selector',
              '',
              '',
              'by clicking outside',
            );
          }
        });
      },
    });
  }

  renderReactIcon() {
    return t.div('.reaction-pile-selector', () => {
      return t.createElement(ReactionIcon, {
        disabled: !this.props.canReact,
        withBorder: true,
        onClick: this.openReactionSelector,
        active: this.state.reactionSelectorOpen,
      });
    });
  }

  renderInlineReactIcon() {
    return t.span('.inline-add-reaction.meta-add-reaction.quiet', () => {
      return t.createElement(ReactionIcon, {
        disabled: !this.props.canReact,
        withBorder: false,
        onClick: this.openReactionSelector,
        active: this.state.reactionSelectorOpen,
      });
    });
  }
}
ReactionPiles.initClass();

module.exports = ModelCacheListener(ReactionPiles);
