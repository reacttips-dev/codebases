/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
    no-unreachable,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS202: Simplify dynamic range loops
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Action } = require('app/scripts/models/action');
const {
  actionFilterFromString,
} = require('app/scripts/lib/util/action-filter-from-string');
const { ActionHistory } = require('@trello/action-history');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { ApiError } = require('app/scripts/network/api-error');
const {
  AttachmentList,
} = require('app/scripts/models/collections/attachment-list');
const { ArchivableMixin } = require('app/scripts/lib/archivable-mixin');
const { Auth } = require('app/scripts/db/auth');
const { Urls } = require('app/scripts/controller/urls');
const { getCardUrl } = Urls;
const {
  CustomFieldItemList,
} = require('app/scripts/models/collections/custom-field-item-list');
const { Dates } = require('app/scripts/lib/dates');
const { idCache } = require('@trello/shortlinks');
const { LabelList } = require('app/scripts/models/collections/label-list');
const { LabelsHelper } = require('app/scripts/models/internal/labels-helper');
const LimitExceeded = require('app/scripts/views/attachment/attachment-limit-exceeded-error');
const TypeRestricted = require('app/scripts/views/attachment/attachment-type-restricted-error');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const { List } = require('app/scripts/models/list');
const { MemberState } = require('app/scripts/view-models/member-state');
const Payloads = require('app/scripts/network/payloads').default;
const {
  PluginDataList,
} = require('app/scripts/models/collections/plugin-data-list');
const Promise = require('bluebird');
const { StickerList } = require('app/scripts/models/collections/sticker-list');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const moment = require('moment');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const xtend = require('xtend');
const { siteDomain } = require('@trello/config');
const { featureFlagClient } = require('@trello/feature-flag-client');

let EDITING_AUTO_CLEAR_MS = undefined;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Card extends TrelloModel {
  static initClass() {
    EDITING_AUTO_CLEAR_MS = 10000;

    this.prototype.typeName = 'Card';
    this.prototype.urlRoot = '/1/cards';

    this.lazy({
      memberList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList().syncModel(this, 'idMembers');
      },
      labelList() {
        return new LabelList()
          .syncModel(this, 'idLabels')
          .syncCache(this.modelCache, [], (label) => {
            let left, needle;
            return (
              (needle = label.id),
              Array.from(
                (left = this.get('idLabels')) != null ? left : [],
              ).includes(needle)
            );
          });
      },
      memberVotedList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList().syncModel(this, 'idMembersVoted');
      },
      checklistList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ChecklistList,
        } = require('app/scripts/models/collections/checklist-list');
        return new ChecklistList().syncCache(
          this.modelCache,
          ['idCard'],
          (checklist) => {
            return checklist.get('idCard') === this.id;
          },
        );
      },
      attachmentList() {
        return new AttachmentList().syncSubModels(this, 'attachments');
      },
      actionList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ActionList,
        } = require('app/scripts/models/collections/action-list');
        return new ActionList().syncCache(this.modelCache, [], (action) => {
          let needle;
          const isComment =
            ((needle = action.get('type')),
            ['commentCard', 'copyCommentCard'].includes(needle));
          const isSameBoard =
            __guard__(action.get('data').board, (x) => x.id) ===
            this.get('idBoard');
          return action.includesModel(this) && (isComment || isSameBoard);
        });
      },
      stickerList() {
        return new StickerList(this.get('stickers'), {
          card: this,
          modelCache: this.modelCache,
        }).syncSubModels(this, 'stickers');
      },
      customFieldItemList() {
        return new CustomFieldItemList().syncCache(
          this.modelCache,
          [],
          (cfi) => {
            return (
              cfi.get('idModel') === this.id && cfi.get('modelType') === 'card'
            );
          },
        );
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
        }).syncCache(this.modelCache, [], (pluginData) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'card'
          );
        });
      },
      memberEditingList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList();
      },
    });
  }

  constructor() {
    super(...arguments);
    this.editable = this.editable.bind(this);
    this.isObserver = this.isObserver.bind(this);
    this.isOnBoardTemplate = this.isOnBoardTemplate.bind(this);
  }

  initialize() {
    this.listenTo(this, 'change:id change:idBoard', () => {
      return this.actionList.sync();
    });

    this._initSubEventsOn('badges');
    return this.cacheShortLink();
  }

  isVisibleAction(action) {
    if (this._actionFilter == null) {
      this._actionFilter = actionFilterFromString(Payloads.cardActions);
    }
    return this._actionFilter(action);
  }

  cacheShortLink() {
    return this.waitForAttrs(this, ['id', 'shortLink'], ({ id, shortLink }) =>
      idCache.setCardId(shortLink, id),
    );
  }

  updateEditing(member) {
    if (this._editingTimeout == null) {
      this._editingTimeout = {};
    }

    // This is a no-op if member is already in the list
    this.memberEditingList.add(member);

    if (this._editingTimeout[member.id] != null) {
      clearTimeout(this._editingTimeout[member.id]);
      delete this._editingTimeout[member.id];
    }

    return (this._editingTimeout[member.id] = this.setTimeout(() => {
      return this.memberEditingList.remove(member);
    }, EDITING_AUTO_CLEAR_MS));
  }

  sync(method, model, options) {
    if (
      method === 'create' &&
      !(this.get('idBoard') != null && this.get('idList') != null)
    ) {
      this.waitForAttrs(this, ['idBoard', 'idList'], (attrs) => {
        this.set(attrs);
        Card.prototype.__proto__.sync.call(this, method, model, options);
      });

      this.waitForId(this.getBoard(), (id) => this.set('idBoard', id));
      return this.waitForId(this.getList(), (id) => this.set('idList', id));
    } else {
      return super.sync(...arguments);
    }
  }

  set(key, options) {
    if (key != null ? key.labels : undefined) {
      key.labels = Array.from(key.labels).map((label) =>
        label.color != null ? label.color : label,
      );
    }

    if (key != null ? key.badges : undefined) {
      key.badges = xtend(this.get('badges'), key.badges);
    }

    return super.set(...arguments);
  }

  moveToList(listDest, index, keyboardMove) {
    if (keyboardMove == null) {
      keyboardMove = false;
    }
    const card = this;

    return this.waitForId(listDest, (idList) => {
      let composerIndex;
      const newPos = listDest.calcPos(index, card);
      const { composer } = listDest.getBoard();

      if (
        newPos === card.get('pos') &&
        card.get('idList') === idList &&
        card.isOpen()
      ) {
        // if we were not removing the card from the archive,
        // handle if we were just swapping the card with the composer
        composerIndex = composer.get('index');
        if (composerIndex === index) {
          composer.set('index', composerIndex + 1);
        } else if (composerIndex === index + 1) {
          composer.set('index', composerIndex - 1);
        }

        return;
      }

      const sourceIdList = card.get('idList');
      const sourceIndex = card.getIndexInList();

      const idBoard = listDest.getBoard().id;

      const delta = {
        pos: newPos,
        idList,
        idBoard,
        closed: false,
      };

      for (const key in delta) {
        const value = delta[key];
        if (card.get(key) === value) {
          delete delta[key];
        }
      }

      if (keyboardMove) {
        setTimeout(() => card.trigger('keyboardMove'));
      }

      const taskName = delta.idList ? 'edit-card/idList' : 'edit-card/pos';

      const traceId = Analytics.startTask({
        taskName,
        source: getScreenFromUrl(),
      });

      const cardsInTargetList = listDest.openCards().length;

      this.recordAction({
        type: 'move',
        idBoard,
        idList,
        position: (() => {
          switch (index) {
            case 0:
              if (cardsInTargetList > 0) {
                return 'top';
              } else {
                return index;
              }
            case cardsInTargetList:
              if (cardsInTargetList > 1) {
                return 'bottom';
              } else {
                return index;
              }
            case 1:
              if (cardsInTargetList > 1) {
                return 1;
              } else {
                return index;
              }
            default:
              return index;
          }
        })(),
        fromPosition: sourceIndex,
      });

      delta['traceId'] = traceId;
      card.update(delta, (err, data) => {
        if (err) {
          throw Analytics.taskFailed({
            taskName,
            traceId,
            source: getScreenFromUrl(),
            error: err,
          });
        } else {
          Analytics.sendUpdatedCardFieldEvent({
            field: delta.idList ? 'idList' : 'pos',
            source: getScreenFromUrl(),
            containers: {
              card: { id: data.id },
              board: { id: data.idBoard },
              list: { id: data.idList },
            },
            attributes: {
              taskId: traceId,
            },
          });
          Analytics.taskSucceeded({
            taskName,
            traceId,
            source: getScreenFromUrl(),
          });
        }
      });

      if (composer != null ? composer.get('vis') : undefined) {
        composerIndex = composer.get('index');

        if (
          composer.get('list').id === idList &&
          composer.get('index') >= index
        ) {
          // if we moved a card to above the composer, increment the position
          // note: we have no way to differentiate between moving a card to just
          // above/just below the composer, so assume above
          composerIndex++;
        }

        if (
          composer.get('list').id === sourceIdList &&
          composer.get('index') > sourceIndex
        ) {
          composerIndex--;
        }

        return composer.set('index', composerIndex);
      }
    });
  }
  moveToNextList(position) {
    const listList = this.getBoard().listList.models;
    const indexCurrentList = _.indexOf(listList, this.getList());
    if (indexCurrentList < listList.length - 1) {
      this.moveToList(
        listList[indexCurrentList + 1],
        position === 'top' ? 0 : 1e9,
        true,
      );
    }
  }

  moveToPrevList(position) {
    const listList = this.getBoard().listList.models;
    const indexCurrentList = _.indexOf(listList, this.getList());
    if (indexCurrentList > 0) {
      this.moveToList(
        listList[indexCurrentList - 1],
        position === 'top' ? 0 : 1e9,
        true,
      );
    }
  }

  toggleMemberWithTracing(idMember, opts, next) {
    const { traceId } = opts;
    let { isMember } = opts;

    if (typeof isMember === 'undefined' || isMember === null) {
      isMember = !this.hasMember(idMember);
    }
    const isMe = Auth.isMe(idMember);

    if (isMember && isMe) {
      this.set('subscribed', true);
    }

    this.recordAction({
      type: isMe
        ? isMember
          ? 'join'
          : 'leave'
        : isMember
        ? 'add-member'
        : 'remove-member',

      idMember,
    });

    return this.toggle('idMembers', idMember, isMember, { traceId }, next);
  }

  addMemberWithTracing(idMember, traceId, next) {
    return this.toggleMemberWithTracing(
      idMember,
      { isMember: true, traceId },
      next,
    );
  }

  removeMemberWithTracing(idMember, traceId, next) {
    return this.toggleMemberWithTracing(
      idMember,
      { isMember: false, traceId },
      next,
    );
  }

  toggleMember(idMember, ...rest) {
    const adjustedLength = Math.max(rest.length, 1),
      next = rest[adjustedLength - 1];
    let [isMember] = Array.from(rest.slice(0, adjustedLength - 1));
    if (typeof isMember === 'undefined' || isMember === null) {
      isMember = !this.hasMember(idMember);
    }
    const isMe = Auth.isMe(idMember);

    if (isMember && isMe) {
      this.set('subscribed', true);
    }

    this.recordAction({
      type: isMe
        ? isMember
          ? 'join'
          : 'leave'
        : isMember
        ? 'add-member'
        : 'remove-member',

      idMember,
    });

    return this.toggle('idMembers', idMember, isMember, next);
  }

  addMember(idMember, next) {
    return this.toggleMember(idMember, true, next);
  }
  removeMember(idMember, next) {
    return this.toggleMember(idMember, false, next);
  }

  hasMember(idMember) {
    return this.memberList.get(idMember);
  }

  toggleLabel(label, toggleOn) {
    if (toggleOn == null) {
      toggleOn = !this.hasLabel(label);
    }

    this.recordAction({
      type: toggleOn ? 'add-label' : 'remove-label',
      idLabel: label.id,
    });

    return this.toggle('idLabels', label.id, toggleOn);
  }

  getIdCardMems() {
    return _.map(this.memberList.models, (member) => member.id);
  }

  hasChecklist(idChecklist) {
    return this.checklistList.get(idChecklist);
  }

  close(traceId, next) {
    this.recordAction({ type: 'archive' });
    this.update({ closed: true, traceId }, next);
  }

  reopen(traceId, next) {
    const list = this.getList();

    if (list != null) {
      this.recordAction({ type: 'unarchive' });
      this.update(
        {
          closed: false,
          traceId,
        },
        next,
      );
    }
  }

  getBoard() {
    let left;
    if (this.modelCache == null) {
      // Not sure when a card loses its reference to the model cache, but since
      // this is the old architecture, it's not worth it to look too hard into
      // it. Since there's only one ModelCache in the entire app, we can just
      // require it again.
      //
      // Dependency required at call site to avoid import cycles, do not lift to top of module
      const { ModelCache } = require('app/scripts/db/model-cache');
      this.modelCache = ModelCache;
    }

    return (left = this.modelCache.get('Board', this.get('idBoard'))) != null
      ? left
      : __guard__(this.getList(), (x) => x.getBoard());
  }

  getIndexInList() {
    const list = this.getList();
    // It's possible that the list won't exist if we've only ever loaded the
    // card model
    if (list != null) {
      return _.indexOf(list.cardList.models, this);
    } else {
      return -1;
    }
  }

  getList() {
    let left;
    return (left = this.modelCache.get('List', this.get('idList'))) != null
      ? left
      : this.collection != null
      ? this.collection.owner
      : undefined;
  }

  getUrl() {
    return getCardUrl(this);
  }

  getFullUrl() {
    const cardRole = this.getCardRole();

    if (cardRole === 'link') {
      return this.get('name');
    }

    return `${siteDomain}${this.getUrl()}`;
  }

  getCardRole() {
    const cardRole = this.get('cardRole');

    if (
      cardRole === 'mirror' &&
      !featureFlagClient.get('wildcard.mirror-cards', false)
    ) {
      return null;
    } else if (
      cardRole === 'separator' &&
      !featureFlagClient.get('wildcard.card-types-separator', false)
    ) {
      return null;
    } else if (
      cardRole === 'link' &&
      !featureFlagClient.get('wildcard.link-cards', false)
    ) {
      return null;
    } else if (
      cardRole === 'board' &&
      !featureFlagClient.get('wildcard.board-cards', false)
    ) {
      return null;
    }

    return cardRole;
  }

  getDueDate() {
    if (__guard__(this.get('badges'), (x) => x.due)) {
      return new Date(this.get('badges').due);
    } else {
      return null;
    }
  }

  setDueDate(dueDate, next) {
    const previousDueDate = {
      due: __guard__(this.getDueDate(), (x) => x.getTime()) || null,
      dueReminder: this.get('dueReminder') || -1,
    };

    this.recordAction({
      type: 'set-due-date',
      dueDate,
      previousDueDate,
    });

    return this.update(dueDate, next);
  }

  editable() {
    return __guard__(this.getBoard(), (x) => x.editable());
  }
  isObserver() {
    const me = Auth.me();
    return __guard__(this.getBoard(), (x) => x.isObserver(me));
  }

  isOnBoardTemplate() {
    return __guard__(this.getBoard(), (x) => x.isTemplate());
  }

  canAttach() {
    return (
      (this.editable() || this.isObserver()) &&
      !this.isOverLimit('attachments', 'perCard') &&
      !this.getBoard().isOverLimit('attachments', 'perBoard')
    );
  }

  attachmentTypeRestricted(attachmentType) {
    return this.getBoard().attachmentTypeRestricted(attachmentType);
  }

  attachmentUrlRestricted(url) {
    return this.getBoard().attachmentUrlRestricted(url);
  }

  canDropAttachment(eventType) {
    return (
      (eventType === 'dd-enter:files' &&
        !this.attachmentTypeRestricted('computer')) ||
      (eventType === 'dd-enter:url' && !this.attachmentTypeRestricted('link'))
    );
  }

  // we always want this to be "the latest comment",
  // but we have to deal with our clock being out of
  // sync with the server, and our "now" actually
  // being "before" an existing comment.
  dateForNewComment() {
    if (this.actionList.length === 0) {
      return new Date();
    } else {
      const latestAction = this.actionList.sort().first();
      const afterLatest = moment(latestAction.getDate())
        .add(1, 'seconds')
        .toDate();
      return _.max([new Date(), afterLatest]);
    }
  }

  addComment(comment, traceId, tracingCallback) {
    const card = this;

    if (comment !== '') {
      return new Promise((resolve, reject) => {
        return this.waitForId(card, (idCard) => {
          const board = card.getBoard();
          const actionPlaceholder = new Action(
            {
              type: 'commentCard',
              date: this.dateForNewComment(),
              data: {
                text: comment,
                card: {
                  id: card.id,
                  name: card.get('name'),
                },
                board: {
                  id: board.id,
                  name: board.get('name'),
                },
                textData: {
                  emoji: Auth.me().allCustomEmoji(),
                },
              },
              idMemberCreator: Auth.myId(),
              display: {
                translationKey: 'action_comment_on_card',
                entities: {
                  card: {
                    hideIfContext: true,
                    id: card.id,
                    isContext: false,
                    shortLink: card.shortLink,
                    text: comment,
                    type: 'card',
                  },
                  comment: {
                    text: comment,
                    type: 'comment',
                  },
                  contextOn: {
                    hideIfContext: true,
                    idContext: card.id,
                    translationKey: 'action_on',
                    type: 'translatable',
                  },
                  memberCreator: {
                    id: Auth.myId(),
                    isContext: false,
                    text: Auth.me().get('fullName'),
                    type: 'member',
                    username: { text: Auth.me().get('fullName') },
                  },
                },
              },
            },
            { modelCache: this.modelCache },
          );

          const timeout = this.setTimeout(
            () => actionPlaceholder.takingTooLong(),
            2000,
          );

          return ApiAjax({
            url: `/1/cards/${card.id}/actions/comments`,
            type: 'post',
            data: {
              text: comment,
            },
            dataType: 'json',
            traceId,
            error: (xhr) => {
              clearTimeout(timeout);
              const errorMessage = ApiError.parseErrorMessage(xhr);
              const error = ApiError.fromResponse(xhr.status, errorMessage);
              tracingCallback(error);
              return reject(xhr);
            },
            success: (resp) => {
              resolve(actionPlaceholder);
              tracingCallback(null, resp);
              clearTimeout(timeout);
              actionPlaceholder.isTakingTooLong = false;
              return this.modelCache.enqueueDelta(actionPlaceholder, resp);
            },
          });
        });
      });
    }

    return Promise.resolve();
  }

  changeDueDateMaintainTime(targetDate, traceId, next) {
    let left;
    const oldDateData =
      (left = new Date(this.get('due'))) != null
        ? left
        : new Date().setHours(12, 0, 0, 0);
    const newDate = Dates.getDateWithSpecificTime(oldDateData, targetDate);
    return this.setDueDate(
      {
        due: newDate.getTime(),
        dueReminder: this.get('dueReminder') || -1,
        traceId,
      },
      next,
    );
  }

  vote(voteVal) {
    if (!this.getBoard().canVote(Auth.me())) {
      return;
    }

    // We have to do this locking business so we don't get the client state out of sync with the server
    return this.waitForLock('vote', (next) => {
      let left;
      if (voteVal === this.voted()) {
        return next();
      }

      // Unfortunately we have to mess with the badges to make sure
      // the vote takes effect immediately on the client side
      const badges = (left = _.clone(this.get('badges'))) != null ? left : {};

      if (voteVal) {
        badges.votes++;
        badges.viewingMemberVoted = true;
      } else {
        badges.votes--;
        badges.viewingMemberVoted = false;
      }
      this.set('badges', badges);

      this.toggle(
        'idMembersVoted',
        Auth.myId(),
        voteVal,
        { collectionName: 'membersVoted' },
        next,
      );
    });
  }

  voted() {
    let left;
    return (left = __guard__(
      this.get('badges'),
      (x) => x.viewingMemberVoted,
    )) != null
      ? left
      : false;
  }

  hasStickers() {
    return this.stickerList.length > 0;
  }

  hasCover() {
    const cover = this.get('cover');
    if (cover == null) {
      return false;
    }

    const {
      color,
      idAttachment,
      idUploadedBackground,
      idPlugin,
      scaled,
    } = cover;
    return (
      color != null ||
      ((idAttachment != null ||
        idUploadedBackground != null ||
        idPlugin != null) &&
        scaled != null)
    );
  }

  hasAttachmentCover() {
    return (
      this.get('idAttachmentCover') != null ||
      __guard__(this.get('cover'), (x) => x.idAttachment) != null
    );
  }

  getAllAgingClasses() {
    return 'aging-level-0 aging-level-1 aging-level-2 aging-level-3 aging-pirate aging-regular';
  }

  getAgingData() {
    const board = this.getBoard();
    const timeInactive = Date.now() - new Date(this.get('dateLastActivity'));

    const data = {
      level: (() => {
        switch (false) {
          case !(timeInactive < Util.getMs({ days: 7 })):
            return 0;
          case !(timeInactive < Util.getMs({ days: 14 })):
            return 1;
          case !(timeInactive < Util.getMs({ days: 28 })):
            return 2;
          default:
            return 3;
        }
      })(),
      mode: board.get('prefs').cardAging,
    };

    data.agingClassesToAdd = `aging-level-${data.level} aging-${data.mode}`;
    if (/64$/.test(this.id)) {
      data.agingClassesToAdd += ' aging-treasure';
    }

    return data;
  }

  toggleVote() {
    this.vote(!this.voted());
  }

  subscribe(subscribed, next) {
    if (subscribed === this.get('subscribed')) {
      return;
    }

    const badges = this.get('badges') || {};
    badges.subscribed = subscribed;

    this.update({ subscribed }, next);
  }

  subscribeWithTracing(subscribed, traceId, next) {
    if (subscribed === this.get('subscribed')) {
      return;
    }

    const badges = this.get('badges') || {};
    badges.subscribed = subscribed;

    this.update({ subscribed, traceId }, next);
  }

  isSubscribed() {
    return _.some([
      this.get('subscribed'),
      __guard__(this.get('badges'), (x) => x.subscribed),
      __guard__(this.getBoard(), (x1) => x1.get('subscribed')),
      __guard__(this.getList(), (x2) => x2.get('subscribed')),
    ]);
  }

  getCheckItem(idCheckItem) {
    for (
      let i = 0, end = this.checklistList.length - 1, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      const checklist = this.checklistList.at(i);
      const checkItem = __guard__(
        checklist != null ? checklist.checkItemList : undefined,
        (x) => x.get(idCheckItem),
      );
      if (checkItem) {
        return checkItem;
      }
    }

    return null;
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.url) {
      data.url = getCardUrl(this);
    }

    return data;
  }

  upload(file, name, { traceId = null }, next) {
    let idOrganization;
    const fd = new FormData();
    fd.append('token', Auth.myToken());
    if (name != null) {
      fd.append('file', file, name);
    } else {
      // Firefox 22 will call the file "undefined" if you have an undefined
      // value as the 3rd parameter
      fd.append('file', file);
    }
    ApiAjax({
      traceId,
      url: `/1/cards/${this.id}/attachments`,
      data: fd,
      type: 'post',
      processData: false,
      contentType: false,
      retry: false,
      error: (xhr, textStatus, error, fxDefault) => {
        const { status, responseJSON } = xhr;
        if (
          this._isTooManyAttachments(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(LimitExceeded());
        } else if (
          this._isAttachmentTypeRestricted(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(TypeRestricted());
        } else if ([0, 413].includes(status)) {
          const errorMessage = ApiError.parseErrorMessage(xhr);
          return next(ApiError.fromResponse(status, errorMessage));
        } else {
          // Default is to retry
          return fxDefault();
        }
      },
      success: (attachment) => {
        let left;
        this.set('attachments', [
          attachment,
          ...Array.from((left = this.get('attachments')) != null ? left : []),
        ]);

        return next(null, attachment);
      },
      timeout: Util.getMs({ hours: 6 }),
    }); // Gold lets you upload 250MB attachments

    if (
      (idOrganization = __guard__(this.getBoard(), (x) =>
        x.get('idOrganization'),
      )) != null
    ) {
      if ((file != null ? file.size : undefined) >= 10 * 1024 * 1024) {
        return Analytics.sendTrackEvent({
          action: 'uploaded',
          actionSubject: 'attachment',
          containers: {
            card: {
              id: this.id,
            },
            list: {
              id: this.get('idList'),
            },
            board: {
              id: this.get('idBoard'),
            },
            organization: {
              id: idOrganization,
            },
          },
          source: 'boardScreen',
          attributes: {
            isBCFeature: true,
            requiredBC: true,
          },
        });
      }
    }
  }

  uploadUrl(data, next) {
    if (next == null) {
      next = function () {};
    }
    if (_.isString(data)) {
      data = { url: data };
    }

    return ApiAjax({
      url: `/1/cards/${this.id}/attachments`,
      type: 'post',
      data,
      error: ({ status, responseJSON }, textStatus, error, fxDefault) => {
        if (
          this._isTooManyAttachments(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(LimitExceeded());
        } else if (
          this._isAttachmentTypeRestricted(
            status,
            responseJSON != null ? responseJSON.error : undefined,
          )
        ) {
          return next(TypeRestricted());
        } else {
          return next(textStatus);
        }
      },
      success: (attachment) => {
        let left;
        this.set('attachments', [
          attachment,
          ...Array.from((left = this.get('attachments')) != null ? left : []),
        ]);
        return next(null, attachment);
      },
    });
  }

  removeCover(attachment, traceId, next) {
    return this.update({ idAttachmentCover: '', traceId }, next);
  }

  makeCover(attachment, traceId, next) {
    return this.update({ idAttachmentCover: attachment.id, traceId }, next);
  }

  async setPluginCover({ idPlugin, url, file }) {
    const formData = new FormData();
    formData.set('idPlugin', idPlugin);
    formData.set('token', Auth.myToken());
    if (url) {
      formData.set('url', url);
    } else if (file) {
      formData.set('file', file);
    }

    const request = new Promise((resolve, reject) => {
      ApiAjax({
        url: `/1/cards/${this.id}/pluginCover`,
        data: formData,
        type: 'post',
        processData: false,
        contentType: false,
        retry: false,
        error: ({ status, responseJSON }, statusText) => {
          reject({ status, statusText });
        },
        success: (pluginCover) => {
          resolve(pluginCover);
        },
        timeout: Util.getMs({ minutes: 2 }),
      });
    });

    try {
      const pluginCover = await request;
      return pluginCover;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  calcChecklistPos(index, checklist) {
    return Util.calcPos(index, this.checklistList, checklist);
  }

  calcAttachmentPos(index, attachment) {
    // if one `pos` is null, they all are!
    // TODO gerard remove this code after the server backfills attachment positions
    if (attachment.get('pos') === null) {
      this.attachmentList.models.forEach(function (attachment, i) {
        const pos = (i + 1) * 16384;
        return attachment.update('pos', pos);
      });
    }

    // We need to do this since the server considers higher positions to be
    // more recent by default. Since we sort from most recent to least recent
    // by default, that means we're sorting from higher `pos` to lower `pos`.
    // Thus, our position calculation needs to be reversed
    const reversedIndex = this.attachmentList.length - index - 1;
    return Util.calcPos(reversedIndex, this.attachmentList, attachment);
  }

  _isTooManyAttachments(status, error) {
    return (
      status === 403 &&
      (error === 'CARD_TOO_MANY_ATTACHMENTS' ||
        error === 'BOARD_TOO_MANY_ATTACHMENTS')
    );
  }

  _isAttachmentTypeRestricted(status, error) {
    return status === 403 && error === 'CARD_ATTACHMENT_TYPE_RESTRICTED';
  }

  _neighbor(delta) {
    const cards = this.getList().openCards();
    const { filter } = this.getBoard();
    let cardIndex = cards.indexOf(this);
    if (cardIndex >= 0) {
      cardIndex += delta;
      while (
        cards.at(cardIndex) != null &&
        !filter.satisfiesFilter(cards.at(cardIndex))
      ) {
        cardIndex += delta;
      }

      return cards.at(cardIndex);
    } else {
      return null;
    }
  }

  prevCard() {
    return this._neighbor(-1);
  }
  nextCard() {
    return this._neighbor(1);
  }

  // For the LabelsHelper mixin
  labelCreateUrl() {
    return `/1/card/${this.id}/labels/`;
  }

  copyTo({ name, idList, pos, keepFromSource, traceId }) {
    if (name == null) {
      name = this.get('name');
    }

    return List.load(idList, Payloads.listMinimal, this.modelCache).then(
      (list) => {
        return ninvoke(
          list.cardList,
          'createWithTracing',
          { name, pos },
          {
            traceId,
            createData: {
              idCardSource: this.id,
              keepFromSource,
            },
          },
        );
      },
    );
  }

  setPluginData(idPlugin, visibility, data) {
    return this.pluginDataList.upsert(idPlugin, visibility, data);
  }

  setPluginDataByKey(idPlugin, visibility, key, val) {
    return this.pluginDataList.setPluginDataByKey(
      idPlugin,
      visibility,
      key,
      val,
    );
  }

  getPluginData(idPlugin) {
    return this.pluginDataList.dataForPlugin(idPlugin);
  }

  getPluginDataByKey(idPlugin, visibility, key, defaultVal) {
    return this.pluginDataList.getPluginDataByKey(
      idPlugin,
      visibility,
      key,
      defaultVal,
    );
  }

  snoopPluginData(idPlugin) {
    return this.pluginDataList.snoopDataForPlugin(idPlugin);
  }

  getAgeMs() {
    if (this.id) {
      return Date.now() - new Date(Util.idToDate(this.id));
    } else {
      return 0;
    }
  }

  getIdMemberCreator() {
    const createAction = this.actionList.find(function (action) {
      let needle;
      return (
        (needle = action.get('type')),
        ['createCard', 'copyCard'].includes(needle)
      );
    });

    return createAction != null
      ? createAction.get('idMemberCreator')
      : undefined;
  }

  getDates() {
    if (!this.getBoard().isCustomFieldsEnabled()) {
      return [];
    }
    return this.customFieldItemList.filter(
      (cfi) =>
        __guard__(cfi.getCustomField(), (x) => x.get('type')) === 'date' &&
        !cfi.isEmpty(),
    );
  }

  shouldSuggestDescription() {
    // Determine if the user probably wants to edit the description of the card
    // We guess they'd want that if it's a card that they created recently and
    // there isn't any discussion on it yet
    const idMe = Auth.myId();

    return (
      !this.get('desc') &&
      this.editable() &&
      this.getAgeMs() < Util.getMs({ minutes: 5 }) &&
      !(__guard__(this.get('badges'), (x) => x.comments) > 0) &&
      (this.actionList.length === 0 || this.getIdMemberCreator() === idMe)
    );
  }

  isVisible() {
    return this.isOpen() && __guard__(this.getList(), (x) => x.isOpen());
  }

  getCustomFieldItem(idCustomField) {
    return this.customFieldItemList.find(
      (cfi) => cfi.get('idCustomField') === idCustomField,
    );
  }

  recordAction(action) {
    return ActionHistory.append(action, this.actionContext());
  }

  actionContext() {
    return {
      idCard: this.get('id'),
      idList: this.get('idList'),
      idBoard: this.get('idBoard'),
      idLabels: this.get('idLabels'),
      idMembers: this.get('idMembers'),
    };
  }

  markAssociatedNotificationsRead() {
    if (!Auth.isLoggedIn()) {
      return;
    }
    return ApiAjax({
      url: `${this.urlRoot}/${this.id}/markAssociatedNotificationsRead`,
      type: 'post',
      background: true,
    });
  }

  isValidSuggestion(suggestion) {
    let allLabels, label, targetList, otherMember, checklist;
    if (MemberState.get('showSuggestions') === false) {
      return false;
    }

    if (!Auth.isLoggedIn()) {
      return false;
    }

    const board = this.getBoard();
    const me = Auth.me();

    if (!board.hasActiveMembership(me)) {
      return false;
    }

    switch (suggestion.type) {
      case 'join':
        return !this.hasMember(me.id) && board.memberList.length > 1;

      case 'add-label':
        allLabels = board.labelList;
        label = allLabels.get(suggestion.idLabel);
        return label && !this.hasLabel(label);

      case 'move':
        targetList = board.listList.get(suggestion.idList);
        return (
          targetList != null &&
          !targetList.get('closed') &&
          suggestion.idList !== this.get('idList')
        );

      case 'add-member':
        otherMember = this.modelCache.get('Member', suggestion.idMember);
        return (
          otherMember != null &&
          !this.hasMember(otherMember.id) &&
          board.hasActiveMembership(otherMember)
        );

      case 'add-checklist':
        checklist = this.modelCache.get(
          'Checklist',
          suggestion.idChecklistSource,
        );
        return (
          checklist != null &&
          checklist.get('idBoard') === this.get('idBoard') &&
          !this.checklistList.any(
            (checklist) => checklist.get('name') === suggestion.name,
          )
        );

      default:
        return false;
    }
  }

  deleteWithTracing(traceId, next) {
    this.recordAction({ type: 'delete' });
    this.destroyWithTracing({ traceId }, next);
  }

  delete() {
    this.recordAction({ type: 'delete' });
    this.destroy();
  }

  trackProperty() {
    return [
      `[Template:${this.get('isTemplate')}]`,
      `[Closed:${this.get('closed')}]`,
    ].join(' ');
  }

  removeLocation(traceId, next) {
    return this.update(
      {
        traceId,
        coordinates: null,
        locationName: null,
        address: null,
        staticMapUrl: null,
      },
      (err, response) => next(err, response),
    );
  }

  getAnalyticsContainers() {
    const board = this.getBoard();
    return {
      card: { id: this.id },
      list: { id: this.get('idList') },
      board: { id: this.get('idBoard') },
      organization: {
        id: board != null ? board.get('idOrganization') : undefined,
      },
      enterprise: {
        id: board != null ? board.get('idEnterprise') : undefined,
      },
    };
  }
}
Card.initClass();

_.extend(Card.prototype, LabelsHelper, ArchivableMixin, LimitMixin);

module.exports.Card = Card;
