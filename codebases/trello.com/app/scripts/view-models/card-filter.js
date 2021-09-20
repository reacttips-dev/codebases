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
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { Label } = require('app/scripts/models/label');
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const {
  satisfiesFilter,
  getWords,
  ID_NONE,
  NO_LABELS,
} = require('app/common/lib/util/satisfies-filter');

const { featureFlagClient } = require('@trello/feature-flag-client');
const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

const isBoardHeaderFilterEnabled = featureFlagClient.get(
  'ecosystem.board-header-filter',
  false,
);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.CardFilter = class CardFilter extends LocalStorageModel {
  constructor(board, options) {
    super(null, options);
    this.board = board;
    this.waitForId(this.board, (idBoard) => {
      const idMe = Auth.myId();
      this.set({ id: `boardCardFilterSettings-${idBoard}-${idMe}` });
      this.fetch();
      return this._resetNewCards();
    });

    this.dueMap = {
      day: 1,
      week: 7,
      month: 28,
      overdue: 0,
      notdue: 0,
      complete: 0,
      incomplete: 0,
    };

    this.modeMap = {
      or: 'or',
      and: 'and',
    };

    this.newCardsWithoutIds = [];

    this.listenTo(
      this,
      'change:title change:idLabels change:idMembers change:due',
      this.debounce(this._resetNewCards),
    );
  }

  default() {
    return {
      idMembers: [],
      idLabels: [],
      title: null,
      due: null,
      limitMembers: true,
      limitLabels: true,
      newCards: [],
      mode: 'or',
    };
  }

  clear() {
    return this.save(this.default());
  }

  getBoard() {
    return this.board;
  }

  _resetNewCards() {
    this.newCardsWithoutIds = [];
    return this.save('newCards', []);
  }

  toggleQuietMode() {
    const idMe = Auth.myId();
    if (idMe == null) {
      return;
    }

    // Quiet Mode is the defaults, except that idMembers is set to you only
    const quietState = this.default();
    quietState.idMembers = [idMe];

    let isInQuietMode = true;
    for (const key in quietState) {
      // We don't have to worry about array ordering; all the arrays we're checking are
      // empty or contain one element
      const value = quietState[key];
      if (isInQuietMode) {
        isInQuietMode = _.isEqual(this.get(key), value);
      }
    }

    if (isInQuietMode) {
      return this.clear();
    } else {
      return this.save(quietState);
    }
  }

  toggleIdLabel(idLabel) {
    return this.toggle('idLabels', idLabel);
  }

  toggleMember(idMember) {
    return this.toggle('idMembers', idMember);
  }

  addIdLabel(idLabel) {
    return this.addToSet('idLabels', idLabel);
  }

  addIdMember(idMember) {
    return this.addToSet('idMembers', idMember);
  }

  isFiltering() {
    return _.some([
      !_.isEmpty(this.get('idMembers')),
      !_.isEmpty(this.get('idLabels')),
      __guard__(this.get('title'), (x) => x.trim()),
      this.get('due') != null,
    ]);
  }

  checkItemSatisfiesFilter(checkItem) {
    const card = checkItem.getCard();

    return satisfiesFilter(
      {
        idMembers: [checkItem.get('idMember')],
        idLabels: card.get('idLabels'),
        due: checkItem.get('due') ? new Date(checkItem.get('due')) : null,
        complete: checkItem.get('state') === 'complete',
        words: getWords(checkItem.get('name')),
      },
      this.toJSON(),
    );
  }

  satisfiesFilter(card) {
    let left, needle;
    if (card == null) {
      return false;
    }

    // cards in the archive are using CardView, so they could be filtered.
    // We want to always show them.
    if (card.get('closed')) {
      return true;
    }

    if (
      ((needle = card.id),
      Array.from((left = this.get('newCards')) != null ? left : []).includes(
        needle,
      )) ||
      Array.from(this.newCardsWithoutIds).includes(card)
    ) {
      return true;
    }

    return satisfiesFilter(
      {
        idMembers: card.get('idMembers'),
        idLabels: card.get('idLabels'),
        due: card.get('due') ? new Date(card.get('due')) : null,
        complete: card.get('dueComplete'),
        words: _.chain([
          getWords(card.get('name')),
          getWords(__guard__(card.get('idShort'), (x) => x.toString())),
          card.getBoard().isCustomFieldsEnabled()
            ? card.customFieldItemList.map((cfi) =>
                cfi.getFilterableWords(getWords),
              )
            : undefined,
        ])
          .compact()
          .flatten()
          .value(),
      },
      this.toJSON(),
    );
  }

  addNewCard(card) {
    this.newCardsWithoutIds.push(card);

    return this.waitForId(card, (idCard) => {
      this.newCardsWithoutIds = _.without(this.newCardsWithoutIds, card);
      return this.addToSet('newCards', idCard);
    });
  }

  toJSON(param) {
    if (param == null) {
      param = {};
    }
    const { board, expanded } = param;
    const json = super.toJSON(...arguments);
    if (board) {
      json.board = this.board.toJSON();
    }

    if (expanded) {
      let left, needle, needle1;
      const search = (left = this.get('title')) != null ? left : '';
      // for members, filter on @username and username
      const memberRe = new RegExp(
        `^${Util.escapeForRegex(search.replace(/^@/, ''))}`,
        'i',
      );
      const labelRe = new RegExp(`^${Util.escapeForRegex(search)}`, 'i');

      json.labels = _.chain(this.board.getLabels())
        .filter(
          (label) =>
            labelRe.test(label.get('color')) || labelRe.test(label.get('name')),
        )
        .sort(Label.compare)
        .map((label) => {
          let needle;
          return _.extend(label.toJSON(), {
            isActive:
              ((needle = label.id),
              Array.from(this.get('idLabels')).includes(needle)),
          });
        })
        .unshift({
          id: ID_NONE,
          name: l(['filtering', NO_LABELS]),
          isActive:
            ((needle = ID_NONE),
            Array.from(this.get('idLabels')).includes(needle)),
        })
        .value();

      json.members = this.board.memberList
        .chain()
        .filter(
          (member) =>
            (search === 'me' && Auth.isMe(member)) ||
            _.any(Util.getMemNameArray(member), (name) => memberRe.test(name)),
        )
        .map((member) => {
          let needle1;
          return _.extend(member.toJSON(), {
            isActive:
              ((needle1 = member.id),
              Array.from(this.get('idMembers')).includes(needle1)),
          });
        })
        .value();

      json.members = Util.sortMembers(json.members, Auth.me());
      json.members.unshift({
        id: ID_NONE,
        fullName: l(['filtering', 'no members']),
        initials: '?',
        isActive:
          ((needle1 = ID_NONE),
          Array.from(this.get('idMembers')).includes(needle1)),
      });

      json.dueOptions = _.keys(this.dueMap).map((time) => {
        return {
          time,
          desc: l(['due date filter', time]),
          isActive: time === this.get('due'),
        };
      });

      json.modes = _.keys(this.modeMap).map((mode) => {
        return {
          mode,
          desc: l(['filter mode', mode]),
          isActive: mode === this.get('mode'),
        };
      });
    }

    return json;
  }

  toQueryString() {
    if (this.isFiltering()) {
      let due, title;
      const filters = [];

      const formatTitle = (title) =>
        title != null ? title.replace(/%/g, '%25') : undefined;

      if ((title = formatTitle(this.get('title')))) {
        filters.push(title);
      }

      this.get('idLabels').forEach((idLabel) => {
        if (idLabel === ID_NONE) {
          return filters.push('label:none');
        } else {
          const label = this.board.modelCache.get('Label', idLabel);
          if (label) {
            let name;
            if ((name = label.get('name'))) {
              return filters.push(`label:${encodeURIComponent(name)}`);
            } else {
              return filters.push(`label:${label.get('color')}`);
            }
          }
        }
      });

      this.get('idMembers').forEach((idMember) => {
        if (idMember === ID_NONE) {
          return filters.push('member:none');
        } else {
          const member = this.board.modelCache.get('Member', idMember);
          if (member) {
            return filters.push(`member:${member.get('username')}`);
          }
        }
      });

      if ((due = this.get('due'))) {
        filters.push(`due:${due}`);
      }

      if (this.get('mode') === 'and') {
        filters.push('mode:and');
      }

      // In filter experiment, remove menu query arg since we don't want the menu to open anymore
      const queryObj =
        isInFilteringExperiment || isBoardHeaderFilterEnabled
          ? {
              filter: filters.join(','),
            }
          : {
              menu: 'filter',
              filter: filters.join(','),
            };

      return (
        '?' +
        _.chain(queryObj)
          .pairs()
          .map(function (...args) {
            const [key, value] = Array.from(args[0]);
            return [key, value].join('=');
          })
          .join('&')
          .value()
      );
    } else {
      return '';
    }
  }

  fromQueryString(filter) {
    if (!filter) {
      return;
    }

    const idMembers = [];
    const idLabels = [];
    let due = undefined;
    let title = undefined;

    return (() => {
      const result = [];
      for (const entry of Array.from(filter.split(','))) {
        let needle, mode;
        const [type, rawValue] = Array.from(entry.split(':'));
        const value = decodeURIComponent(rawValue);

        switch (type) {
          case 'member':
            if (value === 'none') {
              idMembers.push(ID_NONE);
            } else {
              const member = this.board.modelCache.findOne(
                'Member',
                (mem) => mem.get('username') === value,
              );

              if (member != null) {
                idMembers.push(member.id);
              }
            }
            break;

          case 'label':
            if (value === 'none') {
              idLabels.push(ID_NONE);
            } else {
              const label = this.board.labelList.find(
                (label) =>
                  label
                    .get('name')
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) === 0 ||
                  (label.get('name') === '' && label.get('color') === value),
              );

              if (label != null) {
                idLabels.push(label.id);
              }
            }
            break;

          case 'due':
            if (
              ((needle = value),
              Array.from(_.keys(this.dueMap)).includes(needle))
            ) {
              due = value;
            }
            break;

          case 'mode':
            if (value === 'and') {
              mode = 'and';
            }
            break;

          default:
            title = decodeURIComponent(entry);
        }

        result.push(this.set({ idMembers, idLabels, due, title, mode }));
      }
      return result;
    })();
  }
};
