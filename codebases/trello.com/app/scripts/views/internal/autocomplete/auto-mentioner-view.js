/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const { getKey, Key } = require('@trello/keybindings');
const { l } = require('app/scripts/lib/localize');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const SelectMemberView = require('app/scripts/views/member/select-member-view');
const SelectFilterableView = require('app/scripts/views/member/select-filterable-view');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { searchFilter } = require('app/scripts/lib/util/text/search-filter');

const RECENT_MENTIONS_KEY = 'recentMentions';
let recentMentions = TrelloStorage.get(RECENT_MENTIONS_KEY) || [];

class AutoMentionerView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'mention';

    this.prototype.events = {
      'mouseenter .js-select-member': 'hoverItem',
      'click .js-select-member:not(.disabled)': 'insertMember',
      'mouseenter .js-select-all-card-members': 'deselectMember',
      'mouseenter .js-select-all-board-members': 'deselectMember',
      keydown: 'keydownEvent',
      'keyup .js-filter-mentionables': 'keyupEvent',
    };
  }

  initialize({ board, card }) {
    let org;
    this.board = board;
    this.card = card;
    if ((org = this.board != null ? this.board.getOrganization() : undefined)) {
      return this.listenTo(
        org.memberList,
        'add remove reset',
        this.frameDebounce(this.render),
      );
    }
  }

  render() {
    const data = {};
    if (this.options.input) {
      data.input = true;
    }
    if (this.options.button) {
      data.button = true;
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_auto_mentioner'),
        data,
      ),
    );

    Analytics.sendScreenEvent({
      name: 'mentionMembersInlineDialog',
      containers: {
        card: {
          id: this.card != null ? this.card.id : undefined,
        },
        board: {
          id: this.board != null ? this.board.id : undefined,
        },
      },
    });

    this.$mentionablesList = this.$('.js-available-members');

    if (this.options.button) {
      this.fillMentionables(this.getMentionables());
    } else if (this.options.input) {
      this.filterMentionables();
    }

    return this;
  }

  getTextInput() {
    return $(this.options.target);
  }

  getExtraMentionables(cardMentionables, boardMentionables) {
    const allCardMentionable = {
      type: 'extra',
      text: 'card',
      names: ['all', 'card'],
      extraText: l(['automentioner', 'all-members-on-card']),
      mentionCount: cardMentionables.length,
    };
    const allBoardMentionable = {
      type: 'extra',
      text: 'board',
      names: ['all', 'board'],
      extraText: l(['automentioner', 'all-members-on-board']),
      mentionCount: boardMentionables.length,
    };

    if (this.card != null) {
      return [allCardMentionable, allBoardMentionable];
    }
    return [allBoardMentionable];
  }

  getMentionables() {
    const myId = Auth.myId();

    const idsToMentionables = (ids, options) => {
      if (options == null) {
        options = {};
      }
      return _.chain(ids)
        .reject((id) => {
          return this.board.isDeactivated(this.modelCache.get('Member', id));
        })
        .map((id) => {
          return _.extend({}, options, {
            id,
            names: Util.getMemNameArrayFromId(this.modelCache, id),
            type: 'member',
          });
        })
        .value();
    };

    // Sort mentions by recency, unless it's yourself
    // We allow self-mentioning, but always push yourself to the
    // bottom of the list
    const sortMentionables = function (mentionable, iter, list) {
      const index = recentMentions.indexOf(mentionable.id);
      if (mentionable.id === myId) {
        return list.length;
      } else if (index === -1) {
        return recentMentions.length;
      } else {
        return index;
      }
    };

    const cardMentionables = idsToMentionables(
      this.card != null ? this.card.getIdCardMems() : undefined,
    );
    const boardMentionables = idsToMentionables(this.board.getIdBoardMems());

    const orgMentionables = (() => {
      let org;
      if ((org = this.board.getOrganization()) != null) {
        let idValidMembers = [];
        let idInvalidMembers = [];

        const activeMembers = org.memberList.filter(
          (member) => !org.isDeactivated(member),
        );

        if (this.board.isPrivate()) {
          if (org.hasPremiumFeature('superAdmins')) {
            const membersByMemberType = _.groupBy(activeMembers, (member) => {
              if (org.ownedByMember(member)) {
                return 'admin';
              } else {
                return 'not-admin';
              }
            });

            idValidMembers = _.pluck(membersByMemberType['admin'], 'id');
            idInvalidMembers = _.pluck(membersByMemberType['non-admin'], 'id');
          } else {
            idInvalidMembers = _.pluck(activeMembers, 'id');
          }
        } else {
          idValidMembers = _.pluck(activeMembers, 'id');
        }

        return [
          ...Array.from(idsToMentionables(idValidMembers)),
          ...Array.from(
            idsToMentionables(idInvalidMembers, {
              disabled: true,
              extraText: l(['mention member', 'board not team visible']),
            }),
          ),
        ];
      } else {
        return [];
      }
    })();

    return _.chain([
      ...Array.from(cardMentionables),
      ...Array.from(boardMentionables),
      ...Array.from(orgMentionables),
    ])
      .uniq((mentionable) => mentionable.id)
      .sortBy(sortMentionables)
      .concat(this.getExtraMentionables(cardMentionables, boardMentionables))
      .value();
  }

  clearMentionables() {
    return this.$mentionablesList.empty();
  }

  keydownEvent(e) {
    let needle;
    if (((needle = getKey(e)), [Key.Enter, Key.Tab].includes(needle))) {
      Util.stop(e);
      this.$mentionablesList
        .find('.item.selected:first .js-select-member')
        .click();
      return;
    }
  }

  keyupEvent(e) {
    const key = getKey(e);

    if ([Key.Enter, Key.Tab, Key.ArrowLeft, Key.ArrowRight].includes(key)) {
      return;
    } else if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList(this.$mentionablesList, '.item', key);
      return;
    } else {
      return this.filterMentionables();
    }
  }

  filterMentionables(e) {
    let term;
    this.clearMentionables();

    if (this.options.button) {
      term = $('.js-filter-mentionables').val().trim().toLowerCase();
    } else if (this.options.input) {
      const $textInput = this.getTextInput();
      const word = Util.getWordFromCaret($textInput);
      term = word.str.substring(1).toLowerCase();
    }

    const matches = this.filterMentionablesForMatches(term);

    // hide if there are no results
    if (this.options.input && matches.length === 0) {
      this.setTimeout(() => PopOver.hide(), 5);
      return;
    }

    this.fillMentionables(matches);
    return Util.selectMenuItem(
      this.$mentionablesList,
      '.item',
      this.$mentionablesList.find('.item').first(),
    );
  }

  filterMentionablesForMatches(term) {
    const satisfiesSearch = searchFilter(term);

    return _.filter(this.getMentionables(), (filterable) =>
      satisfiesSearch(filterable.names),
    );
  }

  hoverItem(e) {
    const $elem = $(e.target).closest('.item');
    return Util.selectMenuItem(this.$mentionablesList, '.item', $elem);
  }

  deselectMember(e) {
    return this.$mentionablesList.find('.item').removeClass('selected');
  }

  fillMentionables(filterables) {
    filterables = _.groupBy(filterables, 'type');

    const entries = (filterables.member || [])
      .slice(0, 50)
      .map(({ id, disabled, extraText }) => {
        return {
          member: this.modelCache.get('Member', id),
          disabled,
          extraText,
        };
      });

    this.$mentionablesList.empty();

    const mentionables = [];
    for (const { member, disabled, extraText } of Array.from(entries)) {
      mentionables.push(
        this.subview(SelectMemberView, member, { disabled, extraText }),
      );
    }
    this.appendSubviews(mentionables, this.$mentionablesList);

    if (filterables.extra != null) {
      for (const extra of Array.from(filterables.extra)) {
        this.$mentionablesList.append(
          new SelectFilterableView(extra).render().el,
        );
      }
    }

    this.$('.js-empty-list').toggleClass(
      'hide',
      _.keys(filterables).length > 0,
    );
  }

  insertMember(e) {
    let word;
    Util.stop(e);

    const autocompleteText = $(e.currentTarget).attr('autocompleteText');

    this.saveRecent($(e.currentTarget).attr('idMember'));

    let actionSubject = 'member';
    let actionSubjectId = $(e.currentTarget).attr('idMember');
    let source = getScreenFromUrl();

    if (autocompleteText === 'board') {
      actionSubject = 'board';
      actionSubjectId = this.board != null ? this.board.id : undefined;
      // if the mention is coming from the board screen,
      // it's coming from the Description box in the boards menu
      // via description-view.js
      if (source === 'boardScreen') {
        source = 'boardMenuDrawerAboutScreen';
      }
    }

    if (autocompleteText === 'card') {
      actionSubject = 'card';
      actionSubjectId = this.card != null ? this.card.id : undefined;
    }

    Analytics.sendTrackEvent({
      action: 'mentioned',
      actionSubject,
      actionSubjectId,
      source,
      containers: {
        card: {
          id: this.card != null ? this.card.id : undefined,
        },
        board: {
          id: this.board != null ? this.board.id : undefined,
        },
      },
    });

    const $textInput = this.getTextInput();
    if (this.options.input) {
      word = Util.getWordFromCaret($textInput);
      Util.insertSelection(
        $textInput,
        `@${autocompleteText} `,
        word.start,
        word.end,
      );
    } else {
      const caretPosition = Util.getCaretPosition($textInput);
      if (caretPosition != null) {
        word = {
          start: caretPosition,
          end: caretPosition,
        };
      }

      Util.insertSelection(
        $textInput,
        `@${autocompleteText} `,
        word != null ? word.start : undefined,
        word != null ? word.end : undefined,
      );
    }
    PopOver.hide();
  }

  saveRecent(idMember) {
    let recent = TrelloStorage.get(RECENT_MENTIONS_KEY) || [];
    recent = _.chain([idMember, ...Array.from(recent)])
      .uniq()
      .first(16)
      .value();
    TrelloStorage.set(RECENT_MENTIONS_KEY, recent);
    return (recentMentions = recent);
  }
}

AutoMentionerView.initClass();
module.exports = AutoMentionerView;
