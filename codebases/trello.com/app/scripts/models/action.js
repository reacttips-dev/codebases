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
const {
  getAppCreatorModelForApplication,
} = require('app/common/lib/util/app-creator');
const { Auth } = require('app/scripts/db/auth');
const { Dates } = require('app/scripts/lib/dates');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const {
  DisplayEntityMixin,
} = require('app/scripts/models/internal/display-entity-mixin');
const {
  ReactionList,
} = require('app/scripts/models/collections/reaction-list');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const _ = require('underscore');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Action extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Action';
    this.prototype.urlRoot = '/1/actions';
  }

  initialize() {
    return (this.reactionList = new ReactionList([]).syncCache(
      this.modelCache,
      [],
      (reaction) => {
        return reaction.get('idModel') === this.id;
      },
    ));
  }

  getModel() {
    return this.collection.options.model;
  }

  triggerCacheEvents(modelCache, event) {
    for (const idModel of Array.from(this.idModels())) {
      modelCache.trigger(`${event}:${this.typeName}:${idModel}`);
    }
  }

  isCommentLike() {
    let needle;
    return (
      (needle = this.get('type')),
      ['commentCard', 'copyCommentCard'].includes(needle)
    );
  }

  isAddAttachment() {
    return this.get('type') === 'addAttachmentToCard';
  }

  isMember(member) {
    return this.get('idMemberCreator') === member.id;
  }

  getDate() {
    return Dates.parse(this.get('date'));
  }

  getBoard() {
    return this.modelCache.get(
      'Board',
      __guard__(
        __guard__(this.get('data'), (x1) => x1.board),
        (x) => x.id,
      ),
    );
  }

  getCard() {
    return this.modelCache.get(
      'Card',
      __guard__(
        __guard__(this.get('data'), (x1) => x1.card),
        (x) => x.id,
      ),
    );
  }

  getChecklist() {
    return this.modelCache.get(
      'Checklist',
      __guard__(
        __guard__(this.get('data'), (x1) => x1.checklist),
        (x) => x.id,
      ),
    );
  }

  getAppCreator() {
    const appCreator = this.get('appCreator');
    if (appCreator?.id && appCreator?.name) {
      return {
        id: appCreator.id,
        name: appCreator.name,
        ...(getAppCreatorModelForApplication(appCreator.id) || {}),
      };
    }
  }

  editable() {
    // We can edit an action if it's a comment and it belongs to us
    let needle;
    const idMemberCreator = this.get('idMemberCreator');

    return (
      ((needle = this.get('type')), ['commentCard'].includes(needle)) &&
      Auth.isMe(idMemberCreator)
    );
  }

  deletable() {
    let board, needle;
    const idMemberCreator = this.get('idMemberCreator');

    // We can delete an action if ...

    // - It's a comment
    return (
      ((needle = this.get('type')), ['commentCard'].includes(needle)) &&
      // - It belongs to us
      (Auth.isMe(idMemberCreator) ||
        // - It's associated with a board
        ((board = this.getBoard()) != null &&
          // - We have a higher permission level than the person who created it
          board.compareMemberType(
            Auth.me(),
            this.modelCache.get('Member', idMemberCreator),
            { mode: 'commentDelete' },
          ) > 0 &&
          // - We aren't trying to delete a premium organization admin's comment
          !(
            !board.isPremOrgAdmin(Auth.me()) &&
            board.isPremOrgAdmin(idMemberCreator)
          )))
    );
  }

  isPlaceholder() {
    return this.get('date') == null;
  }

  includesModel(model) {
    const modelType = model.typeName.toLowerCase();
    const idModel = model.id;

    // Models that have been created locally but haven't been returned from
    // the server won't have an id yet
    if (!idModel) {
      return false;
    }

    if (modelType === 'member' && this.get('idMemberCreator') === idModel) {
      return true;
    }

    const data = this.get('data');

    // Although this isn't expressed in the API, the idModels array for these
    // actions in the DB contains both the source and destination card, which
    // means that they're returned via the API response, which means that if
    // you *don't* have this check the action paging count gets all screwy.
    if (
      this.get('type') === 'convertToCardFromCheckItem' &&
      data.cardSource.id === idModel
    ) {
      return true;
    }

    return (
      (data[modelType] != null ? data[modelType].id : undefined) === idModel
    );
  }

  idModels() {
    const idModels = (() => {
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
    const idMemberCreator = this.get('idMemberCreator');
    if (idMemberCreator != null) {
      idModels.push(idMemberCreator);
    }
    return idModels;
  }

  takingTooLong() {
    this.isTakingTooLong = true;
    return this.trigger('takingTooLong');
  }

  // We are assuming here that if you can comment
  // you should also be able to react to something
  canReact() {
    const me = Auth.me();
    return __guard__(this.getBoard(), (x) => x.canComment(me));
  }

  isOverUniqueReactionsCapacity() {
    return this.isOverLimit('reactions', 'uniquePerAction');
  }

  isOverTotalReactionsCapacity() {
    return this.isOverLimit('reactions', 'perAction');
  }
}
Action.initClass();

_.extend(Action.prototype, DisplayEntityMixin, LimitMixin);

module.exports.Action = Action;
