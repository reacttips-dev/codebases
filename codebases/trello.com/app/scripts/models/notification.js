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
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { Urls } = require('app/scripts/controller/urls');
const {
  getCardUrl,
  getCardUrlWithoutModels,
  getEnterpriseAdminDashboardUrl,
  getOrganizationUrl,
  getBoardUrl,
} = Urls;
const {
  ReactionList,
} = require('app/scripts/models/collections/reaction-list');
const {
  DisplayEntityMixin,
} = require('app/scripts/models/internal/display-entity-mixin');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const xtend = require('xtend');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Notification extends TrelloModel {
  static initClass() {
    this.PAGE_SIZE = 10;
    this.prototype.typeName = 'Notification';
    this.prototype.urlRoot = '/1/notifications';
  }

  initialize() {
    return (this.reactionList = new ReactionList([]).syncCache(
      this.modelCache,
      [],
      (reaction) => {
        // Sometimes @get('idAction') is being called on a model that has already
        // been deleted (when a reaction has been added to an already read
        // notification, which is deleted and created anew to maintain the
        // correct order in the notification pane). This doesn't cause any
        // problems for the user, but does throw errors in the console.
        try {
          return reaction.get('idModel') === this.get('idAction');
        } catch (err) {
          return;
        }
      },
    ));
  }

  static sortedByDateDescending(modelCache) {
    return _.sortBy(
      modelCache.all('Notification'),
      (notification) => -new Date(notification.get('date')).getTime(),
    );
  }

  getModel() {
    return this.collection.options.model;
  }

  getBoard() {
    let idBoard;
    if (
      (idBoard = __guard__(
        __guard__(this.get('data'), (x1) => x1.board),
        (x) => x.id,
      )) != null
    ) {
      return this.modelCache.get('Board', idBoard);
    } else {
      return null;
    }
  }

  getCard() {
    let idCard;
    if (
      (idCard = __guard__(
        __guard__(this.get('data'), (x1) => x1.card),
        (x) => x.id,
      )) != null
    ) {
      return this.modelCache.get('Card', idCard);
    } else {
      return null;
    }
  }

  getMember() {
    return __guard__(
      this.modelCache.get('Member', this.get('idMemberCreator')),
      (x) => x.toJSON(),
    );
  }

  getMemberReactorsFullNames() {
    return this.reactionList
      .chain()
      .map((model) => model.get('idMember'))
      .flatten()
      .unique()
      .map((id) => this.modelCache.get('Member', id).get('fullName'))
      .value();
  }

  triggerCacheEvents(modelCache, event) {
    for (const idModel of Array.from(this.idModels())) {
      modelCache.trigger(`${event}:${this.typeName}:${idModel}`);
    }
  }

  idModels() {
    return (() => {
      let left;
      const result = [];
      const object = (left = this.get('data')) != null ? left : {};
      for (const key in object) {
        const value = object[key];
        if ((value != null ? value.id : undefined) != null) {
          result.push(value.id);
        }
      }
      return result;
    })();
  }

  isCommentLike() {
    let needle;
    return (
      ((needle = this.get('type')),
      ['commentCard', 'copyCommentCard', 'mentionedOnCard'].includes(needle)) ||
      (this.get('type') === 'reactionAdded' &&
        this.get('data')['actionType'] === 'commentCard')
    );
  }

  isAddAttachment() {
    return this.get('type') === 'addAttachmentToCard';
  }

  getExpandedData() {
    let left;
    const data = xtend((left = this.toJSON().data) != null ? left : {}, {
      date: this.get('date'),
      dateRead: this.get('dateRead'),
      unread: this.get('unread'),
    });

    data[this.get('type')] = true;

    return data;
  }

  markRead() {
    return this.update({ unread: false });
  }

  toggleRead() {
    return this.update({ unread: !this.get('unread') });
  }

  shouldScrollToHash() {
    // the types of notifications that should append the action hash
    return this.isCommentLike();
  }

  shouldGenerateActionLink() {
    let needle;
    return (
      this.shouldScrollToHash() ||
      ((needle = this.get('type')),
      [
        'changeCard',
        'createdCard',
        'addAttachmentToCard',
        'addedToCard',
        'removedFromCard',
        'cardDueSoon',
      ].includes(needle))
    );
  }

  getActionHash() {
    if (this.get('idAction') && this.shouldScrollToHash()) {
      const prefix = this.isCommentLike() ? 'comment' : 'action';
      return [prefix, this.get('idAction')].join('-');
    }
  }

  getCardShortUrl() {
    const card = __guard__(this.get('data'), (x) => x.card);
    return `/c/${card.shortLink}/${card.idShort}-${Util.makeSlug(card.name)}`;
  }

  getActionLink() {
    if (this.shouldGenerateActionLink()) {
      const actionHash = this.getActionHash();
      if (__guard__(this.getCard(), (x) => x.get('url'))) {
        return getCardUrl(this.getCard(), actionHash);
      } else if (
        this.get('data') != null &&
        __guard__(this.get('data'), (x1) => x1.card) != null
      ) {
        return [this.getCardShortUrl(), actionHash].join('#');
      }
    }
  }

  getUrlOfTarget() {
    const data = this.get('data');
    if (
      data.enterprise != null &&
      Auth.me().isEnterpriseAdminOf(data.enterprise)
    ) {
      return getEnterpriseAdminDashboardUrl(data.enterprise.id);
    } else if (data.card != null) {
      return getCardUrlWithoutModels(
        data.board.id,
        data.card.id,
        data.card.name,
      );
    } else if (data.board != null) {
      return getBoardUrl(data.board);
    } else if (data.organization != null) {
      // use org.id since name has funky capitalization issues
      return getOrganizationUrl(data.organization.id);
    }
  }
}
Notification.initClass();

_.extend(Notification.prototype, DisplayEntityMixin);

module.exports.Notification = Notification;
